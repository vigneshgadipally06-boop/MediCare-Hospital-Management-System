"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {api} from "../../lib/api";
type Entry={id:string;tokenNumber:number;status:string;appointment:{patient:{name:string};doctor:{user:{name:string}}}};
export default function DoctorQueue(){
 const [rows,setRows]=useState<Entry[]>([]),[error,setError]=useState("");
 async function load(){try{setRows(await api("/queue/today"))}catch(e){setError((e as Error).message)}}
 useEffect(()=>{load()},[]);
 async function update(id:string,status:string){try{await api(`/queue/${id}/status`,{method:"PATCH",body:JSON.stringify({status})});await load()}catch(e){setError((e as Error).message)}}
 return <main className="shell"><header className="top"><Link href="/" className="brand">✚ MediCare</Link><Link href="/dashboard">Patient dashboard</Link></header><h1>Today's patient queue</h1><p className="muted">Doctor / admin queue console. Sign in with a doctor or admin account.</p>{error&&<p className="error">{error}</p>}<div className="card">{rows.map(r=><div className="list" key={r.id}><div><b>Token #{r.tokenNumber} · {r.appointment.patient.name}</b><div className="muted">{r.status}</div></div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button className="btn secondary" onClick={()=>update(r.id,"IN_PROGRESS")}>Call next</button><button className="btn" onClick={()=>update(r.id,"COMPLETED")}>Complete</button><button className="btn secondary" onClick={()=>update(r.id,"SKIPPED")}>Skip</button></div></div>)}{rows.length===0&&<p className="muted">No queue entries for today.</p>}</div></main>;
}
