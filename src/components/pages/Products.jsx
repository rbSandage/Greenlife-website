// src/components/pages/Products.jsx
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSearch, HiX } from 'react-icons/hi'
import { useProducts } from '../../hooks'
import { CATEGORIES, CATEGORY_COLORS } from '../../data/products'

function ProductCard({ product, index }) {
  const colors = CATEGORY_COLORS[product.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
    >
      <Link to={`/products/${product.id}`} className="no-underline block bg-white rounded-2xl overflow-hidden border border-black/7 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-400 group h-full">
        <div className="h-52 flex items-center justify-center relative overflow-hidden"
          style={{ background: product.imageUrl ? `url(${product.imageUrl}) center/cover` : 'linear-gradient(135deg,#e8f5e9,#c8e6c9)' }}>
          {!product.imageUrl && <span className="text-6xl">🌿</span>}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full">⭐ Featured</div>
          )}
        </div>
        <div className="p-5">
          <span className={`inline-block text-[0.65rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 ${colors.bg} ${colors.text}`}>
            {product.category}
          </span>
          <h3 className="font-heading font-bold text-dark text-base mb-1.5 group-hover:text-green-600 transition-colors leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{product.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.crops?.slice(0, 3).map(c => (
              <span key={c} className="text-[0.63rem] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">{c}</span>
            ))}
            {product.crops?.length > 3 && <span className="text-[0.63rem] text-gray-400">+{product.crops.length - 3} more</span>}
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-black/6">
            <span className="text-xs text-gray-400 truncate mr-2">{product.activeIngredient}</span>
            <span className="flex-shrink-0 text-[0.73rem] font-semibold bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full group-hover:bg-green-600 group-hover:text-white transition-all">Details →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Products() {
  const { products, loading } = useProducts(false)
  const [search, setSearch]   = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat  = activeTab === 'All' || p.category === activeTab
      const matchSearch = !search || [p.name, p.description, p.activeIngredient, ...(p.crops || [])].some(s => s?.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [products, search, activeTab])

  return (
    <div className="pt-[70px]">
      {/* Header */}
      <div className="bg-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(82,199,134,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(82,199,134,.04) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
        <div className="max-w-6xl mx-auto px-[6%] relative z-10 text-center">
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
            <div className="inline-flex items-center gap-2 bg-green-400/12 border border-green-400/25 text-green-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
              🌿 Product Catalog
            </div>
            <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-4">Our Complete<br/>Product Range</h1>
            <p className="text-white/55 text-base max-w-lg mx-auto">Browse our full range of government-approved agri chemical solutions for every crop and every season.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-[6%] py-14">
        {/* Search + Filter */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5}} className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products, crops, ingredients..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-black/10 bg-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-all"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><HiX /></button>}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 ${activeTab === cat ? 'bg-green-600 text-white shadow-md shadow-green-600/30' : 'bg-white text-gray-600 border border-black/10 hover:border-green-400 hover:text-green-600'}`}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="text-sm text-gray-400 mb-6">{loading ? 'Loading...' : `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}{activeTab !== 'All' && ` in ${activeTab}`}{search && ` for "${search}"`}</div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,i) => <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-heading font-bold text-dark text-xl mb-2">No products found</h3>
            <p className="text-gray-500 mb-5">Try adjusting your search or filter</p>
            <button onClick={() => { setSearch(''); setActiveTab('All') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* CTA */}
      <section className="bg-green-gradient py-20 text-center">
        <div className="max-w-2xl mx-auto px-[6%]">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <h2 className="font-display font-black text-white text-3xl md:text-4xl mb-4">Looking for a specific product?</h2>
            <p className="text-white/70 mb-7">Our agri experts can help you find the right solution for your crop and pest situation.</p>
            <Link to="/contact" className="btn-white">📋 Send Enquiry →</Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
