

import { useState, useRef, useEffect } from "react";
import { db } from "../../firebase/config";   // ← your existing firebase config
import {
  collection, doc, setDoc, updateDoc,
  getDocs, deleteDoc, serverTimestamp,
} from "firebase/firestore";

// ═══════════════════════════════════════════════════════════════
//  CONFIGURATION  —  Edit these 3 values only
// ═══════════════════════════════════════════════════════════════

const CLOUDINARY_CLOUD_NAME    = "dzpenviyy";   // ← your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = "product_upload";        // ← your unsigned upload preset
const STAFF_PIN   = process.env.REACT_APP_STAFF_PIN || "1234"
const SITE_URL    = process.env.REACT_APP_SITE_URL || window.location.origin

// ═══════════════════════════════════════════════════════════════
//  QR TYPES
// ═══════════════════════════════════════════════════════════════

const QR_TYPES = [
  { id: "URL",       icon: "🌐", label: "Website URL"  },
  { id: "PDF",       icon: "📄", label: "PDF File"     },
  { id: "Image",     icon: "🖼️", label: "Image"        },
  { id: "WhatsApp",  icon: "💬", label: "WhatsApp"     },
  { id: "VCard",     icon: "👤", label: "Contact Card" },
  { id: "WiFi",      icon: "📶", label: "WiFi"         },
  { id: "Email",     icon: "📧", label: "Email"        },
  { id: "Phone",     icon: "📞", label: "Phone"        },
  { id: "SMS",       icon: "✉️",  label: "SMS"          },
  { id: "Text",      icon: "📝", label: "Plain Text"   },
];

// ═══════════════════════════════════════════════════════════════
//  SECURITY & UTILITIES
// ═══════════════════════════════════════════════════════════════

const BLOCKED = [/javascript:/i,/data:/i,/vbscript:/i,/<script/i,/127\.0\.0\.1/,/localhost/i,/192\.168\./];
const sanitize  = (s = "") => s.replace(/[<>"'`]/g, "").trim();
const isSafeUrl = (u) => { try { const p = new URL(u); return ["http:","https:"].includes(p.protocol) && !BLOCKED.some(r=>r.test(u)); } catch { return false; } };

// ── Dynamic QR Utilities ─────────────────────────────────────────────────────
// Collision-safe code — timestamp prefix + random suffix
// Timestamp makes it unique per millisecond, random handles same-ms edge case
const genCode = () => {
  const ts  = Date.now().toString(36).toUpperCase().slice(-4); // last 4 chars of timestamp
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase(); // 4 random chars
  return `${ts}${rnd}`; // e.g. "K9X2M7P4" — 8 chars, practically collision-proof
};

const buildContent = (type, d) => {
  switch (type) {
    case "URL":     return (d.url || "").trim();
    case "PDF":     return (d.pdfUrl || "").trim();
    case "Image":   return (d.imageUrl || "").trim();
    case "Text":    return sanitize(d.text || "");
    case "Email":   return d.email ? `mailto:${d.email}?subject=${encodeURIComponent(d.subject||"")}&body=${encodeURIComponent(sanitize(d.body||""))}` : "";
    case "Phone":   return d.phone ? `tel:${d.phone.replace(/\s/g,"")}` : "";
    case "SMS":     return d.phone ? `smsto:${d.phone.replace(/\s/g,"")}:${sanitize(d.msg||"")}` : "";
    case "WhatsApp":return d.phone ? `https://wa.me/${d.phone.replace(/[^0-9]/g,"")}${d.msg?`?text=${encodeURIComponent(sanitize(d.msg))}` : ""}` : "";
    case "WiFi":    return d.ssid  ? `WIFI:T:${d.enc||"WPA"};S:${sanitize(d.ssid)};P:${d.pass||""};;` : "";
    case "VCard":   return d.name  ? `BEGIN:VCARD\nVERSION:3.0\nFN:${sanitize(d.name)}\nTEL:${d.phone||""}\nEMAIL:${d.email||""}\nORG:${sanitize(d.org||"")}\nURL:${d.url||""}\nEND:VCARD` : "";
    default: return "";
  }
};

const buildQrUrl = (content, size=300, fg="000000", bg="ffffff") =>
  `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(content)}&size=${size}x${size}&color=${fg}&bgcolor=${bg}&ecc=M&qzone=2&format=png`;

const buildQrSvg = (content, size=400, fg="000000", bg="ffffff") =>
  `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(content)}&size=${size}x${size}&color=${fg}&bgcolor=${bg}&ecc=M&qzone=2&format=svg`;

async function uploadToCloudinary(file, resourceType = "auto") {
  const url  = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res  = await fetch(url, { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  return (await res.json()).secure_url;
}

async function downloadFile(url, filename) {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch { window.open(url, "_blank"); }
}

const loadHistory = () => { try { return JSON.parse(localStorage.getItem("gl_qr_history")||"[]"); } catch { return []; } };
const saveHistory = (h) => { try { localStorage.setItem("gl_qr_history", JSON.stringify(h.slice(0,30))); } catch {} };

// ═══════════════════════════════════════════════════════════════
//  PIN GATE
// ═══════════════════════════════════════════════════════════════

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECS = 30;

function PinGate({ onUnlock }) {
  const [pin,       setPin]       = useState("");
  const [err,       setErr]       = useState("");
  const [shake,     setShake]     = useState(false);
  const [attempts,  setAttempts]  = useState(0);
  const [locked,    setLocked]    = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  // Lockout countdown
  useEffect(() => {
    if (!locked) return;
    setCountdown(LOCKOUT_SECS);
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setLocked(false);
          setAttempts(0);
          setErr("");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [locked]);

  const submit = () => {
    if (locked) return;
    if (pin === STAFF_PIN) {
      setAttempts(0); setErr("");
      onUnlock();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setShake(true); setPin("");
      setTimeout(() => setShake(false), 500);
      if (next >= MAX_ATTEMPTS) {
        setLocked(true);
        setErr(`Too many attempts. Locked for ${LOCKOUT_SECS} seconds.`);
      } else {
        setErr(`Incorrect PIN. ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next !== 1 ? "s" : ""} remaining.`);
      }
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0fdf4",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",padding:20}}>
      <div style={{
        background:"#fff",borderRadius:24,padding:"44px 40px",
        boxShadow:"0 20px 60px rgba(22,101,52,0.12), 0 4px 16px rgba(0,0,0,0.06)",
        width:"100%",maxWidth:380,textAlign:"center",
        animation: shake ? "shake 0.4s ease" : "fadeUp 0.4s ease both",
      }}>
        {/* GreenLife Logo */}
        <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#16a34a,#15803d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🌿</div>
          <div style={{textAlign:"left"}}>
            <p style={{fontSize:15,fontWeight:800,color:"#14532d",lineHeight:1}}>GreenLife</p>
            <p style={{fontSize:11,color:"#16a34a",fontWeight:600,lineHeight:1,marginTop:2}}>Cropcare</p>
          </div>
        </div>

        <div style={{width:56,height:56,borderRadius:16,background:"#f0fdf4",border:"2px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 20px"}}>🔐</div>
        <h2 style={{fontSize:22,fontWeight:800,color:"#14532d",marginBottom:6}}>Staff Access</h2>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:28,lineHeight:1.6}}>Enter your staff PIN to access the QR Generator</p>

        {/* Lockout Banner */}
        {locked && (
          <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
            <p style={{fontSize:13,fontWeight:800,color:"#b91c1c",marginBottom:2}}>🔒 Too many attempts</p>
            <p style={{fontSize:12,color:"#ef4444"}}>Locked for <strong>{countdown}s</strong></p>
          </div>
        )}

        <input
          type="password" placeholder={locked ? "Locked…" : "Enter PIN"} value={pin}
          onChange={(e) => { setPin(e.target.value); if (!locked) setErr(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={locked}
          maxLength={8}
          style={{
            width:"100%",padding:"14px 18px",fontSize:22,textAlign:"center",
            letterSpacing:"0.3em",borderRadius:14,
            border:`2px solid ${err ? "#fca5a5" : "#d1fae5"}`,
            background: locked ? "#f3f4f6" : err ? "#fff5f5" : "#f0fdf4",
            color:"#14532d",fontFamily:"inherit",outline:"none",
            marginBottom:8, transition:"all 0.2s",
            opacity: locked ? 0.5 : 1,
            cursor: locked ? "not-allowed" : "text",
          }}
          autoFocus
        />
        {err && !locked && <p style={{fontSize:12,color:"#ef4444",marginBottom:12,fontWeight:600}}>{err}</p>}
        {!err && !locked && <div style={{height:20}}/>}
        {locked && <div style={{height:8}}/>}

        <button onClick={submit} disabled={locked} style={{
          width:"100%",padding:"14px",borderRadius:14,border:"none",
          background: locked ? "#d1d5db" : "linear-gradient(135deg,#16a34a,#15803d)",
          color:"#fff",fontSize:15,fontWeight:800,cursor: locked ? "not-allowed" : "pointer",
          boxShadow: locked ? "none" : "0 4px 16px rgba(22,163,74,0.35)",
          transition:"all 0.2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
        >
          Unlock →
        </button>
        <p style={{fontSize:11,color:"#9ca3af",marginTop:16}}>🔒 Private staff tool · Not visible to customers</p>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  UPLOAD DROPZONE
// ═══════════════════════════════════════════════════════════════

function DropZone({ accept, icon, label, hint, resourceType, onDone }) {
  const [status,   setStatus]   = useState("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [resultUrl,setResultUrl]= useState("");
  const ref = useRef();

  const ALLOWED_IMAGE_TYPES = ["image/jpeg","image/png","image/webp","image/gif","image/svg+xml"];
  const ALLOWED_PDF_TYPES   = ["application/pdf"];
  const MAX_FILE_SIZE_MB    = 10;

  const handle = async (file) => {
    if (!file) return;

    // Credentials check
    if (CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
      setStatus("error"); setFileName("Set Cloudinary credentials in the file first"); return;
    }

    // File size validation
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setStatus("error"); setFileName(`File too large (${sizeMB.toFixed(1)}MB) — max ${MAX_FILE_SIZE_MB}MB allowed`); return;
    }

    // File type validation (real MIME check — not just extension)
    const allowed = resourceType === "raw" ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowed.includes(file.type)) {
      setStatus("error");
      setFileName(resourceType === "raw"
        ? "Invalid file — only PDF allowed"
        : "Invalid file — JPG, PNG, WebP, GIF, SVG only"
      );
      return;
    }

    // Sanitize filename (strip path traversal / special chars)
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    setFileName(safeName); setStatus("uploading"); setProgress(0);
    const iv = setInterval(() => setProgress(p => p < 88 ? p+7 : p), 180);
    try {
      const url = await uploadToCloudinary(file, resourceType);
      clearInterval(iv); setProgress(100); setStatus("done");
      setResultUrl(url); onDone(url);
    } catch {
      clearInterval(iv); setStatus("error"); setFileName("Upload failed — check Cloudinary credentials");
    }
  };

  const reset = () => { setStatus("idle"); setFileName(""); setResultUrl(""); setProgress(0); onDone(""); if (ref.current) ref.current.value=""; };

  const borderCol = status==="done" ? "#16a34a" : status==="error" ? "#ef4444" : "#d1fae5";
  const bgCol     = status==="done" ? "#f0fdf4" : status==="error" ? "#fff5f5" : "#f9fafb";

  return (
    <div>
      <div
        onDrop={e=>{e.preventDefault();handle(e.dataTransfer.files?.[0]);}}
        onDragOver={e=>e.preventDefault()}
        onClick={()=>status!=="uploading"&&ref.current?.click()}
        style={{
          border:`2px dashed ${borderCol}`,borderRadius:16,padding:"28px 20px",
          textAlign:"center",cursor:status==="uploading"?"not-allowed":"pointer",
          background:bgCol,transition:"all 0.2s",
        }}
      >
        <input ref={ref} type="file" accept={accept} style={{display:"none"}} onChange={e=>handle(e.target.files?.[0])} />

        {status==="idle" && (<>
          <div style={{fontSize:36,marginBottom:10}}>{icon}</div>
          <p style={{fontWeight:700,fontSize:14,color:"#14532d",marginBottom:5}}>{label}</p>
          <p style={{fontSize:12,color:"#6b7280",lineHeight:1.7,whiteSpace:"pre-line"}}>{hint}</p>
          <div style={{display:"inline-block",marginTop:12,padding:"7px 18px",borderRadius:100,background:"#dcfce7",fontSize:12,fontWeight:700,color:"#15803d"}}>Browse files</div>
        </>)}

        {status==="uploading" && (<>
          <div style={{fontSize:28,marginBottom:10}}>⏳</div>
          <p style={{fontSize:13,fontWeight:700,color:"#14532d",marginBottom:14}}>Uploading {fileName}…</p>
          <div style={{background:"#dcfce7",borderRadius:100,height:6,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:100,background:"linear-gradient(90deg,#16a34a,#4ade80)",width:`${progress}%`,transition:"width 0.2s"}}/>
          </div>
          <p style={{fontSize:11,color:"#6b7280",marginTop:6}}>{progress}%</p>
        </>)}

        {status==="done" && (<>
          <div style={{fontSize:32,marginBottom:8}}>✅</div>
          <p style={{fontSize:14,fontWeight:800,color:"#15803d",marginBottom:5}}>Uploaded successfully!</p>
          <p style={{fontSize:11,fontFamily:"monospace",color:"#6b7280",wordBreak:"break-all",lineHeight:1.5,marginBottom:12}}>
            {resultUrl.length>52 ? resultUrl.slice(0,52)+"…" : resultUrl}
          </p>
          <button onClick={e=>{e.stopPropagation();reset();}} style={{fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:8,background:"#f3f4f6",border:"1px solid #e5e7eb",color:"#374151",cursor:"pointer"}}>× Change file</button>
        </>)}

        {status==="error" && (<>
          <div style={{fontSize:32,marginBottom:8}}>❌</div>
          <p style={{fontSize:12,color:"#ef4444",lineHeight:1.6,marginBottom:12}}>{fileName}</p>
          <button onClick={e=>{e.stopPropagation();reset();}} style={{fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:8,background:"#fee2e2",border:"1px solid #fca5a5",color:"#b91c1c",cursor:"pointer"}}>Try again</button>
        </>)}
      </div>

      {/* OR paste URL */}
      {status!=="done" && (
        <div style={{marginTop:12}}>
          <p style={{fontSize:11,color:"#9ca3af",textAlign:"center",marginBottom:8}}>— or paste existing URL —</p>
          <input type="url" placeholder="https://res.cloudinary.com/..." onChange={e=>onDone(e.target.value.trim())}
            style={{width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid #d1fae5",background:"#f0fdf4",fontSize:13,color:"#14532d",outline:"none",fontFamily:"inherit"}}
            onFocus={e=>e.target.style.borderColor="#16a34a"} onBlur={e=>e.target.style.borderColor="#d1fae5"}
          />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FORM FIELDS PER TYPE
// ═══════════════════════════════════════════════════════════════

const Inp = ({label, placeholder, value, onChange, type="text", mono=false}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label && <label style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</label>}
    <input type={type} placeholder={placeholder} value={value||""} onChange={e=>onChange(e.target.value)}
      style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid #d1fae5",background:"#f0fdf4",fontSize:13,color:"#14532d",fontFamily:mono?"monospace":"inherit",outline:"none",transition:"border-color 0.15s"}}
      onFocus={e=>e.target.style.borderColor="#16a34a"} onBlur={e=>e.target.style.borderColor="#d1fae5"}
    />
  </div>
);

const Ta = ({label, placeholder, value, onChange, rows=3}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label && <label style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</label>}
    <textarea placeholder={placeholder} value={value||""} onChange={e=>onChange(e.target.value)} rows={rows}
      style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid #d1fae5",background:"#f0fdf4",fontSize:13,color:"#14532d",fontFamily:"inherit",outline:"none",resize:"vertical",transition:"border-color 0.15s"}}
      onFocus={e=>e.target.style.borderColor="#16a34a"} onBlur={e=>e.target.style.borderColor="#d1fae5"}
    />
  </div>
);

const Sel = ({label, value, onChange, options}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label && <label style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</label>}
    <select value={value||options[0].val} onChange={e=>onChange(e.target.value)}
      style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid #d1fae5",background:"#f0fdf4",fontSize:13,color:"#14532d",fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
      {options.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
    </select>
  </div>
);

const Row2 = ({children}) => <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>;

function QRTypeForm({ type, data, set }) {
  const s = (k) => (v) => set(k,v);
  switch(type) {
    case "URL":
      return <Inp label="Website URL *" placeholder="https://greenlifecropcare.com/product/xyz" value={data.url} onChange={s("url")} type="url"/>;

    case "PDF":
      return (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <DropZone accept=".pdf,application/pdf" icon="📄" label="Upload Product PDF / Brochure" hint={"Supports .pdf · Max 10MB\nPerfect for product datasheets & brochures"} resourceType="raw" onDone={v=>set("pdfUrl",v)}/>
          {data.pdfUrl && (
            <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px"}}>
              <p style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>QR will open</p>
              <p style={{fontSize:11,fontFamily:"monospace",color:"#15803d",wordBreak:"break-all",lineHeight:1.6}}>{data.pdfUrl}</p>
            </div>
          )}
        </div>
      );

    case "Image":
      return (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <DropZone accept="image/*" icon="🖼️" label="Upload Product Image" hint={"Supports JPG, PNG, WebP · Max 10MB\nPerfect for product photos & labels"} resourceType="image" onDone={v=>set("imageUrl",v)}/>
          {data.imageUrl && data.imageUrl.startsWith("http") && (
            <img src={data.imageUrl} alt="preview" style={{maxHeight:160,borderRadius:10,border:"1px solid #d1fae5",objectFit:"contain",width:"100%"}} onError={e=>e.target.style.display="none"}/>
          )}
          {data.imageUrl && (
            <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px"}}>
              <p style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>QR will open</p>
              <p style={{fontSize:11,fontFamily:"monospace",color:"#15803d",wordBreak:"break-all",lineHeight:1.6}}>{data.imageUrl}</p>
            </div>
          )}
        </div>
      );

    case "WhatsApp":
      return (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp label="WhatsApp Number (with country code) *" placeholder="919876543210" value={data.phone} onChange={s("phone")} type="tel"/>
          <Ta  label="Pre-filled Message" placeholder="Hi, I'm interested in your product..." value={data.msg} onChange={s("msg")} rows={2}/>
          <p style={{fontSize:12,color:"#9ca3af"}}>💡 Include country code without + (91 for India)</p>
        </div>
      );

    case "VCard":
      return (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Row2>
            <Inp label="Full Name *" placeholder="Sales Manager" value={data.name} onChange={s("name")}/>
            <Inp label="Designation"  placeholder="GreenLife Cropcare" value={data.org} onChange={s("org")}/>
          </Row2>
          <Row2>
            <Inp label="Phone" placeholder="+91 98765 43210" value={data.phone} onChange={s("phone")} type="tel"/>
            <Inp label="Email" placeholder="sales@greenlife.com" value={data.email} onChange={s("email")} type="email"/>
          </Row2>
          <Inp label="Website" placeholder="https://greenlifecropcare.com" value={data.url} onChange={s("url")} type="url"/>
          <Inp label="Address" placeholder="Pune, Maharashtra" value={data.address} onChange={s("address")}/>
        </div>
      );

    case "WiFi":
      return (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp label="Network Name (SSID) *" placeholder="GreenLife_Office" value={data.ssid} onChange={s("ssid")}/>
          <Inp label="Password" placeholder="WiFi password" value={data.pass} onChange={s("pass")} type="password"/>
          <Sel label="Security Type" value={data.enc} onChange={s("enc")} options={[{val:"WPA",label:"WPA/WPA2"},{val:"WEP",label:"WEP"},{val:"nopass",label:"No Password"}]}/>
        </div>
      );

    case "Email":
      return (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp label="Email Address *" placeholder="info@greenlifecropcare.com" value={data.email} onChange={s("email")} type="email"/>
          <Inp label="Subject" placeholder="Product Enquiry" value={data.subject} onChange={s("subject")}/>
          <Ta  label="Message" placeholder="I would like to know more about..." value={data.body} onChange={s("body")} rows={2}/>
        </div>
      );

    case "Phone":
      return <Inp label="Phone Number *" placeholder="+91 98765 43210" value={data.phone} onChange={s("phone")} type="tel"/>;

    case "SMS":
      return (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp label="Phone Number *" placeholder="+91 98765 43210" value={data.phone} onChange={s("phone")} type="tel"/>
          <Ta  label="Pre-filled SMS" placeholder="Text message..." value={data.msg} onChange={s("msg")} rows={2}/>
        </div>
      );

    case "Text":
      return <Ta label="Text Content *" placeholder="Product name, batch info, instructions..." value={data.text} onChange={s("text")} rows={4}/>;

    default: return null;
  }
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function StaffQRPage() {
  const [unlocked,  setUnlocked]  = useState(() => sessionStorage.getItem("gl_qr_auth")==="1");
  const [qrType,    setQrType]    = useState("URL");
  const [formData,  setFormData]  = useState({});
  const [fg,        setFg]        = useState("#000000");
  const [bg,        setBg]        = useState("#ffffff");
  const [size,      setSize]      = useState(300);
  const [label,     setLabel]     = useState("");

  const [qrImgUrl,  setQrImgUrl]  = useState("");
  const [content,   setContent]   = useState("");
  const [imgStatus, setImgStatus] = useState("idle");

  const [history,   setHistory]   = useState(loadHistory);
  const [dlState,   setDlState]   = useState("");
  const [saved,     setSaved]     = useState(false);
  const [errMsg,    setErrMsg]    = useState("");
  const [tab,       setTab]       = useState("generator");

  // ✅ Dynamic QR state
  const [isDynamic,   setIsDynamic]   = useState(false);
  const [dynSaving,   setDynSaving]   = useState(false);
  const [dynSaved,    setDynSaved]    = useState(false);
  const [dynCode,     setDynCode]     = useState("");
  const [dynUrl,      setDynUrl]      = useState("");
  const [dynQrImg,    setDynQrImg]    = useState("");
  const [dynList,     setDynList]     = useState([]);
  const [dynLoading,  setDynLoading]  = useState(false);
  const [editingCode, setEditingCode] = useState(null);  // code being edited
  const [editDest,    setEditDest]    = useState("");
  const [editSaving,  setEditSaving]  = useState(false);

  const debounceRef = useRef();

  const unlock = () => { sessionStorage.setItem("gl_qr_auth","1"); setUnlocked(true); };
  const logout  = () => { sessionStorage.removeItem("gl_qr_auth"); setUnlocked(false); };

  // Auto-load dynamic QRs when switching to dynamic or analytics tab
  useEffect(() => {
    if ((tab === "dynamic" || tab === "analytics") && unlocked) loadDynamicQRs();
  }, [tab, unlocked]);

  const setField = (k,v) => setFormData(p=>({...p,[k]:v}));
  const switchType = (t) => { setQrType(t); setFormData({}); setQrImgUrl(""); setContent(""); setImgStatus("idle"); setErrMsg(""); };

  // Build + debounce
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setErrMsg("");
      const c = buildContent(qrType, formData);
      if (!c) { setQrImgUrl(""); setContent(""); setImgStatus("idle"); return; }
      if (["URL","WhatsApp"].includes(qrType) && c.startsWith("http") && !isSafeUrl(c)) {
        setErrMsg("🚫 Unsafe URL blocked"); setQrImgUrl(""); return;
      }
      const url = buildQrUrl(c, Math.min(size,400), fg.replace("#",""), bg.replace("#",""));
      setQrImgUrl(url); setContent(c); setImgStatus("loading");
    }, 380);
    return () => clearTimeout(debounceRef.current);
  }, [formData, qrType, size, fg, bg]);

  const handleDownload = async (format) => {
    if (!content) return;
    setDlState(format);
    const url = format==="svg"
      ? buildQrSvg(content, size, fg.replace("#",""), bg.replace("#",""))
      : buildQrUrl(content, size, fg.replace("#",""), bg.replace("#",""));
    // Use label as filename — clean it for safe file naming
    const cleanLabel = (label || `greenlife-qr-${qrType.toLowerCase()}`)
      .replace(/[^a-zA-Z0-9\s\-_]/g, '')   // remove special chars
      .replace(/\s+/g, '-')                  // spaces to hyphens
      .toLowerCase()
      .trim() || 'greenlife-qr';
    const fname = `${cleanLabel}.${format}`;
    await downloadFile(url, fname);
    setTimeout(()=>setDlState(""),2500);
  };

  // Sanitise history entry — strip WiFi password before saving
  const sanitiseForHistory = (type, rawContent) => {
    if (type === "WiFi") {
      // Replace password value with *** in stored content
      return rawContent.replace(/P:[^;]*/g, "P:***");
    }
    return rawContent.slice(0, 80);
  };

  const handleSave = () => {
    if (!content) return;
    const entry = {
      id: Date.now(), type: qrType, label: label||qrType,
      content: sanitiseForHistory(qrType, content),
      thumb: buildQrUrl(content,80,"000000","ffffff"),
      ts: Date.now(),
    };
    const h = [entry,...history].slice(0,30);
    setHistory(h); saveHistory(h);
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  };

  const clearHistory = () => { setHistory([]); saveHistory([]); };

  // ── Dynamic QR Functions ──────────────────────────────────────────────────

  // Create a new dynamic QR — saves to Firestore, QR encodes your site URL
  const createDynamicQR = async () => {
    if (!content) return;
    setDynSaving(true); setErrMsg("");
    try {
      const code = genCode();
      const shortUrl = `${SITE_URL}/qr/${code}`;
      const data = {
        code,
        destination: content,
        label: label || qrType,
        type: qrType,
        active: true,
        scanCount: 0,
        createdAt: serverTimestamp(),
        lastScanned: null,
        expiresAt: null,   // null = never expires
      };
      await setDoc(doc(db, "qr_codes", code), data);
      const imgUrl = buildQrUrl(shortUrl, Math.min(size,400), fg.replace("#",""), bg.replace("#",""));
      setDynCode(code);
      setDynUrl(shortUrl);
      setDynQrImg(imgUrl);
      setDynSaved(true);
      // Save to local history too
      const entry = {
        id: Date.now(), type: qrType,
        label: `[DYNAMIC] ${label||qrType}`,
        content: shortUrl,
        thumb: buildQrUrl(shortUrl, 80, "000000", "ffffff"),
        ts: Date.now(), isDynamic: true, code,
      };
      const h = [entry, ...history].slice(0, 30);
      setHistory(h); saveHistory(h);
    } catch (err) {
      setErrMsg("Failed to create dynamic QR — check Firebase connection");
      console.error(err);
    }
    setDynSaving(false);
  };

  // Load all dynamic QRs from Firestore
  const loadDynamicQRs = async () => {
    setDynLoading(true);
    try {
      const snap = await getDocs(collection(db, "qr_codes"));
      const list = snap.docs
        .map(d => ({ ...d.data(), code: d.id }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setDynList(list);
    } catch (err) {
      console.error("Failed to load dynamic QRs:", err);
    }
    setDynLoading(false);
  };

  // Update destination of existing dynamic QR
  const updateDestination = async (code) => {
    if (!editDest.trim()) return;
    setEditSaving(true);
    try {
      await updateDoc(doc(db, "qr_codes", code), {
        destination: editDest.trim(),
        updatedAt: serverTimestamp(),
      });
      setDynList(prev => prev.map(q => q.code === code ? { ...q, destination: editDest.trim() } : q));
      setEditingCode(null); setEditDest("");
    } catch (err) {
      console.error("Update failed:", err);
    }
    setEditSaving(false);
  };

  // Toggle active/inactive
  const toggleActive = async (code, current) => {
    try {
      await updateDoc(doc(db, "qr_codes", code), { active: !current });
      setDynList(prev => prev.map(q => q.code === code ? { ...q, active: !current } : q));
    } catch (err) { console.error(err); }
  };

  // Delete dynamic QR
  const deleteDynamicQR = async (code) => {
    if (!window.confirm("Delete this dynamic QR? It will stop working immediately.")) return;
    try {
      await deleteDoc(doc(db, "qr_codes", code));
      setDynList(prev => prev.filter(q => q.code !== code));
    } catch (err) { console.error(err); }
  };

  // Reset dynamic QR state when switching to static
  const resetDynamic = () => {
    setDynSaved(false); setDynCode(""); setDynUrl(""); setDynQrImg("");
  };

  const COLOR_PRESETS = [
    {fg:"#000000",bg:"#ffffff",name:"Classic"},
    {fg:"#14532d",bg:"#ffffff",name:"Green"},
    {fg:"#ffffff",bg:"#14532d",name:"Dark Green"},
    {fg:"#ffffff",bg:"#1e3a5f",name:"Navy"},
    {fg:"#14532d",bg:"#f0fdf4",name:"Soft"},
    {fg:"#ffffff",bg:"#1c1917",name:"Dark"},
  ];

  if (!unlocked) return <PinGate onUnlock={unlock}/>;

  return (
    <div style={{minHeight:"100vh",background:"#f0fdf4",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:rgba(22,163,74,0.2);border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scanLine{0%{top:12%}50%{top:84%}100%{top:12%}}
        @keyframes popIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
        .fade-up{animation:fadeUp 0.3s ease both}
        .type-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch}
        .type-scroll::-webkit-scrollbar{height:0}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:#d1fae5;outline:none;cursor:pointer;border:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#16a34a;box-shadow:0 0 8px rgba(22,163,74,0.4);}
        input[type=color]{-webkit-appearance:none;padding:0;border:none;cursor:pointer;border-radius:6px;overflow:hidden;}
        input[type=color]::-webkit-color-swatch-wrapper{padding:0}
        input[type=color]::-webkit-color-swatch{border:none;border-radius:6px}
        select{-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2316a34a' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;}
        @media(max-width:768px){.main-grid{grid-template-columns:1fr!important}.right-sticky{position:static!important}.hide-sm{display:none!important}}
        @media(max-width:500px){.type-pill-label{display:none}}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{background:"#fff",borderBottom:"1px solid #d1fae5",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(22,101,52,0.06)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#16a34a,#15803d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🌿</div>
            <div>
              <p style={{fontSize:14,fontWeight:800,color:"#14532d",lineHeight:1}}>GreenLife Cropcare</p>
              <p style={{fontSize:10,color:"#16a34a",fontWeight:600,lineHeight:1.4}}>Staff QR Generator</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:4}}>
            {[["generator","⚡ Generator"],["dynamic","🔄 Dynamic QR"],["analytics","📊 Analytics"],["history",`🕑 History (${history.length})`]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setTab(id)} style={{
                padding:"7px 14px",borderRadius:8,border:"none",
                background:tab===id?"#dcfce7":"transparent",
                color:tab===id?"#15803d":"#6b7280",
                fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.15s",
              }}>{lbl}</button>
            ))}
          </div>

          {/* Logout */}
          <button onClick={logout} style={{
            padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:700,
            background:"#fef2f2",border:"1px solid #fecaca",color:"#b91c1c",
            cursor:"pointer",flexShrink:0,
          }}>🔓 Lock</button>
        </div>
      </header>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px 60px"}}>

        {/* ══════════════ GENERATOR TAB ══════════════ */}
        {tab==="generator" && (
          <>
            {/* Page title */}
            <div style={{padding:"28px 0 20px"}}>
              <h1 style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:900,color:"#14532d",letterSpacing:"-0.8px",marginBottom:4}}>
                QR Code Generator
              </h1>
              <p style={{fontSize:13,color:"#6b7280"}}>Create QR codes for products, documents, contact cards and more</p>
            </div>

            {/* Type Selector */}
            <div className="type-scroll" style={{marginBottom:20}}>
              {QR_TYPES.map(t=>(
                <button key={t.id} onClick={()=>switchType(t.id)} style={{
                  display:"flex",alignItems:"center",gap:6,padding:"9px 16px",
                  borderRadius:100,border:`1.5px solid ${qrType===t.id?"#16a34a":"#d1fae5"}`,
                  background:qrType===t.id?"#dcfce7":"#fff",
                  color:qrType===t.id?"#15803d":"#6b7280",
                  fontSize:13,fontWeight:700,cursor:"pointer",
                  whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0,
                }}>
                  <span style={{fontSize:15}}>{t.icon}</span>
                  <span className="type-pill-label">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Main grid */}
            <div className="main-grid" style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20,alignItems:"start"}}>

              {/* LEFT */}
              <div style={{display:"flex",flexDirection:"column",gap:16}}>

                {/* Form Card */}
                <div style={{background:"#fff",borderRadius:20,padding:24,border:"1px solid #d1fae5",boxShadow:"0 2px 12px rgba(22,101,52,0.06)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                    <span style={{fontSize:24}}>{QR_TYPES.find(t=>t.id===qrType)?.icon}</span>
                    <div>
                      <h2 style={{fontSize:17,fontWeight:800,color:"#14532d"}}>{QR_TYPES.find(t=>t.id===qrType)?.label}</h2>
                      <p style={{fontSize:11,color:"#9ca3af",marginTop:1}}>Fill details to generate QR</p>
                    </div>
                  </div>

                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    {/* QR Label */}
                    <Inp label="QR Label (for history)" placeholder="e.g. Fungicel 250ml Batch#123" value={label} onChange={setLabel}/>
                    {/* Dynamic form */}
                    <QRTypeForm type={qrType} data={formData} set={setField}/>
                  </div>

                  {errMsg && (
                    <div style={{marginTop:14,padding:"10px 14px",borderRadius:10,background:"#fef2f2",border:"1px solid #fecaca",fontSize:12,color:"#b91c1c"}}>{errMsg}</div>
                  )}

                  {/* ✅ Static / Dynamic Toggle */}
                  <div style={{marginTop:18,display:"flex",gap:8}}>
                    {[{val:false,label:"📌 Static QR",sub:"Fixed content"},{val:true,label:"🔄 Dynamic QR",sub:"Editable anytime"}].map(opt=>(
                      <button key={String(opt.val)} onClick={()=>{setIsDynamic(opt.val);resetDynamic();}} style={{
                        flex:1,padding:"10px",borderRadius:12,cursor:"pointer",textAlign:"center",transition:"all 0.15s",
                        border:`1.5px solid ${isDynamic===opt.val?"#16a34a":"#d1fae5"}`,
                        background:isDynamic===opt.val?"#dcfce7":"#f9fafb",
                      }}>
                        <p style={{fontSize:13,fontWeight:800,color:isDynamic===opt.val?"#15803d":"#6b7280"}}>{opt.label}</p>
                        <p style={{fontSize:10,color:isDynamic===opt.val?"#16a34a":"#9ca3af",marginTop:2}}>{opt.sub}</p>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic QR info */}
                  {isDynamic && (
                    <div style={{marginTop:10,padding:"10px 14px",borderRadius:10,background:"#f0fdf4",border:"1px solid #bbf7d0",fontSize:12,color:"#15803d",lineHeight:1.7}}>
                      🔄 QR will encode <strong>{SITE_URL}/qr/XXXXXX</strong><br/>
                      You can update the destination anytime — QR never changes.
                    </div>
                  )}

                  {/* Dynamic QR result after creation */}
                  {isDynamic && dynSaved && (
                    <div style={{marginTop:10,padding:"14px",borderRadius:12,background:"#f0fdf4",border:"2px solid #16a34a"}}>
                      <p style={{fontSize:12,fontWeight:800,color:"#15803d",marginBottom:6}}>✅ Dynamic QR Created!</p>
                      <p style={{fontSize:11,fontFamily:"monospace",color:"#6b7280",wordBreak:"break-all",marginBottom:8}}>{dynUrl}</p>
                      <p style={{fontSize:11,color:"#9ca3af"}}>Code: <strong style={{color:"#14532d"}}>{dynCode}</strong> · Manage in Dynamic QR tab</p>
                    </div>
                  )}

                  <button
                    onClick={isDynamic ? createDynamicQR : handleSave}
                    disabled={!content || dynSaving}
                    style={{
                      marginTop:10,width:"100%",padding:"13px",borderRadius:12,border:"none",
                      background: (saved||dynSaved) ? "#16a34a" : content ? (isDynamic?"linear-gradient(135deg,#16a34a,#15803d)":"#dcfce7") : "#f3f4f6",
                      color: (saved||dynSaved) ? "#fff" : content ? (isDynamic?"#fff":"#15803d") : "#9ca3af",
                      fontSize:14,fontWeight:800,cursor:content&&!dynSaving?"pointer":"not-allowed",
                      transition:"all 0.2s",
                      boxShadow: isDynamic&&content ? "0 4px 14px rgba(22,163,74,0.3)" : "none",
                    }}
                  >
                    {dynSaving ? "⏳ Creating Dynamic QR…"
                      : dynSaved ? "✅ Dynamic QR Created!"
                      : saved ? "✓ Saved to History!"
                      : isDynamic ? "🔄 Create Dynamic QR"
                      : "💾 Save to History"}
                  </button>
                </div>

                {/* Customise Card */}
                <div style={{background:"#fff",borderRadius:20,padding:24,border:"1px solid #d1fae5",boxShadow:"0 2px 12px rgba(22,101,52,0.06)"}}>
                  <h3 style={{fontSize:15,fontWeight:800,color:"#14532d",marginBottom:18}}>🎨 Customise QR</h3>

                  {/* Color presets */}
                  <p style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Color Presets</p>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
                    {COLOR_PRESETS.map(p=>(
                      <button key={p.name} title={p.name} onClick={()=>{setFg(p.fg);setBg(p.bg);}} style={{
                        width:30,height:30,borderRadius:8,cursor:"pointer",
                        background:`linear-gradient(135deg,${p.fg} 50%,${p.bg} 50%)`,
                        border:`2px solid ${fg===p.fg&&bg===p.bg?"#16a34a":"#d1fae5"}`,
                        transform:fg===p.fg&&bg===p.bg?"scale(1.15)":"scale(1)",
                        transition:"all 0.15s",
                      }}/>
                    ))}
                  </div>

                  {/* Custom colors */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
                    {[{label:"QR Color",val:fg,set:setFg},{label:"Background",val:bg,set:setBg}].map(c=>(
                      <div key={c.label} style={{background:"#f0fdf4",borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div>
                          <p style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em"}}>{c.label}</p>
                          <p style={{fontSize:12,fontFamily:"monospace",fontWeight:700,color:"#14532d",marginTop:2}}>{c.val.toUpperCase()}</p>
                        </div>
                        <input type="color" value={c.val} onChange={e=>c.set(e.target.value)} style={{width:34,height:34,borderRadius:8}}/>
                      </div>
                    ))}
                  </div>

                  {/* Size */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <p style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em"}}>Output Size</p>
                    <span style={{fontSize:12,fontFamily:"monospace",fontWeight:800,color:"#15803d"}}>{size}×{size}px</span>
                  </div>
                  <input type="range" min={100} max={1000} step={50} value={size} onChange={e=>setSize(Number(e.target.value))} style={{width:"100%"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                    <span style={{fontSize:10,color:"#9ca3af"}}>100px (web)</span>
                    <span style={{fontSize:10,color:"#9ca3af"}}>1000px (print)</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Preview sticky */}
              <div className="right-sticky" style={{position:"sticky",top:70,display:"flex",flexDirection:"column",gap:12}}>
                <div style={{background:"#fff",borderRadius:20,padding:24,border:"1px solid #d1fae5",boxShadow:"0 2px 12px rgba(22,101,52,0.06)",textAlign:"center"}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:18}}>Live Preview</p>

                  {/* QR Frame */}
                  <div style={{minHeight:240,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                    {(dynSaved && dynQrImg) || qrImgUrl ? (
                      <div style={{
                        position:"relative",background:bg,borderRadius:16,padding:12,
                        boxShadow:"0 4px 24px rgba(22,101,52,0.12),0 16px 48px rgba(0,0,0,0.12)",
                        display:"inline-flex",transition:"all 0.3s",
                      }}>
                        {/* Green corner accents */}
                        {[{top:4,left:4,borderWidth:"2px 0 0 2px",borderRadius:"5px 0 0 0"},{top:4,right:4,borderWidth:"2px 2px 0 0",borderRadius:"0 5px 0 0"},{bottom:4,left:4,borderWidth:"0 0 2px 2px",borderRadius:"0 0 0 5px"},{bottom:4,right:4,borderWidth:"0 2px 2px 0",borderRadius:"0 0 5px 0"}].map((c,i)=>(
                          <span key={i} style={{position:"absolute",width:16,height:16,borderColor:"#16a34a",borderStyle:"solid",...c,opacity:0.7}}/>
                        ))}
                        <img src={dynSaved && dynQrImg ? dynQrImg : qrImgUrl} alt="QR Code"
                          width={Math.min(size,220)} height={Math.min(size,220)}
                          style={{display:"block",borderRadius:8,opacity:imgStatus==="loading"?0.4:1,transition:"opacity 0.3s",background:bg}}
                          onLoad={()=>setImgStatus("ready")}
                          onError={()=>{setImgStatus("error");setErrMsg("QR generation failed — check internet connection");}}
                        />
                        {imgStatus==="loading" && (
                          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <div style={{width:26,height:26,border:"2.5px solid #d1fae5",borderTopColor:"#16a34a",borderRadius:"50%",animation:"spin 0.65s linear infinite"}}/>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{textAlign:"center",color:"#d1fae5"}}>
                        <div style={{fontSize:52,marginBottom:10}}>⬛</div>
                        <p style={{fontSize:13,fontWeight:600,color:"#9ca3af"}}>Fill the form to preview</p>
                      </div>
                    )}
                  </div>

                  {/* Download buttons */}
                  <div style={{display:"flex",gap:8,marginBottom:imgStatus==="ready"?12:0}}>
                    <button onClick={()=>handleDownload("png")} disabled={imgStatus!=="ready"} style={{
                      flex:1,padding:"12px",borderRadius:12,border:"none",
                      background:imgStatus==="ready"?"linear-gradient(135deg,#16a34a,#15803d)":"#f3f4f6",
                      color:imgStatus==="ready"?"#fff":"#9ca3af",
                      fontSize:13,fontWeight:800,cursor:imgStatus==="ready"?"pointer":"not-allowed",
                      transition:"all 0.2s",boxShadow:imgStatus==="ready"?"0 4px 12px rgba(22,163,74,0.3)":"none",
                    }}>
                      {dlState==="png" ? "✓ Saved!" : "⬇ PNG"}
                    </button>
                    <button onClick={()=>handleDownload("svg")} disabled={imgStatus!=="ready"} style={{
                      flex:1,padding:"12px",borderRadius:12,
                      border:`1.5px solid ${imgStatus==="ready"?"#16a34a":"#e5e7eb"}`,
                      background:imgStatus==="ready"?"#f0fdf4":"#f9fafb",
                      color:imgStatus==="ready"?"#15803d":"#9ca3af",
                      fontSize:13,fontWeight:800,cursor:imgStatus==="ready"?"pointer":"not-allowed",
                      transition:"all 0.2s",
                    }}>
                      {dlState==="svg" ? "✓ Saved!" : "⬇ SVG"}
                    </button>
                  </div>

                  {/* Encoded value */}
                  {content && (
                    <div style={{background:"#f0fdf4",borderRadius:10,padding:"10px 12px",textAlign:"left"}}>
                      <p style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>Encoded</p>
                      <p style={{fontSize:10,fontFamily:"monospace",color:"#6b7280",wordBreak:"break-all",lineHeight:1.6}}>
                        {content.length>80 ? content.slice(0,80)+"…" : content}
                      </p>
                    </div>
                  )}
                </div>

                {/* Info badges */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["🔒","URL Sanitized"],["🛡️","Local History"],["📄","PDF Support"],["🖼️","Image Upload"]].map(([ic,lb])=>(
                    <div key={lb} style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:7,fontSize:12,fontWeight:600,color:"#6b7280"}}>
                      <span>{ic}</span><span>{lb}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════ DYNAMIC QR TAB ══════════════ */}
        {tab==="dynamic" && (
          <div className="fade-up" style={{paddingTop:28}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
              <div>
                <h2 style={{fontSize:26,fontWeight:900,color:"#14532d",letterSpacing:"-0.5px"}}>🔄 Dynamic QR Codes</h2>
                <p style={{fontSize:13,color:"#9ca3af",marginTop:3}}>Update destinations anytime — QR codes never need reprinting</p>
              </div>
              <button onClick={loadDynamicQRs} style={{padding:"9px 18px",borderRadius:10,fontSize:12,fontWeight:700,background:"#dcfce7",border:"1px solid #bbf7d0",color:"#15803d",cursor:"pointer"}}>
                {dynLoading ? "⏳ Loading…" : "🔄 Refresh"}
              </button>
            </div>

            {/* How it works banner */}
            <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:14,padding:"16px 20px",marginBottom:24,display:"flex",gap:16,flexWrap:"wrap"}}>
              {[["1️⃣","Create","Choose Dynamic QR in Generator tab → fill form → Create"],["2️⃣","Print","Download QR → print on packaging, brochure, card"],["3️⃣","Update","Destination changes here → same QR works forever"]].map(([n,t,d])=>(
                <div key={t} style={{flex:1,minWidth:160}}>
                  <p style={{fontSize:13,fontWeight:800,color:"#14532d",marginBottom:3}}>{n} {t}</p>
                  <p style={{fontSize:12,color:"#6b7280",lineHeight:1.6}}>{d}</p>
                </div>
              ))}
            </div>

            {dynList.length === 0 && !dynLoading && (
              <div style={{textAlign:"center",padding:"60px 20px",color:"#d1fae5"}}>
                <div style={{fontSize:52,marginBottom:14}}>🔄</div>
                <p style={{fontSize:16,fontWeight:700,color:"#9ca3af",marginBottom:6}}>No Dynamic QRs yet</p>
                <p style={{fontSize:13,color:"#d1d5db",marginBottom:20}}>Go to Generator tab → toggle Dynamic QR → Create</p>
                <button onClick={()=>setTab("generator")} style={{padding:"12px 24px",borderRadius:12,background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",fontSize:14,fontWeight:800,border:"none",cursor:"pointer"}}>
                  Create Dynamic QR →
                </button>
              </div>
            )}

            {dynList.length > 0 && (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {dynList.map((q)=>(
                  <div key={q.code} style={{background:"#fff",border:`1px solid ${q.active?"#d1fae5":"#fee2e2"}`,borderRadius:16,padding:"18px 20px",transition:"border-color 0.15s"}}>
                    <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>

                      {/* QR thumb */}
                      <div style={{background:"white",borderRadius:10,padding:5,border:"1px solid #f3f4f6",flexShrink:0}}>
                        <img src={buildQrUrl(`${SITE_URL}/qr/${q.code}`,64,"000000","ffffff")} alt="QR" width={64} height={64} style={{display:"block",borderRadius:6}}/>
                      </div>

                      {/* Info */}
                      <div style={{flex:1,minWidth:200}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                          <span style={{fontWeight:800,fontSize:14,color:"#14532d"}}>{q.label}</span>
                          <span style={{padding:"2px 8px",borderRadius:100,background:"#dcfce7",fontSize:11,fontWeight:700,color:"#15803d"}}>{q.type}</span>
                          <span style={{padding:"2px 8px",borderRadius:100,background:q.active?"#dcfce7":"#fee2e2",fontSize:11,fontWeight:700,color:q.active?"#15803d":"#b91c1c"}}>
                            {q.active ? "● Active" : "● Paused"}
                          </span>
                          <span style={{fontSize:11,color:"#9ca3af",marginLeft:"auto"}}>👁 {q.scanCount||0} scans</span>
                        </div>

                        {/* Short URL */}
                        <p style={{fontSize:11,fontFamily:"monospace",color:"#16a34a",marginBottom:4,fontWeight:700}}>
                          {SITE_URL}/qr/{q.code}
                        </p>

                        {/* Current destination — editable */}
                        {editingCode === q.code ? (
                          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                            <input
                              value={editDest}
                              onChange={e=>setEditDest(e.target.value)}
                              placeholder="New destination URL or content"
                              style={{flex:1,minWidth:200,padding:"9px 12px",borderRadius:9,border:"1.5px solid #16a34a",background:"#f0fdf4",fontSize:12,fontFamily:"monospace",color:"#14532d",outline:"none"}}
                              onKeyDown={e=>e.key==="Enter"&&updateDestination(q.code)}
                            />
                            <button onClick={()=>updateDestination(q.code)} disabled={editSaving} style={{padding:"9px 16px",borderRadius:9,background:"#16a34a",color:"#fff",border:"none",fontSize:12,fontWeight:800,cursor:"pointer"}}>
                              {editSaving?"Saving…":"✓ Save"}
                            </button>
                            <button onClick={()=>{setEditingCode(null);setEditDest("");}} style={{padding:"9px 14px",borderRadius:9,background:"#f3f4f6",border:"1px solid #e5e7eb",color:"#6b7280",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p style={{fontSize:11,fontFamily:"monospace",color:"#6b7280",wordBreak:"break-all",lineHeight:1.5}}>
                            → {q.destination?.slice(0,70)}{q.destination?.length>70?"…":""}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                        <button onClick={()=>{setEditingCode(q.code);setEditDest(q.destination||"");}} style={{padding:"8px 14px",borderRadius:9,fontSize:12,fontWeight:700,background:"#f0fdf4",border:"1px solid #d1fae5",color:"#15803d",cursor:"pointer"}}>✏️ Edit</button>
                        <button onClick={()=>toggleActive(q.code,q.active)} style={{padding:"8px 14px",borderRadius:9,fontSize:12,fontWeight:700,background:q.active?"#fef2f2":"#f0fdf4",border:`1px solid ${q.active?"#fecaca":"#d1fae5"}`,color:q.active?"#b91c1c":"#15803d",cursor:"pointer"}}>
                          {q.active?"⏸ Pause":"▶ Resume"}
                        </button>
                        <button onClick={()=>downloadFile(buildQrUrl(`${SITE_URL}/qr/${q.code}`,400,"000000","ffffff"),`${(q.label||q.code).replace(/[^a-zA-Z0-9\s\-_]/g,"").replace(/\s+/g,"-").toLowerCase()}.png`)} style={{padding:"8px 14px",borderRadius:9,fontSize:12,fontWeight:700,background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",border:"none",cursor:"pointer"}}>⬇ PNG</button>
                        <button onClick={()=>deleteDynamicQR(q.code)} style={{padding:"8px 14px",borderRadius:9,fontSize:12,fontWeight:700,background:"#fef2f2",border:"1px solid #fecaca",color:"#b91c1c",cursor:"pointer"}}>🗑 Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ HISTORY TAB ══════════════ */}
        {tab==="history" && (
          <div className="fade-up" style={{paddingTop:28}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
              <div>
                <h2 style={{fontSize:26,fontWeight:900,color:"#14532d",letterSpacing:"-0.5px"}}>QR History</h2>
                <p style={{fontSize:13,color:"#9ca3af",marginTop:3}}>Saved in browser · {history.length} QR codes</p>
              </div>
              {history.length>0 && (
                <button onClick={clearHistory} style={{padding:"9px 18px",borderRadius:10,fontSize:12,fontWeight:700,background:"#fef2f2",border:"1px solid #fecaca",color:"#b91c1c",cursor:"pointer"}}>
                  🗑 Clear All
                </button>
              )}
            </div>

            {history.length===0 ? (
              <div style={{textAlign:"center",padding:"60px 20px",color:"#d1fae5"}}>
                <div style={{fontSize:52,marginBottom:14}}>📭</div>
                <p style={{fontSize:16,fontWeight:700,color:"#9ca3af",marginBottom:6}}>No history yet</p>
                <p style={{fontSize:13,color:"#d1d5db",marginBottom:20}}>Generated QR codes appear here</p>
                <button onClick={()=>setTab("generator")} style={{padding:"12px 24px",borderRadius:12,background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",fontSize:14,fontWeight:800,border:"none",cursor:"pointer"}}>
                  Create QR Code →
                </button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {history.map((h,i)=>{
                  const t = QR_TYPES.find(q=>q.id===h.type);
                  return (
                    <div key={h.id} className="fade-up" style={{
                      background:"#fff",border:"1px solid #d1fae5",borderRadius:16,
                      padding:"16px 20px",display:"flex",alignItems:"center",gap:16,
                      animationDelay:`${i*0.04}s`,
                      transition:"border-color 0.15s",
                    }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="#16a34a"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor="#d1fae5"}
                    >
                      <div style={{background:"white",borderRadius:10,padding:5,border:"1px solid #f3f4f6",flexShrink:0}}>
                        <img src={h.thumb} alt="QR" width={60} height={60} style={{display:"block",borderRadius:6}}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",borderRadius:100,background:"#dcfce7",border:"1px solid #bbf7d0",fontSize:11,fontWeight:700,color:"#15803d"}}>
                            {t?.icon} {h.type}
                          </span>
                          {h.label && <span style={{fontSize:12,fontWeight:700,color:"#14532d"}}>{h.label}</span>}
                          <span style={{fontSize:11,color:"#9ca3af",marginLeft:"auto"}}>{new Date(h.ts).toLocaleString()}</span>
                        </div>
                        <p style={{fontSize:11,fontFamily:"monospace",color:"#6b7280",wordBreak:"break-all",lineHeight:1.6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {h.content}
                        </p>
                      </div>
                      <button onClick={()=>downloadFile(h.thumb.replace("size=80x80",`size=${size}x${size}`),`greenlife-qr-${h.type}-${h.id}.png`)} style={{
                        padding:"9px 16px",borderRadius:10,fontSize:12,fontWeight:800,
                        background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",
                        border:"none",cursor:"pointer",flexShrink:0,
                        boxShadow:"0 2px 8px rgba(22,163,74,0.25)",
                      }}>⬇ PNG</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════ ANALYTICS TAB ══════════════ */}
        {tab==="analytics" && (
          <div className="fade-up" style={{paddingTop:28,paddingBottom:60}}>

            {/* Header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:12}}>
              <div>
                <h2 style={{fontSize:26,fontWeight:900,color:"#14532d",letterSpacing:"-0.5px"}}>📊 QR Analytics</h2>
                <p style={{fontSize:13,color:"#9ca3af",marginTop:3}}>Real-time scan data from all Dynamic QR codes</p>
              </div>
              <button onClick={loadDynamicQRs} style={{padding:"9px 18px",borderRadius:10,fontSize:12,fontWeight:700,background:"#dcfce7",border:"1px solid #bbf7d0",color:"#15803d",cursor:"pointer"}}>
                {dynLoading ? "⏳ Loading…" : "🔄 Refresh"}
              </button>
            </div>

            {/* Summary Stats */}
            {dynList.length > 0 && (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:28}}>
                {/* Total QRs */}
                <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:16,padding:"20px 22px"}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Total QR Codes</p>
                  <p style={{fontSize:32,fontWeight:900,color:"#14532d"}}>{dynList.length}</p>
                </div>
                {/* Total Scans */}
                <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:16,padding:"20px 22px"}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Total Scans</p>
                  <p style={{fontSize:32,fontWeight:900,color:"#16a34a"}}>{dynList.reduce((sum,q)=>sum+(q.scanCount||0),0)}</p>
                </div>
                {/* Active QRs */}
                <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:16,padding:"20px 22px"}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Active QRs</p>
                  <p style={{fontSize:32,fontWeight:900,color:"#15803d"}}>{dynList.filter(q=>q.active!==false).length}</p>
                </div>
                {/* Most Scanned */}
                <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:16,padding:"20px 22px"}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Top QR Scans</p>
                  <p style={{fontSize:32,fontWeight:900,color:"#14532d"}}>{dynList.length>0?Math.max(...dynList.map(q=>q.scanCount||0)):0}</p>
                </div>
              </div>
            )}

            {/* Per QR Analytics */}
            {dynLoading && (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{width:32,height:32,border:"3px solid #d1fae5",borderTopColor:"#16a34a",borderRadius:"50%",animation:"spin 0.7s linear infinite",margin:"0 auto 12px"}}/>
                <p style={{fontSize:13,color:"#9ca3af"}}>Loading analytics…</p>
              </div>
            )}

            {!dynLoading && dynList.length === 0 && (
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:48,marginBottom:14}}>📊</div>
                <p style={{fontSize:16,fontWeight:700,color:"#9ca3af",marginBottom:6}}>No Dynamic QRs yet</p>
                <p style={{fontSize:13,color:"#d1d5db",marginBottom:20}}>Create Dynamic QR codes to see scan analytics here</p>
                <button onClick={()=>setTab("generator")} style={{padding:"12px 24px",borderRadius:12,background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",fontSize:14,fontWeight:800,border:"none",cursor:"pointer"}}>
                  Create Dynamic QR →
                </button>
              </div>
            )}

            {!dynLoading && dynList.length > 0 && (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {/* Sort by scan count — most scanned first */}
                {[...dynList].sort((a,b)=>(b.scanCount||0)-(a.scanCount||0)).map((q,i)=>{
                  const totalScans = dynList.reduce((sum,qq)=>sum+(qq.scanCount||0),0);
                  const pct = totalScans > 0 ? Math.round(((q.scanCount||0)/totalScans)*100) : 0;
                  const isTop = i === 0 && (q.scanCount||0) > 0;
                  return (
                    <div key={q.code} style={{
                      background:"#fff",
                      border:`1px solid ${isTop?"#16a34a":"#d1fae5"}`,
                      borderRadius:16,padding:"18px 22px",
                      transition:"border-color 0.15s",
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>

                        {/* Rank */}
                        <div style={{
                          width:36,height:36,borderRadius:10,flexShrink:0,
                          background:i===0?"linear-gradient(135deg,#16a34a,#15803d)":i===1?"#f0fdf4":i===2?"#f9fafb":"#f9fafb",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:i<3?16:13,fontWeight:800,
                          color:i===0?"#fff":"#6b7280",
                          border:i===0?"none":"1px solid #d1fae5",
                        }}>
                          {i===0?"🏆":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                        </div>

                        {/* Info */}
                        <div style={{flex:1,minWidth:150}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                            <span style={{fontWeight:800,fontSize:14,color:"#14532d"}}>{q.label||q.code}</span>
                            <span style={{padding:"2px 8px",borderRadius:100,background:"#dcfce7",fontSize:11,fontWeight:700,color:"#15803d"}}>{q.type}</span>
                            {q.active===false && <span style={{padding:"2px 8px",borderRadius:100,background:"#fee2e2",fontSize:11,fontWeight:700,color:"#b91c1c"}}>Paused</span>}
                            {isTop && <span style={{padding:"2px 8px",borderRadius:100,background:"#fef9c3",fontSize:11,fontWeight:700,color:"#854d0e"}}>⭐ Top</span>}
                          </div>

                          {/* Progress bar */}
                          <div style={{background:"#f0fdf4",borderRadius:100,height:8,overflow:"hidden",marginBottom:5}}>
                            <div style={{
                              height:"100%",borderRadius:100,
                              background:"linear-gradient(90deg,#16a34a,#4ade80)",
                              width:`${pct}%`,transition:"width 0.4s ease",
                            }}/>
                          </div>

                          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                            <span style={{fontSize:11,color:"#6b7280"}}>
                              Code: <span style={{fontFamily:"monospace",fontWeight:700,color:"#14532d"}}>{q.code}</span>
                            </span>
                            {q.lastScanned && (
                              <span style={{fontSize:11,color:"#9ca3af"}}>
                                Last scan: {new Date(q.lastScanned?.toDate ? q.lastScanned.toDate() : q.lastScanned).toLocaleString()}
                              </span>
                            )}
                            {!q.lastScanned && (
                              <span style={{fontSize:11,color:"#d1d5db"}}>Never scanned yet</span>
                            )}
                          </div>
                        </div>

                        {/* Scan Count */}
                        <div style={{textAlign:"center",flexShrink:0,minWidth:80}}>
                          <p style={{fontSize:36,fontWeight:900,color:isTop?"#16a34a":"#14532d",lineHeight:1}}>{q.scanCount||0}</p>
                          <p style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>scans</p>
                          <p style={{fontSize:11,color:"#16a34a",fontWeight:700,marginTop:2}}>{pct}%</p>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      {/* Footer */}
      <footer style={{borderTop:"1px solid #d1fae5",padding:"20px",textAlign:"center",background:"#fff"}}>
        <p style={{fontSize:12,color:"#9ca3af"}}>🌿 GreenLife Cropcare · Staff QR Generator · Private Tool · Powered by Styrka Tech Serv</p>
      </footer>
    </div>
  );
}
