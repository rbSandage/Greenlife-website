/*eslint-disable*/
// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks'

import Navbar  from './components/layout/Navbar'
import Footer  from './components/layout/Footer'

import Home          from './components/pages/Home'
import Products      from './components/pages/Products'
import ProductDetail from './components/pages/ProductDetail'
import About         from './components/pages/About'
import Contact       from './components/pages/Contact'
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
        {/* Admin routes — no navbar/footer */}
        <Route path="/admin"       element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLoginRedirect />} />

        {/* Public routes — with navbar/footer */}
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
        <Route path="/"             element={<Home />} />
        <Route path="/products"     element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about"        element={<About />} />
        <Route path="/contact"      element={<Contact />} />
        <Route path="*"             element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
