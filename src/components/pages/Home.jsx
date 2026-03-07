// src/components/pages/Home.jsx
import { useScrollReveal } from '../../hooks'

import HeroCarousel      from '../home/HeroCarousel'
import Ticker            from '../home/Ticker'
import CategoryGrid      from '../home/CategoryGrid'
import FeaturedProducts  from '../home/FeaturedProducts'
import WhyChooseUs       from '../home/WhyChooseUs'
import StatsBand         from '../home/StatsBand'
import ProductSpotlight  from '../home/ProductSpotlight'
import Testimonials      from '../home/Testimonials'
import HomeCTA           from '../home/HomeCTA'

export default function Home() {
  useScrollReveal()

  return (
    <main>
      {/* 1 — Hero carousel with product showcase */}
      <HeroCarousel />

      {/* 2 — Scrolling category ticker */}
      <Ticker />

      {/* 3 — Shop by category grid */}
      <CategoryGrid />

      {/* 4 — Featured products from Firebase */}
      <FeaturedProducts />

      {/* 5 — Why choose GreenLife */}
      <WhyChooseUs />

      {/* 6 — Animated stats band */}
      <StatsBand />

      {/* 7 — Interactive product spotlight */}
      <ProductSpotlight />

      {/* 8 — Farmer testimonials */}
      <Testimonials />

      {/* 9 — CTA + contact */}
      <HomeCTA />
    </main>
  )
}
