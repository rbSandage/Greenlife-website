/*eslint-disable*/
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiDownload } from 'react-icons/hi'
import { db } from '../../firebase/config'

const HERO_GRADIENT =
  'linear-gradient(135deg, #052e16 0%, #14532d 50%, #1a6b38 100%)'

export default function ProductViewer() {

  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const snap = await getDoc(doc(db, 'products', id))

        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() })
        } else {
          setError('Product not found')
        }

      } catch (e) {
        setError(e.message)
      }

      setLoading(false)

    }

    fetchProduct()

  }, [id])


  if (loading) {
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500 text-sm">
            Loading brochure...
          </p>

        </div>
      </div>
    )
  }


  if (error || !product) {
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center text-center px-6">

        <div>

          <div className="text-5xl mb-4">🌿</div>

          <h2 className="font-heading font-bold text-gray-800 text-xl mb-3">
            {error || 'Product not found'}
          </h2>

          <Link
            to="/products"
            className="btn-primary no-underline"
          >
            ← Back to Products
          </Link>

        </div>

      </div>
    )
  }


  if (!product.pdfUrl) {
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center text-center px-6">

        <div>

          <div className="text-5xl mb-4">📄</div>

          <h2 className="font-heading font-bold text-gray-800 text-xl mb-3">
            No brochure attached
          </h2>

          <Link
            to={`/products/${id}`}
            className="btn-primary no-underline"
          >
            ← Back to Product
          </Link>

        </div>

      </div>
    )
  }


  const isImage = /\.(png|jpg|jpeg|webp)(\?|$)/i.test(product.pdfUrl)

  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)


  const pdfViewer = isMobile
    ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
        product.pdfUrl
      )}`
    : product.pdfUrl


  return (

    <div
      style={{
        minHeight: '100vh',
        background: '#f5f6f8',
        paddingTop: 70
      }}
    >

      {/* TOP BAR */}

      <div
        style={{
          background: HERO_GRADIENT,
          position: 'relative',
          overflow: 'hidden'
        }}
      >

        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(134,239,172,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div
          className="max-w-5xl mx-auto px-[6%] relative z-10"
          style={{
            padding: '20px 6%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >

          {/* LEFT */}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              minWidth: 0
            }}
          >

            <Link
              to={`/products/${id}`}
              className="no-underline flex-shrink-0"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'rgba(134,239,172,0.8)',
                fontSize: 13,
                fontWeight: 600
              }}
            >

              <HiArrowLeft style={{ fontSize: 16 }} />

              Back

            </Link>

            <div
              style={{
                width: 1,
                height: 24,
                background: 'rgba(255,255,255,0.15)'
              }}
            />

            <div style={{ minWidth: 0 }}>

              <div
                style={{
                  fontSize: 10,
                  color: 'rgba(134,239,172,0.6)',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase'
                }}
              >
                Product Brochure
              </div>

              <div
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {product.name}
              </div>

            </div>

          </div>

          {/* DOWNLOAD */}

          <a
            href={product.pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center gap-2"
            style={{
              background:
                'linear-gradient(135deg,#bbf7d0,#86efac)',
              color: '#14532d',
              fontWeight: 700,
              fontSize: 12,
              padding: '8px 16px',
              borderRadius: 999
            }}
          >

            <HiDownload />

            Download

          </a>

        </div>

      </div>


      {/* VIEWER */}

      <div
        className="max-w-5xl mx-auto px-[6%]"
        style={{
          padding: '24px 6% 48px'
        }}
      >

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: '#fff',
            borderRadius: 20,
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}
        >

          {isImage && (

            <div style={{ padding: 24 }}>

              <img
                src={product.pdfUrl}
                alt="brochure"
                style={{
                  width: '100%',
                  borderRadius: 12
                }}
              />

            </div>

          )}

          {!isImage && (

            <iframe
              src={pdfViewer}
              style={{
                width: '100%',
                height: '82vh',
                border: 'none'
              }}
              title="Product Brochure"
            />

          )}

        </motion.div>

      </div>

    </div>

  )

}