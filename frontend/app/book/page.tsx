"use client";
import Link from "next/link";
import {useSearchParams,useRouter} from "next/navigation";
import {Suspense,useState} from "react";
import {api} from "../../lib/api";
function Booking(){
 const params=useSearchParams(),doctorId=params.get("doctor")||"";
 const [date,setDate]=useState(""),[reason,setReason]=useState(""),[message,setMessage]=useState(""),[error,setError]=useState("");
 const router=useRouter();
 async function submit(e:React.FormEvent){e.preventDefault();setError("");try{const d=await api("/appointments",{method:"POST",body:JSON.stringify({doctorId,appointmentAt:new Date(date).toISOString(),reason})});setMessage(`Appointment booked successfully. Reference: ${d.id}`)}catch(err){setError((err as Error).message)}}
 return <main className="shell"><Link href="/doctors">← Back to doctors</Link><form className="card form" onSubmit={submit}><h1>Book appointment</h1><p className="muted">Select your preferred date and time.</p>{error&&<p className="error">{error}</p>}{message&&<p className="success">{message} <Link href="/dashboard">View dashboard</Link></p>}<label>Date and time</label><input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required/><label>Reason for visit</label><textarea value={reason} onChange={e=>setReason(e.target.value)} minLength={3} required/><button className="btn">Confirm booking</button></form></main>;
}
export default function BookPage(){return <Suspense fallback={<main className="shell">Loading…</main>}><Booking/></Suspense>}
