import {trackingHTML} from '../../view-tracking';import {config,table,failure} from '../../supabase';
import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
const mobileHTML=(html:string)=>html.replace(/<link\b[^>]*data-vereco-mobile[^>]*>/gi,'').replace(/<\/head>/i,'<link rel="stylesheet" href="/property-mobile.css?v=1" data-vereco-mobile></head>');
export async function GET(request:Request,context:{params:Promise<{filename:string}>}){
 const {filename}=await context.params;if(!/^[-\w]+\.html$/.test(filename))return new Response(null,{status:404});
 const c=await config();if(c){try{const rows=await table(c,'portal_listings','?filename=eq.'+encodeURIComponent(filename)+'&select=html,active');if(rows.length){if(!rows[0].active)return new Response(null,{status:404});const html=rows[0].html.replace(/<base\b[^>]*>/gi,'').replace('<head>','<head><base href="'+new URL('/',request.url).href+'">');return new Response(await trackingHTML(mobileHTML(html),filename),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}}catch(e){return failure(e);}}
 const item=await env.BUCKET!.get('published/'+filename);let html;
 if(item)html=(await item.json<any>()).html;else{const r=await fetch(new URL('/originals/'+filename,request.url));if(!r.ok)return new Response(null,{status:404});html=await r.text();}
 html=html.replace(/<base\b[^>]*>/gi,'').replace('<head>','<head><base href="'+new URL('/',request.url).href+'">');
 return new Response(await trackingHTML(mobileHTML(html),filename),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}
