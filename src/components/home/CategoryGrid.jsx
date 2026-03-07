// src/components/home/CategoryGrid.jsx
//
// ─── HOW TO ADD PNG ICONS ────────────────────────────────────────────────────
//  In CATS array below, set the `png` field for each category:
//
//    png: '/images/categories/insecticide.png'
//    png: 'https://res.cloudinary.com/dzpenviyy/image/upload/v1/insecticide.png'
//
//  If `png` is set → shows your PNG image
//  If `png` is empty → falls back to the built-in SVG icon
//
//  Recommended PNG size: 80×80px or 100×100px, transparent background
// ─────────────────────────────────────────────────────────────────────────────

import { useState }  from 'react'
import { Link }      from 'react-router-dom'
import { motion }    from 'framer-motion'

const CATS = [
  {
    slug:    'Insecticide',
    label:   'Insecticides',
    accent:  '#2d6a4f',
    tint:    '#eef7f2',
    border:  '#c0ddd0',
    png:     '',   // ← add your PNG path here
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
        <path d="M24 42C24 42 10 33 10 21C10 13 16 8 24 10C32 8 38 13 38 21C38 33 24 42 24 42Z"
          stroke="#2d6a4f" strokeWidth="1.4" fill="rgba(45,106,79,.1)"/>
        <path d="M24 42V17" stroke="#2d6a4f" strokeWidth=".9" strokeLinecap="round" strokeDasharray="2.5 3" opacity=".6"/>
        <ellipse cx="24" cy="22" rx="4" ry="6" fill="rgba(45,106,79,.2)" stroke="#2d6a4f" strokeWidth="1.2"/>
        <circle cx="24" cy="17" r="2.8" fill="rgba(45,106,79,.25)" stroke="#2d6a4f" strokeWidth="1.1"/>
        <path d="M21.5 16C19 13 16 12" stroke="#2d6a4f" strokeWidth=".9" strokeLinecap="round"/>
        <path d="M26.5 16C29 13 32 12" stroke="#2d6a4f" strokeWidth=".9" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    slug:    'Fungicide',
    label:   'Fungicides',
    accent:  '#1e6091',
    tint:    '#eef4fb',
    border:  '#b8d4ec',
    png:     '',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
        <path d="M24 6L7 12V22C7 33 14 42 24 46C34 42 41 33 41 22V12L24 6Z"
          stroke="#1e6091" strokeWidth="1.4" fill="rgba(30,96,145,.09)"/>
        <path d="M16 23L21 28L32 18" stroke="#1e6091" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    slug:    'Herbicide',
    label:   'Herbicides',
    accent:  '#9c4221',
    tint:    '#fdf3ee',
    border:  '#ecc8b4',
    png:     '',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
        <path d="M24 44V22" stroke="#9c4221" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M24 34C24 34 16 30 13 20C18 20 23 26 24 31" fill="rgba(156,66,33,.12)" stroke="#9c4221" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M24 29C24 29 32 23 36 14C36 21 30 29 24 34" fill="rgba(156,66,33,.12)" stroke="#9c4221" strokeWidth="1.2" strokeLinejoin="round"/>
        <line x1="12" y1="44" x2="36" y2="44" stroke="#9c4221" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="9"  y1="9"  x2="39" y2="39" stroke="rgba(156,66,33,.35)" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="39" y1="9"  x2="9"  y2="39" stroke="rgba(156,66,33,.35)" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    slug:    'Fertilizer',
    label:   'Fertilizers',
    accent:  '#92660a',
    tint:    '#fdf8ee',
    border:  '#e8d4a0',
    png:     '',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
        <circle cx="24" cy="17" r="8" fill="rgba(146,102,10,.1)" stroke="#92660a" strokeWidth="1.3"/>
        <circle cx="24" cy="17" r="3" fill="rgba(146,102,10,.35)"/>
        {[0,60,120,180,240,300].map((d,i) => {
          const r = d*Math.PI/180
          return <line key={i} x1={24+10*Math.sin(r)} y1={17-10*Math.cos(r)} x2={24+13*Math.sin(r)} y2={17-13*Math.cos(r)} stroke="#92660a" strokeWidth="1.2" strokeLinecap="round" opacity=".55"/>
        })}
        <path d="M14 34V28" stroke="#92660a" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M14 32C11 30 10 26" stroke="#92660a" strokeWidth="1" strokeLinecap="round"/>
        <path d="M14 30C17 28 18 24" stroke="#92660a" strokeWidth="1" strokeLinecap="round"/>
        <path d="M24 36V28" stroke="#92660a" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M24 33C21 31 20 27" stroke="#92660a" strokeWidth="1" strokeLinecap="round"/>
        <path d="M24 31C27 29 28 25" stroke="#92660a" strokeWidth="1" strokeLinecap="round"/>
        <path d="M34 34V28" stroke="#92660a" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M34 32C31 30 30 26" stroke="#92660a" strokeWidth="1" strokeLinecap="round"/>
        <path d="M34 30C37 28 38 24" stroke="#92660a" strokeWidth="1" strokeLinecap="round"/>
        <line x1="10" y1="44" x2="38" y2="44" stroke="#92660a" strokeWidth="1.3" strokeLinecap="round" opacity=".4"/>
      </svg>
    ),
  },
  {
    slug:    'Bio-Pesticide',
    label:   'Bio Pesticides',
    accent:  '#3a7d44',
    tint:    '#eef8f1',
    border:  '#b8dcc0',
    png:     '',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
        <path d="M24 6C24 6 10 18 10 28C10 36 16 42 24 42C32 42 38 36 38 28C38 18 24 6 24 6Z"
          stroke="#3a7d44" strokeWidth="1.4" fill="rgba(58,125,68,.09)"/>
        <path d="M24 40V20" stroke="#3a7d44" strokeWidth=".9" strokeLinecap="round" strokeDasharray="2.5 3" opacity=".5"/>
        <path d="M24 33C20 31 16 28 14 24" stroke="#3a7d44" strokeWidth="1.1" strokeLinecap="round"/>
        <path d="M24 28C28 26 32 23 34 19" stroke="#3a7d44" strokeWidth="1.1" strokeLinecap="round"/>
        <circle cx="24" cy="26" r="4.5" fill="rgba(58,125,68,.2)" stroke="#3a7d44" strokeWidth="1.2"/>
        <circle cx="24" cy="26" r="2"   fill="rgba(58,125,68,.5)"/>
      </svg>
    ),
  },
  {
    slug:    'PGR',
    label:   'Growth Regulators',
    accent:  '#6b4c9a',
    tint:    '#f5f1fb',
    border:  '#cfc0e8',
    png:     '',
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
        <path d="M24 44V24" stroke="#6b4c9a" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 34C24 34 17 30 14 22C19 22 23 28 24 32" fill="rgba(107,76,154,.12)" stroke="#6b4c9a" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M24 29C24 29 31 23 34 16C34 22 29 30 24 34" fill="rgba(107,76,154,.12)" stroke="#6b4c9a" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M24 24C21 19 21 13 24 8" stroke="#6b4c9a" strokeWidth="1.1" strokeLinecap="round" opacity=".6"/>
        <path d="M21 12L24 8L27 12" stroke="#6b4c9a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity=".6"/>
        <line x1="16" y1="44" x2="32" y2="44" stroke="#6b4c9a" strokeWidth="1.2" strokeLinecap="round" opacity=".4"/>
      </svg>
    ),
  },
]

function CatCard({ cat, index }) {
  const [hov, setHov] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const showPng = cat.png && !imgErr

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: .5, delay: index * .06, ease: [.22, 1, .36, 1] }}
    >
      <Link
        to={`/products?category=${cat.slug}`}
        className="no-underline flex flex-col items-center text-center px-2 py-3.5 md:px-3 md:py-5"
        style={{
          background:   '#ffffff',
          borderRadius: 16,
          border:       `1.5px solid ${hov ? cat.border : '#e8e2d8'}`,
          boxShadow:    hov ? '0 8px 24px rgba(0,0,0,.09)' : '0 2px 6px rgba(0,0,0,.05)',
          transform:    hov ? 'translateY(-4px)' : 'translateY(0)',
          transition:   'all .3s cubic-bezier(.22,1,.36,1)',
          gap:          10,
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Icon circle */}
        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0 rounded-full transition-all duration-300" style={{
          background:    hov ? cat.tint : '#f8f5f0',
          border:        `1.5px solid ${hov ? cat.border : '#e8e2d8'}`,
        }}>
          {showPng ? (
            <img
              src={cat.png}
              alt={cat.label}
              onError={() => setImgErr(true)}
              style={{ width: 36, height: 36, objectFit: 'contain' }}
            />
          ) : (
            <cat.Icon />
          )}
        </div>

        {/* Category name */}
        <span className="text-[11px] md:text-[13px]" style={{
          fontFamily:   '"Playfair Display", Georgia, serif',
          fontWeight:   700,
          fontStyle:    'italic',
          lineHeight:   1.3,
          color:        hov ? cat.accent : '#2a3a2a',
          transition:   'color .3s',
          letterSpacing:'-0.01em',
        }}>
          {cat.label}
        </span>
      </Link>
    </motion.div>
  )
}

// ── Botanical background illustrations ──────────────────────
function BotanicalBg() {
  const items = [
    { src: '/images/bg/01.png',   top:'20%',  left:'10%',   size:100,  rotate:-15, opacity:.12 },
    { src: '/images/bg/02.png', top:'10%', left:'38%',  size:70,  rotate:10,  opacity:.1  },
    { src: '/images/bg/03.png',  top:'20%', left:'44%',  size:110, rotate:5,   opacity:.1  },
    { src: '/images/bg/04.png',   top:'8%',  left:'58%',  size:65,  rotate:-8,  opacity:.11 },
    { src: '/images/bg/05.png', top:'15%',  left:'82%',  size:80,  rotate:12,  opacity:.1  },
    { src: '/images/bg/06.png',     top:'35%', left:'90%',  size:75,  rotate:-10, opacity:.09 },
    { src: '/images/bg/07.png', top:'45%', left:'3%',   size:65,  rotate:20,  opacity:.1  },
    { src: '/images/bg/08.png', top:'55%', left:'15%',  size:85,  rotate:-20, opacity:.09 },
    { src: '/images/bg/09.png',   top:'60%', left:'85%',  size:70,  rotate:15,  opacity:.1  },
    { src: '/images/bg/10.png',   top:'55%', left:'55%',  size:80,  rotate:-5,  opacity:.09 },
    
  ]

  return (
    <>
      {items.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt=""
          aria-hidden="true"
          style={{
            position:   'absolute',
            top:        item.top,
            left:       item.left,
            width:      item.size,
            height:     item.size,
            objectFit:  'contain',
            opacity:    item.opacity,
            transform:  `rotate(${item.rotate}deg)`,
            pointerEvents: 'none',
            userSelect: 'none',
            filter:     'grayscale(20%)',
          }}
        />
      ))}
    </>
  )
}

export default function CategoryGrid() {
  return (
    <section className="px-4 md:px-0" style={{ padding: '36px 0 40px', background: '#f3f3c8', position: 'relative', overflow: 'hidden' }}>

      {/* Botanical background drawings */}
      <BotanicalBg />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-[5%]">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          style={{
            display:       'flex',
            alignItems:    'center',
            justifyContent:'space-between',
            marginBottom:  20,
            flexWrap:      'wrap',
            gap:           10,
          }}
        >
          <h2 style={{
            fontFamily:   '"Playfair Display", Georgia, serif',
            fontWeight:   900,
            fontSize:     'clamp(20px,2.8vw,32px)',
            lineHeight:   1.1,
            letterSpacing:'-0.02em',
            color:        '#1c2e1c',
            margin:       0,
          }}>
            Browse by{' '}
            <em style={{ color: '#2d6a4f', fontStyle: 'italic' }}>Category</em>
          </h2>

          <Link
            to="/products"
            style={{
              fontFamily:     '"Syne", sans-serif',
              fontWeight:     700,
              fontSize:       10.5,
              letterSpacing:  '.1em',
              textTransform:  'uppercase',
              color:          '#9a9288',
              textDecoration: 'none',
              borderBottom:   '1px solid #ccc6bc',
              paddingBottom:  2,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#2d6a4f'; e.currentTarget.style.borderColor = '#2d6a4f' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9a9288'; e.currentTarget.style.borderColor = '#ccc6bc' }}
          >
            All Products →
          </Link>
        </motion.div>

        {/* ── 6 cards in one line ── */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 md:gap-3">
          {CATS.map((cat, i) => (
            <CatCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
