export async function GET(request:Request,context:{params:Promise<{filename:string}>}){
 const {filename}=await context.params;const name=filename.endsWith('.html')?filename:filename+'.html';if(!/^new-[-\w]+\.html$/.test(name))return new Response(null,{status:404});return Response.redirect(new URL('/p/'+name,request.url),302);
}
