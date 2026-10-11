import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export async function GET(){const listed=await env.BUCKET!.list({prefix:'published/'});const rows=await Promise.all(listed.objects.map(async o=>{const item=await env.BUCKET!.get(o.key);const {html,...data}=await item!.json<any>();return data;}));return Response.json(rows,{headers:{'Cache-Control':'no-store'}});}
