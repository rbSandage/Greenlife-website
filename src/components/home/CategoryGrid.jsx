// src/components/home/CategoryGrid.jsx
//
// ─── HOW TO ADD PNG ICONS ────────────────────────────────────────────────────
//  In CATS array below, set the `png` field for each category:
//
//    png: '/images/categories/insecticide.png'
//    png: 'https://res.cloudinary.com/dzpenviyy/image/upload/v1/insecticide.png'
//
//  Recommended PNG size: 80×80px or 100×100px, transparent background
// ─────────────────────────────────────────────────────────────────────────────

import { useState }  from 'react'
import { Link }      from 'react-router-dom'
import { motion }    from 'framer-motion'

const CATS = [
  {
    slug:       'Insecticide',
    label:      'Insecticides',
    shortLabel: 'Insecticides',
    accent:     '#2d6a4f',
    tint:       '#eef7f2',
    border:     '#c0ddd0',
    png:        '/images/icons/Insecticide.png',   // ← '/images/categories/insecticide.png'
  },
  {
    slug:       'Fungicide',
    label:      'Fungicides',
    shortLabel: 'Fungicides',
    accent:     '#1e6091',
    tint:       '#eef4fb',
    border:     '#b8d4ec',
    png:        '/images/icons/fungicide.png',
  },
  {
    slug:       'Herbicide',
    label:      'Herbicides',
    shortLabel: 'Herbicides',
    accent:     '#9c4221',
    tint:       '#fdf3ee',
    border:     '#ecc8b4',
    png:        '/images/icons/herbicide.png',
  },
  {
    slug:       'Fertilizer',
    label:      'Fertilizers',
    shortLabel: 'Fertilizers',
    accent:     '#92660a',
    tint:       '#fdf8ee',
    border:     '#e8d4a0',
    png:        '/images/icons/fertilizer.png',
  },
  {
    slug:       'Bio-Pesticide',
    label:      'Bio Pesticides',
    shortLabel: 'Bio-Pest',
    accent:     '#3a7d44',
    tint:       '#eef8f1',
    border:     '#b8dcc0',
    png:        '/images/icons/biopesticides.png',
  },
  {
    slug:       'PGR',
    label:      'Growth Regulators',
    shortLabel: 'PGR',
    accent:     '#6b4c9a',
    tint:       '#f5f1fb',
    border:     '#cfc0e8',
    png:        '/images/icons/PGR.png',
  },
]

// ── Image size constants — change freely ──────────────────
const IMG_SIZE_MOBILE  = 72   // px — mobile icon size
const IMG_SIZE_DESKTOP = 96   // px — desktop icon size
// ──────────────────────────────────────────────────────────

function CatCard({ cat, index }) {
  const [hov, setHov]       = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const showPng = cat.png && !imgErr

  // track screen size
  useState(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  })

  const imgSize = isMobile ? IMG_SIZE_MOBILE : IMG_SIZE_DESKTOP

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
        {/* PNG image — no circle wrapper, full size */}
        <div style={{ width: imgSize, height: imgSize, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showPng ? (
            <img
              src={cat.png}
              alt={cat.label}
              onError={() => setImgErr(true)}
              style={{ width: imgSize, height: imgSize, objectFit: 'contain' }}
            />
          ) : (
            /* Placeholder — dashed circle with first letter */
            <div style={{
              width: imgSize, height: imgSize, borderRadius: '50%',
              border: `1.5px dashed ${cat.accent}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: hov ? cat.tint : '#f8f5f0',
            }}>
              <span style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700, fontSize: 18,
                color: `${cat.accent}88`,
              }}>
                {cat.label[0]}
              </span>
            </div>
          )}
        </div>

        {/* Category name */}
        <span className="text-[11px] md:text-[13px]" style={{
          fontFamily:    '"Playfair Display", Georgia, serif',
          fontWeight:    700,
          fontStyle:     'italic',
          lineHeight:    1.3,
          color:         hov ? cat.accent : '#2a3a2a',
          transition:    'color .3s',
          letterSpacing: '-0.01em',
        }}>
          <span className="inline md:hidden">{cat.shortLabel}</span>
          <span className="hidden md:inline">{cat.label}</span>
        </span>
      </Link>
    </motion.div>
  )
}

// ── Botanical background illustrations ──────────────────────
function BotanicalBg() {
  const items = [
    { src: '/images/bg/01.png', top:'20%', left:'10%',  size:100, rotate:-15, opacity:.12 },
    { src: '/images/bg/02.png', top:'10%', left:'38%',  size:70,  rotate:10,  opacity:.1  },
    { src: '/images/bg/03.png', top:'20%', left:'44%',  size:110, rotate:5,   opacity:.1  },
    { src: '/images/bg/04.png', top:'8%',  left:'58%',  size:65,  rotate:-8,  opacity:.11 },
    { src: '/images/bg/05.png', top:'15%', left:'82%',  size:80,  rotate:12,  opacity:.1  },
    { src: '/images/bg/06.png', top:'35%', left:'90%',  size:75,  rotate:-10, opacity:.09 },
    { src: '/images/bg/07.png', top:'45%', left:'3%',   size:65,  rotate:20,  opacity:.1  },
    { src: '/images/bg/08.png', top:'55%', left:'15%',  size:85,  rotate:-20, opacity:.09 },
    { src: '/images/bg/09.png', top:'60%', left:'85%',  size:70,  rotate:15,  opacity:.1  },
    { src: '/images/bg/10.png', top:'55%', left:'55%',  size:80,  rotate:-5,  opacity:.09 },
  ]
  return (
    <>
      {items.map((item, i) => (
        <img key={i} src={item.src} alt="" aria-hidden="true" style={{
          position: 'absolute', top: item.top, left: item.left,
          width: item.size, height: item.size, objectFit: 'contain',
          opacity: item.opacity, transform: `rotate(${item.rotate}deg)`,
          pointerEvents: 'none', userSelect: 'none', filter: 'grayscale(20%)',
        }} />
      ))}
    </>
  )
}

export default function CategoryGrid() {
  return (
    <section className="px-4 md:px-0" style={{ padding: '36px 0 40px', background: '#f3f3c8', position: 'relative', overflow: 'hidden' }}>

      <BotanicalBg />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-[5%]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20, flexWrap:'wrap', gap: 10 }}
        >
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 900, fontSize: 'clamp(20px,2.8vw,32px)',
            lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1c2e1c', margin: 0,
          }}>
            Browse by{' '}
            <em style={{ color: '#2d6a4f', fontStyle: 'italic' }}>Category</em>
          </h2>

          <Link to="/products" style={{
            fontFamily: '"Syne", sans-serif', fontWeight: 700,
            fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase',
            color: '#9a9288', textDecoration: 'none',
            borderBottom: '1px solid #ccc6bc', paddingBottom: 2,
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#2d6a4f'; e.currentTarget.style.borderColor = '#2d6a4f' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9a9288'; e.currentTarget.style.borderColor = '#ccc6bc' }}
          >
            All Products →
          </Link>
        </motion.div>

        {/* 6 cards */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 md:gap-3">
          {CATS.map((cat, i) => (
            <CatCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
