import { makeRouteHandler } from '@keystatic/next/route-handler';
import { isKeystaticEnabled } from '@/lib/keystatic-access';
import config from '../../../../../keystatic.config';

const handler = makeRouteHandler({ config });
const disabled = () => new Response('Not found', { status: 404 });

export const GET = isKeystaticEnabled ? handler.GET : disabled;
export const POST = isKeystaticEnabled ? handler.POST : disabled;
