"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {api} from "../../lib/api";
type Doctor={id:string;specialization:string;consultationFee:number;user:{name:string};department:{name:string}};
export default function Doctors(){
 const [doctors,setDoctors]=useState<Doctor[]>([]),[error,setError]=useState("");
 useEffect(()=>{api("/doctors").then(setDoctors).catch(e=>setError(e.message))},[]);
 return <main className="shell"><header className="top"><Link href="/" className="brand">✚ MediCare</Link><nav className="nav"><Link href="/dashboard">Dashboard</Link><Link href="/login">Login</Link></nav></header><h1>Find a doctor</h1><p className="muted">Choose a specialist to book an appointment.</p>{error&&<p className="error">{error}</p>}<div className="grid two">{doctors.map(d=><article className="card" key={d.id}><div style={{fontSize:32}}>👩‍⚕️</div><h3>{d.user.name}</h3><p className="muted">{d.specialization} · {d.department.name}</p><p><b>₹{d.consultationFee}</b> <span className="muted">consultation</span></p><Link className="btn" href={`/book?doctor=${d.id}`}>Book appointment</Link></article>)}</div></main>;
}
