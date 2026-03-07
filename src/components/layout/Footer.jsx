// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi'

const SITEMAP = [
  { label: 'Home',       to: '/'         },
  { label: 'Products',   to: '/products' },
  { label: 'About Us',   to: '/about'    },
  { label: 'Contact Us', to: '/contact'  },
]

const LEGAL = [
  { label: 'Privacy Policy',  to: '#' },
  { label: 'Terms of Service',to: '#' },
  { label: 'Disclaimer',      to: '#' },
]

const SOCIAL = [
  { icon: 'in', href: '#', label: 'LinkedIn'  },
  { icon: 'fb', href: '#', label: 'Facebook'  },
  { icon: 'ig', href: '#', label: 'Instagram' },
  { icon: 'yt', href: '#', label: 'YouTube'   },
]

function SocialIcon({ icon }) {
  const paths = {
    in: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
    fb: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    ig: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a1 1 0 011 1v11a1 1 0 01-1 1h-11a1 1 0 01-1-1v-11a1 1 0 011-1z',
    yt: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d={paths[icon]}/>
    </svg>
  )
}

// ── Agri field line-art scene ─────────────────────────────
function FieldScene() {
  return (
    <svg
      viewBox="0 0 1400 160"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      style={{ display: 'block', width: '100%', height: 'auto' }}
      aria-hidden="true"
    >
      {/* Ground line */}
      <line x1="0" y1="148" x2="1400" y2="148" stroke="rgba(82,199,134,.25)" strokeWidth="1"/>

      {/* ── CROP ROWS — centre ── */}
      {[320,380,440,500,560,620,680,740,800,860,920,980,1040,1100].map((x, i) => (
        <g key={x}>
          {/* Stalk */}
          <line x1={x} y1="148" x2={x} y2={100 + (i % 3) * 6} stroke="rgba(82,199,134,.35)" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Grain head */}
          <ellipse cx={x} cy={94 + (i % 3) * 6} rx="4" ry="8"
            fill="none" stroke="rgba(82,199,134,.3)" strokeWidth="1"/>
          {/* Left leaf */}
          <path d={`M${x} ${120 + (i%3)*4} C${x-12} ${112+(i%3)*4} ${x-14} ${104+(i%3)*4} ${x-10} ${100+(i%3)*4}`}
            stroke="rgba(82,199,134,.22)" strokeWidth="1" fill="none"/>
          {/* Right leaf */}
          <path d={`M${x} ${114+(i%3)*4} C${x+12} ${106+(i%3)*4} ${x+14} ${98+(i%3)*4} ${x+10} ${94+(i%3)*4}`}
            stroke="rgba(82,199,134,.22)" strokeWidth="1" fill="none"/>
        </g>
      ))}

      {/* ── TREE — far left ── */}
      <g>
        <line x1="60" y1="148" x2="60" y2="70" stroke="rgba(82,199,134,.3)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="60" cy="52" r="28" stroke="rgba(82,199,134,.22)" strokeWidth="1.2" fill="none"/>
        <circle cx="44" cy="62" r="18" stroke="rgba(82,199,134,.18)" strokeWidth="1" fill="none"/>
        <circle cx="76" cy="60" r="20" stroke="rgba(82,199,134,.18)" strokeWidth="1" fill="none"/>
        {/* Inner leaves texture */}
        <path d="M48 54C48 54 55 48 64 50" stroke="rgba(82,199,134,.15)" strokeWidth="1" fill="none"/>
        <path d="M54 62C54 62 61 56 70 58" stroke="rgba(82,199,134,.15)" strokeWidth="1" fill="none"/>
      </g>

      {/* ── SMALL BUSH — left ── */}
      <g>
        <line x1="155" y1="148" x2="155" y2="120" stroke="rgba(82,199,134,.25)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="155" cy="110" r="16" stroke="rgba(82,199,134,.2)" strokeWidth="1" fill="none"/>
        <circle cx="143" cy="116" r="10" stroke="rgba(82,199,134,.16)" strokeWidth="1" fill="none"/>
        <circle cx="167" cy="115" r="11" stroke="rgba(82,199,134,.16)" strokeWidth="1" fill="none"/>
      </g>

      {/* ── FARMER — left of centre ── */}
      <g transform="translate(220, 88)">
        {/* Body */}
        <ellipse cx="14" cy="36" rx="8" ry="14" stroke="rgba(82,199,134,.28)" strokeWidth="1.1" fill="none"/>
        {/* Head */}
        <circle cx="14" cy="16" r="8" stroke="rgba(82,199,134,.3)" strokeWidth="1.1" fill="none"/>
        {/* Hat */}
        <ellipse cx="14" cy="9" rx="12" ry="3" stroke="rgba(82,199,134,.28)" strokeWidth="1" fill="none"/>
        <rect x="10" y="4" width="8" height="6" rx="1.5" stroke="rgba(82,199,134,.25)" strokeWidth="1" fill="none"/>
        {/* Arm with spray */}
        <path d="M22 30 L36 24" stroke="rgba(82,199,134,.25)" strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="36" y="21" width="12" height="6" rx="2" stroke="rgba(82,199,134,.25)" strokeWidth="1" fill="none"/>
        <path d="M48 24 L54 20 M48 24 L54 24 M48 24 L54 28" stroke="rgba(82,199,134,.2)" strokeWidth=".8" strokeLinecap="round"/>
        {/* Legs */}
        <path d="M10 48 L8 60" stroke="rgba(82,199,134,.22)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M18 48 L20 60" stroke="rgba(82,199,134,.22)" strokeWidth="1.2" strokeLinecap="round"/>
      </g>

      {/* ── TRACTOR — right of centre ── */}
      <g transform="translate(1110, 100)">
        {/* Body */}
        <rect x="10" y="12" width="80" height="34" rx="4" stroke="rgba(82,199,134,.28)" strokeWidth="1.2" fill="none"/>
        {/* Cabin */}
        <rect x="14" y="0" width="36" height="14" rx="3" stroke="rgba(82,199,134,.25)" strokeWidth="1" fill="none"/>
        <line x1="22" y1="14" x2="22" y2="0" stroke="rgba(82,199,134,.2)" strokeWidth=".8"/>
        <line x1="36" y1="14" x2="36" y2="0" stroke="rgba(82,199,134,.2)" strokeWidth=".8"/>
        {/* Exhaust */}
        <line x1="46" y1="0" x2="46" y2="-10" stroke="rgba(82,199,134,.2)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="46" cy="-12" r="2" stroke="rgba(82,199,134,.18)" strokeWidth="1" fill="none"/>
        {/* Big rear wheel */}
        <circle cx="22" cy="46" r="22" stroke="rgba(82,199,134,.28)" strokeWidth="1.2" fill="none"/>
        <circle cx="22" cy="46" r="14" stroke="rgba(82,199,134,.18)" strokeWidth="1" fill="none"/>
        {[0,60,120,180,240,300].map((deg,i)=>{
          const r=deg*Math.PI/180
          return <line key={i} x1={22+14*Math.sin(r)} y1={46-14*Math.cos(r)} x2={22+22*Math.sin(r)} y2={46-22*Math.cos(r)} stroke="rgba(82,199,134,.2)" strokeWidth=".9"/>
        })}
        {/* Small front wheel */}
        <circle cx="78" cy="46" r="14" stroke="rgba(82,199,134,.28)" strokeWidth="1.2" fill="none"/>
        <circle cx="78" cy="46" r="8"  stroke="rgba(82,199,134,.18)" strokeWidth="1" fill="none"/>
        {[0,90,180,270].map((deg,i)=>{
          const r=deg*Math.PI/180
          return <line key={i} x1={78+8*Math.sin(r)} y1={46-8*Math.cos(r)} x2={78+14*Math.sin(r)} y2={46-14*Math.cos(r)} stroke="rgba(82,199,134,.2)" strokeWidth=".9"/>
        })}
      </g>

      {/* ── TREE — right side ── */}
      <g>
        <line x1="1320" y1="148" x2="1320" y2="68" stroke="rgba(82,199,134,.3)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="1320" cy="50" r="26" stroke="rgba(82,199,134,.22)" strokeWidth="1.2" fill="none"/>
        <circle cx="1304" cy="60" r="17" stroke="rgba(82,199,134,.17)" strokeWidth="1" fill="none"/>
        <circle cx="1336" cy="58" r="18" stroke="rgba(82,199,134,.17)" strokeWidth="1" fill="none"/>
      </g>

      {/* ── SMALL TREE — far right ── */}
      <g>
        <line x1="1380" y1="148" x2="1380" y2="96" stroke="rgba(82,199,134,.25)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="1380" cy="84" r="18" stroke="rgba(82,199,134,.2)" strokeWidth="1" fill="none"/>
        <circle cx="1370" cy="90" r="11" stroke="rgba(82,199,134,.16)" strokeWidth="1" fill="none"/>
      </g>

      {/* ── SUN — top right ── */}
      <circle cx="1360" cy="30" r="16" stroke="rgba(196,136,58,.2)" strokeWidth="1" fill="none"/>
      <circle cx="1360" cy="30" r="9"  fill="rgba(196,136,58,.1)" stroke="rgba(196,136,58,.22)" strokeWidth="1"/>
      {[0,45,90,135,180,225,270,315].map((deg,i)=>{
        const r=deg*Math.PI/180
        return <line key={i}
          x1={1360+19*Math.sin(r)} y1={30-19*Math.cos(r)}
          x2={1360+24*Math.sin(r)} y2={30-24*Math.cos(r)}
          stroke="rgba(196,136,58,.18)" strokeWidth="1" strokeLinecap="round"/>
      })}

      {/* ── BIRDS — top centre ── */}
      <g stroke="rgba(82,199,134,.18)" strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M580 28 C584 24 588 24 592 28"/>
        <path d="M600 20 C604 16 608 16 612 20"/>
        <path d="M618 32 C622 28 626 28 630 32"/>
      </g>

      {/* ── WATERING CAN — right field area ── */}
      <g transform="translate(1060, 110)">
        <ellipse cx="16" cy="16" rx="16" ry="12" stroke="rgba(82,199,134,.25)" strokeWidth="1" fill="none"/>
        <path d="M32 10 L44 6" stroke="rgba(82,199,134,.22)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M44 6 L50 10 M44 6 L50 6 M44 6 L50 2" stroke="rgba(82,199,134,.18)" strokeWidth=".9" strokeLinecap="round"/>
        <path d="M0 16 L-8 16" stroke="rgba(82,199,134,.22)" strokeWidth="1.2" strokeLinecap="round"/>
      </g>

      {/* ── SEEDLINGS — foreground row ── */}
      {[160,180,200,240,260,280].map((x,i) => (
        <g key={x}>
          <path d={`M${x} 148 L${x} 138`} stroke="rgba(82,199,134,.2)" strokeWidth="1" strokeLinecap="round"/>
          <path d={`M${x} 142 C${x-5} 137 ${x-8} 133 ${x-5} 130`} stroke="rgba(82,199,134,.18)" strokeWidth=".9" fill="none"/>
          <path d={`M${x} 140 C${x+5} 135 ${x+8} 131 ${x+5} 128`} stroke="rgba(82,199,134,.16)" strokeWidth=".9" fill="none"/>
        </g>
      ))}
    </svg>
  )
}

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer style={{ background: '#0a1a0e' }}>

      {/* ── Main content ── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-[5%] pt-10 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.4fr] gap-0 md:gap-10">

          {/* Col 1 — Brand: full width, border-bottom on mobile */}
          <div className="pb-7 mb-7 border-b md:border-b-0 md:mb-0 md:pb-0" style={{ borderColor:'rgba(255,255,255,.08)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-base">🌿</span>
              </div>
              <span className="font-heading font-extrabold text-white text-lg tracking-tight">
                GreenLife Cropcare
              </span>
            </div>

            <p className="font-sans text-xs leading-relaxed mb-5 max-w-[280px] md:max-w-[230px]"
              style={{ color: 'rgba(255,255,255,.36)' }}>
              Premium agri-chemical solutions trusted by farmers and dealers across India since 2004.
            </p>

            <div className="flex gap-2 mb-6">
              {SOCIAL.map(s => (
                <a key={s.icon} href={s.href} aria-label={s.label}
                  className="w-9 h-9 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.5)' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='#1a6b3c'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#1a6b3c' }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,.07)'; e.currentTarget.style.color='rgba(255,255,255,.5)'; e.currentTarget.style.borderColor='rgba(255,255,255,.1)' }}
                >
                  <SocialIcon icon={s.icon}/>
                </a>
              ))}
            </div>

            <button onClick={scrollTop}
              className="flex items-center gap-2 font-heading font-bold text-[10px] tracking-[.16em] uppercase transition-all duration-200 cursor-pointer"
              style={{ color:'rgba(255,255,255,.35)', background:'transparent', border:'1px solid rgba(255,255,255,.12)', padding:'8px 14px', borderRadius:8 }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(82,199,134,.4)'; e.currentTarget.style.color='#52c786' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,.12)'; e.currentTarget.style.color='rgba(255,255,255,.35)' }}
            >
              ↑ Back to Top
            </button>
          </div>

          {/* Mobile: Site Map + Legal side by side */}
          <div className="grid grid-cols-2 md:contents gap-6">

            {/* Col 2 — Site Map */}
            <div className="pb-7 md:pb-0">
              <div className="font-heading font-bold text-white text-xs tracking-[.18em] uppercase mb-4">Site Map</div>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {SITEMAP.map((item, i) => (
                  <li key={item.label}>
                    <Link to={item.to}
                      className={`font-sans text-sm no-underline transition-colors duration-200 hover:text-green-400 ${i===0?'border-b border-white/20 pb-1':''}`}
                      style={{ color: i===0?'#fff':'rgba(255,255,255,.4)' }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Legal */}
            <div className="pb-7 md:pb-0">
              <div className="font-heading font-bold text-white text-xs tracking-[.18em] uppercase mb-4">Legal</div>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {LEGAL.map(item => (
                  <li key={item.label}>
                    <a href={item.to} className="font-sans text-sm no-underline transition-colors duration-200 hover:text-green-400"
                      style={{ color:'rgba(255,255,255,.4)' }}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Col 4 — Contact: full width on mobile */}
          <div className="pt-2 md:pt-0 border-t md:border-t-0" style={{ borderColor:'rgba(255,255,255,.08)' }}>
            <div className="font-heading font-bold text-white text-xs tracking-[.18em] uppercase mb-4">Contact</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <HiLocationMarker className="text-green-500 mt-0.5 flex-shrink-0 text-sm"/>
                <span className="font-sans text-xs leading-relaxed" style={{ color:'rgba(255,255,255,.4)' }}>
                  123 Agri Complex,Sangli,<br/>Maharashtra 440001
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiPhone className="text-green-500 flex-shrink-0 text-sm"/>
                <a href="tel:+919876543210" className="font-sans text-xs no-underline hover:text-green-400 transition-colors"
                  style={{ color:'rgba(255,255,255,.4)' }}>+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-2.5">
                <HiMail className="text-green-500 flex-shrink-0 text-sm"/>
                <a href="mailto:info@greenlifecropcare.com" className="font-sans text-xs no-underline hover:text-green-400 transition-colors"
                  style={{ color:'rgba(255,255,255,.4)' }}>info@greenlifecropcare.com</a>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)' }}>
              <span className="text-green-400 text-xs">✓</span>
              <span className="font-heading font-bold text-[9px] tracking-[.14em] uppercase"
                style={{ color:'rgba(255,255,255,.4)' }}>CIB Registered · ISO 9001:2015</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Field scene line art ── */}
      <div className="w-full overflow-hidden" style={{ marginTop: -95 }}>
        <FieldScene />
      </div>

      {/* ── Copyright bar ── */}
      <div style={{ background: '#0d2e14' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-[5%] py-3 flex flex-col md:flex-row items-center justify-between gap-1">
          <p className="font-sans text-xs text-white/80 m-0 text-center md:text-left">
            © 2024 GreenLife Cropcare. All Rights Reserved.
          </p>
          <p className="font-sans text-xs text-white/60 m-0">
            Developed by <span className="text-white/80 font-medium">Vision Craft</span>
          </p>
        </div>
      </div>

    </footer>
  )
}
