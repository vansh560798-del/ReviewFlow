"use client";
import {useEffect,useState} from 'react';
import QRCode from 'qrcode';
import {supabase} from '@/lib/supabase';
type Store={id:string,name:string,google_review_url:string};
export default function Home(){
 const [user,setUser]=useState<string|null>(null),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState(''),[link,setLink]=useState(''),[stores,setStores]=useState<Store[]>([]),[message,setMessage]=useState(''),[qr,setQr]=useState(''),[nfc,setNfc]=useState('');
 const db=supabase();
 async function load(){const {data:{user}}=await db.auth.getUser();setUser(user?.id||null);if(user){const {data}=await db.from('stores').select('id,name,google_review_url').order('created_at',{ascending:false});setStores(data||[])}}
 useEffect(()=>{load();const {data:{subscription}}=db.auth.onAuthStateChange(()=>{load()});return()=>subscription.unsubscribe()},[]);
 async function login(){const {error}=await db.auth.signInWithPassword({email,password});setMessage(error?.message||'Signed in');await load()}
 async function add(){if(!user)return;let u:URL;try{u=new URL(link)}catch{setMessage('Invalid URL');return}if(u.protocol!=='https:'||!['google.com','www.google.com','g.page','maps.app.goo.gl'].includes(u.hostname)){setMessage('Enter a Google review HTTPS URL');return}const {error}=await db.from('stores').insert({owner_id:user,name,google_review_url:link});setMessage(error?.message||'Store saved');if(!error){setName('');setLink('');await load()}}
 async function generate(store:Store){setMessage('');const {data,error}=await db.rpc('create_card_batch',{p_store_id:store.id,p_quantity:1});if(error){setMessage(error.message);return}const code=data as string;const base=location.origin+'/r/'+code;setQr(await QRCode.toDataURL(base+'?src=qr',{width:320,margin:2}));setNfc(base+'?src=nfc');setMessage('QR created. Program the NFC tag with the NFC URL below.')}
 return <main><h1>✦ ReviewFlow</h1><p className="muted">NFC + Dynamic Google Review Cards</p>
 {!user?<section><h2>Admin sign in</h2><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><button onClick={login}>Sign in</button><p className="muted">Create an admin account in Supabase Authentication first.</p></section>:
 <><section><h2>Add a shop</h2><input placeholder="Shop name" value={name} onChange={e=>setName(e.target.value)}/><input placeholder="Google Review URL" value={link} onChange={e=>setLink(e.target.value)}/><button onClick={add}>Save shop</button></section><section><h2>Your shops</h2>{stores.length===0?<p>No shops yet.</p>:stores.map(s=><div key={s.id} className="row" style={{alignItems:'center',borderBottom:'1px solid #34405a',padding:'12px 0'}}><strong className="card">{s.name}</strong><button onClick={()=>generate(s)}>Generate card QR</button></div>)}</section>{qr&&<section><h2>Card QR</h2><img src={qr} width="220" alt="Generated QR code"/><p><a href={qr} download="reviewflow-qr.png">Download QR PNG</a></p><p>NFC programming URL:</p><code style={{overflowWrap:'anywhere'}}>{nfc}</code></section>}<button onClick={async()=>{await db.auth.signOut();setUser(null);setStores([])}}>Sign out</button></>}
 {message&&<p role="status">{message}</p>}</main>
}