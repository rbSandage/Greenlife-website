// src/components/pages/Home.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../../hooks'
import { Send,MessageCircle } from 'lucide-react'
import { CATEGORY_COLORS } from '../../data/products'
import HeroCarousel from '../hero/HeroCarousel'



// ═══════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════════════════════
const CREAM   = '#ffffdb'   // warm organic cream background
const INK     = '#0e1a10'   // deep forest ink
const SAGE    = '#3d6644'   // sage green
const LEAF    = '#22c55e'   // bright leaf green
const GOLD    = '#c9993a'   // warm harvest gold
const SERIF   = '"Playfair Display", Georgia, serif'
const SANS    = '"DM Sans", system-ui, sans-serif'

// shared reveal animation
const reveal = { initial:{opacity:0,y:32}, whileInView:{opacity:1,y:0}, viewport:{once:true,margin:'-60px'} }

// ── Section Label ─────────────────────────────────────────
function SLabel({ children, light }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <div style={{ width:28, height:1, background: light ? 'rgba(255,255,255,.3)' : GOLD, borderRadius:4 }}/>
      <span style={{ fontFamily:SANS, fontSize:10, fontWeight:700, letterSpacing:'.2em',
        textTransform:'uppercase', color: light ? 'rgba(255,255,255,.5)' : GOLD }}>
        {children}
      </span>
    </div>
  )
}

// ── Section Heading ───────────────────────────────────────
function SHead({ children, light, center, size='clamp(32px,3.8vw,52px)' }) {
  return (
    <div style={{ fontFamily:SERIF, fontSize:size, fontWeight:700, lineHeight:1.12,
      color: light ? '#f5f0e8' : INK, textAlign: center ? 'center' : 'left',
      letterSpacing:'-.01em' }}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  SECTION 1 — TICKER (redesigned dark premium)
// ═══════════════════════════════════════════════════════════
function Ticker() {
  const items = ['Organic Fertilizers','Crop Protection','Bio Pesticides','Micronutrients',
    'Plant Growth Regulators','Fungicides','Herbicides','Insecticides','Soil Enhancers','ISO Certified']
  return (
    <div style={{ background:INK, borderTop:`1px solid rgba(255,255,255,.06)`,
      borderBottom:`1px solid rgba(255,255,255,.06)`, overflow:'hidden', padding:'14px 0' }}>
      <div className="ticker-track" style={{ display:'flex', whiteSpace:'nowrap' }}>
        {[...Array(2)].map((_,ri) => items.map((item,i) => (
          <span key={`${ri}-${i}`} style={{ display:'inline-flex', alignItems:'center', gap:10,
            padding:'0 40px', fontFamily:SANS, fontSize:11, fontWeight:600,
            letterSpacing:'.18em', textTransform:'uppercase', color:'rgba(255,255,255,.38)' }}>
            <span style={{ width:4, height:4, borderRadius:'50%', background:GOLD, flexShrink:0, display:'inline-block' }}/>
            {item}
          </span>
        )))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  SECTION 2 — WHY CHOOSE US
// ═══════════════════════════════════════════════════════════

// ── Custom SVG Icons ──────────────────────────────────────
const Icons = {
  Lab: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M9 4V13L4.5 20C4 21 4.8 22 6 22H20C21.2 22 22 21 21.5 20L17 13V4" stroke="#3d6644" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 4H18.5" stroke="#3d6644" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6.5 18H19.5" stroke="#3d6644" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="1.5 2"/>
      <circle cx="10.5" cy="18.5" r="1" fill="#c9993a"/>
      <circle cx="14.5" cy="16.5" r="1.2" fill="#c9993a"/>
      <circle cx="17.5" cy="19" r="0.8" fill="#c9993a"/>
    </svg>
  ),
  Shield: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 2.5L4 6.5V12.5C4 17.5 8 22 13 23.5C18 22 22 17.5 22 12.5V6.5L13 2.5Z" stroke="#3d6644" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M9 12.5L11.5 15.5L17 9.5" stroke="#c9993a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Leaf: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M5.5 20.5C5.5 20.5 7.5 11.5 13 7.5C18.5 3.5 22.5 5.5 22.5 5.5C22.5 5.5 20.5 13.5 15 17.5C11.5 19.8 7.5 20.2 5.5 20.5Z" stroke="#3d6644" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M5.5 20.5C5.5 20.5 9.5 16.5 13 12.5" stroke="#c9993a" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M13 7.5C13 7.5 12 14 9 17" stroke="#3d6644" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5 2"/>
    </svg>
  ),
  Truck: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="2.5" y="7.5" width="15" height="11" rx="1.5" stroke="#3d6644" strokeWidth="1.4"/>
      <path d="M17.5 10.5H21.5L24 13.5V19H17.5V10.5Z" stroke="#3d6644" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="7.5" cy="20.5" r="2" stroke="#c9993a" strokeWidth="1.4"/>
      <circle cx="21" cy="20.5" r="2" stroke="#c9993a" strokeWidth="1.4"/>
      <path d="M5.5 11.5H13" stroke="#3d6644" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5 2"/>
    </svg>
  ),
  Support: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="10" r="5" stroke="#3d6644" strokeWidth="1.4"/>
      <path d="M4.5 23C4.5 19.4 8.4 16.5 13 16.5C17.6 16.5 21.5 19.4 21.5 23" stroke="#3d6644" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M13 5.5V10L15.8 12" stroke="#c9993a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="7.5" r="3" fill="#3d6644" fillOpacity=".12" stroke="#3d6644" strokeWidth="1"/>
      <path d="M19 7.5H21M20 6.5V8.5" stroke="#c9993a" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Medal: () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="15.5" r="6.5" stroke="#3d6644" strokeWidth="1.4"/>
      <path d="M9.5 3.5L7.5 8.5H18.5L16.5 3.5H9.5Z" stroke="#3d6644" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M10.5 8.5L9.5 15.5" stroke="#3d6644" strokeWidth="1" strokeLinecap="round"/>
      <path d="M15.5 8.5L16.5 15.5" stroke="#3d6644" strokeWidth="1" strokeLinecap="round"/>
      <path d="M10.5 15.8L12.5 17.8L16 13.5" stroke="#c9993a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const PILLARS = [
  { Icon: Icons.Lab,     num:'01', title:'Lab Certified Quality',   tag:'Triple Tested',   body:'Every formulation tested across 3 independent laboratories before it reaches your field. Zero compromise on purity or efficacy.' },
  { Icon: Icons.Shield,  num:'02', title:'CIB Registered',          tag:'Govt. Approved',  body:'Fully registered with Central Insecticides Board. Every product is government-approved, legally compliant, and safe for field use.' },
  { Icon: Icons.Leaf,    num:'03', title:'Crop Intelligence',       tag:'40+ Crops',       body:'40+ crop-specific solutions built with on-field agronomists across 20 seasons of real harvest data from Indian farmlands.' },
  // { Icon: Icons.Truck,   num:'04', title:'Pan-India Delivery',      tag:'48hr Delivery',   body:'Doorstep delivery across Maharashtra, Gujarat, MP and Rajasthan within 48 hours. No minimum order for registered dealers.' },
  // { Icon: Icons.Support, num:'05', title:'Expert Agri Advisory',   tag:'Free Guidance',   body:'Free consultation from qualified agronomists every season. Crop-specific dosage guidance, timing advice and pest identification.' },
  // { Icon: Icons.Medal,   num:'06', title:'Dealer Advantage',        tag:'Best Margins',    body:'Industry-leading margins for distributors, retailers and bulk buyers. Flexible credit terms and seasonal promotional support.' },
]

function PillarCard({ pillar, index }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      initial={{ opacity:0, y:36 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-50px' }}
      transition={{ duration:.65, delay:index * .09, ease:[.22,1,.36,1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#f3f4e3' : '#ffffdb',
        border: `1px solid ${hov ? 'rgba(61,102,68,.2)' : 'rgba(0,0,0,.08)'}`,
        borderRadius: 3,
        padding: '26px 24px 28px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        boxShadow: hov ? '0 20px 48px rgba(14,26,16,.09)' : '0 2px 12px rgba(0,0,0,.04)',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all .35s cubic-bezier(.22,1,.36,1)',
      }}>

      {/* Watermark number */}
      <div style={{
        position:'absolute', top:18, right:22,
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize:68, fontWeight:700, lineHeight:1,
        color: hov ? 'rgba(61,102,68,.07)' : 'rgba(0,0,0,.04)',
        userSelect:'none', letterSpacing:'-.04em', transition:'color .3s',
      }}>{pillar.num}</div>

      {/* Icon box */}
      <div style={{
        width:52, height:52, borderRadius:10,
        border: `1px solid ${hov ? 'rgba(61,102,68,.22)' : 'rgba(0,0,0,.1)'}`,
        background: hov ? 'rgba(61,102,68,.06)' : 'rgba(248,245,238,.9)',
        display:'flex', alignItems:'center', justifyContent:'center',
        marginBottom:26, transition:'all .3s',
      }}>
        <pillar.Icon />
      </div>

      {/* Tag */}
      <div style={{
        display:'inline-block', marginBottom:13,
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontSize:9, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase',
        color: hov ? '#3d6644' : '#9aab9c',
        border: `1px solid ${hov ? '#3d664444' : 'rgba(0,0,0,.1)'}`,
        padding:'3px 10px', borderRadius:100, transition:'all .3s',
      }}>{pillar.tag}</div>

      {/* Title */}
      <div style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize:19, fontWeight:700,
        color: hov ? '#0e1a10' : '#1c2e1e',
        lineHeight:1.28, marginBottom:13,
        letterSpacing:'-.01em', transition:'color .3s',
      }}>{pillar.title}</div>

      {/* Body */}
      <div style={{
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontSize:13.5, color:'#6a7d6c', lineHeight:1.78,
      }}>{pillar.body}</div>

      {/* Hover accent bar */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:2,
        background:'linear-gradient(90deg,#3d6644,#22c55e)',
        transform: hov ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin:'left',
        transition:'transform .4s cubic-bezier(.22,1,.36,1)',
      }}/>
    </motion.div>
  )
}

function WhyChooseUs() {
  return (
    <section style={{ background:'#E6E6B0', padding:'60px 0 0' }} id="about">
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 6%' }}>

        {/* Section header */}
        <div style={{ display:'grid', gridTemplateColumns:'5fr 4fr', gap:80, alignItems:'end', marginBottom:40 }}
          className="responsive-2col">

          <motion.div {...reveal} transition={{ duration:.7 }}>
            <SLabel>Why Choose GreenLife</SLabel>
            <div style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize:'clamp(40px,4.8vw,66px)',
              fontWeight:700, lineHeight:1.06,
              color:'#0e1a10', letterSpacing:'-.02em',
            }}>
              Two Decades of<br/>
              <em style={{ color:'#3d6644', fontStyle:'italic', fontWeight:700 }}>Growing Trust</em>
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ duration:.7, delay:.12 }} style={{ paddingBottom:8 }}>
            <p style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize:15.5, color:'#5a6b5c', lineHeight:1.82, maxWidth:380,
              borderLeft:'2px solid rgba(201,153,58,.4)', paddingLeft:20,
            }}>
              From soil to shelf, GreenLife Cropcare combines modern agri-science with deep-rooted field knowledge — giving every Indian farmer a trusted partner at every crop stage.
            </p>
            <div style={{ display:'flex', gap:16, marginTop:28, flexWrap:'wrap' }}>
              {['ISO 9001','CIB Registered','GMP Certified'].map((c,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6,
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize:11, fontWeight:700, color:'#3d6644', letterSpacing:'.06em' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13">
                    <circle cx="6.5" cy="6.5" r="6" stroke="#c9993a" strokeWidth="1" fill="none"/>
                    <path d="M4 6.5L5.8 8.3L9 5" stroke="#c9993a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {c}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 6 pillar cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}
          className="responsive-3col">
          {PILLARS.map((p, i) => <PillarCard key={i} pillar={p} index={i} />)}
        </div>

        {/* Trust strip */}
        <motion.div {...reveal} transition={{ duration:.6, delay:.2 }}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'36px 0 0', marginTop:48,
            borderTop:'1px solid rgba(0,0,0,.07)', flexWrap:'wrap', gap:24 }}>
          <div style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:14, color:'#8a9c8c', fontStyle:'italic' }}>
            Trusted by farmers across 8 Indian states since 2004
          </div>
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            {['12,000+ Farmers','120+ Products','36 Districts'].map((b,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#c9993a', flexShrink:0 }}/>
                <span style={{ fontFamily:'"DM Sans",system-ui,sans-serif', fontSize:12, fontWeight:600, color:'#7a8c7c', letterSpacing:'.04em' }}>{b}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats band */}
      <div style={{ marginTop:40, background:'#0e1a10', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:.04,
          backgroundImage:'repeating-linear-gradient(-55deg,#22c55e 0,#22c55e 1px,transparent 0,transparent 28px)' }}/>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 6%',
          display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}
          className="responsive-4col">
          {[
            { val:'120+', lab:'Products in Range' },
            { val:'12K+', lab:'Farmers Served'   },
            { val:'36',   lab:'Districts Covered' },
            { val:'20+',  lab:'Years of Expertise'},
          ].map((s,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:.6, delay:i*.1 }}
              style={{ textAlign:'center', padding:'52px 20px',
                borderRight: i<3 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
              <div style={{ fontFamily:'"Playfair Display",Georgia,serif',
                fontSize:'clamp(38px,4vw,54px)', fontWeight:700,
                color:'#f5f0e8', lineHeight:1, letterSpacing:'-.02em' }}>{s.val}</div>
              <div style={{ width:28, height:1, background:'rgba(201,153,58,.5)', margin:'14px auto 10px' }}/>
              <div style={{ fontFamily:'"DM Sans",system-ui,sans-serif', fontSize:11, fontWeight:500,
                color:'rgba(245,240,232,.38)', letterSpacing:'.16em', textTransform:'uppercase' }}>
                {s.lab}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
//  SECTION 3 — PRODUCT CATEGORIES (new brand showcase)
// ═══════════════════════════════════════════════════════════
const CATEGORIES_DATA = [
  { name:'Insecticides',  sub:'Fast knockdown. Long protection.',   color:'#1a3d20', accent:'#4ade80', icon:'🐛', tag:'30+ Products' },
  { name:'Fungicides',    sub:'Block blight before it spreads.',    color:'#2d3a1a', accent:'#a3e635', icon:'🍄', tag:'18+ Products' },
  { name:'Herbicides',    sub:'Weed-free fields, higher yield.',    color:'#1c3830', accent:'#34d399', icon:'🌿', tag:'12+ Products' },
  { name:'Fertilizers',   sub:'Balanced nutrition. Stronger crops.',color:'#3a2d10', accent:'#fbbf24', icon:'💧', tag:'24+ Products' },
  { name:'Bio Pesticides',sub:'Natures defence. Zero residue.',    color:'#2a1f3a', accent:'#a78bfa', icon:'🌱', tag:'8+ Products'  },
  { name:'PGR',           sub:'Regulate. Strengthen. Maximize.',    color:'#3a1a1a', accent:'#fb923c', icon:'🔬', tag:'10+ Products' },
]

function CategoryShowcase() {
  const [hovered, setHovered] = useState(null)
  return (
    <section style={{ background:INK, padding:'100px 0' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 6%' }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56, flexWrap:'wrap', gap:20 }}>
          <motion.div {...reveal} transition={{ duration:.6 }}>
            <SLabel light>Product Range</SLabel>
            <SHead light size="clamp(34px,4vw,54px)">
              Complete Crop<br/>
              <em style={{ color:LEAF, fontStyle:'italic' }}>Protection System</em>
            </SHead>
          </motion.div>
          <motion.div {...reveal} transition={{ duration:.6, delay:.1 }}>
            <Link to="/products" style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:'rgba(255,255,255,.45)',
              textDecoration:'none', letterSpacing:'.08em', display:'flex', alignItems:'center', gap:6,
              transition:'color .2s', borderBottom:'1px solid rgba(255,255,255,.12)', paddingBottom:2 }}
              onMouseEnter={e=>e.currentTarget.style.color='#4ade80'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}>
              View All Products →
            </Link>
          </motion.div>
        </div>

        {/* 6 category cards in 3×2 grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}
          className="responsive-3col">
          {CATEGORIES_DATA.map((cat, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-40px' }} transition={{ duration:.55, delay:i*.07 }}
              onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
              style={{ position:'relative', overflow:'hidden', borderRadius:4,
                background: hovered===i ? cat.color : 'rgba(255,255,255,.04)',
                border:'1px solid rgba(255,255,255,.06)',
                padding:'36px 32px', cursor:'pointer',
                transition:'all .35s cubic-bezier(.22,1,.36,1)' }}>

              {/* Accent glow on hover */}
              <div style={{ position:'absolute', top:0, right:0, width:120, height:120,
                background:`radial-gradient(circle at 80% 20%, ${cat.accent}18, transparent)`,
                opacity: hovered===i ? 1 : 0, transition:'opacity .35s' }}/>

              {/* Top row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
                <div style={{ fontSize:32 }}>{cat.icon}</div>
                <span style={{ fontFamily:SANS, fontSize:10, fontWeight:700, letterSpacing:'.15em',
                  textTransform:'uppercase', color: hovered===i ? cat.accent : 'rgba(255,255,255,.25)',
                  border:`1px solid ${hovered===i ? cat.accent+'44' : 'rgba(255,255,255,.1)'}`,
                  padding:'4px 10px', borderRadius:100, transition:'all .3s' }}>
                  {cat.tag}
                </span>
              </div>

              {/* Name */}
              <div style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, color:'#f5f0e8',
                marginBottom:8, lineHeight:1.2 }}>{cat.name}</div>

              {/* Sub */}
              <div style={{ fontFamily:SANS, fontSize:13, color:'rgba(245,240,232,.4)', lineHeight:1.6,
                marginBottom:24 }}>{cat.sub}</div>

              {/* Arrow */}
              <div style={{ display:'flex', alignItems:'center', gap:6,
                color: hovered===i ? cat.accent : 'rgba(255,255,255,.2)',
                fontFamily:SANS, fontSize:12, fontWeight:600, letterSpacing:'.06em',
                transition:'color .3s' }}>
                <span>Explore range</span>
                <motion.span animate={{ x: hovered===i ? 4 : 0 }} transition={{ duration:.2 }}>→</motion.span>
              </div>

              {/* Bottom accent bar */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2,
                background:`linear-gradient(90deg,${cat.accent},transparent)`,
                transform: hovered===i ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin:'left', transition:'transform .35s' }}/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
//  SECTION 4 — FEATURED PRODUCTS (premium card redesign)
// ═══════════════════════════════════════════════════════════
function ProductCard({ product, delay=0 }) {
  const [hov, setHov] = useState(false)
  const CAT_ACCENT = {
    'Insecticide':'#4ade80','Fungicide':'#a3e635','Herbicide':'#34d399',
    'Fertilizer':'#fbbf24','Bio Pesticide':'#a78bfa','PGR':'#fb923c',
  }
  const accent = CAT_ACCENT[product.category] || '#4ade80'

  return (
    <motion.div initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-40px' }} transition={{ duration:.55, delay }}>
      <Link to={`/products/${product.id}`} style={{ textDecoration:'none', display:'block' }}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        <div style={{
          background:'#fff', border:'1px solid rgba(0,0,0,.07)', overflow:'hidden',
          borderRadius:4, position:'relative',
          transform: hov ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hov ? '0 24px 48px rgba(0,0,0,.10)' : '0 2px 8px rgba(0,0,0,.04)',
          transition:'all .3s cubic-bezier(.22,1,.36,1)',
        }}>

          {/* Image area */}
          <div style={{ height:220, position:'relative', overflow:'hidden',
            background: product.imageUrl ? 'transparent' : `linear-gradient(135deg,#e8f5e9,#c8e6c9)` }}>
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name}
                  style={{ width:'100%', height:'100%', objectFit:'cover',
                    transform: hov ? 'scale(1.04)' : 'scale(1)', transition:'transform .5s' }}/>
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:56 }}>🌿</div>
            }
            {/* Category pill over image */}
            <div style={{ position:'absolute', top:14, left:14 }}>
              <span style={{ fontFamily:SANS, fontSize:10, fontWeight:700, letterSpacing:'.14em',
                textTransform:'uppercase', background:INK+'ee', color:accent,
                padding:'5px 12px', borderRadius:100 }}>
                {product.category}
              </span>
            </div>
            {/* Hover overlay */}
            <div style={{ position:'absolute', inset:0,
              background:'linear-gradient(180deg,transparent 40%,rgba(14,26,16,.7) 100%)',
              opacity: hov ? 1 : 0, transition:'opacity .3s' }}/>
            {/* "View Details" on hover */}
            <div style={{ position:'absolute', bottom:16, left:0, right:0, display:'flex',
              justifyContent:'center', opacity: hov ? 1 : 0,
              transform: hov ? 'translateY(0)' : 'translateY(8px)',
              transition:'all .3s' }}>
              <span style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:'#fff',
                background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.3)',
                padding:'7px 20px', borderRadius:100, backdropFilter:'blur(8px)' }}>
                View Details →
              </span>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding:'24px 24px 28px' }}>
            <div style={{ fontFamily:SERIF, fontSize:17, fontWeight:700, color:INK,
              lineHeight:1.3, marginBottom:8,
              color: hov ? SAGE : INK, transition:'color .2s' }}>
              {product.name}
            </div>
            <div style={{ fontFamily:SANS, fontSize:12, color:'#8a9c8c', lineHeight:1.65,
              marginBottom:16, display:'-webkit-box', WebkitLineClamp:2,
              WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              {product.description || `Effective ${product.category.toLowerCase()} for maximum crop protection.`}
            </div>

            {/* Crop tags */}
            {product.crops?.length > 0 && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:18 }}>
                {product.crops.slice(0,3).map(c => (
                  <span key={c} style={{ fontFamily:SANS, fontSize:10, fontWeight:600,
                    color:SAGE, background:'#f0f7f1', padding:'3px 10px', borderRadius:100,
                    letterSpacing:'.04em' }}>{c}</span>
                ))}
              </div>
            )}

            {/* Bottom row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              paddingTop:16, borderTop:'1px solid rgba(0,0,0,.06)' }}>
              <span style={{ fontFamily:SANS, fontSize:11, color:'#a0b0a2' }}>
                {product.activeIngredient || '—'}
              </span>
              <div style={{ width:28, height:28, borderRadius:'50%', border:`1px solid ${accent}44`,
                display:'flex', alignItems:'center', justifyContent:'center',
                background: hov ? accent : 'transparent', transition:'all .25s' }}>
                <span style={{ fontSize:12, color: hov ? '#fff' : accent, transition:'color .25s' }}>→</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function FeaturedProducts({ products, loading }) {
  const featured = products.filter(p => p.featured)
  const shown    = featured.length ? featured : products.slice(0, 6)

  return (
    <section style={{ background:CREAM, padding:'100px 0' }} id="products">
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 6%' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end',
          marginBottom:56, flexWrap:'wrap', gap:20 }}>
          <motion.div {...reveal} transition={{ duration:.6 }}>
            <SLabel>Featured Range</SLabel>
            <SHead size="clamp(34px,4vw,52px)">
              Products Built for<br/>
              <em style={{ color:SAGE, fontStyle:'italic' }}>Indian Farmlands</em>
            </SHead>
          </motion.div>
          <motion.div {...reveal} transition={{ duration:.6, delay:.1 }}>
            <Link to="/products" style={{ fontFamily:SANS, fontSize:13, fontWeight:600,
              color:SAGE, textDecoration:'none', letterSpacing:'.06em', display:'flex',
              alignItems:'center', gap:6, borderBottom:`1px solid ${SAGE}55`, paddingBottom:2 }}>
              View Full Catalogue →
            </Link>
          </motion.div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="responsive-3col">
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{ height:360, background:'rgba(0,0,0,.06)', borderRadius:4, animation:'pulse 1.5s ease-in-out infinite' }}/>
            ))}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="responsive-3col">
            {shown.map((p,i) => <ProductCard key={p.id} product={p} delay={i*.07}/>)}
          </div>
        )}

        {/* Bottom CTA strip */}
        <motion.div {...reveal} transition={{ duration:.6, delay:.2 }}
          style={{ marginTop:56, display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'32px 40px', background:INK, borderRadius:4, flexWrap:'wrap', gap:20 }}>
          <div>
            <div style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, color:'#f5f0e8', marginBottom:6 }}>
              Looking for a specific product?
            </div>
            <div style={{ fontFamily:SANS, fontSize:13, color:'rgba(245,240,232,.45)' }}>
              Browse our full catalogue of 120+ registered agri products.
            </div>
          </div>
          <Link to="/products" style={{ fontFamily:SANS, fontSize:13, fontWeight:700,
            color:INK, background:LEAF, padding:'13px 28px', borderRadius:4,
            textDecoration:'none', letterSpacing:'.04em', flexShrink:0,
            transition:'background .2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='#4ade80'}
            onMouseLeave={e=>e.currentTarget.style.background=LEAF}>
            Browse All Products →
          </Link>
        </motion.div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
//  SECTION 5 — PRODUCT SPOTLIGHT (interactive showcase)
// ═══════════════════════════════════════════════════════════
const SPOT = [
  { cat:'Insecticide', name:'GREEN COMBI',   line:'Broad-spectrum contact action. Fast knockdown with lasting residual protection.',        active:'Chlorpyrifos 20%',  dosage:'2 ml / L',   pack:'250ml–5L', crops:['Cotton','Rice','Wheat'],         badge:'🔥 Bestseller', color:'#1a3d20', accent:'#4ade80' },
  { cat:'Herbicide',   name:'DR KADU',      line:'Systemic post-emergence control of all annual and perennial weeds in one application.',  active:'Glyphosate 41%',    dosage:'1.6 L / Ac', pack:'500ml–5L', crops:['Soybean','Maize','Sugarcane'],   badge:'⭐ Top Rated',  color:'#2d3a1a', accent:'#a3e635' },
  { cat:'Fungicide',   name:'DR FUTURE ZINC',        line:'Multi-site protective fungicide. Prevents early blight, late blight and downy mildew.',   active:'Mancozeb 75%',      dosage:'2 g / L',    pack:'100g–1kg', crops:['Tomato','Potato','Grapes'],      badge:'⭐ Most Loved', color:'#1c3830', accent:'#34d399' },
  { cat:'Fertilizer',  name:'USS AMRUT',            line:'Perfectly balanced water-soluble nutrition. Ideal for foliar spray and drip irrigation.', active:'N:P:K 19:19:19',   dosage:'3–5 g / L',  pack:'500g–5kg', crops:['Vegetables','Fruits','Pulses'],  badge:'🌾 Universal',  color:'#3a2d10', accent:'#fbbf24' },
  { cat:'Insecticide', name:'NIM SHIELD',  line:'Systemic neonicotinoid protecting crops from sucking pests from the inside out.',         active:'Imidacloprid 17.8%',dosage:'0.5 ml / L', pack:'100ml–1L', crops:['Cotton','Chilli','Tomato'],     badge:'✨ New Arrival', color:'#2a1f3a', accent:'#a78bfa' },
]

function Spotlight() {
  const [active, setActive] = useState(0)
  const p = SPOT[active]

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i+1)%SPOT.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ background:INK, padding:'100px 0', position:'relative', overflow:'hidden' }}>
      {/* subtle grid */}
      <div style={{ position:'absolute', inset:0, opacity:.04,
        backgroundImage:'linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)',
        backgroundSize:'60px 60px' }}/>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 6%', position:'relative', zIndex:10 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}
          className="responsive-2col">

          {/* Left — product list */}
          <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:.7 }}>
            <SLabel light>Star Products</SLabel>
            <SHead light size="clamp(34px,4vw,52px)">
              Our Most<br/>
              <em style={{ color:LEAF, fontStyle:'italic' }}>Trusted Range</em>
            </SHead>
            <p style={{ fontFamily:SANS, fontSize:14, color:'rgba(245,240,232,.42)', lineHeight:1.8,
              maxWidth:380, margin:'20px 0 40px' }}>
              Proven across millions of acres. Tested by thousands of farmers. Selected by you.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {SPOT.map((s,i) => (
                <button key={i} onClick={()=>setActive(i)}
                  style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                    border:'1px solid', textAlign:'left', width:'100%', cursor:'pointer',
                    borderRadius:4, position:'relative', overflow:'hidden',
                    borderColor: active===i ? `${s.accent}44` : 'rgba(255,255,255,.07)',
                    background: active===i ? `${s.color}cc` : 'rgba(255,255,255,.03)',
                    transition:'all .3s' }}>
                  {/* active left bar */}
                  {active===i && <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3,
                    background:`linear-gradient(180deg,${s.accent},${s.accent}44)` }}/>}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:SANS, fontSize:11, fontWeight:600, letterSpacing:'.1em',
                      textTransform:'uppercase', color: active===i ? s.accent : 'rgba(255,255,255,.3)',
                      marginBottom:3, transition:'color .3s' }}>{s.cat}</div>
                    <div style={{ fontFamily:SERIF, fontSize:15, fontWeight:700, color:'#f5f0e8',
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</div>
                  </div>
                  <span style={{ fontFamily:SANS, fontSize:10, fontWeight:700,
                    color: active===i ? s.accent : 'rgba(255,255,255,.2)',
                    borderRadius:100, padding:'4px 10px', flexShrink:0,
                    border:`1px solid ${active===i ? s.accent+'44' : 'rgba(255,255,255,.1)'}`,
                    transition:'all .3s' }}>{s.badge}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — product detail card */}
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
              transition={{ duration:.45 }}
              style={{ background:`${p.color}bb`, border:`1px solid ${p.accent}22`,
                borderRadius:4, padding:40, backdropFilter:'blur(8px)' }}>

              {/* Badge */}
              <div style={{ marginBottom:28 }}>
                <span style={{ fontFamily:SANS, fontSize:10, fontWeight:700, letterSpacing:'.15em',
                  textTransform:'uppercase', color:p.accent,
                  border:`1px solid ${p.accent}44`, padding:'5px 14px', borderRadius:100 }}>
                  {p.badge}
                </span>
              </div>

              {/* Cat */}
              <div style={{ fontFamily:SANS, fontSize:11, fontWeight:700, letterSpacing:'.15em',
                textTransform:'uppercase', color:`${p.accent}88`, marginBottom:10 }}>{p.cat}</div>

              {/* Name */}
              <div style={{ fontFamily:SERIF, fontSize:'clamp(22px,2.5vw,30px)', fontWeight:700,
                color:'#f5f0e8', lineHeight:1.2, marginBottom:16 }}>{p.name}</div>

              {/* Line */}
              <p style={{ fontFamily:SANS, fontSize:14, color:'rgba(245,240,232,.55)', lineHeight:1.8, marginBottom:32 }}>
                {p.line}
              </p>

              {/* Spec grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:28 }}>
                {[['Active',p.active],['Dosage',p.dosage],['Pack Sizes',p.pack]].map(([k,v]) => (
                  <div key={k} style={{ background:'rgba(255,255,255,.05)',
                    border:'1px solid rgba(255,255,255,.08)', borderRadius:4, padding:'14px 16px' }}>
                    <div style={{ fontFamily:SANS, fontSize:9, fontWeight:700, letterSpacing:'.15em',
                      textTransform:'uppercase', color:'rgba(245,240,232,.3)', marginBottom:5 }}>{k}</div>
                    <div style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:'#f5f0e8' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Crop tags */}
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:32 }}>
                {p.crops.map(c => (
                  <span key={c} style={{ fontFamily:SANS, fontSize:11, fontWeight:600,
                    color:p.accent, background:`${p.accent}15`, border:`1px solid ${p.accent}33`,
                    padding:'5px 14px', borderRadius:100 }}>{c}</span>
                ))}
              </div>

              {/* CTA */}
              <Link to="/contact" style={{ display:'flex', alignItems:'center', justifyContent:'center',
                gap:8, background:p.accent, color:INK, fontFamily:SANS, fontSize:13, fontWeight:700,
                padding:'14px', borderRadius:4, textDecoration:'none', letterSpacing:'.04em',
                transition:'opacity .2s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='.85'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                Get Pricing & Details →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
//  SECTION 6 — TESTIMONIALS (editorial large-quote style)
// ═══════════════════════════════════════════════════════════
const TESTI = [
  { name:'Ramesh Patil',    role:'Cotton Farmer',    loc:'Akola, MH',   stars:5, text:'GreenLife ke Chlorpyrifos ne meri poori cotton crop bachaa li. Teen din mein bollworm completely control ho gaya. Life-saver product hai.', color:'#2d6644', init:'R' },
  { name:'Suresh Deshmukh', role:'Agri Dealer',      loc:'Nagpur, MH',  stars:5, text:'5 saal se GreenLife ka authorised dealer hoon. Product quality aur company support dono mein koi compromise nahi. Farmers trust karte hain.', color:'#5a3e10', init:'S' },
  { name:'Mahesh Shinde',   role:'Vegetable Farmer', loc:'Pune, MH',    stars:5, text:'NPK 19:19:19 ke baad tomato crop ki growth aur colour dono mein remarkable improvement aaya. Yield 30% badh gayi is season mein.', color:'#1a3d5a', init:'M' },
]

function Testimonials() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setCurrent(i => (i+1)%TESTI.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{ background:CREAM, padding:'100px 0', overflow:'hidden' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 6%' }}>

        <motion.div {...reveal} transition={{ duration:.6 }} style={{ textAlign:'center', marginBottom:72 }}>
          <SLabel>Farmer Stories</SLabel>
          <SHead center size="clamp(34px,4vw,52px)">
            Trusted by Those<br/>
            <em style={{ color:SAGE, fontStyle:'italic' }}>Who Work the Land</em>
          </SHead>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}
          className="responsive-3col">
          {TESTI.map((t,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-30px' }} transition={{ duration:.55, delay:i*.1 }}
              onClick={()=>setCurrent(i)}
              style={{ background: current===i ? '#fff' : 'rgba(255,255,255,.5)',
                border:`1px solid ${current===i ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.05)'}`,
                borderRadius:4, padding:'36px 32px', cursor:'pointer',
                boxShadow: current===i ? '0 16px 40px rgba(0,0,0,.08)' : 'none',
                transform: current===i ? 'translateY(-4px)' : 'translateY(0)',
                transition:'all .4s cubic-bezier(.22,1,.36,1)' }}>

              {/* Stars */}
              <div style={{ display:'flex', gap:2, marginBottom:20 }}>
                {[...Array(t.stars)].map((_,si) => (
                  <span key={si} style={{ color:GOLD, fontSize:13 }}>★</span>
                ))}
              </div>

              {/* Big open quote */}
              <div style={{ fontFamily:SERIF, fontSize:56, color:`${SAGE}20`, lineHeight:.8,
                marginBottom:12, userSelect:'none' }}>"</div>

              {/* Quote text */}
              <p style={{ fontFamily:SANS, fontSize:14, color:'#5a6b5c', lineHeight:1.82,
                fontStyle:'italic', marginBottom:28 }}>{t.text}</p>

              {/* Author */}
              <div style={{ display:'flex', alignItems:'center', gap:14,
                paddingTop:20, borderTop:'1px solid rgba(0,0,0,.07)' }}>
                <div style={{ width:42, height:42, borderRadius:'50%',
                  background:t.color, display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:SERIF, fontSize:17, fontWeight:700, color:'#fff', flexShrink:0 }}>
                  {t.init}
                </div>
                <div>
                  <div style={{ fontFamily:SERIF, fontSize:15, fontWeight:700, color:INK }}>{t.name}</div>
                  <div style={{ fontFamily:SANS, fontSize:11, color:'#9aab9c', marginTop:2 }}>
                    {t.role} · {t.loc}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:40 }}>
          {TESTI.map((_,i) => (
            <button key={i} onClick={()=>setCurrent(i)}
              style={{ width: current===i ? 24 : 6, height:6, borderRadius:100,
                background: current===i ? SAGE : 'rgba(0,0,0,.15)',
                border:'none', cursor:'pointer', transition:'all .3s', padding:0 }}/>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
//  SECTION 7 — FINAL CTA (full bleed organic)
// ═══════════════════════════════════════════════════════════
function FinalCTA() {
  return (
    <section style={{ background:INK, padding:'100px 0', position:'relative', overflow:'hidden' }} id="contact">
      
      {/* Organic texture */}
      <div style={{ position:'absolute', inset:0, opacity:.05,
        backgroundImage:`repeating-linear-gradient(-45deg,${LEAF} 0,${LEAF} 1px,transparent 0,transparent 50%)`,
        backgroundSize:'24px 24px' }}/>

      <div style={{ position:'absolute', top:'-20%', right:'-5%', width:500, height:500,
        background:`radial-gradient(circle,${SAGE}22,transparent)`, borderRadius:'50%' }}/>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 6%', position:'relative', zIndex:10 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}
          className="responsive-2col">

          {/* LEFT */}
          <motion.div
            initial={{ opacity:0, x:-24 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            transition={{ duration:.7 }}
          >
            <SLabel light>Get In Touch</SLabel>

            <SHead light size="clamp(36px,4.5vw,58px)">
              Ready to Protect<br/>
              <em style={{ color:LEAF, fontStyle:'italic' }}>Your Harvest?</em>
            </SHead>

            <p style={{
              fontFamily:SANS,
              fontSize:15,
              color:'rgba(245,240,232,.45)',
              lineHeight:1.8,
              maxWidth:380,
              margin:'24px 0 0'
            }}>
              Talk to our agri experts for free product recommendations,
              pricing, and dealer enquiries anywhere in India.
            </p>
          </motion.div>

          {/* RIGHT BUTTONS */}
          <motion.div
            initial={{ opacity:0, x:24 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            transition={{ duration:.7, delay:.1 }}
            style={{ display:'flex', flexDirection:'column', gap:14 }}
          >

            {/* SEND ENQUIRY */}
            <Link
              to="/contact"
              style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                gap:10,
                background:LEAF,
                color:INK,
                fontFamily:SANS,
                fontSize:14,
                fontWeight:700,
                padding:'17px 32px',
                borderRadius:4,
                textDecoration:'none',
                letterSpacing:'.04em',
                transition:'background .2s',
                boxShadow:`0 8px 32px ${LEAF}33`
              }}
              onMouseEnter={e=>e.currentTarget.style.background='#4ade80'}
              onMouseLeave={e=>e.currentTarget.style.background=LEAF}
            >
              <Send size={18} />
              Send Enquiry
              <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.4, repeat:Infinity }}>
                →
              </motion.span>
            </Link>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                gap:10,
                background:'transparent',
                color:'rgba(245,240,232,.65)',
                border:'1px solid rgba(245,240,232,.15)',
                fontFamily:SANS,
                fontSize:14,
                fontWeight:600,
                padding:'17px 32px',
                borderRadius:4,
                textDecoration:'none',
                letterSpacing:'.04em',
                transition:'all .2s'
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.borderColor='rgba(74,222,128,.3)';
                e.currentTarget.style.color='#f5f0e8';
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.borderColor='rgba(245,240,232,.15)';
                e.currentTarget.style.color='rgba(245,240,232,.65)';
              }}
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>

            {/* FEATURES */}
            <div style={{ display:'flex', gap:24, marginTop:8 }}>
              {['Free Advisory','Pan-India Delivery','Bulk Pricing'].map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:LEAF, fontSize:11 }}>✓</span>
                  <span style={{
                    fontFamily:SANS,
                    fontSize:11,
                    color:'rgba(245,240,232,.35)',
                    fontWeight:500
                  }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── responsive helpers ───────────────────────────────────
const GLOBAL_STYLE = `
  @media(max-width:768px){
    .responsive-2col{ grid-template-columns:1fr !important; gap:40px !important; }
    .responsive-3col{ grid-template-columns:1fr !important; gap:16px !important; }
    .responsive-4col{ grid-template-columns:1fr 1fr !important; }
  }
  @media(max-width:480px){
    .responsive-4col{ grid-template-columns:1fr !important; }
  }
`

// ═══════════════════════════════════════════════════════════
//  REST OF HOME PAGE
// ═══════════════════════════════════════════════════════════
// (old duplicate functions removed)

// ═══════════════════════════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════════════════════════
export default function Home() {
  const { products, loading } = useProducts(true)

  return (
    <div>
      <style>{GLOBAL_STYLE}</style>

      {/* 1 — HERO */}
      <HeroCarousel />

      {/* 2 — TICKER */}
      <Ticker />

      {/* 3 — WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 5 — FEATURED PRODUCTS */}
      <FeaturedProducts products={products} loading={loading} />


      {/* 4 — CATEGORY SHOWCASE */}
      <CategoryShowcase />


      {/* 6 — SPOTLIGHT */}
      <Spotlight />

      {/* 7 — TESTIMONIALS */}
      <Testimonials />

      {/* 8 — FINAL CTA */}
      <FinalCTA />
    </div>
  )
}
