"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {api} from "../../lib/api";
export default function Login(){
 const [email,setEmail]=useState("patient@medicare.local"),[password,setPassword]=useState("Patient@123"),[error,setError]=useState("");
 const router=useRouter();
 async function submit(e:React.FormEvent){e.preventDefault();setError("");try{const d=await api("/auth/login",{method:"POST",body:JSON.stringify({email,password})});localStorage.setItem("medicare_token",d.token);localStorage.setItem("medicare_user",JSON.stringify(d.user));router.push("/dashboard")}catch(err){setError((err as Error).message)}}
 return <main className="shell"><Link href="/" className="brand">✚ MediCare</Link><form className="card form" onSubmit={submit}><h1>Welcome back</h1><p className="muted">Sign in to manage your care.</p>{error&&<p className="error">{error}</p>}<label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn" style={{width:"100%"}}>Sign in</button><p className="muted">New patient? <Link href="/register">Create an account</Link></p></form></main>;
}
