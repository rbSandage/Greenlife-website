import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        backgroundColor: scrolled || !isHome ? "#fffffff2" : "transparent",
        backdropFilter: scrolled || !isHome ? "blur(10px)" : "none",
        transition: "all 0.4s ease",
      }}
      className="fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center px-[6%]"
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2.5 flex-1 no-underline group"
      >
        <div className="w-9 h-9 bg-green-600 rounded-[10px] flex items-center justify-center text-lg transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110">
          🌿
        </div>
        <div>
          <div className="font-heading font-semibold text-[1.05rem] leading-tight tracking-normal">
            <span
              className={`transition-colors duration-300 ${
                scrolled || !isHome ? "text-gray-900" : "text-white"
              }`}
            >
              GreenLife
            </span>

            <span
              className={`transition-colors duration-300 ${
                scrolled || !isHome ? "text-green-600" : "text-green-400"
              }`}
            >
              {" "}
              Cropcare
            </span>
          </div>
          <div className="text-[0.6rem] text-yellow-600 tracking-widest uppercase leading-none">
            Agri Solutions
          </div>
        </div>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 list-none mx-8">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={`text-sm font-medium no-underline transition-colors duration-300 relative group ${
                pathname === l.to
                    ? "text-green-600"
                  : scrolled ||!isHome
                    ? "text-gray-600 hover:text-green-600"
                    : "text-white/70 hover:text-white"
              }`}
            >
              {l.label}
              <span
                className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500 rounded-full transition-transform duration-300 ${
                  pathname === l.to
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        to="/contact"
        className="hidden md:inline-flex items-center gap-1.5 bg-green-600 text-white text-sm font-heading font-bold px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-green-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/40 no-underline"
      >
        Get Enquiry →
      </Link>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`md:hidden text-2xl p-1 ${
          scrolled ? "text-gray-900" : "text-white"
        }`}
      >
        {menuOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`absolute top-full left-0 right-0 ${
            scrolled
              ? "bg-white border-gray-200"
              : "bg-dark/98 border-green-400/10"
          } backdrop-blur-xl border-t p-6 flex flex-col gap-5 md:hidden`}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium no-underline ${
                pathname === l.to
                  ? "text-green-600"
                  : scrolled
                    ? "text-gray-700"
                    : "text-white/70"
              }`}
            >
              {l.label}
            </Link>
          ))}

          <Link to="/contact" className="btn-primary self-start text-sm">
            Get Enquiry →
          </Link>
        </div>
      )}
    </nav>
  );
}
