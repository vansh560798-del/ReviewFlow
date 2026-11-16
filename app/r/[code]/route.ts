import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
export async function GET(req:NextRequest,{params}:{params:Promise<{code:string}>}){
 const {code}=await params;const src=req.nextUrl.searchParams.get('src')==='nfc'?'nfc':'qr';
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
 const {data,error}=await db.rpc('resolve_card',{p_code:code,p_source:src});
 if(error||!data||!Array.isArray(data)||!data[0]?.destination)return new NextResponse('Card unavailable',{status:404});
 const url=data[0].destination as string;
 if(!url.startsWith('https://'))return new NextResponse('Invalid destination',{status:404});
 return NextResponse.redirect(url,302);
}