/*eslint-disable*/
// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks'
import { lazy, Suspense } from 'react'

import Navbar         from './components/layout/Navbar'
import Footer         from './components/layout/Footer'
import ProtectedRoute from './components/admin/ProtectedRoute'

// ✅ All pages lazy loaded
const Home           = lazy(() => import('./components/pages/Home'))
const Products       = lazy(() => import('./components/pages/Products'))
const ProductDetail  = lazy(() => import('./components/pages/ProductDetail'))
const ProductViewer  = lazy(() => import('./components/pages/ProductViewer'))
const About          = lazy(() => import('./components/pages/About'))
const Contact        = lazy(() => import('./components/pages/Contact'))
const AdminLogin     = lazy(() => import('./components/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const StaffQRPage    = lazy(() => import('./components/pages/StaffQRPage'))
const QRRedirect     = lazy(() => import('./components/pages/QRRedirect'))   // ← NEW

// Secret staff path from .env
const STAFF_ROUTE = import.meta.env.VITE_STAFF_PATH || 'qr'

// Green spinner while lazy chunk loads
function PageLoader() {
  return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{
        width:38, height:38,
        border:'3px solid #d1fae5',
        borderTopColor:'#1a6b3c',
        borderRadius:'50%',
        animation:'spin 0.7s linear infinite',
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ── WhatsApp Floating Button ── */
function WhatsAppButton() {
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) return null
  if (location.pathname.startsWith('/staff')) return null
  if (location.pathname.startsWith('/qr'))    return null  // ← hide on QR redirect page

  return (
    <>
      <style>{`
        @keyframes waPulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.7); }
          70%  { box-shadow: 0 0 0 18px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        .wa-btn { animation: waPulse 2.5s infinite; transition: transform 0.25s; }
        .wa-btn:hover { transform: scale(1.1); }
      `}</style>
      <a
        href="https://wa.me/918600707575"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        style={{
          position:'fixed', bottom:24, right:24, zIndex:9999,
          width:56, height:56, borderRadius:'50%',
          background:'#25D366',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 6px 16px rgba(0,0,0,0.2)',
          textDecoration:'none',
        }}
        title="Chat with us on WhatsApp"
      >
        <img
          src="/images/icons/whatsapp.png"
          alt="WhatsApp"
          width={30} height={30}
          style={{ objectFit:'contain' }}
          loading="lazy"
        />
      </a>
    </>
  )
}

/* ── 404 Page ── */
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6 pt-[70px]">
      <div>
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="font-heading font-bold text-dark text-3xl mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary no-underline">← Go Home</a>
      </div>
    </div>
  )
}

/* ── App ── */
export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius:'12px', fontFamily:'DM Sans, sans-serif', fontSize:'14px' },
          success: { iconTheme: { primary:'#1a6b3c', secondary:'#fff' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin */}
          <Route path="/admin"       element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLoginRedirect />} />

          {/* Staff QR tool — secret URL */}
          <Route path={`/staff/${STAFF_ROUTE}`} element={<StaffQRPage />} />

          {/* ✅ Dynamic QR redirect — NO navbar/footer, just redirect */}
          <Route path="/qr/:code" element={<QRRedirect />} />

          {/* Public */}
          <Route path="*" element={<PublicApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function AdminLoginRedirect() {
  const { user } = useAuth()
  if (user) return <AdminDashboard />
  return <AdminLogin />
}

function PublicApp() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                      element={<Home />} />
          <Route path="/products"              element={<Products />} />
          <Route path="/products/:id"          element={<ProductDetail />} />
          <Route path="/products/:id/brochure" element={<ProductViewer />} />
          <Route path="/about"                 element={<About />} />
          <Route path="/contact"               element={<Contact />} />
          <Route path="*"                      element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
