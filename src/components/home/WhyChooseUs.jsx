/*eslint-disable*/
// src/components/home/WhyChooseUs.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'

/* ── SVG Icons ── */
const LabIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 4V12L4.5 19H19.5L15 12V4" stroke="#3a6b42" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="7" y1="4" x2="17" y2="4" stroke="#3a6b42" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="9.5" cy="16.5" r=".9" fill="#c4883a" />
    <circle cx="12.5" cy="15" r="1.1" fill="#c4883a" />
    <circle cx="15.5" cy="17" r=".8" fill="#c4883a" />
  </svg>
)
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 6V11C3 16.5 7 21 12 22.5C17 21 21 16.5 21 11V6L12 2Z" stroke="#3a6b42" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M8.5 11L11 13.5L15.5 9" stroke="#c4883a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 19C5 19 7 11 12 8C17 5 20.5 6.5 20.5 6.5C20.5 6.5 18.5 14 13 17C10 18.8 6.5 19 5 19Z" stroke="#3a6b42" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5 19C5 19 8.5 15.5 12 11.5" stroke="#c4883a" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
// const TruckIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//     <rect x="2" y="7" width="14" height="10" rx="1.5" stroke="#3a6b42" strokeWidth="1.4" />
//     <path d="M16 10H20L22.5 13V17H16V10Z" stroke="#3a6b42" strokeWidth="1.4" strokeLinejoin="round" />
//     <circle cx="6.5" cy="18.5" r="1.8" stroke="#c4883a" strokeWidth="1.3" />
//     <circle cx="19.5" cy="18.5" r="1.8" stroke="#c4883a" strokeWidth="1.3" />
//   </svg>
// )
// const PersonIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//     <circle cx="12" cy="9.5" r="4.5" stroke="#3a6b42" strokeWidth="1.4" />
//     <path d="M4.5 22C4.5 18.7 7.9 16 12 16C16.1 16 19.5 18.7 19.5 22" stroke="#3a6b42" strokeWidth="1.4" strokeLinecap="round" />
//     <path d="M12 5.5V9.5L14.5 11.5" stroke="#c4883a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// )
// const MedalIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//     <circle cx="12" cy="14.5" r="5.5" stroke="#3a6b42" strokeWidth="1.4" />
//     <path d="M8.5 3.5L7 7.5H17L15.5 3.5H8.5Z" stroke="#3a6b42" strokeWidth="1.4" strokeLinejoin="round" />
//     <path d="M9.5 14.8L11.5 16.8L15 12.5" stroke="#c4883a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// )

const CARDS = [
  { num: '01', tag: 'Triple Tested',   title: 'Lab Certified Quality',  png:'/images/icons/lab.png',   body: 'Tested across 3 independent labs before reaching your field. Zero compromise on purity or efficacy, guaranteed every batch.' },
  { num: '02', tag: 'Govt. Approved',  title: 'CIB Registered',          png:'/images/icons/govt.png', body: 'Every product registered with the Central Insecticides Board — legally compliant and safe for use across all Indian farm conditions.' },
  { num: '03', tag: '40+ Crops',       title: 'Crop Intelligence',        png:'/images/icons/crop.png',   body: '40+ crop-specific formulations developed with agronomists over 20 seasons of real Indian harvest data from the ground up.' },
//   { num: '04', tag: '48hr Delivery',   title: 'Pan-India Supply',        Icon: TruckIcon,  body: 'Doorstep delivery across MH, GJ, MP and Rajasthan within 48 hours. No minimum order requirement for registered dealers.' },
//   { num: '05', tag: 'Free Advisory',   title: 'Expert Agri Support',     Icon: PersonIcon, body: 'Free seasonal advice from qualified agronomists. Crop-specific dosage guidance, timing and pest identification — always.' },
//   { num: '06', tag: 'Best Margins',    title: 'Dealer Advantage',        Icon: MedalIcon,  body: 'Industry-leading margins, flexible credit terms and seasonal promotional support. 200+ active dealers trust GreenLife.' },
]

function Card({ card, index }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: .6, delay: index * .08, ease: [.22, 1, .36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-lg p-3 relative overflow-hidden h-full"
      style={{
        background: hov ? '#fff' : 'rgba(255,255,255,.75)',
        border: `1px solid ${hov ? 'rgba(58,107,66,.2)' : 'rgba(0,0,0,.08)'}`,
        boxShadow: hov ? '0 16px 40px rgba(0,0,0,.08)' : '0 2px 8px rgba(0,0,0,.04)',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'all .3s cubic-bezier(.22,1,.36,1)',
      }}
    >
      {/* Watermark */}
      <span
        className="absolute top-3 right-4 font-display font-bold select-none leading-none"
        style={{ fontSize: 40, color: hov ? 'rgba(58,107,66,.07)' : 'rgba(0,0,0,.04)', letterSpacing: '-.04em', transition: 'color .3s' }}
      >
        {card.num}
      </span>

      {/* Icon box */}
      <div
        className="w-11 h-11 rounded-[9px] flex items-center justify-center mb-4"
        style={{
          border: `1px solid ${hov ? 'rgba(58,107,66,.22)' : 'rgba(0,0,0,.1)'}`,
          background: hov ? 'rgba(58,107,66,.06)' : 'rgba(245,241,232,.8)',
          transition: 'all .3s',
          transform: hov ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        <img src={card.png}
        alt={card.title}
      style={{width:28,height:28,objectFit:'contain'}} />  
        </div>

      {/* Tag */}
      <span
        className="inline-block font-heading font-bold tracking-[.18em] uppercase mb-2.5"
        style={{
          fontSize: 8.5, color: hov ? '#3a6b42' : '#8fa090',
          border: `1px solid ${hov ? 'rgba(58,107,66,.25)' : 'rgba(0,0,0,.1)'}`,
          padding: '2px 9px', borderRadius: 100,
          transition: 'all .3s',
        }}
      >
        {card.tag}
      </span>

      <h3 className="font-display font-bold text-[16px] leading-snug mb-2" style={{ color: '#0d1f13' }}>
        {card.title}
      </h3>
      <p className="font-sans text-[12px] leading-[1.6]" style={{ color: '#6a7d6c' }}>
        {card.body}
      </p>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
        style={{
          background: 'linear-gradient(90deg,#3a6b42,#52c786)',
          transform: hov ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform .38s cubic-bezier(.22,1,.36,1)',
        }}
      />
    </motion.div>
  )
}

const CERTS = ['ISO 9001:2015 Certified', 'CIB Registered', 'GMP Certified', '20+ Years Experience']

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-heading"
      style={{ padding: '40px 0', background: '#f3f3c8' }}
    >
      <div className="max-w-[1200px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-start">

          {/* ── LEFT sticky ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7 }}
            className="lg:sticky lg:top-20 flex flex-col justify-between h-full"
          >
            <div className="section-label">Why GreenLife</div>
            <h2
              id="why-heading"
              className="font-display font-bold leading-[1.08] tracking-[-0.018em] mb-2"
              style={{ fontSize: 'clamp(28px,3vw,42px)', color: '#0d1f13' }}
            >
              Two Decades of{' '}
              <em className="italic" style={{ color: '#3a6b42' }}>Growing Trust</em>
            </h2>

            <p
              className="font-sans text-[13.5px] leading-[1.8] mb-6 max-w-[280px]"
              style={{ color: '#5e7263', borderLeft: '2px solid rgba(196,136,58,.4)', paddingLeft: 16 }}
            >
              From soil science to your doorstep — combining modern agri-chemistry with 20 years of field-tested knowledge across Indian farmlands.
            </p>

            {/* Cert list */}
            {/* <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {CERTS.map(c => (
                <li key={c} className="flex items-center gap-2.5 font-sans font-semibold text-[12px]" style={{ color: '#3a6b42' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <circle cx="8" cy="8" r="7.3" stroke="#c4883a" strokeWidth="1" />
                    <path d="M5 8L7.2 10.2L11.5 5.8" stroke="#c4883a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul> */}
          </motion.div>

          {/* ── RIGHT: 3×2 cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CARDS.map((card, i) => <Card key={card.num} card={card} index={i} />)}
          </div>
        </div>
        {/* CERT ROW */}
<div className="flex flex-wrap justify-center gap-6 mt-10 border-t border-[#dcd5c6] pt-6">
  {CERTS.map(c => (
    <div
      key={c}
      className="flex items-center gap-2 font-sans font-semibold text-[12px]"
      style={{ color: '#3a6b42' }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.3" stroke="#c4883a" strokeWidth="1" />
        <path d="M5 8L7.2 10.2L11.5 5.8" stroke="#c4883a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {c}
    </div>
  ))}
</div>
      </div>
    </section>
  )
}
