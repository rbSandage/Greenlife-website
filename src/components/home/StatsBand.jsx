// src/components/home/StatsBand.jsx
import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks'

const STATS = [
  { to: 120, suffix: '+',  label: 'Products in Range'  },
  { to: 12,  suffix: 'K+', label: 'Farmers Served'     },
  { to: 36,  suffix: '',   label: 'Districts Covered'  },
  { to: 20,  suffix: '+',  label: 'Years of Expertise' },
]

function StatItem({ stat, index, last }) {
  const [count, ref] = useCountUp(stat.to, 1600)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .6, delay: index * .1 }}
      className="text-center py-12 px-5"
      style={{ borderRight: last ? 'none' : '1px solid rgba(255,255,255,.07)' }}
    >
      <div
        className="font-display font-bold leading-none tracking-[-0.02em]"
        style={{ fontSize: 'clamp(34px,4vw,52px)', color: '#eef6ee' }}
      >
        {count}{stat.suffix}
      </div>
      <div className="mx-auto my-3" style={{ width: 20, height: 1, background: 'rgba(196,136,58,.45)' }} />
      <div
        className="font-heading font-semibold tracking-[.18em] uppercase"
        style={{ fontSize: 9.5, color: 'rgba(238,246,238,.32)' }}
      >
        {stat.label}
      </div>
    </motion.div>
  )
}

export default function StatsBand() {
  return (
    <div
      aria-label="Company statistics"
      className="relative overflow-hidden"
      style={{ background: '#0b1c0d' }}
    >
      {/* Diagonal texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(-52deg,rgba(114,184,62,.03) 0,rgba(114,184,62,.03) 1px,transparent 0,transparent 30px)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-[5%]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {STATS.map((s, i) => (
            <StatItem key={s.label} stat={s} index={i} last={i === STATS.length - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
