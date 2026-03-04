// src/components/admin/AdminLogin.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const { login } = useAuth()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const submit = async e => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in both fields'); return }
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(rgba(82,199,134,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(82,199,134,.04) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(26,107,60,.25),transparent_65%)]" />

      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}
        className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🌿</div>
          <h1 className="font-heading font-extrabold text-white text-2xl">GreenLife Admin</h1>
          <p className="text-white/40 text-sm mt-1.5">Sign in to manage your website</p>
        </div>

        <form onSubmit={submit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="mb-5">
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@greenlifecropcare.com"
              className="w-full bg-white/8 border border-white/15 text-green placeholder-white/25 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/15 transition-all"
            />
          </div>
          <div className="mb-7">
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Enter your password"
                className="w-full bg-white/8 border border-white/15 text-green placeholder-white/25 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/15 transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-sm">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-4 rounded-xl font-heading font-bold text-base transition-all duration-300 ${loading ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-600/30'}`}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-xs text-white/25 mt-6">GreenLife Cropcare Admin Portal · Secured by Firebase</p>
      </motion.div>
    </div>
  )
}
