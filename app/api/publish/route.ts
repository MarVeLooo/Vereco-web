import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const secret=(env as any).PUBLISH_SECRET;if(!secret||request.headers.get('Authorization')!=='Bearer '+secret)return new Response(null,{status:401});
 const raw=await request.text();if(raw.length>20000000)return new Response(null,{status:413});
 let body;try{body=JSON.parse(raw);}catch{return new Response(null,{status:400});}
 if(!/^[-\w]+\.html$/.test(body.filename)||typeof body.title!=='string'||!Number.isFinite(body.price)||body.price<=0||typeof body.html!=='string')return new Response(null,{status:400});
 await env.BUCKET!.put('published/'+body.filename,JSON.stringify(body),{httpMetadata:{contentType:'application/json'}});
 return Response.json({published:true});
}
