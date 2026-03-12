/*eslint-disable*/
// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks'

import Navbar  from './components/layout/Navbar'
import Footer  from './components/layout/Footer'

import Home           from './components/pages/Home'
import Products       from './components/pages/Products'
import ProductDetail  from './components/pages/ProductDetail'
import ProductViewer  from './components/pages/ProductViewer'
import About          from './components/pages/About'
import Contact        from './components/pages/Contact'
import AdminLogin     from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import ProtectedRoute from './components/admin/ProtectedRoute'

/* ── WhatsApp Floating Button ── */
function WhatsAppButton() {
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) return null

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
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          textDecoration: 'none',
        }}
        title="Chat with us on WhatsApp"
      >
        <img
          src="/images/icons/whatsapp.png"
          alt="WhatsApp"
          style={{ width: 30, height: 30, objectFit: 'contain' }}
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
          style: { borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#1a6b3c', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/admin"       element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLoginRedirect />} />
        <Route path="*"            element={<PublicApp />} />
      </Routes>
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
      <Routes>
        <Route path="/"                      element={<Home />} />
        <Route path="/products"              element={<Products />} />
        <Route path="/products/:id"          element={<ProductDetail />} />
        <Route path="/products/:id/brochure" element={<ProductViewer />} />
        <Route path="/about"                 element={<About />} />
        <Route path="/contact"               element={<Contact />} />
        <Route path="*"                      element={<NotFound />} />
      </Routes>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
