"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {api} from "../../lib/api";
export default function Register(){
 const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[phone,setPhone]=useState(""),[error,setError]=useState("");
 const router=useRouter();
 async function submit(e:React.FormEvent){e.preventDefault();setError("");try{await api("/auth/register",{method:"POST",body:JSON.stringify({name,email,password,phone})});router.push("/login")}catch(err){setError((err as Error).message)}}
 return <main className="shell"><Link href="/" className="brand">✚ MediCare</Link><form className="card form" onSubmit={submit}><h1>Create patient account</h1>{error&&<p className="error">{error}</p>}<label>Full name</label><input value={name} onChange={e=>setName(e.target.value)} required/><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><label>Phone</label><input value={phone} onChange={e=>setPhone(e.target.value)}/><label>Password (minimum 8 characters)</label><input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn" style={{width:"100%"}}>Create account</button><p className="muted">Already registered? <Link href="/login">Login</Link></p></form></main>;
}
