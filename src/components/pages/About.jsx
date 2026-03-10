// src/components/pages/About.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Building2, BadgeCheck,
  Wheat, FlaskConical, CheckCircle, Leaf,
  Users,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
//  ICON COMPONENT
//
//  • If png path is provided → shows your PNG image
//  • Otherwise              → shows the Lucide icon
//
//  To swap any icon to a custom PNG/SVG image:
//    1. Drop your file in /public/images/icons/
//    2. Uncomment the png line next to that item in the data
//       e.g.  png: '/images/icons/mission.png'
//    3. Done — no other code changes needed
// ─────────────────────────────────────────────────────────────
function Icon({ png, lucide: LucideIcon, size = 22, color = '#16a34a' }) {
  if (png) {
    return (
      <img
        src={png} alt=""
        style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    )
  }
  return <LucideIcon size={size} color={color} strokeWidth={1.8} />
}

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────
const TIMELINE = [
  { year: '2004', title: 'Company Founded',          desc: 'GreenLife Cropcare started as a small agri chemical distributor in Nagpur, Maharashtra.' },
  { year: '2008', title: 'ISO Certification',         desc: 'Achieved ISO 9001 certification for quality management systems in product handling.' },
  { year: '2012', title: 'Pan-Maharashtra Expansion', desc: 'Expanded dealer network to all 36 districts of Maharashtra with 200+ active dealers.' },
  { year: '2016', title: '100+ Product Portfolio',    desc: 'Crossed the milestone of 100 registered agri chemical products across all categories.' },
  { year: '2020', title: 'Multi-State Operations',    desc: 'Expanded to Gujarat, Madhya Pradesh and Rajasthan. Serving 10,000+ farmers.' },
  { year: '2024', title: 'Digital Transformation',    desc: 'Launched digital presence to serve more farmers and dealers across India.' },
]

const TEAM = [
  { name: 'Ashok Sabale', role: 'Managing Director', exp: '20+ years in agri chemicals',
    lucide: Users,
    // png: '/images/team/ashok.png',  ← uncomment + add photo to use PNG
  },
  { name: 'Amit Shinde',  role: 'Technical Head',    exp: 'M.Sc. Agriculture, 15 years',
    lucide:Users,
    // png: '/images/team/amit.png',
  },
  { name: 'Chinmay',      role: 'Sales Director',    exp: 'Pan-India dealer network',
    lucide: Users,
    // png: '/images/team/chinmay.png',
  },
  { name: 'Rushikesh',    role: 'Quality Manager',   exp: 'ISO certified QA specialist',
    lucide: Users,
    // png: '/images/team/rushikesh.png',
  },
]

const CERTS = [
  { lucide: Building2,    title: 'CIB Registered',     sub: 'Central Insecticides Board',  color: '#16a34a', light: '#f0fdf4',
    // png: '/images/certs/cib.png',
  },
  { lucide: BadgeCheck,   title: 'ISO 9001:2015',       sub: 'Quality Management System',   color: '#0891b2', light: '#ecfeff',
    // png: '/images/certs/iso.png',
  },
  { lucide: Wheat,        title: 'Agri Dept. Approved', sub: 'Maharashtra Government',      color: '#ca8a04', light: '#fefce8',
    // png: '/images/certs/agri.png',
  },
  { lucide: FlaskConical, title: 'NABL Accredited',     sub: 'Lab Testing Certified',       color: '#7c3aed', light: '#f5f3ff',
    // png: '/images/certs/nabl.png',
  },
  { lucide: CheckCircle,  title: 'BIS Certified',       sub: 'Bureau of Indian Standards',  color: '#059669', light: '#f0fdf4',
    // png: '/images/certs/bis.png',
  },
]

const STATS = [
  { value: '20+',     label: 'Years Experience'    },
  { value: '100+',    label: 'Products Registered' },
  { value: '10,000+', label: 'Farmers Served'      },
  { value: '36',      label: 'Districts Covered'   },
]

const MVV = [
  // { lucide: Target, title: 'Our Mission', color: '#16a34a', light: '#f0fdf4',
    {png: '/images/icons/mission1.png',title: 'Our Mission',color: '#15bd53', light: '#f0fdf4',
    text: 'To provide every Indian farmer with safe, effective, government-approved agri chemical solutions that maximize crop yield while protecting the environment.' },
  // { lucide: Eye,    title: 'Our Vision',  color: '#0891b2', light: '#ecfeff',
   { png: '/images/icons/vision.png',title: 'Our Vision',  color: '#0891b2', light: '#ecfeff',
    text: 'To be the most trusted agri chemical brand in India — known for product quality, technical support, and genuine commitment to farmer welfare.' },
  // { lucide: Star,   title: 'Our Values',  color: '#7c3aed', light: '#f5f3ff',
   { png: '/images/icons/values.png',title: 'Our Values',  color: '#7c3aed', light: '#f5f3ff',
    text: 'Quality without compromise. Transparency in every transaction. Farmer welfare above profit. Scientific approach to agriculture.' },
]

const HERO_GRADIENT = 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #1a6b38 100%)'

// ─────────────────────────────────────────────────────────────
//  SECTION HEADER — reusable centred header
// ─────────────────────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 32 }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#16a34a', marginBottom: 4 }}>
        {label}
      </p>
      <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)', fontWeight: 800, color: '#111827' }}>
        {title}
      </h2>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="pt-[70px]" style={{ background: '#f5f6f8' }}>

      {/* ══════ HERO ══════ */}
     <div
  style={{
    background: HERO_GRADIENT,
    padding: '52px 0 70px',
    position: 'relative',
    overflow: 'hidden'   // VERY IMPORTANT
  }}
>

  {/* Background PNG */}
  <img
    src="/images/hero/herobg.png"
    alt=""
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      maxHeight: '550px',   // limits height
      objectFit: 'cover',
      opacity: 0.24,
      pointerEvents: 'none'
    }}
  />

  <div
    className="max-w-4xl mx-auto px-[6%]"
    style={{ position: 'relative', zIndex: 2 }}
  >
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            {/* Badge */}
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                color: '#86efac', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '6px 16px', borderRadius: 999, marginBottom: 20,
              }}
            >
              {/* ↓ Replace with PNG: add  png="/images/icons/leaf.png"  to use custom image */}
              <Icon lucide={Leaf} size={14} color="#86efac" />
              About Us
            </span>

            <h1 style={{
              fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 12,
              fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)',
            }}>
              20 Years of Protecting<br />
              <span style={{ color: '#4ade80', fontStyle: 'italic' }}>India's Harvests</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7, maxWidth: 440, marginBottom: 36 }}>
              Since 2004, GreenLife Cropcare has been the trusted agri chemical partner for farmers
              and dealers across Western and Central India.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 40px', justifyContent: 'center' }}>
              {STATS.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(134,239,172,0.6)', marginTop: 3 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════ MISSION / VISION / VALUES ══════ */}
      <section style={{ background: '#f5f6f8', padding: '52px 0' }}>
        <div className="max-w-6xl mx-auto px-[6%]">
          <SectionHeader label="Who We Are" title="Built on Purpose" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MVV.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.09 }}
                style={{
                  background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.05)', padding: '24px 20px',
                  textAlign: 'center', transition: 'all 0.22s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.09)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: item.light,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px',
                }}>
                  {/* To use PNG: add  png="/images/icons/mission.png"  to the item in MVV data */}
                  <Icon lucide={item.lucide} png={item.png} size={40} color={item.color} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: item.color, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.65 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TIMELINE ══════ */}
      <section style={{ background: '#fff', padding: '52px 0' }}>
        <div className="max-w-4xl mx-auto px-[6%]">
          <SectionHeader label="Our Journey" title="Two Decades of Growth" />

          <div className="relative">
            {/* Vertical line — left on mobile, centre on desktop */}
            <div className="absolute top-0 bottom-0 left-8 md:left-1/2"
              style={{ width: 1, background: 'linear-gradient(to bottom,rgba(22,163,74,0.4),rgba(74,222,128,0.4))' }} />

            {TIMELINE.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`relative flex items-start mb-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Dot */}
                <div className="absolute left-[26px] md:left-1/2 md:-translate-x-1/2 z-10"
                  style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#16a34a,#4ade80)',
                    border: '3px solid #fff',
                    boxShadow: '0 0 0 3px rgba(22,163,74,0.18)',
                    flexShrink: 0,
                  }} />

                {/* Card — offset from dot on mobile, half-width alternating on desktop */}
                <div className={`ml-14 w-full md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
                  <div style={{
                    background: '#fff', borderRadius: 14,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                    padding: '14px 16px',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 2 }}>{item.year}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TEAM ══════ */}
      <section style={{ background: '#f5f6f8', padding: '52px 0' }}>
        <div className="max-w-6xl mx-auto px-[6%]">
          <SectionHeader label="Our Team" title="The People Behind GreenLife" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEAM.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  background: '#fff', borderRadius: 16, overflow: 'hidden',
                  border: '1px solid #e5e7eb', boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                  textAlign: 'center', transition: 'all 0.22s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.09)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)' }}
              >
                <div style={{ height: 5, background: HERO_GRADIENT }} />
                <div style={{ padding: '20px 16px' }}>
                  {/* Avatar — shows PNG photo if set, else SVG icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px', overflow: 'hidden',
                  }}>
                    {/* Uncomment png in TEAM data to show a real photo */}
                    <Icon lucide={m.lucide} png={m.png} size={26} color="#16a34a" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', marginBottom: 5 }}>{m.role}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>{m.exp}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CERTIFICATIONS ══════ */}
{/* ══════ CERTIFICATIONS ══════ */}
<section style={{ padding: '56px 0', background: '#f3f3c8' }}>
  <div className="max-w-5xl mx-auto px-[6%]">

    <SectionHeader
      label="Certifications"
      title="Government Certified & Industry Approved"
    />

    {/* Background Container */}
    <div
      style={{
        background: '#051f0c',
        borderRadius: 18,
        padding: '26px',
        border: '1px solid #bbf7d0'
      }}
    >

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        {CERTS.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}

            style={{
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              padding: '16px 12px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}

            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}

            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >

            {/* Icon */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 8
            }}>
              <Icon lucide={c.lucide} png={c.png} size={20} color={c.color} />
            </div>

            {/* Title */}
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#111827'
            }}>
              {c.title}
            </div>

            {/* Subtitle */}
            <div style={{
              fontSize: 10,
              color: '#6b7280',
              marginTop: 3
            }}>
              {c.sub}
            </div>

          </motion.div>
        ))}

      </div>

    </div>

  </div>
</section>

      {/* ══════ PARTNER WITH US — left-aligned, gradient + dots ══════ */}
      <section style={{ position: 'relative', overflow: 'hidden', background: HERO_GRADIENT, padding: '44px 0' }}>

        {/* Small dot pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(134,239,172,0.18) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.55,
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-[6%]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Left — text */}
            <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>

              {/* Small label */}
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#86efac', marginBottom: 8,
              }}>
                Get In Touch
              </span>

              {/* One-line heading */}
              <h2 style={{
                fontWeight: 800, color: '#fff', lineHeight: 1.15, whiteSpace: 'nowrap',
                fontSize: 'clamp(1.3rem, 2.6vw, 1.9rem)', marginBottom: 8,
              }}>
                Partner With Us
              </h2>

              <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, lineHeight: 1.65, maxWidth: 380 }}>
                Become a dealer or send a product enquiry —<br className="hidden md:block" />
                our team responds within 24 hours.
              </p>
            </motion.div>

            {/* Right — buttons */}
            <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'row', gap: 10, flexShrink: 0 }}>
              <Link to="/contact"
                className="no-underline hover:scale-105 transition-transform duration-200"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', borderRadius: 999,
                  fontWeight: 700, fontSize: 13, color: '#14532d',
                  background: 'linear-gradient(135deg,#bbf7d0,#86efac)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap',
                }}>
                Contact Us →
              </Link>
              <Link to="/products"
                className="no-underline hover:scale-105 transition-transform duration-200"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', borderRadius: 999,
                  fontWeight: 700, fontSize: 13, color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  background: 'rgba(255,255,255,0.08)',
                  whiteSpace: 'nowrap',
                }}>
                View Products
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  )
}
