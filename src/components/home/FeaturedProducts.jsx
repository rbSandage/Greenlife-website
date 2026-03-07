// src/components/home/FeaturedProducts.jsx
//
// ─── HOW TO ADD PNG IMAGES ────────────────────────────────────────────────────
//  METHOD 1 — Admin Dashboard (recommended)
//    Upload via Admin → Products → Edit Product → Upload Image
//
//  METHOD 2 — Map by product name
//    'Chlorpyrifos 20% EC': '/images/products/chlorpyrifos.png'
//
//  METHOD 3 — Any public URL
//    'NPK 19-19-19': 'https://res.cloudinary.com/.../npk.png'
// ─────────────────────────────────────────────────────────────────────────────

import { useState }    from 'react'
import { Link }        from 'react-router-dom'
import { motion }      from 'framer-motion'
import { useProducts } from '../../hooks'

// ── Product image map ─────────────────────────────────────
const PRODUCT_ICONS = {
  'Chlorpyrifos 20% EC':   '',
  'Glyphosate 41% SL':     '',
  'Mancozeb 75% WP':       '',
  'NPK 19-19-19':          '',
  'Imidacloprid 17.8% SL': '',
  '2,4-D Amine 58% SL':    '',
}

// ── Category accent colors ────────────────────────────────
const CAT_ACCENT = {
  Insecticide:     { color: '#2d6a4f', tint: '#eef7f2', dot: '#2d6a4f' },
  Fungicide:       { color: '#1e5f8e', tint: '#eef4fb', dot: '#1e5f8e' },
  Herbicide:       { color: '#8b3a1e', tint: '#fdf3ee', dot: '#8b3a1e' },
  Fertilizer:      { color: '#7a540a', tint: '#fdf8ee', dot: '#7a540a' },
  'Bio-Pesticide': { color: '#2e7d44', tint: '#eef8f1', dot: '#2e7d44' },
}
const DEFAULT_ACCENT = { color: '#2d6a4f', tint: '#eef7f2', dot: '#2d6a4f' }

function resolveImage(product) {
  if (product.imageUrl)            return product.imageUrl
  if (PRODUCT_ICONS[product.name]) return PRODUCT_ICONS[product.name]
  return null
}

// ── Agri background illustrations ────────────────────────
function AbstractBg() {
  const items = [
    { src: '/images/bg/grapes.png',   top:'22%',right:'0',bottom:'0%', size:'auto',height:'100%', opacity:.07 },
    { src: '/images/bg/grapes.png',   top:'3%',   right:'75%',  size:'auto', rotate:15,  opacity:.07 },
    
    // { src: '/images/bg/farmer2.png',    top:'5%',   right:'2%',  size:160, rotate:15,  opacity:.11 },
    // { src: '/images/bg/seeds.png',   top:'10%',  left:'35%',  size:100, rotate:20,  opacity:.1  },
    // { src: '/images/bg/branch.png',  bottom:'0%',left:'40%',  size:140, rotate:-5,  opacity:.1  },
    // { src: '/images/bg/wheat.png',   bottom:'5%',right:'-1%', size:150, rotate:8,   opacity:.1  },
    // { src: '/images/bg/droplet.png', top:'40%',  right:'8%',  size:80,  rotate:0,   opacity:.09 },
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
            bottom:     item.bottom,
            left:       item.left,
            right:      item.right,
            width:      item.size,
            height:     item.size,
            objectFit:  'contain',
            opacity:    item.opacity,
            transform:  `rotate(${item.rotate}deg)`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      ))}
    </>
  )
}

// ── Skeleton ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '1px solid #ede8df', overflow: 'hidden',
    }}>
      <div style={{ height: 220, background: '#f5f0e8' }} className="animate-pulse"/>
      <div style={{ padding: '20px 22px' }} className="space-y-3">
        <div style={{ height: 14, width:'70%', borderRadius: 8, background:'#ede8df' }} className="animate-pulse"/>
        <div style={{ height: 11, width:'45%', borderRadius: 8, background:'#ede8df' }} className="animate-pulse"/>
      </div>
    </div>
  )
}

// ── Product card ───────────────────────────────────────────
function ProductCard({ product, index }) {
  const [hov,    setHov]    = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const acc    = CAT_ACCENT[product.category] ?? DEFAULT_ACCENT
  const imgSrc = resolveImage(product)
  const showImg= imgSrc && !imgErr

  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-32px' }}
      transition={{ duration:.6, delay:index*.09, ease:[.22,1,.36,1] }}
      style={{ height:'100%' }}
    >
      <Link
        to={`/products/${product.id}`}
        className="no-underline block"
        style={{
          background:   '#ffffff',
          borderRadius: 20,
          border:       `1.5px solid ${hov ? acc.color + '30' : '#e8e2d8'}`,
          boxShadow:    hov
            ? '0 20px 52px rgba(0,0,0,.13), 0 4px 12px rgba(0,0,0,.07)'
            : '0 2px 10px rgba(0,0,0,.06)',
          transform:    hov ? 'translateY(-7px)' : 'translateY(0)',
          transition:   'all .36s cubic-bezier(.22,1,.36,1)',
          overflow:     'hidden',
          position:     'relative',
          display:      'flex',
          flexDirection:'column',
          height:       '100%',
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >

        {/* ── IMAGE ZONE ── */}
        <div style={{
          height:     260,
          background: hov ? acc.tint : '#faf7f2',
          display:    'flex',
          alignItems: 'center',
          justifyContent:'center',
          position:   'relative',
          transition: 'background .35s',
          overflow:   'hidden',
        }}>
          {/* Soft radial glow behind image */}
          <div style={{
            position:   'absolute', inset:0,
            background: `radial-gradient(circle at 50% 60%, ${acc.color}10, transparent 70%)`,
            transition: 'opacity .4s',
            opacity:    hov ? 1 : 0,
          }}/>

          {/* Category dot — top left, minimal */}
          <div style={{
            position:   'absolute', top:14, left:16,
            display:    'flex', alignItems:'center', gap:6,
          }}>
            <div style={{
              width:7, height:7, borderRadius:'50%',
              background: acc.color,
              opacity: .6,
            }}/>
            <span style={{
              fontFamily:   '"Syne",sans-serif',
              fontWeight:   700,
              fontSize:     9,
              letterSpacing:'.14em',
              textTransform:'uppercase',
              color:        acc.color,
              opacity:      .7,
            }}>
              {product.category}
            </span>
          </div>

          {showImg ? (
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => setImgErr(true)}
              style={{
                width:      '82%',
                height:     '82%',
                objectFit:  'contain',
                transform:  hov ? 'scale(1.07) translateY(-4px)' : 'scale(1)',
                transition: 'transform .4s cubic-bezier(.22,1,.36,1)',
                filter:     hov
                  ? 'drop-shadow(0 14px 28px rgba(0,0,0,.18))'
                  : 'drop-shadow(0 4px 10px rgba(0,0,0,.1))',
                position:   'relative', zIndex:2,
              }}
            />
          ) : (
            /* Placeholder letter */
            <div style={{
              width:76, height:76, borderRadius:'50%',
              background:   acc.tint,
              border:       `2px solid ${acc.color}20`,
              display:      'flex',
              alignItems:   'center',
              justifyContent:'center',
              transform:    hov ? 'scale(1.06) translateY(-3px)' : 'scale(1)',
              transition:   'transform .4s cubic-bezier(.22,1,.36,1)',
              position:     'relative', zIndex:2,
            }}>
              <span style={{
                fontFamily: '"Playfair Display",serif',
                fontWeight: 900, fontStyle:'italic',
                fontSize:   30,
                color:      acc.color,
                opacity:    .55,
                lineHeight: 1,
              }}>
                {product.name?.charAt(0) ?? '?'}
              </span>
            </div>
          )}
        </div>

        {/* ── BODY ── */}
        <div style={{ padding:'16px 20px 18px', flex:1, display:'flex', flexDirection:'column' }}>

          {/* Product name */}
          <h3 style={{
            fontFamily:   '"Playfair Display",Georgia,serif',
            fontWeight:   900,
            fontStyle:    'normal',
            fontSize:     16,
            lineHeight:   1.2,
            color:        '#1c2e1c',
            margin:       '0 0 4px',
            letterSpacing:'-0.01em',
            transition:   'color .25s',
          }}>
            {product.name}
          </h3>

          {/* Active ingredient */}
          <p style={{
            fontFamily: '"DM Sans",sans-serif',
            fontSize:   11.5,
            color:      '#9aaa9a',
            margin:     '0 0 10px',
            lineHeight: 1.4,
          }}>
            {product.activeIngredient}
          </p>

          {/* Crop tags */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:10 }}>
            {(product.crops || []).slice(0,3).map(c => (
              <span key={c} style={{
                fontFamily:   '"DM Sans",sans-serif',
                fontWeight:   500,
                fontSize:     10,
                color:        acc.color,
                background:   acc.tint,
                padding:      '2px 8px',
                borderRadius: 999,
                border:       `1px solid ${acc.color}20`,
              }}>
                {c}
              </span>
            ))}
          </div>

          {/* Footer — pushed to bottom */}
          <div style={{
            display:       'flex',
            alignItems:    'center',
            justifyContent:'space-between',
            paddingTop:    10,
            borderTop:     '1px solid #ede8df',
            marginTop:     'auto',
          }}>
            <span style={{
              fontFamily: '"DM Sans",sans-serif',
              fontSize:   10.5,
              color:      '#b0bcb0',
            }}>
              {product.dosage?.split(' ').slice(0,4).join(' ')}
            </span>

            <div style={{
              width:        30, height:30,
              borderRadius: '50%',
              background:   hov ? acc.color : 'transparent',
              border:       `1.5px solid ${hov ? acc.color : '#ddd6c8'}`,
              display:      'flex',
              alignItems:   'center',
              justifyContent:'center',
              transition:   'all .3s',
            }}>
              <span style={{
                fontSize:   12,
                color:      hov ? '#fff' : '#b0bcb0',
                fontWeight: 700,
                transition: 'color .3s',
                marginTop:  '-1px',
              }}>→</span>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{
          position:      'absolute', bottom:0, left:0, right:0, height:2,
          background:    `linear-gradient(90deg, ${acc.color}, ${acc.color}44)`,
          transformOrigin:'left',
          transform:     hov ? 'scaleX(1)' : 'scaleX(0)',
          transition:    'transform .42s cubic-bezier(.22,1,.36,1)',
        }}/>
      </Link>
    </motion.div>
  )
}

// ── Main section ───────────────────────────────────────────
export default function FeaturedProducts() {
  const { products, loading } = useProducts(true)

  const featured = products.filter(p => p.featured).slice(0,4)
  const display  = featured.length >= 2 ? featured : products.slice(0,4)

  return (
    <section
      aria-labelledby="products-heading"
      style={{ padding:'72px 0 80px', background:'#f0ebe0', position:'relative', overflow:'hidden' }}
    >
      {/* Abstract background */}
      <AbstractBg />

      <div className="relative z-10 max-w-[1200px] mx-auto px-[5%]">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:.6 }}
          style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:12, marginBottom:36 }}
        >
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:28, height:2, borderRadius:2, background:'#b8832a' }}/>
              <span style={{
                fontFamily:   '"Syne",sans-serif', fontWeight:700,
                fontSize:     9.5, letterSpacing:'.28em', textTransform:'uppercase',
                color:        '#b8832a',
              }}>
                Featured Range
              </span>
            </div>
            <h2 id="products-heading" style={{
              fontFamily:   '"Playfair Display",Georgia,serif',
              fontWeight:   900,
              fontSize:     'clamp(24px,3.2vw,42px)',
              lineHeight:   1.08,
              letterSpacing:'-0.02em',
              color:        '#1c2e1c',
              margin:       0,
            }}>
              Products Built for{' '}
              <em style={{ color:'#2d6a4f', fontStyle:'italic' }}>Indian Farmlands</em>
            </h2>
          </div>

          <Link
            to="/products"
            style={{
              fontFamily:     '"Syne",sans-serif', fontWeight:700,
              fontSize:       11, letterSpacing:'.1em', textTransform:'uppercase',
              color:          '#9a9288', textDecoration:'none',
              borderBottom:   '1px solid #ccc6bc', paddingBottom:2,
            }}
            onMouseEnter={e => { e.currentTarget.style.color='#2d6a4f'; e.currentTarget.style.borderColor='#2d6a4f' }}
            onMouseLeave={e => { e.currentTarget.style.color='#9a9288'; e.currentTarget.style.borderColor='#ccc6bc' }}
          >
            Full Catalogue →
          </Link>
        </motion.div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ alignItems:'stretch' }}>
          {loading
            ? Array.from({length:4}).map((_,i) => <SkeletonCard key={i}/>)
            : display.map((p,i) => <ProductCard key={p.id} product={p} index={i}/>)
          }
        </div>

        {/* ── Browse all strip ── */}
        {!loading && products.length > 4 && (
          <motion.div
            initial={{ opacity:0, y:14 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:.5, delay:.3 }}
            style={{
              marginTop:     24,
              background:    '#fff',
              borderRadius:  18,
              border:        '1.5px solid #e8e2d8',
              padding:       '22px 28px',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'space-between',
              gap:           16,
              boxShadow:     '0 2px 10px rgba(0,0,0,.05)',
            }}
          >
            <div>
              <p style={{
                fontFamily: '"Playfair Display",serif', fontWeight:700, fontStyle:'italic',
                fontSize:17, color:'#1c2e1c', margin:'0 0 3px',
              }}>
                Looking for something specific?
              </p>
              <p style={{
                fontFamily:'"DM Sans",sans-serif', fontSize:12,
                color:'#9aaa9a', margin:0,
              }}>
                Browse our complete catalogue of {products.length}+ agri products
              </p>
            </div>

            <Link
              to="/products"
              style={{
                fontFamily:     '"Syne",sans-serif', fontWeight:700,
                fontSize:       11, letterSpacing:'.1em', textTransform:'uppercase',
                color:          '#fff', textDecoration:'none',
                background:     '#2d6a4f',
                padding:        '12px 24px', borderRadius:12,
                flexShrink:     0,
                boxShadow:      '0 4px 14px rgba(45,106,79,.3)',
                transition:     'all .25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#1c4d38'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background='#2d6a4f'; e.currentTarget.style.transform='none' }}
            >
              Browse All →
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
