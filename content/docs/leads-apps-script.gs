/**
 * FUSE — Receptor de leads do site (Google Apps Script)
 *
 * Recebe o POST de /api/lead, grava na planilha e envia aviso por e-mail.
 * Instalação: ver docs/leads-planilha.md
 *
 * Propriedades do script (Configurações do projeto → Propriedades do script):
 *   WEBHOOK_SECRET  → mesmo valor de LEADS_WEBHOOK_SECRET na Vercel
 *   NOTIFY_TO       → e-mail(s) que recebem o aviso (separe por vírgula)
 */

const SHEET_NAME = 'Leads';
const DEDUP_HOURS = 24; // mesmo e-mail em até 24h atualiza a linha em vez de duplicar

// Ordem das colunas da planilha
const COLUMNS = [
  ['receivedAt', 'Data'],
  ['status', 'Status'],
  ['name', 'Nome'],
  ['company', 'Empresa'],
  ['role', 'Cargo'],
  ['email', 'E-mail'],
  ['phone', 'Telefone/WhatsApp'],
  ['city', 'Cidade/UF'],
  ['website', 'Site'],
  ['interest', 'Solução de interesse'],
  ['challenge', 'Principal desafio'],
  ['source', 'Como conheceu'],
  ['last_utm_source', 'UTM source (último)'],
  ['last_utm_medium', 'UTM medium (último)'],
  ['last_utm_campaign', 'UTM campaign (último)'],
  ['last_utm_term', 'UTM term (último)'],
  ['last_utm_content', 'UTM content (último)'],
  ['first_utm_source', 'UTM source (primeiro)'],
  ['first_utm_medium', 'UTM medium (primeiro)'],
  ['first_utm_campaign', 'UTM campaign (primeiro)'],
  ['first_landing_page', 'Página de entrada (primeiro)'],
  ['first_referrer', 'Referrer (primeiro)'],
  ['first_date', 'Primeira visita'],
  ['last_gclid', 'gclid'],
  ['last_fbclid', 'fbclid'],
  ['page', 'Página do envio'],
  ['consent', 'Consentimento LGPD'],
  ['consentText', 'Texto aceito'],
  ['userAgent', 'Navegador'],
  ['updates', 'Reenvios'],
];

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ ok: false, error: 'invalid_json' });
  }

  if (!data.secret || data.secret !== props.getProperty('WEBHOOK_SECRET')) {
    return respond({ ok: false, error: 'unauthorized' });
  }
  delete data.secret;

  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // evita linhas trocadas em envios simultâneos
  try {
    const sheet = getSheet();
    const result = upsertLead(sheet, data);
    notify(props.getProperty('NOTIFY_TO'), data, result.updated, sheet);
    return respond({ ok: true, updated: result.updated });
  } catch (err) {
    console.error(err);
    return respond({ ok: false, error: 'sheet_error' });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map((c) => c[1]));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

function upsertLead(sheet, data) {
  const emailCol = COLUMNS.findIndex((c) => c[0] === 'email') + 1;
  const dateCol = COLUMNS.findIndex((c) => c[0] === 'receivedAt') + 1;
  const updatesCol = COLUMNS.findIndex((c) => c[0] === 'updates') + 1;
  const lastRow = sheet.getLastRow();
  const email = String(data.email || '').toLowerCase();

  // Procura o mesmo e-mail nas últimas 200 linhas, dentro da janela de deduplicação
  if (lastRow > 1 && email) {
    const start = Math.max(2, lastRow - 199);
    const rows = sheet.getRange(start, 1, lastRow - start + 1, COLUMNS.length).getValues();
    for (let i = rows.length - 1; i >= 0; i--) {
      const sameEmail = String(rows[i][emailCol - 1]).toLowerCase() === email;
      const ageHours = (Date.now() - new Date(rows[i][dateCol - 1]).getTime()) / 36e5;
      if (sameEmail && ageHours <= DEDUP_HOURS) {
        const rowIndex = start + i;
        const values = buildRow(data, 'Reenviado');
        values[updatesCol - 1] = Number(rows[i][updatesCol - 1] || 0) + 1;
        sheet.getRange(rowIndex, 1, 1, COLUMNS.length).setValues([values]);
        return { updated: true };
      }
    }
  }

  sheet.appendRow(buildRow(data, 'Novo'));
  return { updated: false };
}

function buildRow(data, status) {
  return COLUMNS.map(([key]) => {
    if (key === 'status') return status;
    if (key === 'updates') return 0;
    if (key === 'receivedAt') return new Date(data.receivedAt || Date.now());
    return data[key] !== undefined ? String(data[key]) : '';
  });
}

function notify(to, data, updated, sheet) {
  if (!to) return;
  const subject = (updated ? '[Reenvio] ' : '') + 'Novo lead no site: ' + data.name + ' (' + data.company + ')';
  const origin = data.last_utm_source
    ? data.last_utm_source + ' / ' + (data.last_utm_medium || '-') + ' / ' + (data.last_utm_campaign || '-')
    : data.first_referrer || 'Direto/orgânico';

  const body = [
    'Nome: ' + data.name,
    'Empresa: ' + data.company + ' — ' + data.role,
    'E-mail: ' + data.email,
    'Telefone/WhatsApp: ' + data.phone,
    'Cidade/UF: ' + data.city,
    'Site: ' + (data.website || '-'),
    'Solução de interesse: ' + data.interest,
    'Como conheceu: ' + (data.source || '-'),
    'Origem: ' + origin,
    '',
    'Principal desafio:',
    data.challenge,
    '',
    'Planilha: ' + sheet.getParent().getUrl(),
  ].join('\n');

  MailApp.sendEmail({ to: to, subject: subject, body: body, replyTo: data.email, name: 'Site Fuse' });
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Rode uma vez pelo editor para autorizar Planilha + E-mail e testar o aviso. */
function testeManual() {
  const fake = {
    postData: {
      contents: JSON.stringify({
        secret: PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET'),
        receivedAt: new Date().toISOString(),
        name: 'Teste Fuse', company: 'Empresa Teste', role: 'Diretoria',
        email: 'teste@exemplo.com.br', phone: '(11) 90000-0000', city: 'Santo André, SP',
        website: '', interest: 'Estratégia', challenge: 'Lead de teste enviado pelo editor do Apps Script.',
        source: 'Outro', consent: 'sim', page: '/contato',
      }),
    },
  };
  console.log(doPost(fake).getContent());
}
