/*eslint-disable*/
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
        <Route path="*" element={<PublicApp />} />
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
<>
<a
  href="https://wa.me/918600707575"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "56px",
    height: "56px",
    backgroundColor: "#25D366",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    zIndex: 9999,
    animation: "waPulse 2s infinite",
    transition: "transform 0.3s"
  }}
  onMouseEnter={(e)=> e.currentTarget.style.transform="scale(1.1)"}
  onMouseLeave={(e)=> e.currentTarget.style.transform="scale(1)"}
>
  <img
    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg"
    alt="WhatsApp"
    style={{ width: "28px", filter: "invert(1)" }}
  />
</a>

<style>
{`
@keyframes waPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(37,211,102,0.7);
  }
  70% {
    box-shadow: 0 0 0 18px rgba(37,211,102,0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37,211,102,0);
  }
}
`}
</style>
</>
      <Footer />
    </>
  )
}
