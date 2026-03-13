/*eslint-disable*/
// src/components/pages/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { HiArrowLeft, HiPhone} from 'react-icons/hi'
import { db } from '../../firebase/config'
import {Send } from 'lucide-react'


/* ── Category colours (no external dependency) ──────────── */
const CATEGORY_COLORS = {
  Fungicide:        { bg: 'bg-purple-100', text: 'text-purple-700' },
  Insecticide:      { bg: 'bg-cyan-100',   text: 'text-cyan-700'   },
  Herbicide:        { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Fertilizer:       { bg: 'bg-red-100',    text: 'text-red-700'    },
  'Bio-pesticide':  { bg: 'bg-green-100',  text: 'text-green-700'  },
  PGR:              { bg: 'bg-violet-100', text: 'text-violet-700' },
}



export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading]  = useState(true)
  const [error,   setError]    = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id))
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
        else setError('Product not found')
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  if (loading) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading product...</p>
      </div>
    </div>
  )

  if (error || !product) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <div className="text-6xl mb-4">🌿</div>
        <h2 className="font-heading font-bold text-dark text-2xl mb-3">{error || 'Product not found'}</h2>
        <Link to="/products" className="btn-primary">← Back to Products</Link>
      </div>
    </div>
  )

   const colors = CATEGORY_COLORS[product.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }

  return (
    <div className="pt-[70px]">
      <div className="max-w-6xl mx-auto px-[6%] py-12">
        {/* Back */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors no-underline mb-8">
          <HiArrowLeft /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left — Image */}
          <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.6}}>
            <div className="rounded-3xl overflow-hidden h-96 flex items-center justify-center text-8xl relative"
              style={{
                background: product.imageUrl ? '#f3f8d3' : 'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
                border: '1.5px solid #e5e7eb',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              }}>
              {product.imageUrl
                ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
                : '🌿'
              }
              {product.featured && <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">⭐ Featured Product</div>}
            </div>

            {/* Safety info card */}
            <div className="mt-5 rounded-2xl overflow-hidden"
              style={{ border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {/* Header strip */}
              <div style={{ background: 'linear-gradient(135deg,#052e16,#14532d)', padding: '12px 18px',
                display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>  <img src="/images/icons/safety.png" alt="PDF" style={{ width: 40, height: 40, objectFit: 'contain' }} /></span>
                <span style={{ color: '#bbf7d0', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>
                  Safety Information
                </span>
              </div>
              {/* Body */}
              <div style={{ background: '#fff', padding: '14px 18px' }}>
                <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                  {product.safetyInfo || 'Use as directed. Keep away from children. Wear protective gear during application.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — Details */}
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:.6,delay:.1}}>
            <span className={`inline-block text-[0.67rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 ${colors.bg} ${colors.text}`}>{product.category}</span>
            <h1 className="font-display font-black text-dark text-3xl md:text-4xl leading-tight mb-3">{product.name}</h1>
            <p className="text-gray-500 leading-relaxed mb-7">{product.description}</p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3.5 mb-7">
              {[
                ['Active Ingredient', product.activeIngredient],
                ['Dosage', product.dosage],
                ['Formulation', product.formulation],
                ['Pack Sizes', product.packSizes?.join(', ')],
              ].map(([k, v]) => (
                <div key={k} className="bg-green-50 rounded-xl p-4">
                  <div className="text-[0.65rem] text-green-600 font-bold uppercase tracking-widest mb-1">{k}</div>
                  <div className="text-sm font-semibold text-dark">{v || '—'}</div>
                </div>
              ))}
            </div>

            {/* Crops */}
            <div className="mb-8">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Suitable Crops</div>
              <div className="flex flex-wrap gap-2">
                {product.crops?.map(c => (
                  <span key={c} className="bg-white border border-green-200 text-green-700 text-xs px-3.5 py-1.5 rounded-full font-medium">{c}</span>
                ))}
              </div>
            </div>

            {/* Gov approved badge */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-7 w-fit">
              <span className="text-green-600 text-sm">✅</span>
              <span className="text-xs font-semibold text-green-700">Government Approved Product — CIB Registered</span>
            </div>

            {/* PDF Brochure link — only shows if attached */}
            {product.pdfUrl && (
              <Link
                to={`/products/${product.id}/brochure`}
                className="inline-flex items-center gap-2 no-underline mt-2 mb-7 px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                style={{
                  background: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  color: '#d15353',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'inline-flex',
                }}
              >
             <img src="/images/icons/pdf.png" alt="PDF" style={{ width: 24, height: 24, objectFit: 'contain' }} />
               View Product Brochure / Label
              </Link>
            )}

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <Link to={`/contact?product=${encodeURIComponent(product.name)}`} className="btn-primary flex-1 md:flex-none justify-center">
                <Send/>
                 Enquirey
              </Link>
              <a href="tel:+919876543210" className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-5 py-3.5 rounded-full text-sm font-semibold hover:bg-green-50 transition-all">
                <HiPhone /> Call Now
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
