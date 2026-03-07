// src/components/home/Testimonials.jsx
import { motion } from 'framer-motion'

const REVIEWS = [
  {
    stars:    5,
    quote:    'GreenLife ke Chlorpyrifos ne meri cotton crop ko completely save kar liya. Teen din mein results aane lage.',
    name:     'Ramesh Patil',
    role:     'Cotton Farmer',
    location: 'Akola, MH',
    crop:     'Cotton',
    initials: 'RP',
    color:    '#1a6b3c',
    light:    '#e8f5e9',
  },
  {
    stars:    5,
    quote:    '5 saal se GreenLife ka dealer hoon. Product quality aur support mein koi compromise nahi. Best agri brand.',
    name:     'Suresh Deshmukh',
    role:     'Agri Dealer',
    location: 'Nagpur, MH',
    crop:     'Dealer',
    initials: 'SD',
    color:    '#92400e',
    light:    '#fef3c7',
  },
  {
    stars:    5,
    quote:    'NPK 19:19:19 ke baad tomato yield 30% bad.Remarkable improvement aaya colour aur growth mein.',
    name:     'Mahesh Shinde',
    role:     'Vegetable Farmer',
    location: 'Pune, MH',
    crop:     'Tomato',
    initials: 'MS',
    color:    '#1e5f8e',
    light:    '#eff6ff',
  },
  // {
  //   stars:    5,
  //   quote:    'Mancozeb ne meri grape crop ko fungal attack se bachaya. Bahut effective — har season recommend karta hoon.',
  //   name:     'Vijay Kulkarni',
  //   role:     'Grape Farmer',
  //   location: 'Nashik, MH',
  //   crop:     'Grapes',
  //   initials: 'VK',
  //   color:    '#1a6b3c',
  //   light:    '#e8f5e9',
  // },
  {
    stars:    5,
    quote:    'Imidacloprid se whitefly problem completely khatam ho gayi. Systemic action bahut fast hai. Great product.',
    name:     'Prakash More',
    role:     'Cotton Farmer',
    location: 'Aurangabad, MH',
    crop:     'Cotton',
    initials: 'PM',
    color:    '#5b21b6',
    light:    '#f5f3ff',
  },
  // {
  //   stars:    5,
  //   quote:    'GreenLife ke products reliable hain. Delivery on time aur pricing bhi fair hai. Highly recommend to all farmers.',
  //   name:     'Dinesh Jadhav',
  //   role:     'Soybean Farmer',
  //   location: 'Latur, MH',
  //   crop:     'Soybean',
  //   initials: 'DJ',
  //   color:    '#92400e',
  //   light:    '#fef3c7',
  // },
]

// Double the array so marquee loops seamlessly
const DOUBLED = [...REVIEWS, ...REVIEWS]

function Card({ r }) {
  return (
    <div
      className="flex-shrink-0 w-64 bg-white rounded-2xl p-5 border border-green-100 mx-2"
      style={{ boxShadow: '0 2px 12px rgba(26,107,60,.07)' }}
    >
      {/* Top bar */}
      <div className="h-0.5 rounded-full mb-3 w-full" style={{ background: `linear-gradient(90deg, ${r.color}, transparent)` }}/>

      {/* Stars */}
      <div className="text-amber-400 text-xs tracking-widest mb-2">{'★'.repeat(r.stars)}</div>

      {/* Quote */}
      <p className="font-sans text-xs leading-relaxed italic mb-3" style={{ color: '#4a6452' }}>
        "{r.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-2 pt-2 border-t border-green-50">
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-heading font-bold"
          style={{ background: r.light, color: r.color }}
        >
          {r.initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-xs truncate" style={{ color: '#0d2a14' }}>{r.name}</p>
          <p className="font-sans text-[9px] truncate" style={{ color: '#8faa92' }}>{r.role} · {r.location}</p>
        </div>

        {/* Crop pill */}
        <span
          className="font-heading font-bold rounded-full px-2 py-0.5 text-[8px] tracking-wide uppercase flex-shrink-0"
          style={{ color: r.color, background: r.light }}
        >
          {r.crop}
        </span>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testi-heading"
      className="relative overflow-hidden py-12"
      style={{ background: '#fbfaf7' }}  
    >
      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(26,107,60,.045) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-[5%] mb-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .5 }}
        >
          <div className="section-label">Farmer Stories</div>
          <h2 id="testi-heading" className="section-title m-0">
            Trusted by Those Who{' '}
            <em className="font-display italic" style={{ color: '#1a6b3c' }}>Work the Land</em>
          </h2>
        </motion.div>
      </div>

      {/* ── Running marquee strip ── */}
      <div className="relative z-10 overflow-hidden">

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #f0f7f2, transparent)' }}/>
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #f0f7f2, transparent)' }}/>

        {/* Row 1 — left */}
        <div className="flex" style={{ animation: 'marqueeLeft 32s linear infinite' }}>
          {DOUBLED.map((r, i) => <Card key={`a${i}`} r={r} />)}
        </div>

        {/* Row 2 — right (reverse) */}
        {/* <div className="flex" style={{ animation: 'marqueeRight 36s linear infinite' }}>
          {DOUBLED.map((r, i) => <Card key={`b${i}`} r={r} />)}
        </div> */}
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: .6, delay: .3 }}
        className="relative z-10 flex items-center justify-center gap-2 mt-8"
      >
        <div className="w-6 h-px bg-green-200"/>
        <span className="font-heading font-bold text-[9px] tracking-[.18em] uppercase text-green-600">
          Verified Farmer Reviews · Maharashtra
        </span>
        <div className="w-6 h-px bg-green-200"/>
      </motion.div>

      {/* Keyframes */}
      <style>{`
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="marqueeLeft"], [style*="marqueeRight"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
