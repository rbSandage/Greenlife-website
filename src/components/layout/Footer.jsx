// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { HiLocationMarker, HiPhone, HiMail, HiClock } from "react-icons/hi";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/5 pt-16 pb-6">
      <div className="max-w-6xl mx-auto px-[6%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="font-heading font-extrabold text-xl text-white mb-3">
              🌿 GreenLife Cropcare
            </div>

            <p className="text-sm text-white/40 leading-relaxed max-w-[270px]">
              Premium agri chemical solutions trusted by farmers and dealers
              across India since 2004.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-5">

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-[9px] bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30"
              >
                <Facebook size={18} className="text-white" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-[9px] bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30"
              >
                <Instagram size={18} className="text-white" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-[9px] bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30"
              >
                <Twitter size={18} className="text-white" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-[9px] bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30"
              >
                <Youtube size={18} className="text-white" />
              </a>

            </div>
          </div>

          {/* Products */}
          <div>
            <div className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Products
            </div>

            <ul className="flex flex-col gap-2.5 list-none">
              {[
                "Herbicides",
                "Insecticides",
                "Fungicides",
                "Fertilizers",
                "Bio-Pesticides",
              ].map((p) => (
                <li key={p}>
                  <Link
                    to="/products"
                    className="text-sm text-white/40 no-underline hover:text-green-400 transition-colors"
                  >
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Company
            </div>

            <ul className="flex flex-col gap-2.5 list-none">
              {[
                ["About Us", "/about"],
                ["Products", "/products"],
                ["Contact Us", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-white/40 no-underline hover:text-green-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Contact
            </div>

            <div className="flex flex-col gap-3">

              <div className="flex gap-2.5 items-start">
                <HiLocationMarker className="text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/40 leading-relaxed">
                  123 Agri Complex, Sangli, Maharashtra 440001
                </span>
              </div>

              <div className="flex gap-2.5 items-center">
                <HiPhone className="text-green-400 flex-shrink-0" />
                <span className="text-sm text-white/40">
                  +91 98765 43210
                </span>
              </div>

              <div className="flex gap-2.5 items-center">
                <HiMail className="text-green-400 flex-shrink-0" />
                <span className="text-sm text-white/40">
                  info@greenlifecropcare.com
                </span>
              </div>

              <div className="flex gap-2.5 items-center">
                <HiClock className="text-green-400 flex-shrink-0" />
                <span className="text-sm text-white/40">
                  Mon–Sat: 9 AM – 6 PM
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/8 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">

          <p className="text-xs text-white/25">
            © 2026 GreenLife Cropcare. All rights reserved. | Developed by Vision Craft
          </p>

          <div className="flex gap-6">
            {["Privacy Policy", "Terms", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-white/25 no-underline hover:text-green-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}