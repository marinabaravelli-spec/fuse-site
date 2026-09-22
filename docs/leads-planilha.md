# Formulário de contato → Google Sheets

Cada envio do formulário vira uma linha na planilha e dispara um e-mail de aviso.

```
Site (/contato) → /api/lead (Vercel) → Google Apps Script → Planilha "Leads" + e-mail
```

## 1. Criar a planilha (5 min)

1. Com a conta Google da Fuse, crie uma planilha: **Leads — Site Fuse**.
2. Menu **Extensões → Apps Script**.
3. Apague o conteúdo de `Código.gs` e cole todo o arquivo `docs/leads-apps-script.gs`. Salve.

## 2. Configurar as propriedades (2 min)

No Apps Script: **Configurações do projeto (engrenagem) → Propriedades do script → Adicionar**:

| Propriedade | Valor |
|---|---|
| `WEBHOOK_SECRET` | uma senha longa e aleatória (ex.: gerada em um gerenciador de senhas, 40+ caracteres) |
| `NOTIFY_TO` | `marina.baravelli@hubfuse.com.br` (vários e-mails: separe por vírgula) |

## 3. Autorizar e testar (2 min)

1. No editor, selecione a função **`testeManual`** e clique em **Executar**.
2. Autorize o acesso à planilha e ao envio de e-mail (conta da Fuse).
3. Confira: uma linha "Teste Fuse" na aba **Leads** e o e-mail de aviso na caixa de entrada. Depois, apague a linha de teste.

## 4. Publicar como app da web (2 min)

1. **Implantar → Nova implantação → Tipo: App da Web**.
2. **Executar como:** Eu. **Quem pode acessar:** Qualquer pessoa.
   (Seguro: sem o `WEBHOOK_SECRET`, o script recusa qualquer envio.)
3. Copie a **URL do app da web** (termina em `/exec`).

## 5. Configurar na Vercel

Em **Settings → Environment Variables** (Production e Preview):

| Variável | Valor |
|---|---|
| `LEADS_WEBHOOK_URL` | URL `/exec` do passo 4 |
| `LEADS_WEBHOOK_SECRET` | o mesmo valor de `WEBHOOK_SECRET` |

Faça um novo deploy e envie um teste real pelo formulário.

## Atualizar o script depois

Editou o código? **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão**. A URL continua a mesma.

## Antispam

Já ativo, sem configuração: campo invisível (honeypot) e tempo mínimo de preenchimento.

Recomendado antes do lançamento: **Cloudflare Turnstile** (gratuito, sem "clique nos semáforos").
No painel da Cloudflare → Turnstile → Add site (`hubfuse.com.br`), modo *Managed*. Cadastre na Vercel:
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`. O widget aparece sozinho no formulário.

## LGPD — cuidados com a planilha

- Compartilhe a planilha **somente** com quem atende leads. Nunca "qualquer pessoa com o link".
- Defina por quanto tempo os dados ficam guardados (ex.: 24 meses) e registre isso na Política de Privacidade.
- Se alguém pedir exclusão dos dados, apague a linha correspondente.

## Limites

O Google permite ~100 e-mails/dia em contas gratuitas e ~1.500/dia no Workspace — muito acima do volume esperado de leads.
