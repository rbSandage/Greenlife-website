// src/components/admin/AdminDashboard.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth, useProducts, useProductCRUD, useEnquiries } from '../../hooks'
import { HiLogout, HiPlus, HiPencil, HiTrash, HiStar, HiEye, HiEyeOff, HiMail, HiMailOpen, HiX, HiMenu, HiDownload, HiDocumentText } from 'react-icons/hi'
import QRCode from 'qrcode'

/* ── Category colours (no external dependency) ──────────── */
const CATEGORY_COLORS = {
  Fungicide:        { bg: 'bg-purple-100', text: 'text-purple-700' },
  Insecticide:      { bg: 'bg-cyan-100',   text: 'text-cyan-700'   },
  Herbicide:        { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Fertilizer:       { bg: 'bg-red-100',    text: 'text-red-700'    },
 'Bio-pesticide':  { bg: 'bg-green-100',  text: 'text-green-700'  },
  PGR:              { bg: 'bg-violet-100', text: 'text-violet-700' },
}


/* ── Categories ─────────────────────────────────────────── */
const CATEGORIES = ['Fungicide', 'Insecticide', 'Herbicide', 'Fertilizer', 'Bio-pesticide', 'PGR']

/* ── ProductForm ────────────────────────────────────────── */
const EMPTY = { name:'', category:'Insecticide', description:'', activeIngredient:'', dosage:'', formulation:'', packSizes:'', crops:'', safetyInfo:'', featured:false, active:true, imageUrl:'', pdfUrl:'', pdfName:'' }

function ProductForm({ initial = EMPTY, onSave, onCancel, uploading, progress, uploadPdf }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial, packSizes: Array.isArray(initial.packSizes) ? initial.packSizes.join(', ') : initial.packSizes || '', crops: Array.isArray(initial.crops) ? initial.crops.join(', ') : initial.crops || '' })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview]     = useState(initial.imageUrl || '')
  const [pdfFile, setPdfFile]         = useState(null)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfUrl, setPdfUrl]           = useState(initial.pdfUrl || '')
  const [pdfName, setPdfName]         = useState(initial.pdfName || '')
  const [qrDataUrl, setQrDataUrl]     = useState('')

  const handlePdf = async e => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 20 * 1024 * 1024) { toast.error('File must be under 20MB'); return }
    setPdfFile(f)
    setPdfUploading(true)
    try {
      const url = await uploadPdf(f)
      setPdfUrl(url)
      setPdfName(f.name)
      // QR uses domain URL if editing existing product, else direct URL (re-download after save)
      const productId = initial?.id
      const pageUrl = productId
        ? `${process.env.REACT_APP_SITE_URL}/products/${productId}/brochure`
        : url
      const qr = await QRCode.toDataURL(pageUrl, {
        width: 300, margin: 2,
        color: { dark: '#052e16', light: '#ffffff' },
      })
      setQrDataUrl(qr)
      toast.success(productId
        ? 'File uploaded — QR ready!'
        : 'File uploaded! Save product then use 🔲 in table to get final QR.')
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally { setPdfUploading(false) }
  }

  const downloadQR = () => {
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `${form.name || 'product'}-QR.png`
    a.click()
  }

  const handle = e => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImage = e => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const submit = e => {
    e.preventDefault()
    if (!form.name || !form.category) { toast.error('Name and category are required'); return }
    const data = { ...form, packSizes: form.packSizes.split(',').map(s => s.trim()).filter(Boolean), crops: form.crops.split(',').map(s => s.trim()).filter(Boolean), pdfUrl, pdfName }
    onSave(data, imageFile)
  }

  const input = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-all"
  const label = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5"

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Product Name *</label>
          <input name="name" value={form.name} onChange={handle} required placeholder="e.g. Chlorpyrifos 20% EC" className={input} />
        </div>
        <div>
          <label className={label}>Category *</label>
          <select name="category" value={form.category} onChange={handle} className={`${input} bg-white`}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Description</label>
        <textarea name="description" value={form.description} onChange={handle} rows={3} placeholder="Full product description..." className={`${input} resize-none`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Active Ingredient</label>
          <input name="activeIngredient" value={form.activeIngredient} onChange={handle} placeholder="e.g. Chlorpyrifos 20%" className={input} />
        </div>
        <div>
          <label className={label}>Dosage</label>
          <input name="dosage" value={form.dosage} onChange={handle} placeholder="e.g. 2 ml per litre" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Formulation</label>
          <input name="formulation" value={form.formulation} onChange={handle} placeholder="e.g. Emulsifiable Concentrate" className={input} />
        </div>
        <div>
          <label className={label}>Pack Sizes (comma-separated)</label>
          <input name="packSizes" value={form.packSizes} onChange={handle} placeholder="250ml, 500ml, 1L" className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Suitable Crops (comma-separated)</label>
        <input name="crops" value={form.crops} onChange={handle} placeholder="Cotton, Rice, Wheat, Soybean" className={input} />
      </div>

      <div>
        <label className={label}>Safety Information</label>
        <textarea name="safetyInfo" value={form.safetyInfo} onChange={handle} rows={2} placeholder="Safety and handling instructions..." className={`${input} resize-none`} />
      </div>

      {/* Image */}
      <div>
        <label className={label}>Product Image (max 5MB)</label>
        <div className="flex gap-4 items-start">
          <label className="flex-1 flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <span className="text-2xl mb-1">📸</span>
            <span className="text-xs text-gray-400">{imageFile ? imageFile.name : 'Click to upload image'}</span>
          </label>
          {preview && <img src={preview} alt="Preview" className="w-28 h-28 object-cover rounded-xl border border-gray-100" />}
        </div>
        {uploading && <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 transition-all" style={{width:`${progress}%`}} /></div>}
      </div>

      {/* ── PDF Brochure + QR Code ── */}
      <div>
        <label className={label}>Product PDF or Image (brochure / label)</label>
        <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
          <input type="file" accept=".pdf,image/*" onChange={handlePdf} className="hidden" />
          <span className="text-xl mb-0.5">📄</span>
          <span className="text-xs text-gray-400">
            {pdfUploading ? 'Uploading...' : pdfFile ? pdfFile.name : pdfName ? pdfName : 'Click to upload PDF or Image'}
          </span>
        </label>

        {/* Existing PDF link */}
        {pdfUrl && !pdfUploading && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-green-600 mt-2 no-underline hover:underline">
            <HiDocumentText /> {pdfName || 'View attached PDF'}
          </a>
        )}

        {/* Upload progress */}
        {pdfUploading && (
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-pulse w-full" />
          </div>
        )}

        {/* QR Code preview + download */}
        {qrDataUrl && (
          <div className="mt-4 flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <img src={qrDataUrl} alt="QR Code" className="rounded-lg border border-gray-200" style={{ width: 90, height: 90 }} />
            <div>
              <p className="text-xs font-bold text-gray-700 mb-0.5">QR Code Ready ✓</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Scan opens PDF directly on phone.<br />Print &amp; stick on bottle label.
              </p>
              <button type="button" onClick={downloadQR}
                className="inline-flex items-center gap-1.5 text-xs px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors">
                <HiDownload /> Download QR PNG
              </button>
            </div>
          </div>
        )}

        {/* Show existing QR if product already has PDF */}
        {!qrDataUrl && pdfUrl && (
          <button type="button"
            onClick={async () => {
              const productId = initial?.id
              const pageUrl = productId
                ? `${process.env.REACT_APP_SITE_URL}/products/${productId}/brochure`
                : pdfUrl
              const qr = await QRCode.toDataURL(pageUrl, { width: 300, margin: 2, color: { dark: '#052e16', light: '#ffffff' } })
              setQrDataUrl(qr)
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs px-4 py-2 border border-green-300 text-green-700 rounded-lg font-bold hover:bg-green-50 transition-colors">
            🔲 Regenerate QR Code
          </button>
        )}
      </div>

      <div className="flex gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handle} className="w-4 h-4 accent-green-600 rounded" />
          <span className="text-sm font-medium text-gray-600">Featured on Homepage</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="active" checked={form.active} onChange={handle} className="w-4 h-4 accent-green-600 rounded" />
          <span className="text-sm font-medium text-gray-600">Visible on Website</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={uploading}
          className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-heading font-bold hover:bg-green-500 transition-all disabled:opacity-50">
          {uploading ? `Uploading ${progress}%...` : '💾 Save Product'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-all font-medium">Cancel</button>
      </div>
    </form>
  )
}

/* ── Modal ──────────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
        <motion.div initial={{opacity:0,scale:.97,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.97}} transition={{duration:.25}}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
          <div className="flex justify-between items-center p-7 border-b border-gray-100">
            <h3 className="font-heading font-bold text-dark text-xl">{title}</h3>
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"><HiX /></button>
          </div>
          <div className="p-7">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Main Dashboard ─────────────────────────────────────── */
export default function AdminDashboard() {
  const { logout } = useAuth()
  const { products, loading: pLoad } = useProducts(false)
  const { enquiries, loading: eLoad, markRead, deleteEnquiry } = useEnquiries()
  const { addProduct, updateProduct, deleteProduct, toggleField, uploadPdf, uploading, progress } = useProductCRUD()

  const [tab,     setTab]     = useState('products')
  const [modal,   setModal]   = useState(null) // 'add' | 'edit' | 'enquiry'
  const [editing, setEditing] = useState(null)
  const [selEnq,  setSelEnq]  = useState(null)
  const [sideOpen, setSide]   = useState(false)

  const handleSave = async (data, file) => {
    try {
      if (editing) {
        await updateProduct(editing.id, data, file)
        toast.success('Product updated!')
      } else {
        const newId = await addProduct(data, file)
        toast.success('Product added!')
        // Auto-download QR if PDF was attached
        if (data.pdfUrl && newId) {
          const pageUrl = `${process.env.REACT_APP_SITE_URL}/products/${newId}/brochure`
          const qr = await QRCode.toDataURL(pageUrl, { width: 300, margin: 2, color: { dark: '#052e16', light: '#ffffff' } })
          const a = document.createElement('a')
          a.href = qr
          a.download = `${data.name}-QR.png`
          a.click()
        }
      }
      setModal(null); setEditing(null)
    } catch (e) { toast.error(e.message) }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try { await deleteProduct(product.id, product.imageUrl); toast.success('Product deleted') }
    catch (e) { toast.error(e.message) }
  }

  const unread = enquiries.filter(e => !e.read).length

  const SIDEBAR_LINKS = [
    { id:'products', icon:'📦', label:'Products' },
    { id:'enquiries', icon:'📋', label:'Enquiries', badge: unread },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark flex flex-col transition-transform duration-300 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🌿</div>
          <div>
            <div className="font-heading font-bold text-white text-sm">GreenLife Admin</div>
            <div className="text-[0.6rem] text-white/35 uppercase tracking-widest">Management Panel</div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="text-[0.6rem] text-white/25 uppercase tracking-widest px-3 mb-3">Menu</div>
          {SIDEBAR_LINKS.map(l => (
            <button key={l.id} onClick={() => { setTab(l.id); setSide(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${tab === l.id ? 'bg-green-600/20 text-green-400 border border-green-600/25' : 'text-white/55 hover:text-white hover:bg-white/5'}`}>
              <span>{l.icon}</span>
              <span>{l.label}</span>
              {l.badge > 0 && <span className="ml-auto bg-red-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full">{l.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/8">
          <button onClick={() => { if(window.confirm('Sign out?')) logout() }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/55 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <HiLogout /> Sign Out
          </button>
        </div>
      </aside>
      {sideOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSide(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSide(!sideOpen)} className="lg:hidden text-gray-500 hover:text-gray-800"><HiMenu className="text-xl" /></button>
            <div>
              <h1 className="font-heading font-bold text-dark text-lg capitalize">{tab}</h1>
              <p className="text-xs text-gray-400">Manage your {tab}</p>
            </div>
          </div>
          {tab === 'products' && (
            <button onClick={() => { setEditing(null); setModal('add') }} className="btn-primary text-sm">
              <HiPlus /> Add Product
            </button>
          )}
        </header>

        <main className="p-6">
          {/* Stats bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {[
              { label:'Total Products', value: products.length, color:'bg-green-100 text-green-700', icon:'📦' },
              { label:'Active Products', value: products.filter(p=>p.active).length, color:'bg-blue-100 text-blue-700', icon:'✅' },
              { label:'Featured', value: products.filter(p=>p.featured).length, color:'bg-amber-100 text-amber-700', icon:'⭐' },
              { label:'Enquiries', value: enquiries.length, color:'bg-purple-100 text-purple-700', icon:'📋', badge: unread },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="font-heading font-bold text-dark text-2xl">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
                {s.badge > 0 && <div className="ml-auto w-5 h-5 bg-red-500 text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">{s.badge}</div>}
              </div>
            ))}
          </div>

          {/* ── Products Tab ── */}
          {tab === 'products' && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-heading font-bold text-dark">{products.length} Products</span>
              </div>
              {pLoad ? (
                <div className="p-12 text-center text-gray-400">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">📦</div>
                  <p className="text-gray-500 mb-4">No products yet</p>
                  <button onClick={() => setModal('add')} className="btn-primary text-sm"><HiPlus /> Add First Product</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>{['Product','Category','Crops','Status','Actions'].map(h => <th key={h} className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map(p => {
                        const colors = CATEGORY_COLORS[p.category] || { bg:'bg-gray-100', text:'text-gray-700' }
                        return (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center text-lg flex-shrink-0">
                                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : '🌿'}
                                </div>
                                <div>
                                  <div className="font-medium text-dark text-sm">{p.name}</div>
                                  <div className="text-xs text-gray-400">{p.activeIngredient}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4"><span className={`text-[0.65rem] font-bold uppercase px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>{p.category}</span></td>
                            <td className="px-5 py-4 text-xs text-gray-400">{p.crops?.slice(0,2).join(', ')}{p.crops?.length > 2 ? '...' : ''}</td>
                            <td className="px-5 py-4">
                              <div className="flex gap-1.5 flex-wrap">
                                <span className={`text-[0.63rem] font-bold uppercase px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.active ? 'Active' : 'Hidden'}</span>
                                {p.featured && <span className="text-[0.63rem] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleField(p.id, 'featured', !p.featured)} title="Toggle featured" className={`p-2 rounded-lg transition-all ${p.featured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'}`}><HiStar /></button>
                                <button onClick={() => toggleField(p.id, 'active', !p.active)} title="Toggle visibility" className={`p-2 rounded-lg transition-all ${p.active ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' : 'text-gray-300 hover:text-blue-400 hover:bg-blue-50'}`}>{p.active ? <HiEye /> : <HiEyeOff />}</button>
                                <button onClick={() => { setEditing(p); setModal('edit') }} title="Edit" className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"><HiPencil /></button>
                                {p.pdfUrl && (
                                  <button title="Download QR Code" className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                                    onClick={async () => {
                                      const pageUrl = `${process.env.REACT_APP_SITE_URL}/products/${p.id}/brochure`
                                      const qr = await QRCode.toDataURL(pageUrl, { width: 300, margin: 2, color: { dark: '#052e16', light: '#ffffff' } })
                                      const a  = document.createElement('a')
                                      a.href = qr
                                      a.download = `${p.name}-QR.png`
                                      a.click()
                                    }}>
                                    🔲
                                  </button>
                                )}
                                <button onClick={() => handleDelete(p)} title="Delete" className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><HiTrash /></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Enquiries Tab ── */}
          {tab === 'enquiries' && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <span className="font-heading font-bold text-dark">{enquiries.length} Enquiries {unread > 0 && <span className="text-sm text-red-500 font-normal ml-2">({unread} unread)</span>}</span>
              </div>
              {eLoad ? (
                <div className="p-12 text-center text-gray-400">Loading...</div>
              ) : enquiries.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-gray-500">No enquiries yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {enquiries.map(enq => (
                    <div key={enq.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${!enq.read ? 'bg-green-50/40' : ''}`}
                      onClick={() => { setSelEnq(enq); setModal('enquiry'); if(!enq.read) markRead(enq.id) }}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${!enq.read ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {!enq.read ? <HiMail className="text-green-600" /> : <HiMailOpen className="text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-dark text-sm">{enq.name}</span>
                          {!enq.read && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
                          <span className="text-xs text-gray-400 ml-auto">{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN') : ''}</span>
                        </div>
                        <div className="text-xs text-gray-400 truncate">{enq.phone} · {enq.product || enq.type}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); if(window.confirm('Delete this enquiry?')) deleteEnquiry(enq.id) }} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"><HiTrash /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'edit' ? `Edit — ${editing?.name}` : 'Add New Product'} onClose={() => { setModal(null); setEditing(null) }}>
          <ProductForm initial={editing || EMPTY} onSave={handleSave} onCancel={() => { setModal(null); setEditing(null) }} uploading={uploading} progress={progress} uploadPdf={uploadPdf} />
        </Modal>
      )}

      {modal === 'enquiry' && selEnq && (
        <Modal title="Enquiry Details" onClose={() => { setModal(null); setSelEnq(null) }}>
          <div className="space-y-4">
            {[['Name', selEnq.name],['Phone/WhatsApp', selEnq.phone],['Email', selEnq.email || '—'],['Type', selEnq.type],['Product Interest', selEnq.product || '—'],['Date', selEnq.createdAt ? new Date(selEnq.createdAt).toLocaleString('en-IN') : '—']].map(([k,v]) => (
              <div key={k} className="flex gap-3">
                <div className="w-36 flex-shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest pt-0.5">{k}</div>
                <div className="text-sm text-dark font-medium">{v}</div>
              </div>
            ))}
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message</div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-dark leading-relaxed">{selEnq.message}</div>
            </div>
            <div className="flex gap-3 pt-2">
              <a href={`tel:${selEnq.phone}`} className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-bold text-center hover:bg-green-500 transition-all no-underline">📞 Call Now</a>
              <a href={`https://wa.me/${selEnq.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 text-white py-3 rounded-xl text-sm font-bold text-center hover:bg-green-400 transition-all no-underline">💬 WhatsApp</a>
              {selEnq.email && <a href={`mailto:${selEnq.email}`} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-bold text-center hover:bg-gray-50 transition-all no-underline">📧 Email</a>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
