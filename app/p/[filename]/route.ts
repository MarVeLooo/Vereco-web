import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export async function GET(request:Request,context:{params:Promise<{filename:string}>}){
 const {filename}=await context.params;if(!/^[-\w]+\.html$/.test(filename))return new Response(null,{status:404});
 const item=await env.BUCKET!.get('published/'+filename);let html;
 if(item)html=(await item.json<any>()).html;else{const r=await fetch(new URL('/originals/'+filename,request.url));if(!r.ok)return new Response(null,{status:404});html=await r.text();}
 html=html.replace(/<base\b[^>]*>/gi,'').replace('<head>','<head><base href="'+new URL('/',request.url).href+'">');
 return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}
