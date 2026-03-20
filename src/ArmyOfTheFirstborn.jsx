import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Play, MapPin, Clock, Users, Heart, ChevronRight, ChevronDown,
  Menu, X, Search, ArrowRight, Calendar, BookOpen, Headphones,
  Globe, ChevronLeft, Radio, Flame, Star, Church
} from "lucide-react";

// ─── Utility ───────────────────────────────────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ─── Google Fonts ───────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --off-white: #FAFAFA;
      --charcoal: #121212;
      --spirit: #D4A017;
      --spirit-light: #F0C842;
      --spirit-dark: #A87B0D;
      --glass: rgba(250,250,250,0.08);
      --glass-border: rgba(250,250,250,0.12);
      --serif: 'Playfair Display', Georgia, serif;
      --sans: 'Plus Jakarta Sans', system-ui, sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--charcoal);
      color: var(--off-white);
      font-family: var(--sans);
      overflow-x: hidden;
    }

    ::selection { background: var(--spirit); color: var(--charcoal); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--charcoal); }
    ::-webkit-scrollbar-thumb { background: var(--spirit); border-radius: 2px; }

    /* Glassmorphism */
    .glass {
      background: var(--glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
    }

    /* Grain overlay */
    .grain::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9999;
      opacity: 0.4;
    }

    /* Pulsating badge */
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
    .live-pulse::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 9999px;
      background: #ef4444;
      animation: pulse-ring 1.5s ease-out infinite;
    }

    /* Countdown flip */
    @keyframes flip-in {
      from { transform: rotateX(-90deg); opacity: 0; }
      to { transform: rotateX(0deg); opacity: 1; }
    }
    .flip { animation: flip-in 0.4s ease forwards; }

    /* Gold shimmer */
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .gold-shimmer {
      background: linear-gradient(90deg, var(--spirit) 0%, var(--spirit-light) 40%, var(--spirit) 60%, var(--spirit-dark) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }

    /* Reveal animation */
    @keyframes reveal-up {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .reveal { animation: reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }

    /* Hero video scale on scroll */
    .hero-media {
      transition: transform 0.1s linear;
      will-change: transform;
    }

    /* Mega menu */
    @keyframes slide-in-right {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .mega-menu-open { animation: slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }

    /* Bento hover */
    .bento-card {
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
    }
    .bento-card:hover {
      transform: scale(1.02) translateY(-4px);
      box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,160,23,0.2);
    }

    /* Sermon card */
    .sermon-card {
      transition: transform 0.35s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.35s ease;
    }
    .sermon-card:hover {
      transform: translateY(-6px) scale(1.01);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    }

    /* Filter button active */
    .filter-btn.active {
      background: var(--spirit);
      color: var(--charcoal);
      border-color: var(--spirit);
    }

    /* Map pin pulse */
    @keyframes map-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.6); }
      50% { box-shadow: 0 0 0 12px rgba(212,160,23,0); }
    }
    .map-pin-pulse { animation: map-pulse 2s ease-in-out infinite; }

    /* Section divider */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent);
    }

    /* Nav link hover line */
    .nav-link {
      position: relative;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1px;
      background: var(--spirit);
      transition: width 0.3s ease;
    }
    .nav-link:hover::after { width: 100%; }

    /* Text reveal stagger */
    .stagger-1 { animation-delay: 0.1s; opacity: 0; }
    .stagger-2 { animation-delay: 0.25s; opacity: 0; }
    .stagger-3 { animation-delay: 0.4s; opacity: 0; }
    .stagger-4 { animation-delay: 0.55s; opacity: 0; }

    /* Responsive */
    @media (max-width: 768px) {
      .bento-grid { grid-template-columns: 1fr 1fr !important; }
      .sermon-grid { grid-template-columns: 1fr !important; }
      .hero-heading { font-size: clamp(2.5rem, 10vw, 5rem) !important; }
    }
    @media (max-width: 480px) {
      .bento-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

// ─── Atoms ──────────────────────────────────────────────────────────────────

const PrimaryButton = ({ children, onClick, className, icon, ...props }) => (
  <button
    onClick={onClick}
    className={cn("primary-btn", className)}
    style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      padding: "16px 36px", borderRadius: "4px",
      background: "var(--spirit)", color: "var(--charcoal)",
      fontFamily: "var(--sans)", fontWeight: 700, fontSize: "0.9rem",
      letterSpacing: "0.08em", textTransform: "uppercase",
      border: "none", cursor: "pointer",
      transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      position: "relative", overflow: "hidden",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(212,160,23,0.45)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
    {...props}
  >
    {children}
    {icon && <ArrowRight size={16} />}
  </button>
);

const OutlineButton = ({ children, onClick, className, ...props }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      padding: "15px 36px", borderRadius: "4px",
      background: "transparent", color: "var(--off-white)",
      fontFamily: "var(--sans)", fontWeight: 600, fontSize: "0.9rem",
      letterSpacing: "0.08em", textTransform: "uppercase",
      border: "1px solid rgba(250,250,250,0.25)", cursor: "pointer",
      transition: "all 0.25s ease",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--spirit)"; e.currentTarget.style.color = "var(--spirit)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(250,250,250,0.25)"; e.currentTarget.style.color = "var(--off-white)"; }}
    {...props}
  >
    {children}
  </button>
);

const SectionLabel = ({ children }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: "10px",
    fontFamily: "var(--sans)", fontSize: "0.72rem", fontWeight: 700,
    letterSpacing: "0.2em", textTransform: "uppercase",
    color: "var(--spirit)", marginBottom: "20px",
  }}>
    <span style={{ width: 24, height: 1, background: "var(--spirit)", display: "inline-block" }} />
    {children}
    <span style={{ width: 24, height: 1, background: "var(--spirit)", display: "inline-block" }} />
  </div>
);

// ─── Navigation ─────────────────────────────────────────────────────────────

const navLinks = [
  { label: "About", sub: ["Our Story", "Leadership", "Beliefs", "Locations"] },
  { label: "Sermons", sub: ["Watch Latest", "Series Archive", "Speakers", "Podcast"] },
  { label: "Connect", sub: ["Life Groups", "Serve", "Young Adults", "Women & Men"] },
  { label: "Give", sub: [] },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav
        className="glass"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          padding: "0 clamp(20px, 5vw, 80px)",
          height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(18,18,18,0.92)" : "rgba(18,18,18,0.4)",
          backdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid rgba(212,160,23,0.15)" : "1px solid rgba(250,250,250,0.08)",
          transition: "all 0.4s ease",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            border: "2px solid var(--spirit)",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(212,160,23,0.1)",
          }}>
            <Flame size={18} color="var(--spirit)" />
          </div>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 700, color: "var(--off-white)", lineHeight: 1.1 }}>Army of</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "0.7rem", fontWeight: 400, color: "var(--spirit)", letterSpacing: "0.12em", textTransform: "uppercase" }}>The Firstborn</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="desktop-nav" role="menubar">
          {navLinks.map(link => (
            <div key={link.label} style={{ position: "relative" }}
              onMouseEnter={() => setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="nav-link"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--sans)", fontSize: "0.85rem", fontWeight: 500,
                  color: "var(--off-white)", letterSpacing: "0.04em",
                  display: "flex", alignItems: "center", gap: 4,
                }}
                role="menuitem"
                aria-haspopup={link.sub.length > 0}
                aria-expanded={activeDropdown === link.label}
              >
                {link.label}
                {link.sub.length > 0 && <ChevronDown size={12} style={{ transition: "transform 0.2s", transform: activeDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)" }} />}
              </button>

              {/* Dropdown */}
              {link.sub.length > 0 && activeDropdown === link.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: "absolute", top: "calc(100% + 16px)", left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(18,18,18,0.96)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(212,160,23,0.15)", borderRadius: 8,
                    padding: "12px 0", minWidth: 180,
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                  }}
                  role="menu"
                >
                  {link.sub.map(s => (
                    <button key={s}
                      role="menuitem"
                      style={{
                        display: "block", width: "100%", padding: "10px 24px",
                        background: "none", border: "none", cursor: "pointer", textAlign: "left",
                        fontFamily: "var(--sans)", fontSize: "0.85rem", fontWeight: 400,
                        color: "rgba(250,250,250,0.7)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.target.style.color = "var(--spirit)"; e.target.style.paddingLeft = "28px"; }}
                      onMouseLeave={e => { e.target.style.color = "rgba(250,250,250,0.7)"; e.target.style.paddingLeft = "24px"; }}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button aria-label="Search" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(250,250,250,0.6)", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--spirit)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,0.6)"}
          >
            <Search size={18} />
          </button>
          <PrimaryButton style={{ padding: "10px 24px", fontSize: "0.78rem" }}>
            Plan Your Visit
          </PrimaryButton>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--off-white)", display: "none" }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Mega Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "min(380px, 90vw)",
              background: "#0d0d0d",
              borderLeft: "1px solid rgba(212,160,23,0.15)",
              zIndex: 1100,
              padding: "80px 40px 40px",
              overflowY: "auto",
            }}
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu"
              style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer", color: "var(--off-white)" }}>
              <X size={24} />
            </button>

            <div style={{ fontFamily: "var(--serif)", fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--spirit)", marginBottom: 40, textTransform: "uppercase" }}>
              Navigation
            </div>

            {navLinks.map((link, i) => (
              <div key={link.label} style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 700, color: "var(--off-white)", marginBottom: 12, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--spirit)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--off-white)"}
                >
                  {link.label}
                </div>
                {link.sub.map(s => (
                  <div key={s} style={{ fontFamily: "var(--sans)", fontSize: "0.9rem", color: "rgba(250,250,250,0.5)", padding: "6px 0", cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--spirit)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,0.5)"}
                  >
                    {s}
                  </div>
                ))}
              </div>
            ))}

            <div style={{ marginTop: 40, paddingTop: 40, borderTop: "1px solid rgba(250,250,250,0.08)" }}>
              <PrimaryButton style={{ width: "100%", justifyContent: "center" }}>Plan Your Visit</PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

// ─── Hero Section ────────────────────────────────────────────────────────────

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
      aria-label="Hero section"
    >
      {/* Background Video Layer */}
      <motion.div style={{ scale, position: "absolute", inset: 0, zIndex: 0 }}>
        {/* Gradient background simulating video */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1005 40%, #0d0a00 70%, #121212 100%)",
        }} />
        {/* Gold light beam effects */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,160,23,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute",
          top: "15%", left: "50%",
          transform: "translateX(-50%)",
          width: "2px", height: "40%",
          background: "linear-gradient(to bottom, transparent, rgba(212,160,23,0.3), transparent)",
          filter: "blur(4px)",
        }} />
        {/* Cross silhouette */}
        <div style={{
          position: "absolute", top: "20%", left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.06,
          width: 200, height: 300,
        }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 4, height: 300, background: "var(--spirit)", borderRadius: 2 }} />
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 160, height: 4, background: "var(--spirit)", borderRadius: 2 }} />
        </div>
        {/* Particle dots */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${5 + (i * 4.7) % 90}%`,
            top: `${10 + (i * 7.3) % 80}%`,
            width: i % 3 === 0 ? 3 : 1.5,
            height: i % 3 === 0 ? 3 : 1.5,
            borderRadius: "50%",
            background: i % 4 === 0 ? "var(--spirit)" : "rgba(250,250,250,0.15)",
            animation: `pulse-ring ${2 + (i % 3)}s ease-out ${i * 0.3}s infinite`,
          }} />
        ))}
      </motion.div>

      {/* Dark overlay gradient */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to bottom, rgba(18,18,18,0.3) 0%, rgba(18,18,18,0.1) 40%, rgba(18,18,18,0.7) 100%)",
      }} />

      {/* Scroll indicator side text */}
      <motion.div
        style={{ y, position: "absolute", left: "clamp(20px, 4vw, 60px)", top: "50%", zIndex: 10, opacity }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div style={{
          writing: "vertical-rl",
          writingMode: "vertical-rl",
          fontFamily: "var(--sans)", fontSize: "0.68rem", fontWeight: 500,
          color: "rgba(250,250,250,0.35)", letterSpacing: "0.25em", textTransform: "uppercase",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        }}>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, transparent, var(--spirit))" }} />
          Scroll
        </div>
      </motion.div>

      {/* Social links vertical */}
      <motion.div
        style={{ y, position: "absolute", right: "clamp(20px, 4vw, 60px)", top: "50%", zIndex: 10, opacity }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {["YT", "IG", "FB"].map(s => (
            <button key={s} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--sans)", fontSize: "0.62rem", fontWeight: 700,
              color: "rgba(250,250,250,0.3)", letterSpacing: "0.1em",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--spirit)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,0.3)"}
            >
              {s}
            </button>
          ))}
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, var(--spirit), transparent)" }} />
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div style={{ y, opacity, position: "relative", zIndex: 5, textAlign: "center", padding: "0 20px", maxWidth: 900 }}>
        {/* Pre-heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 32,
            background: "rgba(212,160,23,0.1)",
            border: "1px solid rgba(212,160,23,0.25)",
            borderRadius: 100, padding: "8px 20px",
          }}
        >
          <Flame size={12} color="var(--spirit)" />
          <span style={{ fontFamily: "var(--sans)", fontSize: "0.7rem", fontWeight: 600, color: "var(--spirit)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Welcome to Army of the Firstborn
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hero-heading"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
            fontWeight: 900,
            lineHeight: 1.0,
            color: "var(--off-white)",
            marginBottom: 28,
            letterSpacing: "-0.02em",
          }}
        >
          Faith.{" "}
          <em style={{ color: "var(--spirit)", fontStyle: "italic" }}>Family.</em>
          {" "}Future.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          style={{
            fontFamily: "var(--sans)", fontSize: "clamp(1rem, 2vw, 1.25rem)", fontWeight: 300,
            color: "rgba(250,250,250,0.65)", maxWidth: 520, margin: "0 auto 48px",
            lineHeight: 1.7,
          }}
        >
          A covenant community ablaze with purpose—built for every soul called to stand in the congregation of the firstborn.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <PrimaryButton icon>Plan Your Visit</PrimaryButton>
          <OutlineButton>
            <Play size={14} fill="currentColor" />
            Watch Live
          </OutlineButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, flexWrap: "wrap" }}
        >
          {[["12+", "Years of Grace"], ["3K+", "Family Members"], ["2", "Campuses"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="gold-shimmer" style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 700 }}>{n}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: "0.72rem", fontWeight: 500, color: "rgba(250,250,250,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 200, zIndex: 3,
        background: "linear-gradient(to top, var(--charcoal), transparent)",
      }} />

      {/* Scroll arrow */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
      >
        <ChevronDown size={22} color="rgba(250,250,250,0.35)" />
      </motion.div>
    </section>
  );
};

// ─── Service Selector ────────────────────────────────────────────────────────

const useCountdown = () => {
  const [state, setState] = useState({ isLive: false, countdown: "", day: "" });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const min = now.getMinutes();

      const isSunday = day === 0;
      const serviceStart = 10;
      const serviceEnd = 12;
      const isLive = isSunday && hour >= serviceStart && hour < serviceEnd;

      if (isLive) {
        setState({ isLive: true, countdown: "Live Now", day: "Sunday" });
        return;
      }

      let daysUntil = (7 - day) % 7 || 7;
      const next = new Date(now);
      next.setDate(now.getDate() + daysUntil);
      next.setHours(serviceStart, 0, 0, 0);
      const diff = next - now;

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setState({
        isLive: false,
        countdown: `${d}d ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`,
        day: "Sunday",
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return state;
};

const ServiceSelector = () => {
  const { isLive, countdown } = useCountdown();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "100px clamp(20px, 6vw, 100px)", background: "var(--charcoal)", position: "relative" }} aria-label="Service times">
      {/* Background glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60%", height: "60%", background: "radial-gradient(ellipse, rgba(212,160,23,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel>Join Us In Person</SectionLabel>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, lineHeight: 1.1, color: "var(--off-white)" }}>
            Every Sunday,<br />
            <span style={{ color: "var(--spirit)" }}>A Fresh Encounter.</span>
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 2, borderRadius: 12, overflow: "hidden",
          border: "1px solid rgba(212,160,23,0.12)",
        }}>
          {/* Live Status Panel */}
          <div style={{
            padding: "56px 48px",
            background: isLive ? "rgba(212,160,23,0.06)" : "rgba(250,250,250,0.02)",
            borderRight: "1px solid rgba(212,160,23,0.08)",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            {isLive ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div className="live-pulse" style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                  <span style={{ fontFamily: "var(--sans)", fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    Service is Live Now
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontWeight: 700, color: "var(--off-white)", marginBottom: 16 }}>We're Live!</h3>
                <p style={{ fontFamily: "var(--sans)", color: "rgba(250,250,250,0.5)", marginBottom: 32, lineHeight: 1.6 }}>Join thousands worshipping together right now. Come as you are.</p>
                <PrimaryButton icon>Watch Live Stream</PrimaryButton>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 24 }}>
                  <SectionLabel>Next Service</SectionLabel>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 700, color: "var(--off-white)", marginBottom: 8 }}>Sunday Morning</h3>
                <div style={{ fontFamily: "var(--sans)", fontSize: "1.1rem", color: "rgba(250,250,250,0.5)", marginBottom: 32 }}>10:00 AM — 12:00 PM</div>

                {/* Countdown */}
                <div style={{
                  fontFamily: "'Courier New', monospace", fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 700, color: "var(--spirit)", letterSpacing: "0.08em",
                  marginBottom: 32,
                  textShadow: "0 0 40px rgba(212,160,23,0.4)",
                }}>
                  {countdown}
                </div>

                <PrimaryButton icon>Plan Your Visit</PrimaryButton>
              </>
            )}
          </div>

          {/* Location & Times */}
          <div style={{ padding: "56px 48px", background: "rgba(250,250,250,0.015)" }}>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 600, color: "var(--off-white)", marginBottom: 36 }}>Service Times & Locations</h3>

            {[
              { campus: "Main Sanctuary", time: "10:00 AM", address: "123 Kingdom Way, City Center" },
              { campus: "North Campus", time: "9:00 AM & 11:30 AM", address: "456 Covenant Blvd, Northside" },
            ].map(loc => (
              <div key={loc.campus} style={{
                padding: "24px 0",
                borderBottom: "1px solid rgba(250,250,250,0.06)",
                marginBottom: 0,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontWeight: 600, color: "var(--off-white)", marginBottom: 6 }}>{loc.campus}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "rgba(250,250,250,0.45)" }}><MapPin size={11} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} />{loc.address}</div>
                  </div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.9rem", fontWeight: 600, color: "var(--spirit)", whiteSpace: "nowrap", marginLeft: 16 }}>{loc.time}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 32 }}>
              <OutlineButton>
                <MapPin size={14} />
                Get Directions
              </OutlineButton>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 700px) {
          section div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

// ─── Bento Next Steps ────────────────────────────────────────────────────────

const bentoItems = [
  {
    id: "new",
    icon: <Star size={22} color="var(--spirit)" />,
    label: "New Here",
    title: "Your First Step Starts Here",
    desc: "Not sure where to begin? We've made it easy. Your journey into purpose begins this Sunday.",
    cta: "I'm New",
    bg: "linear-gradient(135deg, rgba(212,160,23,0.12) 0%, rgba(212,160,23,0.04) 100%)",
    border: "rgba(212,160,23,0.25)",
    size: "large",
  },
  {
    id: "watch",
    icon: <Play size={22} color="var(--off-white)" />,
    label: "Watch Online",
    title: "Worship From Anywhere",
    desc: "Catch live services or the full sermon archive on demand.",
    cta: "Watch Now",
    bg: "rgba(250,250,250,0.03)",
    border: "rgba(250,250,250,0.08)",
    size: "normal",
  },
  {
    id: "groups",
    icon: <Users size={22} color="var(--off-white)" />,
    label: "Life Groups",
    title: "Find Your Tribe",
    desc: "Real community. Real connection. Join a group near you.",
    cta: "Find a Group",
    bg: "rgba(250,250,250,0.03)",
    border: "rgba(250,250,250,0.08)",
    size: "normal",
  },
  {
    id: "give",
    icon: <Heart size={22} color="var(--spirit)" />,
    label: "Give",
    title: "Fuel the Mission",
    desc: "Your generosity builds the Kingdom. Give securely online, anytime.",
    cta: "Give Now",
    bg: "linear-gradient(135deg, rgba(212,160,23,0.07) 0%, transparent 100%)",
    border: "rgba(212,160,23,0.15)",
    size: "normal",
  },
];

const BentoGrid = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "100px clamp(20px, 6vw, 100px)", background: "#0e0e0e" }} aria-label="Next steps">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 56, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}
        >
          <div>
            <SectionLabel>Next Steps</SectionLabel>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 700, color: "var(--off-white)", lineHeight: 1.1 }}>
              Where do you<br />
              <span style={{ color: "var(--spirit)" }}>want to go next?</span>
            </h2>
          </div>
          <p style={{ fontFamily: "var(--sans)", color: "rgba(250,250,250,0.45)", maxWidth: 320, lineHeight: 1.7, fontSize: "0.95rem" }}>
            No matter where you are in your journey, we have a path for you.
          </p>
        </motion.div>

        <div
          className="bento-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 16,
          }}
        >
          {bentoItems.map((item, i) => (
            <motion.div
              key={item.id}
              className="bento-card"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 12,
                padding: item.size === "large" ? "48px 44px" : "36px 32px",
                gridRow: item.size === "large" ? "1 / 3" : "auto",
                display: "flex", flexDirection: "column",
                cursor: "pointer", position: "relative", overflow: "hidden",
              }}
              role="article"
              aria-label={item.label}
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && e.currentTarget.click()}
            >
              {/* Background glow for large card */}
              {item.size === "large" && (
                <div style={{
                  position: "absolute", bottom: -60, right: -60,
                  width: 240, height: 240, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
              )}

              <div style={{
                width: 48, height: 48, borderRadius: 12,
                border: `1px solid ${item.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24, background: "rgba(250,250,250,0.04)",
              }}>
                {item.icon}
              </div>

              <div style={{ fontFamily: "var(--sans)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--spirit)", marginBottom: 12 }}>
                {item.label}
              </div>

              <h3 style={{
                fontFamily: "var(--serif)",
                fontSize: item.size === "large" ? "2.2rem" : "1.4rem",
                fontWeight: 700, color: "var(--off-white)",
                lineHeight: 1.2, marginBottom: 16,
              }}>
                {item.title}
              </h3>

              <p style={{ fontFamily: "var(--sans)", color: "rgba(250,250,250,0.5)", lineHeight: 1.7, fontSize: "0.9rem", flexGrow: 1, marginBottom: 28 }}>
                {item.desc}
              </p>

              <button style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--sans)", fontSize: "0.85rem", fontWeight: 700,
                color: item.id === "new" || item.id === "give" ? "var(--spirit)" : "var(--off-white)",
                letterSpacing: "0.06em", padding: 0,
                transition: "gap 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.gap = "14px"}
                onMouseLeave={e => e.currentTarget.style.gap = "8px"}
              >
                {item.cta}
                <ArrowRight size={15} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Sermon Archive ──────────────────────────────────────────────────────────

const sermons = [
  { id: 1, title: "The Warrior's Covenant", series: "Firstborn Rising", speaker: "Pastor James A.", topic: "Identity", date: "Mar 16, 2025", duration: "48 min", thumb: "🔥" },
  { id: 2, title: "Walking Through Fire", series: "Unbroken", speaker: "Pastor Sarah M.", topic: "Faith", date: "Mar 9, 2025", duration: "52 min", thumb: "✨" },
  { id: 3, title: "Kingdom Builders", series: "Firstborn Rising", speaker: "Pastor James A.", topic: "Purpose", date: "Mar 2, 2025", duration: "44 min", thumb: "👑" },
  { id: 4, title: "The Spirit of Adoption", series: "Heirs of Grace", speaker: "Pastor David R.", topic: "Family", date: "Feb 23, 2025", duration: "50 min", thumb: "🕊️" },
  { id: 5, title: "Intercession & Authority", series: "Prayer Unlocked", speaker: "Pastor Sarah M.", topic: "Prayer", date: "Feb 16, 2025", duration: "46 min", thumb: "🙏" },
  { id: 6, title: "The Unseen Battle", series: "Unbroken", speaker: "Pastor James A.", topic: "Spiritual Warfare", date: "Feb 9, 2025", duration: "55 min", thumb: "⚔️" },
];

const SermonArchive = () => {
  const [activeFilter, setActiveFilter] = useState({ type: "all", value: "" });
  const [visible, setVisible] = useState(sermons.map(s => s.id));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filterGroups = [
    { type: "series", label: "Series", values: [...new Set(sermons.map(s => s.series))] },
    { type: "speaker", label: "Speaker", values: [...new Set(sermons.map(s => s.speaker))] },
    { type: "topic", label: "Topic", values: [...new Set(sermons.map(s => s.topic))] },
  ];

  const handleFilter = (type, value) => {
    const newFilter = activeFilter.type === type && activeFilter.value === value
      ? { type: "all", value: "" }
      : { type, value };
    setActiveFilter(newFilter);
    if (newFilter.type === "all") {
      setVisible(sermons.map(s => s.id));
    } else {
      setVisible(sermons.filter(s => s[newFilter.type] === newFilter.value).map(s => s.id));
    }
  };

  return (
    <section ref={ref} style={{ padding: "100px clamp(20px, 6vw, 100px)", background: "var(--charcoal)" }} aria-label="Sermon archive">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <SectionLabel>The Word</SectionLabel>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 700, color: "var(--off-white)", marginBottom: 16 }}>
            Sermons that <em style={{ color: "var(--spirit)", fontStyle: "italic" }}>Ignite</em>
          </h2>
          <p style={{ fontFamily: "var(--sans)", color: "rgba(250,250,250,0.45)", maxWidth: 480, margin: "0 auto" }}>
            Dive into our archive of transformative messages.
          </p>
        </motion.div>

        {/* Filter Groups */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}
        >
          <button
            className={cn("filter-btn", activeFilter.type === "all" && "active")}
            onClick={() => handleFilter("all", "")}
            style={{
              padding: "8px 20px", borderRadius: 100,
              background: activeFilter.type === "all" ? "var(--spirit)" : "transparent",
              color: activeFilter.type === "all" ? "var(--charcoal)" : "rgba(250,250,250,0.5)",
              border: "1px solid",
              borderColor: activeFilter.type === "all" ? "var(--spirit)" : "rgba(250,250,250,0.15)",
              fontFamily: "var(--sans)", fontSize: "0.8rem", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em",
            }}
          >
            All
          </button>
          {filterGroups.map(group =>
            group.values.map(val => (
              <button
                key={val}
                className={cn("filter-btn", activeFilter.value === val && "active")}
                onClick={() => handleFilter(group.type, val)}
                style={{
                  padding: "8px 20px", borderRadius: 100,
                  background: activeFilter.value === val ? "var(--spirit)" : "transparent",
                  color: activeFilter.value === val ? "var(--charcoal)" : "rgba(250,250,250,0.5)",
                  border: "1px solid",
                  borderColor: activeFilter.value === val ? "var(--spirit)" : "rgba(250,250,250,0.15)",
                  fontFamily: "var(--sans)", fontSize: "0.8rem", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em",
                }}
              >
                {val}
              </button>
            ))
          )}
        </motion.div>

        {/* Sermon Grid */}
        <div
          className="sermon-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
        >
          <AnimatePresence mode="popLayout">
            {sermons.filter(s => visible.includes(s.id)).map((sermon, i) => (
              <motion.article
                key={sermon.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="sermon-card"
                style={{
                  background: "rgba(250,250,250,0.03)",
                  border: "1px solid rgba(250,250,250,0.08)",
                  borderRadius: 12, overflow: "hidden",
                  cursor: "pointer",
                }}
                tabIndex={0}
                aria-label={`Sermon: ${sermon.title} by ${sermon.speaker}`}
              >
                {/* Thumbnail */}
                <div style={{
                  height: 180,
                  background: "linear-gradient(135deg, rgba(212,160,23,0.1) 0%, rgba(18,18,18,0.8) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "3.5rem", position: "relative",
                  borderBottom: "1px solid rgba(250,250,250,0.06)",
                }}>
                  {sermon.thumb}
                  <div style={{
                    position: "absolute", bottom: 12, right: 12,
                    background: "rgba(18,18,18,0.85)", backdropFilter: "blur(8px)",
                    borderRadius: 100, padding: "4px 12px",
                    fontFamily: "var(--sans)", fontSize: "0.7rem", fontWeight: 600,
                    color: "rgba(250,250,250,0.7)",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <Headphones size={10} />
                    {sermon.duration}
                  </div>
                </div>

                <div style={{ padding: "24px 24px 28px" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--sans)", fontSize: "0.65rem", fontWeight: 700,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color: "var(--spirit)", background: "rgba(212,160,23,0.08)",
                      border: "1px solid rgba(212,160,23,0.2)", borderRadius: 100,
                      padding: "3px 10px",
                    }}>{sermon.series}</span>
                    <span style={{
                      fontFamily: "var(--sans)", fontSize: "0.65rem", fontWeight: 600,
                      color: "rgba(250,250,250,0.35)",
                      background: "rgba(250,250,250,0.04)",
                      border: "1px solid rgba(250,250,250,0.08)", borderRadius: 100,
                      padding: "3px 10px",
                    }}>{sermon.topic}</span>
                  </div>

                  <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--off-white)", marginBottom: 8, lineHeight: 1.3 }}>
                    {sermon.title}
                  </h3>

                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.82rem", color: "rgba(250,250,250,0.4)", marginBottom: 20 }}>
                    {sermon.speaker} · {sermon.date}
                  </div>

                  <button style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "var(--sans)", fontSize: "0.82rem", fontWeight: 600,
                    color: "var(--spirit)", padding: 0, letterSpacing: "0.04em",
                    transition: "gap 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.gap = "13px"}
                    onMouseLeave={e => e.currentTarget.style.gap = "8px"}
                  >
                    <Play size={13} fill="currentColor" />
                    Watch Sermon
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <OutlineButton>
            <BookOpen size={15} />
            View Full Archive
          </OutlineButton>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sermon-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .sermon-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

// ─── Location Map ─────────────────────────────────────────────────────────────

const LocationSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "100px clamp(20px, 6vw, 100px)", background: "#0a0a0a" }} aria-label="Location">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel>Find Us</SectionLabel>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "var(--off-white)", lineHeight: 1.15, marginBottom: 32 }}>
              Come Home to<br />
              <span style={{ color: "var(--spirit)" }}>The Sanctuary.</span>
            </h2>

            <p style={{ fontFamily: "var(--sans)", color: "rgba(250,250,250,0.5)", lineHeight: 1.8, marginBottom: 40, fontSize: "0.95rem" }}>
              Our doors are open. Our table is set. Whether you're returning or stepping in for the very first time, you belong here.
            </p>

            {[
              { icon: <MapPin size={16} />, label: "Main Campus", val: "123 Kingdom Way, City Center, State 00000" },
              { icon: <Clock size={16} />, label: "Sunday Services", val: "10:00 AM · 12:00 PM" },
              { icon: <Globe size={16} />, label: "Online Campus", val: "Live every Sunday at 10AM EST" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: "var(--spirit)",
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--spirit)", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: "var(--sans)", color: "rgba(250,250,250,0.6)", fontSize: "0.9rem" }}>{item.val}</div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
              <PrimaryButton icon>Get Directions</PrimaryButton>
              <OutlineButton>All Campuses</OutlineButton>
            </div>
          </motion.div>

          {/* Map Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div style={{
              position: "relative", borderRadius: 16, overflow: "hidden",
              border: "1px solid rgba(212,160,23,0.12)",
              height: 480,
              background: "linear-gradient(135deg, #1a1a0e 0%, #0d0d0d 100%)",
            }}>
              {/* Stylized map grid */}
              <svg width="100%" height="100%" viewBox="0 0 500 480" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
                {[...Array(12)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 45} y1={0} x2={i * 45} y2={480} stroke="rgba(212,160,23,0.5)" strokeWidth={0.5} />
                ))}
                {[...Array(12)].map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 45} x2={500} y2={i * 45} stroke="rgba(212,160,23,0.5)" strokeWidth={0.5} />
                ))}
                {/* Road lines */}
                <path d="M 0 200 Q 150 195 250 200 Q 350 205 500 200" stroke="rgba(212,160,23,0.8)" strokeWidth={3} fill="none" />
                <path d="M 250 0 L 250 480" stroke="rgba(212,160,23,0.6)" strokeWidth={2} />
                <path d="M 100 0 Q 120 240 80 480" stroke="rgba(212,160,23,0.3)" strokeWidth={1.5} fill="none" />
                <path d="M 380 0 Q 360 240 390 480" stroke="rgba(212,160,23,0.3)" strokeWidth={1.5} fill="none" />
                {/* Blocks */}
                <rect x={60} y={80} width={100} height={80} rx={4} fill="rgba(212,160,23,0.05)" stroke="rgba(212,160,23,0.15)" strokeWidth={1} />
                <rect x={300} y={60} width={120} height={100} rx={4} fill="rgba(212,160,23,0.05)" stroke="rgba(212,160,23,0.15)" strokeWidth={1} />
                <rect x={60} y={280} width={90} height={90} rx={4} fill="rgba(212,160,23,0.05)" stroke="rgba(212,160,23,0.15)" strokeWidth={1} />
                <rect x={310} y={290} width={110} height={80} rx={4} fill="rgba(212,160,23,0.05)" stroke="rgba(212,160,23,0.15)" strokeWidth={1} />
              </svg>

              {/* Center pin */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -60%)",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div
                  className="map-pin-pulse"
                  style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "var(--spirit)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 0,
                  }}
                >
                  <Flame size={22} color="var(--charcoal)" />
                </div>
                <div style={{ width: 2, height: 24, background: "linear-gradient(to bottom, var(--spirit), transparent)" }} />
                <div style={{
                  background: "rgba(18,18,18,0.92)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212,160,23,0.3)", borderRadius: 8,
                  padding: "10px 18px", textAlign: "center",
                  marginTop: 4,
                }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "0.95rem", fontWeight: 700, color: "var(--off-white)" }}>Army of the Firstborn</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.72rem", color: "var(--spirit)", marginTop: 2 }}>Main Sanctuary</div>
                </div>
              </div>

              {/* Overlay gradient */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, transparent 30%, rgba(10,10,10,0.6) 100%)", pointerEvents: "none" }} />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          section div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

// ─── Mission Banner ───────────────────────────────────────────────────────────

const MissionBanner = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{
      padding: "100px clamp(20px, 6vw, 100px)",
      background: "linear-gradient(135deg, #100e00 0%, #0a0a0a 50%, #100800 100%)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Gold rays */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: 0, left: "50%",
          width: 1, height: "100%",
          background: "linear-gradient(to bottom, rgba(212,160,23,0.12), transparent)",
          transform: `rotate(${-20 + i * 10}deg)`,
          transformOrigin: "top center",
          pointerEvents: "none",
        }} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}
      >
        <SectionLabel>Our Mission</SectionLabel>

        <blockquote style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
          fontWeight: 700, lineHeight: 1.3,
          color: "var(--off-white)",
          marginBottom: 32, fontStyle: "italic",
        }}>
          "To the general assembly and church of the firstborn, whose names are written in heaven."
        </blockquote>

        <div style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--spirit)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 48 }}>
          Hebrews 12:23
        </div>

        <p style={{ fontFamily: "var(--sans)", color: "rgba(250,250,250,0.55)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
          We exist to deploy a generation of covenant believers—trained, transformed, and sent as a holy army into every sphere of society.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <PrimaryButton icon>Our Story</PrimaryButton>
          <OutlineButton>Core Beliefs</OutlineButton>
        </div>
      </motion.div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer style={{
    background: "#080808",
    borderTop: "1px solid rgba(212,160,23,0.1)",
    padding: "72px clamp(20px, 6vw, 100px) 40px",
  }} role="contentinfo">
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--spirit)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(212,160,23,0.1)" }}>
              <Flame size={20} color="var(--spirit)" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--off-white)" }}>Army of</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "0.72rem", color: "var(--spirit)", letterSpacing: "0.15em", textTransform: "uppercase" }}>The Firstborn</div>
            </div>
          </div>
          <p style={{ fontFamily: "var(--sans)", color: "rgba(250,250,250,0.35)", lineHeight: 1.8, fontSize: "0.88rem", maxWidth: 280 }}>
            A covenant community walking in the fullness of kingdom inheritance.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {["YouTube", "Instagram", "Facebook", "Podcast"].map(s => (
              <button key={s} style={{
                background: "rgba(250,250,250,0.04)", border: "1px solid rgba(250,250,250,0.08)",
                borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                fontFamily: "var(--sans)", fontSize: "0.68rem", fontWeight: 600,
                color: "rgba(250,250,250,0.4)", letterSpacing: "0.08em",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--spirit)"; e.currentTarget.style.color = "var(--spirit)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(250,250,250,0.08)"; e.currentTarget.style.color = "rgba(250,250,250,0.4)"; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Column Links */}
        {[
          { title: "Ministries", links: ["Life Groups", "Youth", "Women", "Men", "Worship"] },
          { title: "Resources", links: ["Sermons", "Podcast", "Bible Plans", "Prayer"] },
          { title: "Connect", links: ["Plan a Visit", "New Here", "Give", "Contact"] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontFamily: "var(--sans)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--spirit)", marginBottom: 20 }}>{col.title}</div>
            {col.links.map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <button style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  fontFamily: "var(--sans)", fontSize: "0.88rem", color: "rgba(250,250,250,0.4)",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--off-white)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,0.4)"}
                >
                  {l}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="divider" style={{ marginBottom: 32 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: "0.78rem", color: "rgba(250,250,250,0.25)" }}>
          © {new Date().getFullYear()} Army of the Firstborn. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms", "Accessibility"].map(l => (
            <button key={l} style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontFamily: "var(--sans)", fontSize: "0.78rem", color: "rgba(250,250,250,0.25)",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--spirit)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,0.25)"}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @media (max-width: 900px) {
        footer div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 500px) {
        footer div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </footer>
);

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <FontLoader />
      <div className="grain" style={{ minHeight: "100vh", background: "var(--charcoal)" }}>
        <a href="#main" style={{
          position: "absolute", top: -100, left: 16,
          background: "var(--spirit)", color: "var(--charcoal)",
          padding: "12px 20px", borderRadius: 4, fontFamily: "var(--sans)", fontWeight: 700,
          zIndex: 9999, transition: "top 0.2s",
        }}
          onFocus={e => e.currentTarget.style.top = "16px"}
          onBlur={e => e.currentTarget.style.top = "-100px"}
        >
          Skip to content
        </a>

        <Navigation />

        <main id="main">
          <Hero />

          <div className="divider" />
          <ServiceSelector />

          <div className="divider" />
          <BentoGrid />

          <div className="divider" />
          <SermonArchive />

          <div className="divider" />
          <MissionBanner />

          <div className="divider" />
          <LocationSection />
        </main>

        <Footer />
      </div>
    </>
  );  
}