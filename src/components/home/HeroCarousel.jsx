// src/components/home/HeroCarousel.jsx
//
// ─── HOW TO ADD PNG PRODUCT IMAGES TO EACH SLIDE ─────────────────────────────
//
//  In the SLIDES array below, find the slide and set:
//
//    productImage: '/images/products/chlorpyrifos.png'
//    productImage: 'https://res.cloudinary.com/dzpenviyy/image/upload/v1/chlorpyrifos.png'
//
//  LOCAL FILES → put PNGs in /public/images/products/ and use '/images/products/file.png'
//  CLOUDINARY  → paste the full URL directly
//  TRANSPARENT background PNGs look best (product on white/transparent bg)
//
//  For slide background image/video:
//    image: '/images/hero/slide1.jpg'
//    video: '/videos/hero/slide1.mp4'
//  Leave empty ('') to keep the gradient.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'
import { Link }                                      from 'react-router-dom'
import { motion, AnimatePresence}                   from 'framer-motion'

// ═══════════════════════════════════════════════════════════
//  SLIDE DATA
// ═══════════════════════════════════════════════════════════
const SLIDES = [
  {
    id: 1,

    // Slide background
    image:          '',
    video:          '',
    bg:             'linear-gradient(160deg,#071209 0%,#0d2112 55%,#091808 100%)',
    overlayOpacity: 0.62,
    overlayColor:   '#061108',

    // Left column text
    eyebrow:    'Bestseller · Insecticide',
    dotColor:   '#c4883a',
    heading:    ['Complete Pest', 'Control for', 'Every Indian Farm'],
    accentLine: 'Every crop. Every season.',
    body:       'Chlorpyrifos 20% EC — CIB-registered, broad-spectrum contact insecticide. Fast knockdown with long residual protection across 40+ crop types.',
    btnLabel:   'Explore Products',
    btnBg:      '#1a6b3c',
    btnLink:    '/products',
    ghostLabel: 'Get Free Advisory',
    ghostLink:  '/contact',

    // Right column — product card
    // ↓ Replace with your PNG path or URL
    productImage: '/images/hero/KADU.png',   // '/images/products/chlorpyrifos.png'
    badge:    '🔥 Bestseller · 10,000+ Sold',
    accent:   '#72b83e',
    accentLt: '#a8d878',
    ringColor:'rgba(114,184,62,.35)',
    cropBg:   'rgba(114,184,62,.12)',
    cropBdr:  'rgba(114,184,62,.28)',
    category: 'Insecticide',
    name:     'Dr.Future Kadu',
    specs:    [['Active', 'Chlorpyrifos 20%'], ['Dosage', '2 ml / L'], ['Form', 'EC'], ['Pack', '250ml–5L']],
    crops:    ['Cotton', 'Rice', 'Wheat', 'Soybean'],
  },
  {
    id: 2,

    image:          '',
    video:          '',
    bg:             'linear-gradient(160deg,#130d03 0%,#1d1504 55%,#0f1a0a 100%)',
    overlayOpacity: 0.60,
    overlayColor:   '#100a02',

    eyebrow:    'Universal · Fertilizer',
    dotColor:   '#daa84e',
    heading:    ['Balanced Nutrition', 'for Every Crop,', 'Every Season'],
    accentLine: 'Foliar. Drip. Proven.',
    body:       'NPK 19:19:19 — Fully water-soluble balanced fertilizer. Proven to boost yield by 30% in one season across all vegetable, fruit and field crops.',
    btnLabel:   'Explore Products',
    btnBg:      '#b8772a',
    btnLink:    '/products',
    ghostLabel: 'Download Brochure',
    ghostLink:  '/contact',

    productImage: '/images/hero/orange.png',   // '/images/products/npk.png'
    badge:    '🌾 Universal · All Crops',
    accent:   '#daa84e',
    accentLt: '#f0c878',
    ringColor:'rgba(218,168,78,.35)',
    cropBg:   'rgba(218,168,78,.12)',
    cropBdr:  'rgba(218,168,78,.28)',
    category: 'Fertilizer',
    name:     'Dr.Future Zinc',
    specs:    [['Ratio', '19:19:19'], ['Dosage', '3–5 g / L'], ['Form', 'WSP'], ['Pack', '500g–5kg']],
    crops:    ['Vegetables', 'Fruits', 'Pulses', 'All Crops'],
  },
  {
    id: 3,

    image:          '',
    video:          '',
    bg:             'linear-gradient(160deg,#060e14 0%,#0b1820 55%,#081409 100%)',
    overlayOpacity: 0.62,
    overlayColor:   '#040a08',

    eyebrow:    'Top Rated · Fungicide',
    dotColor:   '#34d399',
    heading:    ['Stop Blight Before', 'It Destroys', 'Your Harvest'],
    accentLine: 'Protective. Preventive. Proven.',
    body:       'Mancozeb 75% WP — Multi-site protective fungicide. Prevents early blight, late blight and downy mildew. Trusted by 5,000+ vegetable farmers.',
    btnLabel:   'Explore Products',
    btnBg:      '#1d7a50',
    btnLink:    '/products',
    ghostLabel: 'Get Expert Advice',
    ghostLink:  '/contact',

    productImage: '/images/hero/KADU.png',   // '/images/products/mancozeb.png'
    badge:    '⭐ Top Rated · Most Loved',
    accent:   '#34d399',
    accentLt: '#5de8bb',
    ringColor:'rgba(52,211,153,.35)',
    cropBg:   'rgba(52,211,153,.12)',
    cropBdr:  'rgba(52,211,153,.28)',
    category: 'Fungicide',
    name:     'Dr.Future Combi',
    specs:    [['Active', 'Mancozeb 75%'], ['Dosage', '2 g / L'], ['Form', 'WP'], ['Pack', '100g–1kg']],
    crops:    ['Tomato', 'Potato', 'Grapes', 'Onion'],
  },
]

// ═══════════════════════════════════════════════════════════
//  CROP DECORATIONS — per-slide edge PNG images
//
//  Drop your transparent PNGs into /public/images/crops/
//  e.g.  /public/images/crops/cotton.png
//        /public/images/crops/rice.png  etc.
//
//  Each slide shows its own crop images at left / right edges.
//  Opacity is intentionally low (0.18–0.28) so they feel like
//  a background texture, not foreground elements.
// ═══════════════════════════════════════════════════════════

// Map each slide id → crop images positioned around the hero
const SLIDE_CROP_DECOR = {
  1: [
    // left edge
    { src: '/images/crops/cotton.png',  top: '10%', left: '0%',   width: 120, rot: -10, opacity: 0.22, side: 'left'  },
    { src: '/images/crops/rice.png',    top: '55%', left: '1%',   width: 100, rot:   8, opacity: 0.18, side: 'left'  },
    // right edge (behind product card area — very subtle)
    { src: '/images/crops/wheat.png',   top: '8%',  right: '0%',  width: 110, rot:  12, opacity: 0.15, side: 'right' },
    { src: '/images/crops/soybean.png', top: '62%', right: '1%',  width: 95,  rot:  -8, opacity: 0.18, side: 'right' },
  ],
  2: [
    { src: '/images/crops/vegetables.png', top: '8%',  left: '0%',  width: 130, rot: -12, opacity: 0.20, side: 'left'  },
    { src: '/images/crops/fruits.png',     top: '58%', left: '1%',  width: 105, rot:   6, opacity: 0.18, side: 'left'  },
    { src: '/images/crops/pulses.png',     top: '6%',  right: '0%', width: 115, rot:  10, opacity: 0.15, side: 'right' },
    { src: '/images/crops/maize.png',      top: '60%', right: '1%', width: 100, rot:  -6, opacity: 0.16, side: 'right' },
  ],
  3: [
    { src: '/images/crops/tomato.png',  top: '12%', left: '0%',  width: 110, rot: -14, opacity: 0.24, side: 'left'  },
    { src: '/images/crops/potato.png',  top: '58%', left: '1%',  width: 100, rot:   9, opacity: 0.20, side: 'left'  },
    { src: '/images/crops/grapes.png',  top: '8%',  right: '0%', width: 120, rot:  12, opacity: 0.16, side: 'right' },
    { src: '/images/crops/onion.png',   top: '60%', right: '1%', width: 95,  rot:  -9, opacity: 0.18, side: 'right' },
  ],
}

function CropDecorations({ slide }) {
  const items = SLIDE_CROP_DECOR[slide.id] || []
  return (
    <>
      {items.map((item, i) => (
        <motion.img
          key={`${slide.id}-${i}`}
          src={item.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          initial={{ opacity: 0, scale: 0.82, x: item.side === 'left' ? -30 : 30 }}
          animate={{ opacity: item.opacity, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position:      'absolute',
            top:           item.top,
            left:          item.left  || 'auto',
            right:         item.right || 'auto',
            width:         item.width,
            transform:     `rotate(${item.rot}deg)`,
            pointerEvents: 'none',
            userSelect:    'none',
            zIndex:        4,
            filter:        `drop-shadow(0 8px 24px rgba(0,0,0,0.55))
                            drop-shadow(0 0 12px ${slide.accent}22)`,
            // On mobile hide them so they don't clutter small screens
          }}
          className="hidden md:block"
          // Fallback: if PNG missing, img simply won't render (no broken icon shown)
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      ))}
    </>
  )
}

// ═══════════════════════════════════════════════════════════
//  SLIDE BACKGROUND — video / image / gradient orbs
// ═══════════════════════════════════════════════════════════
function SlideBackground({ slide }) {
  const Overlay = () => (
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: slide.overlayColor, opacity: slide.overlayOpacity, zIndex: 2 }} />
  )

  if (slide.video) return (
    <>
      <video key={slide.video} src={slide.video} autoPlay muted loop playsInline
        aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 1 }} />
      <Overlay />
    </>
  )

  if (slide.image) return (
    <>
      <motion.div key={slide.image}
        initial={{ scale: 1.06, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.02, opacity: 0 }} transition={{ duration: 1.1, ease: [.22, 1, .36, 1] }}
        className="absolute inset-0"
        style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 }} />
      <Overlay />
    </>
  )

  // Gradient — floating ambient orbs
  return (
    <>
      <div className="absolute pointer-events-none" style={{
        width: 520, height: 520, borderRadius: '50%', zIndex: 1,
        background: 'radial-gradient(circle,rgba(77,140,86,.13),transparent)',
        top: '-18%', left: '-12%', filter: 'blur(70px)',
        animation: 'heroFloat 9s ease-in-out infinite',
      }} />
      <div className="absolute pointer-events-none" style={{
        width: 300, height: 300, borderRadius: '50%', zIndex: 1,
        background: 'radial-gradient(circle,rgba(196,136,58,.08),transparent)',
        bottom: '8%', right: '10%', filter: 'blur(60px)',
        animation: 'heroFloat 11s ease-in-out infinite reverse',
      }} />
    </>
  )
}

// ═══════════════════════════════════════════════════════════
//  ANNOTATION PILL — floating label with + dot
// ═══════════════════════════════════════════════════════════
//
//  ANNOTATION POSITIONS (in a 500 × 520 SVG coordinate space)
//  Each entry: { pill position %, line origin on bottle, side }
//
//  specs[0] → top-right    specs[1] → bottom-right
//  specs[2] → bottom-left  specs[3] → top-left
//
const ANNOT_CONFIG = [
  // [pillLeft%, pillTop%, lineFromX, lineFromY, align]
  { pl:'62%', pt:'4%',  fx:320, fy:105, align:'left'  },  // top-right
  { pl:'72%', pt:'72%', fx:330, fy:400, align:'left'  },  // bottom-right
  { pl:'2%',  pt:'68%', fx:165, fy:390, align:'right' },  // bottom-left
  { pl:'2%',  pt:'12%', fx:168, fy:118, align:'right' },  // top-left
]

function AnnotPill({ label, sub, accent, align, delay }) {
  return (
    <motion.div
      initial={{ opacity:0, scale:.8 }}
      animate={{ opacity:1, scale:1  }}
      transition={{ duration:.5, delay, ease:[.22,1,.36,1] }}
      style={{
        display:'flex', alignItems:'center',
        gap:7,
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
      }}
    >
      {/* + dot */}
      <div style={{
        width:22, height:22, borderRadius:'50%', flexShrink:0,
        background:'rgba(255,255,255,.08)',
        border:`1.5px solid ${accent}88`,
        display:'flex', alignItems:'center', justifyContent:'center',
        backdropFilter:'blur(6px)',
      }}>
        <span style={{ color:accent, fontSize:13, lineHeight:1, fontWeight:700 }}>+</span>
      </div>
      {/* Label glass pill */}
      <div style={{
        background:'rgba(8,20,10,.72)',
        backdropFilter:'blur(16px)',
        border:`1px solid ${accent}44`,
        borderRadius:10,
        padding:'6px 12px',
        textAlign: align === 'right' ? 'right' : 'left',
        whiteSpace:'nowrap',
      }}>
        <div style={{ fontSize:8, fontWeight:700, letterSpacing:'.14em',
          textTransform:'uppercase', color:accent, lineHeight:1.3 }}>
          {label}
        </div>
        <div style={{ fontSize:11, fontWeight:600, color:'rgba(238,246,238,.9)', lineHeight:1.4 }}>
          {sub}
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════
//  PRODUCT SHOWCASE — full image + dotted-line annotations
// ═══════════════════════════════════════════════════════════
function ProductCard({ slide }) {
  const [imgErr, setImgErr] = useState(false)
  const showImg = slide.productImage && !imgErr

  // Map specs to 4 annotation positions
  const annots = slide.specs.slice(0, 4).map(([k, v], i) => ({
    ...ANNOT_CONFIG[i], label: k, sub: v,
  }))

  return (
    <motion.div
      key={slide.id}
      initial={{ opacity:0, x:40, scale:.97 }}
      animate={{ opacity:1, x:0,  scale:1   }}
      exit={{    opacity:0, x:-24, scale:.97 }}
      transition={{ duration:.7, ease:[.22,1,.36,1] }}
      style={{ position:'relative', height:520, width:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}
    >

      {/* ── Radial glow behind bottle ── */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:320, height:320, borderRadius:'50%',
        background:`radial-gradient(circle, ${slide.accent}28, transparent 70%)`,
        filter:'blur(40px)',
        pointerEvents:'none',
        zIndex:8,
      }}/>

      {/* ── SVG dotted lines layer ── */}
      <svg
        viewBox="0 0 500 520"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          pointerEvents:'none', zIndex:5,
          overflow:'visible',
        }}
      >
        {annots.map((a, i) => (
          <motion.line
            key={i}
            x1={a.fx} y1={a.fy}
            x2={
              i === 0 ? 360 :
              i === 1 ? 355 :
              i === 2 ? 60  : 58
            }
            y2={
              i === 0 ? 38  :
              i === 1 ? 388 :
              i === 2 ? 374 : 88
            }
            stroke={slide.accent}
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity=".45"
            initial={{ pathLength:0, opacity:0 }}
            animate={{ pathLength:1, opacity:1 }}
            transition={{ duration:.8, delay: .3 + i*.12 }}
          />
        ))}

        {/* Bottom ground shadow ellipse */}
        <ellipse cx="250" cy="488" rx="90" ry="10"
          fill={slide.accent} fillOpacity=".08"/>
      </svg>

      {/* ── Product image ── */}
      {showImg ? (
        <img
          src={slide.productImage}
          alt={slide.name}
          onError={() => setImgErr(true)}
          style={{
            position:'relative',
            height:520, 
            width:'auto', 
            maxWidth:'100%',
            objectFit:'contain',
            animation:'productFloat 4s ease-in-out infinite',
            filter:`drop-shadow(0 32px 48px rgba(0,0,0,.85))
                    drop-shadow(0 0 48px ${slide.accent}44)`,
            zIndex:10,
          }}
        />
      ) : (
        /* Placeholder */
        <div style={{
          display:'flex', flexDirection:'column',
          alignItems:'center', gap:12, zIndex:10, opacity:.45,
        }}>
          <div style={{
            width:140, height:200, borderRadius:20,
            background:`${slide.accent}10`,
            border:`2px dashed ${slide.accent}44`,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', gap:10,
          }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <rect x="14" y="4" width="24" height="44" rx="6"
                stroke={slide.accent} strokeWidth="1.6" fill={`${slide.accent}12`}/>
              <rect x="18" y="1" width="16" height="6" rx="3"
                stroke={slide.accent} strokeWidth="1.4" fill="none"/>
              <rect x="16" y="18" width="20" height="18" rx="3"
                fill={`${slide.accent}20`} stroke={`${slide.accent}44`} strokeWidth="1"/>
            </svg>
            <span style={{
              fontSize:8, fontWeight:700, letterSpacing:'.16em',
              textTransform:'uppercase', color:slide.accent,
              textAlign:'center', padding:'0 8px',
            }}>
              Set productImage<br/>in SLIDES array
            </span>
          </div>
        </div>
      )}

      {/* ── Floating annotation pills ── */}
      {annots.map((a, i) => (
        <div
          key={i}
          style={{
            position:'absolute',
            left: a.pl, top: a.pt,
            zIndex:20,
            transform: a.align === 'right'
              ? 'translateX(0)'
              : 'translateX(0)',
          }}
        >
          <AnnotPill
            label={a.label}
            sub={a.sub}
            accent={slide.accent}
            align={a.align}
            delay={.4 + i*.1}
          />
        </div>
      ))}

      {/* ── Product name + badge strip at bottom ── */}
      <motion.div
        initial={{ opacity:0, y:16 }}
        animate={{ opacity:1, y:0  }}
        transition={{ duration:.6, delay:.2 }}
        style={{
          position:'absolute', bottom:0, left:0, right:0,
          zIndex:20,
          display:'flex', alignItems:'center',
          justifyContent:'space-between', gap:10,
        }}
      >
        {/* Name */}
        <h3 className="font-display font-bold text-white leading-none"
          style={{ fontSize:'clamp(14px,1.4vw,18px)', margin:0 }}>
          {slide.name}
        </h3>

        {/* Crop pills */}
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'flex-end' }}>
          {slide.crops.slice(0,3).map(c => (
            <span key={c} style={{
              fontSize:8.5, fontWeight:600, padding:'3px 9px',
              borderRadius:999,
              color:slide.accent,
              background:slide.cropBg,
              border:`1px solid ${slide.cropBdr}`,
            }}>{c}</span>
          ))}
        </div>
      </motion.div>

    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════
//  SLIDE COUNTER  (top-right)
// ═══════════════════════════════════════════════════════════
function SlideCounter({ cur, total }) {
  return (
    <div className="hidden md:flex absolute top-6 right-6 z-30 items-center gap-2.5 select-none">
      <span className="font-display font-bold text-white" style={{ fontSize: 22, lineHeight: 1 }}>
        {String(cur + 1).padStart(2, '0')}
      </span>
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.2)' }} />
      <span className="font-sans font-medium" style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>
        {String(total).padStart(2, '0')}
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════════════════════════
const SLIDE_DURATION = 6000
const GRID_STYLE = {
  backgroundImage: `linear-gradient(rgba(114,184,62,.022) 1px,transparent 1px),
                    linear-gradient(90deg,rgba(114,184,62,.022) 1px,transparent 1px)`,
  backgroundSize: '72px 72px',
}

export default function HeroCarousel() {
  const [cur, setCur] = useState(0)
  const [pct, setPct] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const startTimer = useCallback((idx) => {
    clearInterval(timer.current)
    setCur(idx)
    setPct(0)
    let elapsed = 0
    timer.current = setInterval(() => {
      elapsed += 60
      setPct(Math.min((elapsed / SLIDE_DURATION) * 100, 100))
      if (elapsed >= SLIDE_DURATION) {
        elapsed = 0
        setCur(c => (c + 1) % SLIDES.length)
      }
    }, 60)
  }, [])

  useEffect(() => { startTimer(0); return () => clearInterval(timer.current) }, [startTimer])

  const goTo = (i) => startTimer(i)
  const prev = ()  => startTimer((cur - 1 + SLIDES.length) % SLIDES.length)
  const next = ()  => startTimer((cur + 1) % SLIDES.length)
  const slide = SLIDES[cur]

  return (
    <section
      aria-label="Hero product carousel"
      className="relative overflow-hidden"
      style={{ height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? 560 : 640, paddingTop: 64, background: slide.bg, transition: 'background 1s ease' }}
    >

      {/* Layer 1 — background */}
      <AnimatePresence mode="wait">
        <SlideBackground key={`bg-${slide.id}`} slide={slide} />
      </AnimatePresence>

      {/* Layer 2 — grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ ...GRID_STYLE, zIndex: 3 }} />

      {/* Layer 2.5 — crop / vegetable PNG decorations (left & right edges only) */}
      <AnimatePresence mode="wait">
        <CropDecorations key={`crops-${slide.id}`} slide={slide} />
      </AnimatePresence>

      {/* Layer 3 — decorative SVG arcs */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3 }} viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
        <path d="M-50 600 Q350 200 700 350 Q1050 500 1450 150"
          stroke="rgba(114,184,62,.05)" strokeWidth="1.5" fill="none" strokeDasharray="400"
          style={{ strokeDashoffset: 400, animation: 'drawLine 2.5s ease-out forwards' }} />
        <circle cx="700" cy="350" r="220" stroke="rgba(114,184,62,.03)"  strokeWidth="1" fill="none" />
        <circle cx="700" cy="350" r="380" stroke="rgba(114,184,62,.018)" strokeWidth="1" fill="none" />
      </svg>

      {/* Slide counter */}
      <SlideCounter cur={cur} total={SLIDES.length} />

      {/* Layer 4 — main content */}
      <div className="relative h-full max-w-[1200px] mx-auto px-4 md:px-[5%] flex items-center py-4 lg:py-0" style={{ zIndex: 10, overflow: 'visible' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 w-full items-center">

          {/* MOBILE: image first, then text. DESKTOP: text left only (image right handled below) */}
          <motion.div
            key={`txt-${slide.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: .8, ease: [.22, 1, .36, 1] }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >

            {/* ── MOBILE product image — TOP (hidden on desktop) ── */}
            {slide.productImage && (
              <motion.div
                key={`mob-img-${slide.id}`}
                initial={{ opacity: 0, scale: .9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .6, delay: .15, ease: [.22, 1, .36, 1] }}
                className="lg:hidden flex flex-col items-center mb-3"
              >
                {/* Glow + image */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 240, height: 240, borderRadius: '50%',
                    background: `radial-gradient(circle, ${slide.accent}28, transparent 70%)`,
                    filter: 'blur(36px)', pointerEvents: 'none',
                  }}/>
                  <img
                    src={slide.productImage}
                    alt={slide.name}
                    style={{
                      height: 'clamp(220px,40VscWand,320px)',
                      width: 'auto',
                      maxWidth: '75vw',
                      objectFit: 'contain',
                      animation: 'productFloat 4s ease-in-out infinite',
                      filter: `drop-shadow(0 20px 32px rgba(0,0,0,.7)) drop-shadow(0 0 32px ${slide.accent}44)`,
                      position: 'relative', zIndex: 2,
                      display: 'block',
                    }}
                  />
                </div>
                {/* Name + crop pills */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  <span className="font-display font-bold text-white" style={{ fontSize: 13 }}>{slide.name}</span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {slide.crops.slice(0, 2).map(c => (
                      <span key={c} style={{
                        fontSize: 9, fontWeight: 600, padding: '3px 9px', borderRadius: 999,
                        color: slide.accent, background: slide.cropBg, border: `1px solid ${slide.cropBdr}`,
                      }}>{c}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Eyebrow ── */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1.5 md:mb-5">
              <span className="w-[4px] h-[4px] rounded-full"
                style={{ background: slide.dotColor, animation: 'pulseDot 2s ease-in-out infinite' }} />
              <span className="font-heading font-bold tracking-[.18em] uppercase"
                style={{ fontSize: 9, color: slide.dotColor }}>
                {slide.eyebrow}
              </span>
            </div>

            {/* ── Heading ── */}
            <h1 className="font-display font-bold text-white leading-[1.1] tracking-[-0.02em] mb-1.5 md:mb-4"
              style={{ fontSize: 'clamp(18px,5.2vw,74px)' }}>
              <span className="lg:hidden">{slide.heading[0]} {slide.heading[1]} </span>
              <span className="hidden lg:inline">{slide.heading[0]}<br />{slide.heading[1]}<br /></span>
              <span style={{ color: '#52c786' }}>{slide.heading[2]}</span>
            </h1>

            {/* ── Accent line ── */}
            <p className="font-heading font-bold tracking-[.16em] uppercase mb-1 md:mb-3"
              style={{ fontSize: 9, color: `${slide.dotColor}99` }}>
              {slide.accentLine}
            </p>

            {/* ── Body ── */}
            <p className="font-sans leading-[1.6] mb-3 md:mb-8 max-w-[420px] mx-auto lg:mx-0"
              style={{ fontSize: 11, color: "rgba(238,246,238,.42)" }}>
              {slide.body}
            </p>

            {/* ── Buttons ── */}
            <div className="flex flex-row gap-2 justify-center lg:justify-start">
              <Link to={slide.btnLink}
                className="inline-flex items-center justify-center gap-1.5 text-white font-heading font-bold text-[10px] md:text-sm px-4 py-2 md:px-5 md:py-3.5 rounded-lg no-underline transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: slide.btnBg, boxShadow: `0 4px 20px ${slide.btnBg}66` }}>
                {slide.btnLabel} →
              </Link>
              <Link to={slide.ghostLink}
                className="inline-flex items-center justify-center gap-1.5 font-sans font-medium text-[10px] md:text-sm px-4 py-2 md:px-5 md:py-3.5 rounded-lg no-underline transition-all duration-200 border"
                style={{ color: 'rgba(238,246,238,.5)', borderColor: 'rgba(238,246,238,.14)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(82,199,134,.4)'; e.currentTarget.style.color = '#eef6ee' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(238,246,238,.14)'; e.currentTarget.style.color = 'rgba(238,246,238,.5)' }}>
                {slide.ghostLabel}
              </Link>
            </div>

          </motion.div>

          {/* RIGHT — full annotated card (desktop only) */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              <ProductCard key={`card-${slide.id}`} slide={slide} />
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Prev / Next — vertically centered always */}
      <button onClick={prev} aria-label="Previous slide"
        className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M8 2L3.5 6.5L8 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button onClick={next} aria-label="Next slide"
        className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M5 2L9.5 6.5L5 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
            className="h-[3px] rounded-full transition-all duration-300"
            style={{ width: i === cur ? 32 : 6, background: i === cur ? '#52c786' : 'rgba(255,255,255,.25)' }} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] z-20"
        style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#1a6b3c,#52c786)', transition: 'none' }} />

      {/* Keyframes */}
      <style>{`
        @keyframes drawLine    { from { stroke-dashoffset:400 } to { stroke-dashoffset:0 } }
        @keyframes heroFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulseDot    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes productFloat{ 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.02)} }
      `}</style>
    </section>
  )
}
