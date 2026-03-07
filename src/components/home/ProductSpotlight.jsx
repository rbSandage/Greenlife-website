// src/components/home/ProductSpotlight.jsx
//
// ─── PRODUCT IMAGES ──────────────────────────────────────────────────────────
//  Add image paths matching exact product name:
//  'Dr.Kadu': '/images/products/drkadu.png'
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { Link }                from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
// ─── IMAGE SIZE CONTROLS ─────────────────────────────────────────────────────
const IMG_MAX_HEIGHT     = 360   // desktop image height (px)  ← adjust freely
const IMG_MAX_WIDTH      = 320   // desktop image max width (px)
const IMG_MAX_HEIGHT_MOB = 260   // mobile image height (px)   ← adjust freely
const IMG_MAX_WIDTH_MOB  = 240   // mobile image max width (px)
const ZONE_HEIGHT_DESK   = 360   // desktop left panel height (px)
const ZONE_HEIGHT_MOB    = 240   // mobile top panel height (px)
// ─────────────────────────────────────────────────────────────────────────────



const PRODUCT_IMAGES = {
  'Dr.Kadu':        '/images/hero/KADU.png',
  'Dr.Future Zinc': '/images/hero/orange.png',
  'Future Combi':   '/images/hero/KADU.png',
  'NPK 19:19:19':   '/images/hero/orange.png',
  'Humic':          '/images/hero/orange.png',
}

const PRODUCTS = [
  {
    cat: 'Insecticide', name: 'Dr.Kadu', badge: 'Bestseller',
    desc: 'Broad-spectrum contact insecticide with fast knockdown and long residual action. Controls sucking and chewing pests across 40+ crop types.',
    active: 'Neem 20%', dosage: '2 ml / Litre', pack: '250ml – 5L',
    crops: ['Cotton', 'Rice', 'Wheat', 'Soybean'],
    accent: '#1a6b3c', light: '#e8f5e9', mid: '#a5d6a7',
  },
  {
    cat: 'Herbicide', name: 'Dr.Future Zinc', badge: 'Top Rated',
    desc: 'Systemic post-emergence herbicide. Eliminates all annual and perennial weeds through complete root-to-tip translocation in one application.',
    active: 'Zinc 41%', dosage: '1.6 L / Acre', pack: '500ml – 5L',
    crops: ['Soybean', 'Maize', 'Sugarcane', 'Wheat'],
    accent: '#92400e', light: '#fef3c7', mid: '#fcd34d',
  },
  {
    cat: 'Fungicide', name: 'Future Combi', badge: 'Most Loved',
    desc: 'Multi-site protective fungicide preventing early blight, late blight and downy mildew before they establish and destroy your vegetable yield.',
    active: '75%', dosage: '2 g / Litre', pack: '100g – 1kg',
    crops: ['Tomato', 'Potato', 'Grapes', 'Onion'],
    accent: '#1e5f8e', light: '#eff6ff', mid: '#93c5fd',
  },
  {
    cat: 'Fertilizer', name: 'NPK 19:19:19', badge: 'Universal',
    desc: 'Perfectly balanced water-soluble fertilizer for foliar spray and drip irrigation. Proven to boost yield by 30% in a single growing season.',
    active: 'N:P:K 19:19:19', dosage: '3–5 g / Litre', pack: '500g – 5kg',
    crops: ['Vegetables', 'Fruits', 'Pulses', 'Field Crops'],
    accent: '#78350f', light: '#fdf4e7', mid: '#f0b429',
  },
  {
    cat: 'Insecticide', name: 'Humic', badge: 'New Arrival',
    desc: 'Systemic neonicotinoid absorbed into plant tissue — controls whitefly, thrips and aphids from inside out before they become a problem.',
    active: 'Humic 97.8%', dosage: '0.5 ml / Litre', pack: '100ml – 1L',
    crops: ['Cotton', 'Chilli', 'Tomato', 'Brinjal'],
    accent: '#5b21b6', light: '#f5f3ff', mid: '#c4b5fd',
  },
]

const INTERVAL = 4500

function BottleSVG({ accent, light }) {
  return (
    <svg viewBox="0 0 100 180" fill="none" width="90" height="162">
      <rect x="34" y="10" width="32" height="12" rx="4" fill={light} stroke={accent} strokeWidth="1.5"/>
      <path d="M40 22V36C30 41 24 54 24 72V158C24 163 28 167 36 167H64C72 167 76 163 76 158V72C76 54 70 41 60 36V22"
        fill={light} stroke={accent} strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="28" y="80" width="44" height="52" rx="4" fill={accent} stroke={accent} strokeWidth="1" opacity=".25"/>
      <path d="M50 106C50 106 38 100 36 88C44 86 50 96 50 104C50 96 56 86 64 88C62 100 50 106 50 106Z"
        fill={accent} opacity=".5"/>
      <rect x="38" y="12" width="6" height="8" rx="2" fill={accent} opacity=".2"/>
    </svg>
  )
}

export default function ProductSpotlight() {
  const [active, setActive]     = useState(0)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-advance + progress bar
  useEffect(() => {
    setProgress(0)
    const step = 50
    const inc  = (step / INTERVAL) * 100
    const prog = setInterval(() => setProgress(p => Math.min(p + inc, 100)), step)
    const adv  = setInterval(() => {
      setActive(i => (i + 1) % PRODUCTS.length)
      setProgress(0)
    }, INTERVAL)
    return () => { clearInterval(prog); clearInterval(adv) }
  }, [active])

  const p = PRODUCTS[active]
  const imgSrc = PRODUCT_IMAGES[p.name]
  const [imgErr, setImgErr] = useState(false)
  const showImg = imgSrc && !imgErr

  return (
    <section
      aria-labelledby="spot-heading"
      style={{ padding: isMobile ? '44px 0 52px' : '72px 0 80px', background: '#f0ebe0' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-[5%]">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .55 }}
          className="flex justify-between items-end flex-wrap gap-3"
          style={{ marginBottom: isMobile ? 18 : 28 }}
        >
          <div>
            <div className="section-label">Star Products</div>
            <h2 id="spot-heading" className="section-title" style={{ margin: 0 }}>
              Our Most{' '}
              <em className="font-display italic" style={{ color: '#1a6b3c' }}>Trusted Range</em>
            </h2>
          </div>
          <Link
            to="/products"
            className="font-heading font-bold uppercase no-underline transition-colors duration-200"
            style={{ fontSize: 11, letterSpacing: '.1em', color: '#6b8f72', borderBottom: '1px solid #b8d4bc', paddingBottom: 2 }}
            onMouseEnter={e => { e.currentTarget.style.color='#1a6b3c'; e.currentTarget.style.borderColor='#1a6b3c' }}
            onMouseLeave={e => { e.currentTarget.style.color='#6b8f72'; e.currentTarget.style.borderColor='#b8d4bc' }}
          >
            View All Products →
          </Link>
        </motion.div>

        {/* ── Showcase card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6, delay: .1 }}
          style={{
            background:          '#ffffff',
            borderRadius:        isMobile ? 16 : 24,
            border:              '1px solid #d4e8d8',
            overflow:            'hidden',
            boxShadow:           '0 4px 32px rgba(26,107,60,.08)',
            display:             'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1.7fr',
          }}
        >
          {/* ── IMAGE ZONE ── */}
          <div style={{
            background:     p.light,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        isMobile ? '28px 20px' : '40px 24px',
            position:       'relative',
            overflow:       'hidden',
            height:         isMobile ? ZONE_HEIGHT_MOB : ZONE_HEIGHT_DESK,
            transition:     'background .4s',
          }}>
            {/* Soft glow */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(circle at 50% 60%, ${p.accent}18, transparent 70%)`,
              transition: 'all .4s',
            }}/>

            {/* Leaf corners */}
            <svg style={{ position:'absolute', top:-8, right:-8, opacity:.12, pointerEvents:'none' }}
              viewBox="0 0 110 110" width={isMobile ? 80 : 110} height={isMobile ? 80 : 110} fill="none">
              <path d="M55 105C55 105 5 75 5 40C5 15 25 5 55 15C85 5 105 15 105 40C105 75 55 105 55 105Z"
                fill={p.accent} stroke={p.accent} strokeWidth="1"/>
            </svg>
            <svg style={{ position:'absolute', bottom:-6, left:-6, opacity:.08, pointerEvents:'none' }}
              viewBox="0 0 80 80" width={isMobile ? 60 : 80} height={isMobile ? 60 : 80} fill="none">
              <path d="M40 76C40 76 4 56 4 30C4 12 18 4 40 12C62 4 76 12 76 30C76 56 40 76 40 76Z"
                fill={p.accent} stroke={p.accent} strokeWidth="1"/>
            </svg>

            {/* Product image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: .85, y: 16 }}
                animate={{ opacity: 1, scale: 1,   y: 0  }}
                exit={{    opacity: 0, scale: .9,  y: -8  }}
                transition={{ duration: .5, ease: [.22, 1, .36, 1] }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                {showImg ? (
                  <img
                    src={imgSrc}
                    alt={p.name}
                    onError={() => setImgErr(true)}
                    style={{
                      maxHeight:  isMobile ? IMG_MAX_HEIGHT_MOB : IMG_MAX_HEIGHT,
                      maxWidth:   isMobile ? IMG_MAX_WIDTH_MOB  : IMG_MAX_WIDTH,
                      width:      'auto',
                      height:     'auto',
                      objectFit:  'contain',
                      filter:     'drop-shadow(0 20px 36px rgba(0,0,0,.14))',
                    }}
                  />
                ) : (
                  <BottleSVG accent={p.accent} light={p.light} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'#e0eae2' }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: p.accent,
                transition: 'width .05s linear, background .4s',
                borderRadius: '0 2px 2px 0',
              }}/>
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div style={{
            padding:        isMobile ? '22px 18px 26px' : '36px 40px 36px 36px',
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'center',
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={p.name}
                initial={{ opacity:0, y: isMobile ? 10 : 0, x: isMobile ? 0 : 16 }}
                animate={{ opacity:1, y: 0, x: 0 }}
                exit={{    opacity:0, y: isMobile ? -8 : 0, x: isMobile ? 0 : -10 }}
                transition={{ duration: .38, ease: [.22, 1, .36, 1] }}
              >
                {/* Category + badge */}
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <span style={{
                    fontFamily:'"Syne",sans-serif', fontWeight:700,
                    fontSize:9, letterSpacing:'.2em', textTransform:'uppercase', color:p.accent,
                  }}>{p.cat}</span>
                  <span style={{ width:3, height:3, borderRadius:'50%', background:'#c8d8ca' }}/>
                  <span style={{
                    fontFamily:'"Syne",sans-serif', fontWeight:700,
                    fontSize:8.5, letterSpacing:'.12em', textTransform:'uppercase',
                    color:'#fff', background:p.accent, padding:'3px 9px', borderRadius:999,
                  }}>{p.badge}</span>
                </div>

                {/* Name */}
                <h3 style={{
                  fontFamily:'"Playfair Display",Georgia,serif', fontWeight:900,
                  fontSize: isMobile ? 'clamp(18px,5.5vw,24px)' : 'clamp(20px,2.2vw,28px)',
                  lineHeight:1.15, letterSpacing:'-0.01em', color:'#0d2a14',
                  margin:'0 0 8px',
                }}>{p.name}</h3>

                {/* Description */}
                <p style={{
                  fontFamily:'"DM Sans",sans-serif',
                  fontSize: isMobile ? 12 : 13, lineHeight:1.72, color:'#5a7260',
                  margin: isMobile ? '0 0 14px' : '0 0 22px',
                }}>{p.desc}</p>

                {/* Specs */}
                <div style={{
                  display:'grid', gridTemplateColumns:'repeat(3,1fr)',
                  gap: isMobile ? 6 : 8,
                  marginBottom: isMobile ? 12 : 18,
                }}>
                  {[
                    [isMobile ? 'Active' : 'Active Ingredient', p.active],
                    ['Dosage', p.dosage],
                    [isMobile ? 'Pack' : 'Pack Sizes', p.pack],
                  ].map(([k, v]) => (
                    <div key={k} style={{
                      padding: isMobile ? '8px 8px' : '10px 12px',
                      borderRadius:10, background:'#f4fbf6', border:'1px solid #d0e8d8',
                    }}>
                      <div style={{
                        fontFamily:'"Syne",sans-serif', fontWeight:700,
                        fontSize: isMobile ? 6 : 7.5,
                        letterSpacing:'.14em', textTransform:'uppercase',
                        color:'#7aaa84', marginBottom:3,
                      }}>{k}</div>
                      <div style={{
                        fontFamily:'"DM Sans",sans-serif', fontWeight:600,
                        fontSize: isMobile ? 10 : 12, color:'#1c3a22', lineHeight:1.3,
                      }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Crop tags */}
                <div style={{ display:'flex', flexWrap:'wrap', gap: isMobile ? 5 : 6, marginBottom: isMobile ? 18 : 24 }}>
                  {p.crops.map(c => (
                    <span key={c} style={{
                      fontFamily:'"DM Sans",sans-serif', fontWeight:500,
                      fontSize: isMobile ? 10 : 11,
                      color:p.accent, background:p.light,
                      border:`1px solid ${p.mid}55`,
                      padding: isMobile ? '3px 9px' : '4px 12px', borderRadius:999,
                    }}>{c}</span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to="/contact"
                  className="no-underline inline-flex items-center justify-center gap-2"
                  style={{
                    padding:       isMobile ? '12px 0' : '13px 28px',
                    width:         isMobile ? '100%' : 'auto',
                    alignSelf:     isMobile ? 'stretch' : 'flex-start',
                    borderRadius:  12,
                    background:    p.accent, color:'#fff',
                    fontFamily:    '"Syne",sans-serif', fontWeight:700,
                    fontSize:      isMobile ? 11 : 11.5,
                    letterSpacing: '.08em', textTransform:'uppercase',
                    boxShadow:     `0 4px 18px ${p.accent}35`,
                    transition:    'all .25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity='.85'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity='1';   e.currentTarget.style.transform='none' }}
                >
                  Get Pricing & Details →
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Tab pills ── */}
        <div style={{
          display:'flex', gap: isMobile ? 6 : 8,
          marginTop:14, flexWrap:'wrap', justifyContent:'center',
        }}>
          {PRODUCTS.map((prod, i) => (
            <button
              key={prod.name}
              onClick={() => { setActive(i); setProgress(0) }}
              style={{
                display:'flex', alignItems:'center', gap:6,
                padding:      isMobile ? '6px 11px' : '8px 16px',
                borderRadius: 999,
                border:       `1.5px solid ${i===active ? prod.accent : '#d4e8d8'}`,
                background:   i===active ? prod.accent : '#ffffff',
                cursor:'pointer', transition:'all .25s',
              }}
            >
              <div style={{
                width:5, height:5, borderRadius:'50%',
                background: i===active ? '#fff' : prod.accent,
                transition:'background .25s',
              }}/>
              <span style={{
                fontFamily:'"Syne",sans-serif', fontWeight:700,
                fontSize: isMobile ? 9 : 10, letterSpacing:'.06em',
                color: i===active ? '#fff' : '#4a6a50',
                transition:'color .25s', whiteSpace:'nowrap',
              }}>
                {prod.name.split(' ').slice(0, 2).join(' ')}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
