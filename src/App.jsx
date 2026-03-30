import { useState, useRef, useEffect } from "react";
import "./App.css";
const CRIME_TYPES=["Phishing / Email Scam","UPI / Banking Fraud","Identity Theft","Ransomware / Malware","Social Media Hacking","Online Shopping Fraud","Cyber Stalking","Data Breach","Sextortion","Investment Fraud"];
const STATUS_STEPS=["Filed","Under Review","Action Taken"];
function genId(){return"CYB-"+new Date().getFullYear()+"-"+String(Math.floor(Math.random()*9000)+1000);}

const INIT_COMPLAINTS=[
  {id:"CYB-2024-001",type:"UPI Fraud",name:"Rahul Sharma",date:"2024-03-12",status:1,
   desc:"Received fake UPI collect request disguised as an e-commerce refund. Lost ₹8,500.",
   comments:[{author:"Officer Kumar",text:"Case assigned. Bank notified.",date:"2024-03-13"}],
   timeline:[{event:"Complaint Filed",time:"12 Mar 2024, 10:22 AM",note:"Received via portal."},
             {event:"Assigned to Cyber Cell",time:"12 Mar 2024, 3:45 PM",note:"Officer Kumar assigned."},
             {event:"Under Review",time:"13 Mar 2024, 9:00 AM",note:"Evidence under examination."}]},
  {id:"CYB-2024-002",type:"Phishing",name:"Priya Mehta",date:"2024-03-14",status:2,
   desc:"Fake bank email stole account credentials. Unauthorised transaction of ₹22,000 detected.",
   comments:[{author:"Officer Singh",text:"Account frozen. Recovery in progress.",date:"2024-03-15"},{author:"System",text:"Resolution notice sent.",date:"2024-03-18"}],
   timeline:[{event:"Complaint Filed",time:"14 Mar 2024, 8:10 AM",note:"Received via portal."},
             {event:"Under Review",time:"14 Mar 2024, 2:00 PM",note:"Phishing URL traced."},
             {event:"Action Taken",time:"18 Mar 2024, 11:30 AM",note:"Suspects identified. ₹18,000 recovered."}]},
  {id:"CYB-2024-003",type:"Identity Theft",name:"Arjun Singh",date:"2024-03-15",status:0,
   desc:"PAN card details misused to open a fraudulent loan account without consent.",
   comments:[],
   timeline:[{event:"Complaint Filed",time:"15 Mar 2024, 6:55 PM",note:"Awaiting assignment."}]},
];

const SCAM_ALERTS=[
  {id:1,category:"phishing",title:"Fake IRCTC Refund Emails Circulating",desc:"Scammers send fake IRCTC refund emails asking for bank details. Over 4,000 affected in Delhi-NCR.",severity:"high",date:"2024-03-20",reports:4213},
  {id:2,category:"upi",title:"QR Code Swap Scam at Petrol Stations",desc:"Fraudsters replace genuine QR codes at petrol pumps with their own. Verify merchant name before paying.",severity:"high",date:"2024-03-18",reports:2891},
  {id:3,category:"identity",title:"Aadhaar-Linked SIM Swap Fraud Rising",desc:"Fraudsters use forged docs to get duplicate SIMs and intercept OTPs. Report to telecom provider immediately.",severity:"medium",date:"2024-03-17",reports:1540},
  {id:4,category:"malware",title:"Fake Trading Apps on WhatsApp",desc:"Malicious APK files promise high returns. Installing grants full device access.",severity:"high",date:"2024-03-16",reports:3200},
  {id:5,category:"social",title:"Instagram 'Blue Tick' Phishing Links",desc:"Fake Meta emails offering verified badge contain phishing links that steal credentials.",severity:"medium",date:"2024-03-15",reports:987},
  {id:6,category:"upi",title:"Fake KYC Update Calls from 'Bank'",desc:"Callers impersonate bank officials asking for card details. Banks never ask for OTP over call.",severity:"medium",date:"2024-03-13",reports:5100},
  {id:7,category:"phishing",title:"Electricity Bill Disconnect Threats",desc:"SMS threatening disconnection unless you pay via a link. Discoms never ask payment via links.",severity:"low",date:"2024-03-10",reports:780},
  {id:8,category:"malware",title:"Screen Share Scam via AnyDesk",desc:"Tech support scammers ask victims to install AnyDesk, then steal banking credentials.",severity:"high",date:"2024-03-09",reports:2100},
];

const HELPLINES=[
  {icon:"🚔",org:"Ministry of Home Affairs",name:"Cyber Crime Helpline",number:"1930",desc:"National helpline for all cyber crimes including financial fraud, online scams, and identity theft. Available around the clock.",avail:"24/7 Available",color:"var(--danger)"},
  {icon:"🛡️",org:"Government of India",name:"Cyber Crime Portal",number:"cybercrime.gov.in",desc:"Official portal to report cyber crimes online. File complaints for child exploitation, financial fraud, and other cyber offences.",avail:"Online 24/7",color:"var(--accent)",isWeb:true},
  {icon:"📞",org:"Reserve Bank of India",name:"RBI Banking Helpline",number:"14440",desc:"Report banking and UPI related fraud. Handles unauthorised transactions and digital payment scams.",avail:"Mon–Sat, 9AM–6PM",color:"#ffd60a"},
  {icon:"👮",org:"Delhi Police",name:"Cyber Cell Helpline",number:"011-23490111",desc:"Delhi's dedicated cyber crime unit for hacking, identity theft, and online harassment.",avail:"Mon–Sat, 10AM–5PM",color:"#60a5fa"},
  {icon:"📱",org:"TRAI",name:"Spam & Fraud Call Report",number:"1909",desc:"Report unsolicited commercial calls, SMS fraud, and telemarketing scams to the Telecom Regulatory Authority.",avail:"24/7 Available",color:"#a78bfa"},
  {icon:"🏦",org:"NPCI",name:"UPI Fraud Helpline",number:"18001201740",desc:"National Payments Corporation helpline for UPI fraud, incorrect transactions, and payment disputes.",avail:"Mon–Sat, 8AM–8PM",color:"var(--warning)"},
  {icon:"👩‍⚖️",org:"National Commission for Women",name:"Women Cyber Safety",number:"7827170170",desc:"Support for women facing online harassment, cyber stalking, sextortion, or morphed image misuse.",avail:"Mon–Sat, 9AM–5PM",color:"#f9a8d4"},
  {icon:"🆘",org:"CERT-In",name:"Incident Response",number:"1800-11-4949",desc:"Indian Computer Emergency Response Team for cybersecurity incidents, data breaches, and infrastructure attacks.",avail:"24/7 Available",color:"var(--accent)"},
];

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav({tab,setTab,dark,toggleDark}){
  const tabs=["Home","Report","Track","Alerts","Helplines","Dashboard"];
  return(
    <nav className="nav">
      <div className="nav-logo">🛡️<span className="lt">Cyber<span style={{color:"var(--accent)"}}>Shield</span></span></div>
      <div className="nav-center">{tabs.map(t=><button key={t} className={`nav-tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</button>)}</div>
      <div className="nav-right">
        <span className="theme-icon">{dark?"🌙":"☀️"}</span>
        <div className="theme-toggle" onClick={toggleDark} title="Toggle theme"/>
      </div>
    </nav>
  );
}

function MobileNav({tab,setTab}){
  const tabs=[{name:"Home",i:"🏠"},{name:"Report",i:"📝"},{name:"Track",i:"🔍"},{name:"Alerts",i:"🚨"},{name:"Helplines",i:"📞"},{name:"Dashboard",i:"📊"}];
  return(
    <div className="mobile-nav">
      {tabs.map(t=>(
        <button key={t.name} className={`mobile-tab${tab===t.name?" active":""}`} onClick={()=>setTab(t.name)}>
          <span>{t.i}</span><span>{t.name}</span>
        </button>
      ))}
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero({setTab}){
  return(
    <div className="hero page-enter">
      <div className="hero-badge">🇮🇳 India Cyber Safety Initiative</div>
      <h1>Report. Track.<br/><em>Stay Safe Online.</em></h1>
      <p>File cyber crime complaints instantly, track their real-time progress, and stay informed about the latest digital scams targeting Indians.</p>
      <div className="hero-cta">
        <button className="btn btn-primary" onClick={()=>setTab("Report")}>📝 File a Complaint</button>
        <button className="btn btn-secondary" onClick={()=>setTab("Helplines")}>📞 Emergency Helplines</button>
      </div>
    </div>
  );
}

function StatsBar(){
  return(
    <div className="stats-bar">
      {[{n:"1,24,336",l:"Complaints Filed"},{n:"89%",l:"Resolution Rate"},{n:"₹48 Cr",l:"Money Recovered"},{n:"2,891",l:"Active Alerts"}].map(s=>(
        <div className="stat-item" key={s.l}><div className="stat-num">{s.n}</div><div className="stat-label">{s.l}</div></div>
      ))}
    </div>
  );
}

// ── REPORT FORM ───────────────────────────────────────────────────────────────
function ReportForm({onSubmit}){
  const [form,setForm]=useState({name:"",phone:"",email:"",crimeType:"",date:"",platform:"",description:"",loss:""});
  const [errors,setErrors]=useState({});
  const [files,setFiles]=useState([]);
  const [drag,setDrag]=useState(false);
  const fileRef=useRef();
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Full name is required";
    if(!form.phone.match(/^[6-9]\d{9}$/))e.phone="Enter valid 10-digit Indian mobile";
    if(!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))e.email="Enter a valid email address";
    if(!form.crimeType)e.crimeType="Please select crime type";
    if(!form.date)e.date="Incident date is required";
    if(!form.description.trim()||form.description.length<30)e.description="Describe in at least 30 characters";
    return e;
  };
  const submit=()=>{
    const e=validate();if(Object.keys(e).length){setErrors(e);return;}
    setErrors({});
    onSubmit({...form,id:genId(),files:files.length,submittedAt:new Date().toLocaleDateString("en-IN")});
    setForm({name:"",phone:"",email:"",crimeType:"",date:"",platform:"",description:"",loss:""});
    setFiles([]);
  };
  const addFiles=fl=>{
    const arr=Array.from(fl).slice(0,5).map(f=>({name:f.name,url:f.type.startsWith("image/")?URL.createObjectURL(f):null}));
    setFiles(p=>[...p,...arr].slice(0,5));
  };
  return(
    <div className="section page-enter">
      <div className="section-title">File a <span>Complaint</span></div>
      <div className="section-sub">All fields marked * are required. Your information is kept strictly confidential.</div>
      <div className="form-card">
        <div className="form-grid">
          <div>
            <label className="field-label">Full Name<span className="req">*</span></label>
            <input className={`field-input${errors.name?" error":""}`} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Rahul Sharma"/>
            {errors.name&&<div className="error-msg">⚠ {errors.name}</div>}
          </div>
          <div>
            <label className="field-label">Mobile Number<span className="req">*</span></label>
            <input className={`field-input${errors.phone?" error":""}`} value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="10-digit mobile"/>
            {errors.phone&&<div className="error-msg">⚠ {errors.phone}</div>}
          </div>
          <div>
            <label className="field-label">Email Address<span className="req">*</span></label>
            <input type="email" className={`field-input${errors.email?" error":""}`} value={form.email} onChange={e=>set("email",e.target.value)} placeholder="your@email.com"/>
            {errors.email&&<div className="error-msg">⚠ {errors.email}</div>}
          </div>
          <div>
            <label className="field-label">Crime Type<span className="req">*</span></label>
            <select className={`field-select${errors.crimeType?" error":""}`} value={form.crimeType} onChange={e=>set("crimeType",e.target.value)}>
              <option value="">Select crime type…</option>
              {CRIME_TYPES.map(c=><option key={c}>{c}</option>)}
            </select>
            {errors.crimeType&&<div className="error-msg">⚠ {errors.crimeType}</div>}
          </div>
          <div>
            <label className="field-label">Date of Incident<span className="req">*</span></label>
            <input type="date" className={`field-input${errors.date?" error":""}`} value={form.date} onChange={e=>set("date",e.target.value)} max={new Date().toISOString().split("T")[0]}/>
            {errors.date&&<div className="error-msg">⚠ {errors.date}</div>}
          </div>
          <div>
            <label className="field-label">Platform / App Involved</label>
            <input className="field-input" value={form.platform} onChange={e=>set("platform",e.target.value)} placeholder="e.g. PhonePe, Instagram"/>
          </div>
          <div>
            <label className="field-label">Financial Loss (₹)</label>
            <input type="number" className="field-input" value={form.loss} onChange={e=>set("loss",e.target.value)} placeholder="Enter 0 if no loss"/>
          </div>
          <div className="form-full">
            <label className="field-label">Describe the Incident<span className="req">*</span></label>
            <textarea className={`field-textarea${errors.description?" error":""}`} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe what happened — names, numbers, links, amounts…"/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              {errors.description&&<div className="error-msg">⚠ {errors.description}</div>}
              <span style={{color:"var(--muted)",fontSize:"0.72rem",marginLeft:"auto"}}>{form.description.length} chars</span>
            </div>
          </div>
          <div className="form-full">
            <label className="field-label">Upload Evidence (max 5)</label>
            <div className={`upload-zone${drag?" dragging":""}`} onClick={()=>fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files);}}>
              <div className="upload-icon">📎</div>
              <div className="upload-label">Click or drag & drop files</div>
              <div className="upload-hint">Screenshots, PDFs, receipts — max 10MB each</div>
              <input ref={fileRef} type="file" multiple accept="image/*,.pdf" style={{display:"none"}} onChange={e=>addFiles(e.target.files)}/>
            </div>
            {files.length>0&&(
              <div className="preview-grid">
                {files.map((f,i)=>(
                  <div key={i} className="preview-item">
                    {f.url?<img src={f.url} alt={f.name}/>:<span style={{fontSize:"1.3rem"}}>📄</span>}
                    <button className="preview-remove" onClick={e=>{e.stopPropagation();setFiles(p=>p.filter((_,j)=>j!==i));}}>×</button>
                    {!f.url&&<span style={{padding:"0 3px",textAlign:"center",wordBreak:"break-all",fontSize:"0.63rem"}}>{f.name.slice(0,11)}…</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="divider"/>
        <div style={{background:"rgba(255,77,109,0.07)",border:"1px solid rgba(255,77,109,0.2)",borderRadius:8,padding:"12px 15px",fontSize:"0.81rem",color:"var(--muted)",marginBottom:16}}>
          ⚠️ Filing a false complaint is punishable under IT Act, 2000. All information will be verified by authorities.
        </div>
        <div className="form-submit-row">
          <button className="btn btn-secondary" onClick={()=>{setForm({name:"",phone:"",email:"",crimeType:"",date:"",platform:"",description:"",loss:""});setFiles([]);setErrors({});}}>Clear</button>
          <button className="btn btn-primary" onClick={submit}>Submit Complaint →</button>
        </div>
      </div>
    </div>
  );
}

// ── TRACK PAGE ────────────────────────────────────────────────────────────────
function TrackPage({complaints,onAddComment}){
  const [searchId,setSearchId]=useState("");
  const [result,setResult]=useState(null);
  const [notFound,setNotFound]=useState(false);
  const [query,setQuery]=useState("");
  const [filterStatus,setFilterStatus]=useState("all");
  const [filterType,setFilterType]=useState("all");
  const [newComment,setNewComment]=useState("");

  const doSearch=()=>{
    const found=complaints.find(c=>c.id.toLowerCase()===searchId.trim().toLowerCase());
    if(found){setResult(found);setNotFound(false);}
    else{setResult(null);setNotFound(true);}
  };

  const filtered=complaints.filter(c=>{
    const q=query.toLowerCase();
    const mQ=!q||c.id.toLowerCase().includes(q)||c.type.toLowerCase().includes(q)||c.name.toLowerCase().includes(q)||c.desc.toLowerCase().includes(q);
    const mS=filterStatus==="all"||String(c.status)===filterStatus;
    const mT=filterType==="all"||c.type===filterType;
    return mQ&&mS&&mT;
  });

  const uniqueTypes=[...new Set(complaints.map(c=>c.type))];

  const postComment=(id)=>{
    if(!newComment.trim())return;
    const c={author:"You",text:newComment,date:new Date().toLocaleDateString("en-IN")};
    onAddComment(id,c);
    setResult(prev=>prev?{...prev,comments:[...prev.comments,c]}:prev);
    setNewComment("");
  };

  // sync result with latest complaints state
  useEffect(()=>{
    if(result){
      const fresh=complaints.find(c=>c.id===result.id);
      if(fresh)setResult(fresh);
    }
  },[complaints]);

  return(
    <div className="section page-enter">
      <div className="section-title">Track <span>Complaints</span></div>
      <div className="section-sub">Search by ID, name, or keyword. Filter by status or crime type.</div>

      {/* ID Search */}
      <div style={{display:"flex",gap:10,marginBottom:26,flexWrap:"wrap"}}>
        <input className="field-input" style={{maxWidth:310}} placeholder="Enter Complaint ID e.g. CYB-2024-001"
          value={searchId} onChange={e=>setSearchId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()}/>
        <button className="btn btn-primary" onClick={doSearch}>🔍 Search by ID</button>
      </div>
      {notFound&&<div style={{color:"var(--danger)",marginBottom:18}}>❌ No complaint found with this ID.</div>}

      {/* Detail Card */}
      {result&&(
        <div className="track-card" style={{marginBottom:30,border:"1px solid var(--accent)",cursor:"default"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexWrap:"wrap",gap:8}}>
            <div className="track-id">{result.id}</div>
            <div className={`tag ${result.status===0?"tag-open":result.status===1?"tag-review":"tag-resolved"}`}>
              {result.status===0?"🟡 Filed":result.status===1?"🔵 Under Review":"✅ Action Taken"}
            </div>
          </div>
          <div style={{fontWeight:700,fontSize:"1rem",marginBottom:4}}>{result.type}</div>
          <div style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:18}}>{result.desc}</div>
          <div className="track-steps">
            {STATUS_STEPS.map((s,i)=>(
              <div key={s} className={`track-step${i<result.status?" done":i===result.status?" active":""}`}>
                <div className="step-dot">{i<result.status?"✓":i===result.status?"●":i+1}</div>
                <div className="step-label">{s}</div>
              </div>
            ))}
          </div>
          <div className="track-meta" style={{marginBottom:0}}>
            <div className="track-meta-item"><strong>{result.name}</strong>Complainant</div>
            <div className="track-meta-item"><strong>{result.date}</strong>Incident Date</div>
            <div className="track-meta-item"><strong>{result.comments.length}</strong>Comments</div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <div className="timeline-title">📋 Activity Timeline</div>
            {result.timeline.map((t,i)=>(
              <div className="timeline-item" key={i}>
                <div className="timeline-dot-wrap"><div className="timeline-dot"/><div className="timeline-line"/></div>
                <div><div className="timeline-event">{t.event}</div><div className="timeline-time">{t.time}</div>{t.note&&<div className="timeline-note">{t.note}</div>}</div>
              </div>
            ))}
          </div>

          {/* Comments */}
          <div className="timeline" style={{borderTop:"1px solid var(--border)",paddingTop:18,marginTop:18}}>
            <div className="timeline-title">💬 Comments & Updates</div>
            {result.comments.length>0&&(
              <div className="comment-list">
                {result.comments.map((c,i)=>(
                  <div className="comment-item" key={i}>
                    <div className="comment-author">{c.author==="System"?"🤖 System":c.author==="You"?"👤 You":"👮 "+c.author}</div>
                    <div className="comment-text">{c.text}</div>
                    <div className="comment-date">{c.date}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="comment-input-row">
              <input className="comment-input" placeholder="Add a comment or update…" value={newComment}
                onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&postComment(result.id)}/>
              <button className="btn btn-primary btn-sm" onClick={()=>postComment(result.id)}>Post</button>
            </div>
          </div>
          <div style={{marginTop:14,textAlign:"right"}}>
            <button className="btn btn-secondary btn-sm" onClick={()=>setResult(null)}>✕ Close</button>
          </div>
        </div>
      )}

      {/* Browse All */}
      <div style={{fontWeight:700,fontSize:"0.97rem",marginBottom:14}}>
        All Complaints <span style={{color:"var(--muted)",fontWeight:400,fontSize:"0.83rem"}}>({complaints.length} total)</span>
      </div>
      <div className="search-bar-wrap">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by ID, name, type, description…" value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
        <select className="search-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="0">🟡 Filed</option>
          <option value="1">🔵 Under Review</option>
          <option value="2">✅ Action Taken</option>
        </select>
        <select className="search-select" value={filterType} onChange={e=>setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {uniqueTypes.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length===0?(
        <div className="no-results"><div className="no-results-icon">🔎</div><h3>No complaints found</h3><p>Try adjusting your search or filters.</p></div>
      ):(
        filtered.map(c=>(
          <div className="track-card" key={c.id} onClick={()=>{setResult(c);setSearchId(c.id);}}>
            <div className="track-header">
              <div>
                <div className="track-id">{c.id}</div>
                <div style={{fontWeight:700,marginTop:4}}>{c.type}</div>
                <div style={{color:"var(--muted)",fontSize:"0.79rem",marginTop:3}}>{c.name} · {c.date}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7,alignItems:"flex-end"}}>
                <div className={`tag ${c.status===0?"tag-open":c.status===1?"tag-review":"tag-resolved"}`}>
                  {c.status===0?"🟡 Filed":c.status===1?"🔵 Under Review":"✅ Resolved"}
                </div>
                <div style={{fontSize:"0.73rem",color:"var(--muted)"}}>{c.comments.length} comment{c.comments.length!==1?"s":""}</div>
              </div>
            </div>
            <div style={{fontSize:"0.8rem",color:"var(--muted)",lineHeight:1.6}}>{c.desc.slice(0,120)}{c.desc.length>120?"…":""}</div>
          </div>
        ))
      )}
    </div>
  );
}

// ── ALERTS PAGE ───────────────────────────────────────────────────────────────
function AlertsPage(){
  const [filter,setFilter]=useState("all");
  const [query,setQuery]=useState("");
  const cats=["all","phishing","upi","identity","malware","social"];
  const catLabel=c=>c==="all"?"🔍 All":c==="phishing"?"🎣 Phishing":c==="upi"?"💸 UPI Fraud":c==="identity"?"🪪 Identity":c==="malware"?"🦠 Malware":"📱 Social";
  const filtered=SCAM_ALERTS.filter(a=>{
    const mC=filter==="all"||a.category===filter;
    const q=query.toLowerCase();
    const mQ=!q||a.title.toLowerCase().includes(q)||a.desc.toLowerCase().includes(q);
    return mC&&mQ;
  });
  return(
    <div className="section page-enter">
      <div className="section-title">Scam <span>Alerts</span></div>
      <div className="section-sub">Stay updated on the latest cyber threats. Filter by category or search by keyword.</div>
      <div className="search-bar-wrap">
        <div className="search-input-wrap" style={{maxWidth:370}}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search alerts…" value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
      </div>
      <div className="alerts-filter">{cats.map(c=><button key={c} className={`filter-btn${filter===c?" active":""}`} onClick={()=>setFilter(c)}>{catLabel(c)}</button>)}</div>
      <div style={{color:"var(--muted)",fontSize:"0.79rem",marginBottom:16}}>{filtered.length} alert{filtered.length!==1?"s":""} found</div>
      {filtered.length===0?(
        <div className="no-results"><div className="no-results-icon">🚨</div><h3>No alerts found</h3><p>Try a different keyword or category.</p></div>
      ):(
        <div className="alerts-grid">
          {filtered.map(a=>(
            <div key={a.id} className={`alert-card ${a.severity}`}>
              <div className="alert-header">
                <span className={`alert-category ${a.category}`}>{catLabel(a.category).replace("🔍 ","")}</span>
                <span className={`severity-badge ${a.severity}`}>{a.severity.toUpperCase()}</span>
              </div>
              <div className="alert-title">{a.title}</div>
              <div className="alert-desc">{a.desc}</div>
              <div className="alert-footer">
                <span className="alert-date">{a.date}</span>
                <span className="alert-reports">📊 {a.reports.toLocaleString("en-IN")} reports</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── HELPLINES ─────────────────────────────────────────────────────────────────
function HelplinesPage(){
  const [search,setSearch]=useState("");
  const filtered=HELPLINES.filter(h=>!search||h.name.toLowerCase().includes(search.toLowerCase())||h.number.includes(search)||h.desc.toLowerCase().includes(search.toLowerCase()));
  return(
    <div className="section page-enter">
      <div className="section-title">Emergency <span>Helplines</span></div>
      <div className="section-sub">Official government-verified contacts. Reach the right authority instantly.</div>
      <div className="search-bar-wrap" style={{marginBottom:26}}>
        <div className="search-input-wrap" style={{maxWidth:370}}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search helplines…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>
      {filtered.length===0?(
        <div className="no-results"><div className="no-results-icon">📞</div><h3>No helplines found</h3></div>
      ):(
        <div className="helpline-grid">
          {filtered.map((h,i)=>(
            <div className="helpline-card" key={i}>
              <div className="helpline-icon">{h.icon}</div>
              <div><div className="helpline-org">{h.org}</div><div className="helpline-name">{h.name}</div></div>
              <div className="helpline-number" style={{color:h.color}}>{h.number}</div>
              <div className="helpline-desc">{h.desc}</div>
              <div className="helpline-avail">🟢 {h.avail}</div>
              {h.isWeb
                ?<a className="helpline-btn" href={`https://${h.number}`} target="_blank" rel="noreferrer">🌐 Visit Portal</a>
                :<a className="helpline-btn" href={`tel:${h.number}`}>📞 Call Now</a>
              }
            </div>
          ))}
        </div>
      )}
      <div className="tip-box">
        <h3>⚠️ What To Do If You're Scammed</h3>
        <div className="tip-list">
          {["Call the Cyber Crime Helpline 1930 immediately — the faster you report, the better the chance of recovery.",
            "Do NOT share OTPs, passwords, or screen access with anyone, even if they claim to be from your bank.",
            "Take screenshots of all suspicious messages, calls, and transaction details before they disappear.",
            "Block and report fraudulent phone numbers, UPI IDs, and social media accounts.",
            "Contact your bank immediately to freeze transactions if money has been transferred.",
            "File a complaint on cybercrime.gov.in with all evidence attached."
          ].map((tip,i)=><div className="tip-item" key={i}>{tip}</div>)}
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({dark}){
  const barRef=useRef(),pieRef=useRef(),lineRef=useRef();
  const barC=useRef(),pieC=useRef(),lineC=useRef();
  useEffect(()=>{
    const accent="#00c9a7",danger="#ff4d6d",warn="#ffd60a",purple="#a78bfa",blue="#60a5fa";
    const gc=dark?"rgba(30,48,72,0.8)":"rgba(200,216,232,0.5)";
    const tc=dark?"#5a7a9a":"#6b8aaa";
    const lc=dark?"#e2eaf4":"#1a2a3a";
    const bg=dark?"#0d1724":"#ffffff";
    const defs={plugins:{legend:{labels:{color:lc,font:{family:"Syne",size:11}}}},scales:{x:{grid:{color:gc},ticks:{color:tc}},y:{grid:{color:gc},ticks:{color:tc}}}};
    if(barC.current)barC.current.destroy();
    barC.current=new Chart(barRef.current,{type:"bar",data:{labels:["Jan","Feb","Mar","Apr","May","Jun"],datasets:[
      {label:"Phishing",data:[420,580,710,490,830,960],backgroundColor:danger+"bb",borderRadius:6},
      {label:"UPI Fraud",data:[310,450,520,380,670,800],backgroundColor:warn+"bb",borderRadius:6},
      {label:"Identity",data:[180,210,290,240,350,410],backgroundColor:purple+"bb",borderRadius:6},
    ]},options:{...defs,responsive:true,maintainAspectRatio:true}});
    if(pieC.current)pieC.current.destroy();
    pieC.current=new Chart(pieRef.current,{type:"doughnut",data:{labels:["Phishing","UPI Fraud","Identity","Malware","Social","Other"],datasets:[{data:[34,28,14,11,8,5],backgroundColor:[danger,warn,purple,blue,accent,"#94a3b8"],borderWidth:2,borderColor:bg}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{labels:{color:lc,font:{family:"Syne",size:11}}}}}});
    if(lineC.current)lineC.current.destroy();
    lineC.current=new Chart(lineRef.current,{type:"line",data:{labels:["Jan","Feb","Mar","Apr","May","Jun"],datasets:[
      {label:"Complaints Filed",data:[1200,1450,1700,1550,2100,2400],borderColor:accent,backgroundColor:accent+"20",tension:0.4,fill:true,pointBackgroundColor:accent},
      {label:"Resolved",data:[980,1200,1450,1300,1800,2100],borderColor:blue,backgroundColor:blue+"15",tension:0.4,fill:true,pointBackgroundColor:blue},
    ]},options:{...defs,responsive:true,maintainAspectRatio:true}});
    return()=>{barC.current?.destroy();pieC.current?.destroy();lineC.current?.destroy();};
  },[dark]);
  return(
    <div className="section page-enter">
      <div className="section-title">Crime <span>Dashboard</span></div>
      <div className="section-sub">Analytics and real-time statistics on cyber crime trends across India.</div>
      <div className="dash-grid">
        {[{n:"1,24,336",l:"Total Complaints",c:"accent",t:"↑ 18% this month"},
          {n:"4,891",l:"High Priority",c:"danger",t:"↑ 7% this week"},
          {n:"₹48.2 Cr",l:"Money Recovered",c:"accent",t:"↑ 12% this quarter"},
          {n:"89%",l:"Resolution Rate",c:"warning",t:"↑ 3% improvement"},
          {n:"2,891",l:"Active Alerts",c:"danger",t:""},
          {n:"47 min",l:"Avg. Response Time",c:"accent",t:"↓ 8 min faster"},
        ].map(d=>(
          <div className="dash-card" key={d.l}>
            <div className={`dash-num ${d.c}`}>{d.n}</div>
            <div className="dash-label">{d.l}</div>
            {d.t&&<div className="dash-trend">{d.t}</div>}
          </div>
        ))}
      </div>
      <div className="charts-grid">
        <div className="chart-box" style={{gridColumn:"1/-1"}}>
          <div className="chart-title">📈 Monthly Complaints vs Resolutions</div>
          <canvas ref={lineRef} height={80}></canvas>
        </div>
        <div className="chart-box">
          <div className="chart-title">📊 Crime Type Breakdown (Monthly)</div>
          <canvas ref={barRef} height={140}></canvas>
        </div>
        <div className="chart-box">
          <div className="chart-title">🥧 Crime Distribution (%)</div>
          <canvas ref={pieRef} height={140}></canvas>
        </div>
      </div>
    </div>
  );
}

// ── SUCCESS MODAL ─────────────────────────────────────────────────────────────
function SuccessModal({data,onClose,goTrack}){
  return(
    <div className="success-overlay" onClick={onClose}>
      <div className="success-box" onClick={e=>e.stopPropagation()}>
        <div className="success-icon">✅</div>
        <h2>Complaint Filed!</h2>
        <p>Your complaint has been submitted. Save your ID to track progress.</p>
        <div className="success-id">{data.id}</div>
        <p style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:20}}>Filed on {data.submittedAt} · Updates sent via email</p>
        <div style={{display:"flex",gap:11,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={()=>{goTrack();onClose();}}>Track Complaint</button>
          <button className="btn btn-secondary" onClick={onClose}>File Another</button>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
function App(){
  const [tab,setTab]=useState("Home");
  const [dark,setDark]=useState(true);
  const [complaints,setComplaints]=useState(INIT_COMPLAINTS);
  const [showSuccess,setShowSuccess]=useState(false);
  const [lastSubmit,setLastSubmit]=useState(null);

  useEffect(()=>{document.body.classList.toggle("light",!dark);},[dark]);

  const handleSubmit=data=>{
    const newC={
      id:data.id,type:data.crimeType,name:data.name,date:data.date||data.submittedAt,status:0,
      desc:data.description,comments:[],
      timeline:[{event:"Complaint Filed",time:new Date().toLocaleString("en-IN"),note:"Received via portal. Awaiting assignment."}]
    };
    setComplaints(p=>[newC,...p]);
    setLastSubmit(data);
    setShowSuccess(true);
  };

  const handleAddComment=(id,comment)=>{
    setComplaints(p=>p.map(c=>c.id===id?{...c,comments:[...c.comments,comment]}:c));
  };

  return(
    <>
      <Nav tab={tab} setTab={setTab} dark={dark} toggleDark={()=>setDark(d=>!d)}/>
      {tab==="Home"&&<><Hero setTab={setTab}/><StatsBar/><AlertsPage/></>}
      {tab==="Report"&&<ReportForm onSubmit={handleSubmit}/>}
      {tab==="Track"&&<TrackPage complaints={complaints} onAddComment={handleAddComment}/>}
      {tab==="Alerts"&&<AlertsPage/>}
      {tab==="Helplines"&&<HelplinesPage/>}
      {tab==="Dashboard"&&<Dashboard dark={dark}/>}
      <MobileNav tab={tab} setTab={setTab}/>
      {showSuccess&&lastSubmit&&<SuccessModal data={lastSubmit} onClose={()=>setShowSuccess(false)} goTrack={()=>setTab("Track")}/>}
      <div style={{height:80}}/>
    </>
  );
}
export default App;
