/*eslint-disable*/
// src/components/pages/ProductViewer.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiDownload } from 'react-icons/hi'
import { db } from '../../firebase/config'

const HERO_GRADIENT = 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #1a6b38 100%)'

export default function ProductViewer() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id))
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
        else setError('Product not found')
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    }
    fetchProduct()
  }, [id])

  if (loading) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading brochure...</p>
      </div>
    </div>
  )

  if (error || !product) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="font-heading font-bold text-gray-800 text-xl mb-3">{error || 'Product not found'}</h2>
        <Link to="/products" className="btn-primary no-underline">← Back to Products</Link>
      </div>
    </div>
  )

  if (!product.pdfUrl) return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <div className="text-5xl mb-4">📄</div>
        <h2 className="font-heading font-bold text-gray-800 text-xl mb-3">No brochure attached</h2>
        <Link to={`/products/${id}`} className="btn-primary no-underline">← Back to Product</Link>
      </div>
    </div>
  )

  const isImage = /\.(png|jpg|jpeg|webp)(\?|$)/i.test(product.pdfUrl)
  const isPdf   = !isImage

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8', paddingTop: 70 }}>

      {/* ── Top bar ── */}
      <div style={{ background: HERO_GRADIENT, position: 'relative', overflow: 'hidden' }}>
        {/* dot texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(134,239,172,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="max-w-5xl mx-auto px-[6%] relative z-10"
          style={{ padding: '20px 6%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Left — back + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <Link to={`/products/${id}`} className="no-underline flex-shrink-0"
              style={{ display: 'flex', alignItems: 'center', gap: 6,
                color: 'rgba(134,239,172,0.8)', fontSize: 13, fontWeight: 600 }}>
              <HiArrowLeft style={{ fontSize: 16 }} /> Back
            </Link>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, color: 'rgba(134,239,172,0.6)', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>
                Product Brochure
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.name}
              </div>
            </div>
          </div>

          {/* Right — download button */}
          <a href={product.pdfUrl} download target="_blank" rel="noopener noreferrer"
            className="no-underline flex-shrink-0 inline-flex items-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg,#bbf7d0,#86efac)',
              color: '#14532d', fontWeight: 700, fontSize: 12,
              padding: '8px 16px', borderRadius: 999,
            }}>
            <HiDownload /> Download
          </a>
        </div>
      </div>

      {/* ── Viewer ── */}
      <div className="max-w-5xl mx-auto px-[6%]" style={{ padding: '24px 6% 48px' }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}
        >
          {/* Image — shown directly */}
          {isImage && (
            <div style={{ padding: 24 }}>
              <img
                src={product.pdfUrl}
                alt={product.pdfName || 'Product brochure'}
                style={{ width: '100%', borderRadius: 12, display: 'block' }}
              />
            </div>
          )}

          {/* PDF — native browser viewer via <object> tag, no Google, no email */}
          {isPdf && (
            <object
              data={product.pdfUrl}
              type="application/pdf"
              style={{ width: '100%', height: '80vh', display: 'block', border: 'none' }}
            >
              {/* Fallback for browsers that can't render PDF inline */}
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
                  Your browser can't preview this PDF.
                </p>
                <a href={product.pdfUrl} download target="_blank" rel="noopener noreferrer"
                  className="btn-primary no-underline inline-flex items-center gap-2">
                  <HiDownload /> Download PDF
                </a>
              </div>
            </object>
          )}
        </motion.div>

        {/* Product info strip below */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>
            🌿 GreenLife Cropcare — {product.category}
          </div>
          <Link to={`/products/${id}`} className="no-underline"
            style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
            View Full Product Details →
          </Link>
        </div>
      </div>
    </div>
  )
}
