/*eslint-disable*/

// src/components/home/HomeCTA.jsx
//
// ─── FARMER IMAGE ────────────────────────────────────────────────────────────
//  Replace IMAGE_SRC with your farmer / crop PNG (transparent bg works best):
//    '/images/cta/farmer.png'
//  Recommended: portrait-style PNG, min 300×400px, transparent background
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";

// const IMAGE_SRC = "/images/cta/farmer.png"; // ← your image here

export default function HomeCTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-6 md:py-12 px-4 md:px-[5%]"
      style={{ background: "#f3f3c8" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl flex flex-col md:flex-row md:items-center max-w-[1200px] mx-auto"
        style={{
          background:
            "linear-gradient(120deg, #1a6b3c 0%, #0f4a28 60%, #0d3a20 100%)",
          minHeight: 280,
        }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Glow blob right */}
        <div
          className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at right, rgba(82,199,134,.18), transparent 70%)",
          }}
        />

        {/* ── LEFT — farmer image ── */}
        <div className="w-full md:flex-shrink-0 md:w-[260px] flex items-end justify-center pt-6 md:pt-0">
          <img
            src="/images/bg/fruits.png"
            alt="Farmer"
            className="w-[180px] md:w-[245px] object-contain mx-auto md:mx-0"
            style={{ transform: "translateY(0px) md:translateY(20px)" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* ── MIDDLE — heading + desc ── */}
        {/* MIDDLE — heading + desc */}
        <div className="flex-1 py-6 px-6 md:py-10 md:px-10 text-center md:text-left">
          <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <div
              className="h-px w-5"
              style={{ background: "rgba(196,136,58,.6)" }}
            />
            <span
              className="font-heading font-bold text-[9px] tracking-[.22em] uppercase"
              style={{ color: "rgba(196,136,58,.85)" }}
            >
              Get in Touch
            </span>
          </div>

          <h2
            id="cta-heading"
            className="font-display font-bold text-white leading-tight m-0 mb-2"
            style={{ fontSize: "clamp(22px,2.5vw,30px)" }}
          >
            Ready to Protect{" "}
            <em className="italic" style={{ color: "#86efac" }}>
              Your Harvest?
            </em>
          </h2>

          <p
            className="font-sans text-xs md:text-sm leading-relaxed m-0 max-w-md mx-auto md:mx-0"
            style={{ color: "rgba(238,246,238,.6)" }}
          >
            Free agri advisory · Bulk pricing · Pan-India delivery · Dealer
            support
          </p>
        </div>

        {/* ── RIGHT — buttons ── */}
        {/* RIGHT — buttons */}
        <div className="flex-shrink-0 flex flex-row md:flex-col gap-3 px-6 pb-7 md:pb-0 md:pr-10 md:px-0 justify-center">
          <Link
            to="/contact"
            className="no-underline flex items-center justify-center gap-2 font-heading font-bold py-3 px-7 rounded-xl text-xs transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "#fff",
              color: "#1a6b3c",
              letterSpacing: ".04em",
              textTransform: "uppercase",
              boxShadow: "0 6px 18px rgba(0,0,0,.2)",
            }}
          >
             <Send/>
            <span>Send Enquiry</span>
           
          </Link>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center justify-center gap-2 font-heading font-bold py-3 px-7 rounded-xl text-xs transition-all duration-200"
            style={{
              color: "rgba(238,246,238,.9)",
              border: "1.5px solid rgba(255,255,255,.25)",
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            <MessageCircle/>
            <span>WhatsApp Us</span>
          
          </a>
        </div>
      </motion.div>
    </section>
  );
}
