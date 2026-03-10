// src/components/pages/Products.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSearch, HiX, HiChevronDown, HiCheck } from 'react-icons/hi'
import { useProducts } from '../../hooks'
import { Send } from 'lucide-react'
import { CATEGORIES, CATEGORY_COLORS } from '../../data/products'

/* ── Category config ──────────────────────────────────── */
const CATEGORY_META = {
  All:            { emoji: '🌾', color: '#16a34a', light: '#f0fdf4', label: 'All Categories' },
  Fungicide:      { emoji: '🍄', color: '#7c3aed', light: '#f5f3ff', label: 'Fungicide'      },
  Insecticide:    { emoji: '🌿', color: '#0891b2', light: '#ecfeff', label: 'Insecticide'    },
  Herbicide:      { emoji: '🌱', color: '#ca8a04', light: '#fefce8', label: 'Herbicide'      },
  Fertilizer:     { emoji: '🌻', color: '#dc2626', light: '#fff1f2', label: 'Fertilizer'     },
  'Bio-control':  { emoji: '🦋', color: '#059669', light: '#f0fdf4', label: 'Bio-control'    },
  'Plant Growth': { emoji: '🌾', color: '#9333ea', light: '#faf5ff', label: 'Plant Growth'   },
}

/* ── Hero edge produce ────────────────────────────────── */
const HERO_FLOATS = [
  { png: '/images/floats/tomato.png',   x: '10%',  y: '12%', size: 56, rot: -10 },
  { png: '/images/floats/corn.png',     x: '5%',  y: '56%', size: 58, rot:   9 },
  { png: '/images/floats/chilli1.png',  x: '91%', y: '8%',  size: 60, rot:  1 },
  { png: '/images/floats/carrot.png',   x: '92%', y: '52%', size: 52, rot: -10 },
  { png: '/images/floats/banana.png', x: '78%', y: '70%', size: 50, rot:   6 },
  { png: '/images/floats/grapes.png',    x: '16%',  y: '70%', size: 48, rot:  10 },
]

/* ── CTA edge produce ─────────────────────────────────── */
const CTA_FLOATS = [
  { png: '/images/floats/wheat.png',    x: '6%',  y: '18%', size: 44 },
  { png: '/images/floats/broccoli.png', x: '85%', y: '14%', size: 48 },
  { png: '/images/floats/grapes.png',   x: '9%',  y: '66%', size: 42 },
  { png: '/images/floats/sunflower.png',x: '82%', y: '62%', size: 46 },
]

/* ── Category Dropdown ────────────────────────────────── */
function CategoryDropdown({ value, onChange, categories }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const allCats = ['All', ...categories]

  useEffect(() => {
    const handleOut = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleOut)
    return () => document.removeEventListener('mousedown', handleOut)
  }, [])

  const selected = CATEGORY_META[value] || CATEGORY_META['All']

  return (
    <div ref={ref} className="relative flex-shrink-0" style={{ width: 170 }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-1.5 bg-white px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 transition-all duration-200"
        style={{
          border: open ? '1.5px solid #16a34a' : '1.5px solid #d1d5db',
          boxShadow: open ? '0 0 0 3px rgba(22,163,74,0.08)' : 'none',
        }}
      >
        <span className="flex items-center gap-1.5 truncate">
          <span style={{ fontSize: 14 }}>{selected.emoji}</span>
          <span className="truncate">{selected.label}</span>
        </span>
        <HiChevronDown
          className="text-gray-400 flex-shrink-0"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute left-0 mt-1 bg-white rounded-xl overflow-hidden z-50"
            style={{
              width: 210,
              top: '100%',
              border: '1.5px solid #e5e7eb',
              boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
            }}
          >
            {allCats.map(cat => {
              const m = CATEGORY_META[cat] || CATEGORY_META['All']
              const isActive = value === cat
              return (
                <button
                  key={cat}
                  onClick={() => { onChange(cat); setOpen(false) }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors"
                  style={{ background: isActive ? m.light : 'transparent', color: isActive ? m.color : '#374151' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f9fafb' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: isActive ? m.color + '22' : '#f3f4f6', fontSize: 13 }}
                    >
                      {m.emoji}
                    </span>
                    <span className="font-semibold">{m.label}</span>
                  </span>
                  {isActive && <HiCheck style={{ color: m.color, flexShrink: 0 }} />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Product Card ─────────────────────────────────────── */
function ProductCard({ product, index }) {
  const meta = CATEGORY_META[product.category] || CATEGORY_META['All']

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      layout
      className="h-full"
    >
      <Link
        to={`/products/${product.id}`}
        className="no-underline flex flex-col bg-white rounded-2xl overflow-hidden h-full group"
        style={{
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.12)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        {/* ── Image area — tall, dominant ── */}
        <div
          className="relative flex items-center justify-center flex-shrink-0"
          style={{
            height: 240,          /* bigger than body text area */
            background: product.imageUrl
              ? `url(${product.imageUrl}) center/cover no-repeat`
              : `linear-gradient(145deg, ${meta.light} 0%, ${meta.color}1a 100%)`,
          }}
        >
          {!product.imageUrl && (
            <span style={{ fontSize: 56, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' }}>
              {meta.emoji}
            </span>
          )}

          {/* Category bar at bottom of image */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-3 py-1.5"
            style={{ background: meta.color + 'ee' }}
          >
            <span style={{ fontSize: 11 }}>{meta.emoji}</span>
            <span className="text-white text-[0.58rem] font-bold tracking-widest uppercase">
              {product.category}
            </span>
          </div>

          {product.featured && (
            <span className="absolute top-2.5 right-2.5 text-[0.58rem] font-bold px-2 py-0.5 rounded-full bg-green-700 text-white">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* ── Text body — compact ── */}
        <div className="p-2 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-snug group-hover:text-green-700 transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-[0.68rem] text-gray-500 line-clamp-2 leading-relaxed mb-2.5 flex-1">
            {product.description}
          </p>

          {product.crops?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {product.crops.slice(0, 3).map(c => (
                <span key={c} className="text-[0.58rem] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: meta.light, color: meta.color }}>
                  {c}
                </span>
              ))}
              {product.crops.length > 3 && (
                <span className="text-[0.58rem] text-gray-400 py-0.5">+{product.crops.length - 3}</span>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2.5" style={{ borderTop: '1px solid #f0f0f0' }}>
            <span className="text-[0.63rem] text-gray-400 truncate mr-2 max-w-[95px]">
              {product.activeIngredient}
            </span>
            <span
              className="text-[0.63rem] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: meta.light, color: meta.color }}
            >
              Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Main Page ────────────────────────────────────────── */
export default function Products() {
  const { products, loading } = useProducts(false)
  const [inputVal,  setInputVal]  = useState('')
  const [search,    setSearch]    = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const handleSearch = () => setSearch(inputVal)
  const handleClear  = () => { setInputVal(''); setSearch('') }

  const filtered = useMemo(() => products.filter(p => {
    const matchCat    = activeTab === 'All' || p.category === activeTab
    const matchSearch = !search || [p.name, p.description, p.activeIngredient, ...(p.crops || [])]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  }), [products, search, activeTab])

  return (
    <div className="pt-[70px]" style={{ background: '#f5f6f8' }}>

      {/* ══════════ HERO ══════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #1a6b38 100%)',
          paddingTop: 52,
          paddingBottom: 88,           /* extra bottom space for the clip cut */
          clipPath: 'polygon(0 0, 100% 0, 100% 80%, 55% 98%, 0 80%)',
        }}
      >
        {/* Dot texture */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(134,239,172,0.14) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.5,
          }}
        />
        {/* Centre glow */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 42%, rgba(74,222,128,0.08) 0%, transparent 70%)' }} />

        {/* Edge produce */}
        {HERO_FLOATS.map((item, i) => (
          <motion.img
            key={i}
            src={item.png}
            alt=""
            className="absolute select-none pointer-events-none"
            style={{ left: item.x, top: item.y, width: item.size, height: item.size, objectFit: 'contain', transform: `rotate(${item.rot}deg)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.24 }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
          />
        ))}

        {/* Heading text */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span
              className="inline-flex items-center gap-2 text-green-300 text-[0.65rem] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.22)' }}
            >
              🌿 Product Catalog
            </span>
            <h1
              className="font-extrabold text-white leading-tight mb-3"
              style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', textShadow: '0 2px 18px rgba(0,0,0,0.3)' }}
            >
              Our Complete{' '}
              <span style={{ color: '#4ade80' }}>Product Range</span>
            </h1>
            <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
              Government-approved agri-chemical solutions for every crop and season.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ══════════ SEARCH BAR (floated up, overlapping hero cut) ══════════ */}
      <div
        className="max-w-3xl mx-auto px-6"
        style={{ marginTop: 18, position: 'relative', zIndex: 20 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-xl flex items-center gap-2 px-2 py-2"
          style={{ boxShadow: '0 6px 32px rgba(0,0,0,0.13)', border: '1px solid #e5e7eb' }}
        >
          {/* Dropdown */}
          <CategoryDropdown value={activeTab} onChange={setActiveTab} categories={CATEGORIES} />

          {/* Vertical divider */}
          <div style={{ width: 1, height: 24, background: '#e5e7eb', flexShrink: 0 }} />

          {/* Input */}
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search products, crops, ingredients…"
            className="flex-1 text-xs text-gray-700 bg-transparent focus:outline-none px-2 min-w-0"
            style={{ caretColor: '#16a34a' }}
          />

          {inputVal && (
            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <HiX className="text-base" />
            </button>
          )}

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white flex-shrink-0 hover:opacity-90 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 2px 10px rgba(22,163,74,0.28)' }}
          >
            <HiSearch className="text-sm" />
            Search
          </button>
        </motion.div>
      </div>

      {/* ══════════ GRID ══════════ */}
      <div className="max-w-6xl mx-auto px-6 pt-7 pb-14">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs text-gray-400 mb-5"
        >
          {loading ? 'Loading…' : (
            <>
              Showing <strong className="text-gray-700">{filtered.length}</strong>{' '}
              product{filtered.length !== 1 ? 's' : ''}
              {activeTab !== 'All' && <> in <strong className="text-gray-700">{activeTab}</strong></>}
              {search && <> · "<em className="text-gray-600">{search}</em>"</>}
            </>
          )}
        </motion.p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ height: 310, background: '#e5e7eb' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">No products found</h3>
            <p className="text-gray-400 text-sm mb-5">Try adjusting your search or category</p>
            <button
              onClick={() => { handleClear(); setActiveTab('All') }}
              className="px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ══════════ CTA ══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #14532d 55%, #1a6b38 100%)',
          clipPath: 'polygon(0 12%, 38% 0, 100% 8%, 100% 100%, 0 100%)',
          paddingTop: 60,
          paddingBottom: 50,
        }}
      >
        {/* Dot texture */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(134,239,172,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.45,
          }}
        />

        {/* Edge produce */}
        {CTA_FLOATS.map((item, i) => (
          <motion.img
            key={i}
            src={item.png}
            alt=""
            className="absolute select-none pointer-events-none"
            style={{ left: item.x, top: item.y, width: item.size, height: item.size, objectFit: 'contain' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          />
        ))}

        <div className="relative z-10 max-w-md mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-extrabold text-white text-xl md:text-2xl mb-2.5 leading-snug">
              Looking for a specific product?
            </h2>
            <p className="text-white/55 text-xs mb-6 leading-relaxed">
              Our agri experts can help you find the right solution for your crop and pest situation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-green-900 no-underline hover:scale-105 active:scale-95 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #53bc51, #69bc66)',
                boxShadow: '0 5px 20px rgba(0,0,0,0.22)',
              }}
            >
              <Send/>
             Send Enquiry →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
