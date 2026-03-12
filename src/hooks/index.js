// src/hooks/index.js
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, where, serverTimestamp
} from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase/config'

// ── useAuth ───────────────────────────────────────────────
export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false) })
    return unsub
  }, [])
  const login  = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const logout = () => signOut(auth)
  return { user, loading, login, logout }
}

// ── useProducts ───────────────────────────────────────────
export function useProducts(onlyActive = true) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  useEffect(() => {
    const q = onlyActive
      ? query(collection(db, 'products'), where('active','==',true), orderBy('createdAt','desc'))
      : query(collection(db, 'products'), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q,
      snap => { setProducts(snap.docs.map(d => ({ id:d.id, ...d.data() }))); setLoading(false) },
      err  => { setError(err.message); setLoading(false) }
    )
    return unsub
  }, [onlyActive])
  return { products, loading, error }
}
// ─── useProductCRUD (Cloudinary Version) ───────────────────

export function useProductCRUD() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Upload to Cloudinary
  const uploadImage = useCallback(async (file) => {
    if (!file) return null

    setUploading(true)
    setProgress(10)

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData
        }
      )

      const data = await res.json()

      setProgress(100)
      setUploading(false)
      setTimeout(() => setProgress(0), 500)

      return data.secure_url

    } catch (error) {
      setUploading(false)
      setProgress(0)
      throw error
    }
  }, [])

  // Upload PDF to Cloudinary (raw upload)
  const uploadPdf = useCallback(async (file) => {
    if (!file) return null

    const cloudName   = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,  // ← raw not image
      { method: 'POST', body: formData }
    )

    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.secure_url
  }, [])

  const addProduct = useCallback(async (data, imageFile) => {
    let imageUrl = ""

    if (imageFile) {
      imageUrl = await uploadImage(imageFile)
    }

    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      imageUrl,
      createdAt: serverTimestamp(),
      
    })

    return docRef.id
  }, [uploadImage])

  const updateProduct = useCallback(async (id, data, imageFile) => {
    let imageUrl = data.imageUrl

    if (imageFile) {
      imageUrl = await uploadImage(imageFile)
    }

    await updateDoc(doc(db, 'products', id), {
      ...data,
      imageUrl,
      updatedAt: serverTimestamp(),
    })
  }, [uploadImage])

  const deleteProduct = useCallback(async (id) => {
    await deleteDoc(doc(db, 'products', id))
    // Cloudinary images are NOT auto-deleted (requires backend with API secret)
  }, [])

  const toggleField = useCallback(async (id, field, value) => {
    await updateDoc(doc(db, 'products', id), { [field]: value })
  }, [])

  return { addProduct, updateProduct, deleteProduct, toggleField, uploadPdf, uploading, progress }
}



// ── useEnquiries ──────────────────────────────────────────
export function useEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading,   setLoading]   = useState(true)
  useEffect(() => {
    const q = query(collection(db, 'enquiries'), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q, snap => {
      setEnquiries(snap.docs.map(d => ({ id:d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])
  const addEnquiry    = (data) => addDoc(collection(db,'enquiries'), { ...data, createdAt: serverTimestamp(), read: false })
  const markRead      = (id)   => updateDoc(doc(db,'enquiries',id), { read: true })
  const deleteEnquiry = (id)   => deleteDoc(doc(db,'enquiries',id))
  return { enquiries, loading, addEnquiry, markRead, deleteEnquiry }
}

// ── useScrollReveal ───────────────────────────────────────
export function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ── useCountUp ────────────────────────────────────────────
export function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const step = target / (duration / 20)
        let cur = 0
        const id = setInterval(() => {
          cur += step
          if (cur >= target) { setCount(target); clearInterval(id) }
          else setCount(Math.floor(cur))
        }, 20)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return [count, ref]
}
