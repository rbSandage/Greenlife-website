// src/components/home/Ticker.jsx
const ITEMS = [
  'Insecticides', 'Fungicides', 'Herbicides', 'Fertilizers',
  'Bio Pesticides', 'Micronutrients', 'Plant Growth Regulators',
  'ISO 9001 Certified', 'CIB Registered', 'Pan-India Delivery',
]

export default function Ticker() {
  // doubled for seamless loop
  const all = [...ITEMS, ...ITEMS]

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden"
      style={{ background: '#133f1a', borderBottom: '1px solid rgba(255,255,255,.055)', padding: '11px 0' }}
    >
      <div className="ticker-track flex whitespace-nowrap">
        {all.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-heading font-bold tracking-[.2em] uppercase"
            style={{ fontSize: 10, color: 'rgb(255, 255, 255)', padding: '0 32px' }}
          >
            <span
              className="flex-shrink-0 rounded-full"
              style={{ width: 4, height: 4, background: '#dee910' }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
