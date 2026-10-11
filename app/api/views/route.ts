import {env} from 'cloudflare:workers';
import {verifyView} from '../../view-tracking';
import {config,table} from '../../supabase';
import base from '../../../public/catalog-base.json';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
export async function GET(request:Request){const secret=(env as any).PUBLISH_SECRET;if(!secret||request.headers.get('Authorization')!=='Bearer '+secret)return new Response(null,{status:401,headers});try{const rows=await env.DB!.prepare('SELECT filename, views, last_viewed_at FROM property_views').all();return Response.json(rows.results,{headers});}catch{return Response.json({error:'No se pudo consultar el conteo.'},{status:503,headers});}}
export async function POST(request:Request){if(request.headers.get('Origin')!==new URL(request.url).origin)return new Response(null,{status:403,headers});if(Number(request.headers.get('Content-Length'))>1500)return new Response(null,{status:413,headers});try{const raw=await request.text();if(raw.length>1500)return new Response(null,{status:413,headers});const data=await verifyView(JSON.parse(raw).token||'');if(!data)return new Response(null,{status:400,headers});const c=await config();let visible=false;if(c){const rows=await table(c,'portal_listings','?filename=eq.'+encodeURIComponent(data.filename)+'&select=active');if(rows.length){if(!rows[0].active)return new Response(null,{status:404,headers});visible=true;}}if(!visible)visible=base.some(p=>p.filename===data.filename)||!!await env.BUCKET!.get('published/'+data.filename);if(!visible)return new Response(null,{status:404,headers});const now=new Date().toISOString();await env.DB!.batch([
 env.DB!.prepare('INSERT OR IGNORE INTO property_view_events (id, expires) VALUES (?, ?)').bind(data.id,data.expires),
 env.DB!.prepare('INSERT INTO property_views (filename, views, last_viewed_at) SELECT ?, 1, ? WHERE changes() = 1 ON CONFLICT(filename) DO UPDATE SET views = property_views.views + 1, last_viewed_at = excluded.last_viewed_at').bind(data.filename,now),
 env.DB!.prepare('DELETE FROM property_view_events WHERE expires < ?').bind(Date.now())
]);return new Response(null,{status:204,headers});}catch{return new Response(null,{status:503,headers});}}
