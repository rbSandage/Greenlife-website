// src/components/pages/QRRedirect.jsx
import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../firebase/config'   // ← your existing firebase config

export default function QRRedirect() {
  const { code }               = useParams()
  const [status, setStatus]    = useState('loading') // loading|redirecting|notfound|error

  useEffect(() => {
    if (!code) { setStatus('notfound'); return }
    redirect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const redirect = async () => {
    try {
      const ref  = doc(db, 'qr_codes', code)
      const snap = await getDoc(ref)

      if (!snap.exists()) { setStatus('notfound'); return }

      const data = snap.data()

      // Check if QR is active
      if (data.active === false) { setStatus('notfound'); return }

      // Check expiry if set
      if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
        setStatus('notfound'); return
      }

      // ✅ Increment scan count silently
      updateDoc(ref, {
        scanCount: increment(1),
        lastScanned: new Date(),
      }).catch(() => {}) // non-blocking — don't fail redirect if this errors

      setStatus('redirecting')

      // Redirect after tiny delay (shows branded screen)
      setTimeout(() => {
        window.location.replace(data.destination)
      }, 800)

    } catch (err) {
      console.error('QR redirect error:', err)
      setStatus('error')
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────

  if (status === 'loading' || status === 'redirecting') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          {/* GreenLife branding */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🌿</div>
            <div>
              <p style={styles.logoName}>GreenLife</p>
              <p style={styles.logoSub}>Cropcare</p>
            </div>
          </div>

          {/* Spinner */}
          <div style={styles.spinnerWrap}>
            <div style={styles.spinner} />
          </div>

          <p style={styles.redirectText}>
            {status === 'loading' ? 'Loading…' : 'Redirecting you…'}
          </p>
          <p style={styles.redirectSub}>Please wait a moment</p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        `}</style>
      </div>
    )
  }

  if (status === 'notfound') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🌿</div>
            <div>
              <p style={styles.logoName}>GreenLife</p>
              <p style={styles.logoSub}>Cropcare</p>
            </div>
          </div>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
            QR Code Not Found
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 24 }}>
            This QR code has expired, been removed,<br />or does not exist.
          </p>
          <a href="/" style={styles.homeBtn}>← Visit GreenLife Cropcare</a>
        </div>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }`}</style>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
            Could not load this QR code. Please try again.
          </p>
          <button onClick={redirect} style={styles.homeBtn}>Try Again</button>
        </div>
      </div>
    )
  }

  return null
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0fdf4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: '44px 36px',
    textAlign: 'center',
    maxWidth: 360,
    width: '100%',
    boxShadow: '0 20px 60px rgba(22,101,52,0.1), 0 4px 16px rgba(0,0,0,0.06)',
    animation: 'fadeUp 0.35s ease both',
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  logoIcon: {
    width: 40, height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg,#16a34a,#15803d)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20,
  },
  logoName: { fontSize: 15, fontWeight: 800, color: '#14532d', lineHeight: 1, textAlign: 'left' },
  logoSub:  { fontSize: 11, color: '#16a34a', fontWeight: 600, lineHeight: 1.4, textAlign: 'left' },
  spinnerWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  spinner: {
    width: 44, height: 44,
    border: '4px solid #d1fae5',
    borderTopColor: '#16a34a',
    borderRadius: '50%',
    animation: 'spin 0.75s linear infinite',
  },
  redirectText: { fontSize: 16, fontWeight: 700, color: '#14532d', marginBottom: 4 },
  redirectSub:  { fontSize: 13, color: '#9ca3af' },
  homeBtn: {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: 12,
    background: 'linear-gradient(135deg,#16a34a,#15803d)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'inherit',
  },
}
