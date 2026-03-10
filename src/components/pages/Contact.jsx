// src/components/pages/Contact.jsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useEnquiries } from "../../hooks";
import { HiLocationMarker, HiPhone, HiMail, HiClock } from "react-icons/hi";
import { MessageCircle, Send,Loader2 } from "lucide-react";

const PRODUCTS_LIST = [
  "Chlorpyrifos 20% EC",
  "Glyphosate 41% SL",
  "Mancozeb 75% WP",
  "NPK 19-19-19",
  "Imidacloprid 17.8% SL",
  "2,4-D Amine 58% SL",
  "Other / General Enquiry",
];

export default function Contact() {
  const [params] = useSearchParams();
  const { addEnquiry } = useEnquiries();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    product: params.get("product") || "",
    message: "",
    type: "General Enquiry",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await addEnquiry(form);
      setSent(true);
      toast.success("Enquiry sent! We will contact you within 24 hours.");
    } catch (err) {
      toast.error("Something went wrong. Please try calling us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[70px]">
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #052e16 0%, #14532d 50%, #1a6b38 100%)",
          padding: "52px 0 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(134,239,172,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.7,
          }}
        />
        {/* Centre glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(74,222,128,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-[6%] relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.2)",
                color: "#86efac",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: 999,
                marginBottom: 20,
              }}
            >
              Get In Touch
            </span>

            <h1
              className="font-display font-black text-white leading-tight mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
            >
              Contact Our
              <br />
              Agri Experts
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 13,
                lineHeight: 1.7,
                maxWidth: 440,
              }}
            >
              Send an enquiry, request a quote, or ask our agronomists about the
              right product for your crop.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-[6%] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left — Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h2 className="font-heading font-bold text-dark text-2xl mb-6">
              Get In Touch
            </h2>
            <div className="flex flex-col gap-4 mb-10">
              {[
                {
                  icon: HiLocationMarker,
                  label: "Address",
                  value: "123 Agri Complex,Sangli, Maharashtra 440001",
                },
                {
                  icon: HiPhone,
                  label: "Phone / WhatsApp",
                  value: "+91 98765 43210",
                },
                {
                  icon: HiMail,
                  label: "Email",
                  value: "info@greenlifecropcare.com",
                },
                {
                  icon: HiClock,
                  label: "Working Hours",
                  value: "Mon–Sat: 9:00 AM – 6:00 PM",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-green-700 uppercase tracking-widest mb-0.5">
                      {label}
                    </div>
                    <div className="text-sm text-dark font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30 no-underline"
            >
              <span className="text-2xl">
                <MessageCircle />
              </span>
              <div>
                <div className="font-heading font-bold text-sm">
                  Chat on WhatsApp
                </div>
                <div className="text-xs text-white/75">
                  Usually replies within 1 hour
                </div>
              </div>
            </a>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="bg-green-50 border-2 border-green-300 rounded-3xl p-12 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-heading font-bold text-dark text-2xl mb-3">
                  Enquiry Sent!
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Thank you, <strong>{form.name}</strong>. Our agri expert will
                  contact you at <strong>{form.phone}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({
                      name: "",
                      phone: "",
                      email: "",
                      product: "",
                      message: "",
                      type: "General Enquiry",
                    });
                  }}
                  className="btn-primary"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="bg-white rounded-3xl p-8 border border-black/7 shadow-sm"
              >
                <h3 className="font-heading font-bold text-dark text-xl mb-6">
                  Send Your Enquiry
                </h3>

                {/* Enquiry type */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {[
                    "General Enquiry",
                    "Product Enquiry",
                    "Dealer Enquiry",
                    "Technical Support",
                  ].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, type: t }))}
                      className={`text-xs px-3.5 py-2 rounded-full border transition-all ${form.type === t ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-500 hover:border-green-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handle}
                      required
                      placeholder="Your name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handle}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-all"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handle}
                    placeholder="your@email.com"
                    type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-all"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Product of Interest
                  </label>
                  <select
                    name="product"
                    value={form.product}
                    onChange={handle}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-all bg-white"
                  >
                    <option value="">Select a product (optional)</option>
                    {PRODUCTS_LIST.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Message / Requirements *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handle}
                    required
                    rows={4}
                    placeholder="Tell us about your crop, area, pest problem, or quantity needed..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-heading font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Enquiry
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  We respond within 24 hours · Your information is secure
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
