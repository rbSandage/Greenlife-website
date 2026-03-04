// src/components/pages/About.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const TIMELINE = [
  { year: '2004', title: 'Company Founded', desc: 'GreenLife Cropcare started as a small agri chemical distributor in Nagpur, Maharashtra.' },
  { year: '2008', title: 'ISO Certification', desc: 'Achieved ISO 9001 certification for quality management systems in product handling.' },
  { year: '2012', title: 'Pan-Maharashtra Expansion', desc: 'Expanded dealer network to all 36 districts of Maharashtra with 200+ active dealers.' },
  { year: '2016', title: '100+ Product Portfolio', desc: 'Crossed the milestone of 100 registered agri chemical products across all categories.' },
  { year: '2020', title: 'Multi-State Operations', desc: 'Expanded to Gujarat, Madhya Pradesh and Rajasthan. Serving 10,000+ farmers.' },
  { year: '2024', title: 'Digital Transformation', desc: 'Launched digital presence to serve more farmers and dealers across India.' },
]

const TEAM = [
  { name: 'Ashok Sabale', role: 'Managing Director', emoji: '👨‍💼', exp: '20+ years in agri chemicals' },
  { name: 'Amit Shinde', role: 'Technical Head', emoji: '👨‍💼', exp: 'M.Sc. Agriculture, 15 years' },
  { name: 'Chinmay', role: 'Sales Director', emoji: '👨‍💻', exp: 'Pan-India dealer network' },
  { name: 'Rushikesh', role: 'Quality Manager', emoji: '👨‍💻', exp: 'ISO certified QA specialist' },
]

const CERTS = ['🏛️ Central Insecticides Board (CIB) Registered','📋 ISO 9001:2015 Certified','🌾 Maharashtra Agriculture Department Approved','🧪 NABL Accredited Lab Testing','✅ BIS Certified Manufacturing']

export default function About() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <div className="bg-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{backgroundImage:'linear-gradient(rgba(82,199,134,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(82,199,134,.04) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(26,107,60,.25),transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-[6%] relative z-10">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
            <div className="inline-flex items-center gap-2 bg-green-400/12 border border-green-400/25 text-green-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              About Us
            </div>
            <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-5 max-w-2xl">
              20 Years of Protecting<br/><span className="text-green-400 italic">India's Harvests</span>
            </h1>
            <p className="text-white/55 text-base leading-relaxed max-w-xl">
              Since 2004, GreenLife Cropcare has been the trusted agri chemical partner for farmers and dealers across Western and Central India. We believe every farmer deserves access to safe, effective, and affordable crop protection solutions.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission / Vision */}
      <section className="py-20 bg-[#f7fdf8]">
        <div className="max-w-6xl mx-auto px-[6%]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon:'🎯', title:'Our Mission', text:'To provide every Indian farmer with safe, effective, and government-approved agri chemical solutions that maximize crop yield while protecting the environment.' },
              { icon:'🔭', title:'Our Vision', text:'To be the most trusted agri chemical brand in India — known for product quality, technical support, and a genuine commitment to farmer welfare.' },
              { icon:'💎', title:'Our Values', text:'Quality without compromise. Transparency in every transaction. Farmer welfare above profit. Scientific approach to agriculture.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5,delay:i*.1}}
                className="bg-white rounded-2xl p-8 border border-black/6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-heading font-bold text-dark text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-[6%]">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
            <div className="section-label justify-center">Our Journey</div>
            <h2 className="section-title">Two Decades of Growth</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200 md:left-1/2" />
            {TIMELINE.map((item, i) => (
              <motion.div key={i} initial={{opacity:0,x: i%2===0 ? -20 : 20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.5,delay:i*.08}}
                className={`relative flex items-start gap-6 mb-10 ${i%2===0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:gap-0`}>
                <div className="absolute left-5 md:left-1/2 w-6 h-6 bg-green-600 rounded-full border-4 border-white shadow-md md:-translate-x-1/2 flex-shrink-0 z-10" />
                <div className={`ml-16 md:ml-0 md:w-1/2 ${i%2===0 ? 'md:pr-14' : 'md:pl-14'}`}>
                  <div className="bg-[#f7fdf8] rounded-2xl p-5 border border-green-100">
                    <div className="font-heading font-extrabold text-green-600 text-sm mb-1">{item.year}</div>
                    <h4 className="font-heading font-bold text-dark text-base mb-1.5">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#f7fdf8]">
        <div className="max-w-6xl mx-auto px-[6%]">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
            <div className="section-label justify-center">Our Team</div>
            <h2 className="section-title">The People Behind GreenLife</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((m, i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5,delay:i*.1}}
                className="bg-white rounded-2xl p-6 text-center border border-black/6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="text-5xl mb-4">{m.emoji}</div>
                <h4 className="font-heading font-bold text-dark text-base mb-1">{m.name}</h4>
                <div className="text-sm text-green-600 font-medium mb-2">{m.role}</div>
                <div className="text-xs text-gray-400">{m.exp}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-dark">
        <div className="max-w-6xl mx-auto px-[6%]">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
            <div className="section-label justify-center !text-green-400 before:!bg-green-400">Certifications</div>
            <h2 className="font-display font-black text-white text-3xl md:text-4xl">Government Certified &<br/>Industry Approved</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CERTS.map((c, i) => (
              <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:i*.07}}
                className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/8 hover:border-green-400/30 transition-all">
                <span className="text-xl flex-shrink-0">{c.split(' ')[0]}</span>
                <span className="text-sm text-white/75">{c.slice(c.indexOf(' ')+1)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-gradient py-20 text-center">
        <div className="max-w-2xl mx-auto px-[6%]">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <h2 className="font-display font-black text-white text-3xl md:text-4xl mb-4">Partner With Us</h2>
            <p className="text-white/70 mb-7">Become a dealer or send a product enquiry — our team responds within 24 hours.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/contact" className="btn-white">Contact Us →</Link>
              <Link to="/products" className="btn-outline">View Products</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
