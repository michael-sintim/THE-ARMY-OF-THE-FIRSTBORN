import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
} from "framer-motion";
import {
  Play, MapPin, Clock, Users, Heart, ChevronDown, ArrowRight,
  Menu, X, BookOpen, Headphones, Globe, Radio, Flame, Star,
  Search, Mic, Calendar, Filter, ExternalLink, Phone,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const cn = (...c) => c.filter(Boolean).join(" ");

/* ─── global styles (injected once) ─────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }

:root {
  --bg:       #121212;
  --bg-alt:   #0e0e0e;
  --bg-deep:  #0a0a0a;
  --gold:     #D4A017;
  --gold-lt:  #F0C842;
  --gold-dk:  #A87B0D;
  --white:    #FAFAFA;
  --muted:    rgba(250,250,250,0.50);
  --faint:    rgba(250,250,250,0.25);
  --border:   rgba(250,250,250,0.08);
  --gold-b:   rgba(212,160,23,0.22);
  --gold-bg:  rgba(212,160,23,0.08);
  --serif:    'Playfair Display', Georgia, serif;
  --sans:     'Plus Jakarta Sans', system-ui, sans-serif;
  --shadow:   0 24px 64px rgba(0,0,0,0.55);
  --shadow-h: 0 40px 90px rgba(0,0,0,0.70);
}

body {
  background: var(--bg);
  color: var(--white);
  font-family: var(--sans);
  overflow-x: hidden;
}

::selection { background: var(--gold); color: #111; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }
:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

/* ── nav ── */
.nav-root {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 900;
  height: 68px;
  display: flex;
  align-items: center;
  padding: 0 clamp(16px, 5vw, 72px);
  justify-content: space-between;
  will-change: background, border-color;
  transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}
.nav-root.at-top {
  background: rgba(18,18,18,0.35);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(250,250,250,0.06);
  box-shadow: none;
}
.nav-root.scrolled {
  background: rgba(12,12,12,0.94);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-bottom: 1px solid rgba(212,160,23,0.18);
  box-shadow: 0 4px 32px rgba(0,0,0,0.4);
}

/* ── nav links ── */
.nav-link-btn {
  background: none; border: none; cursor: pointer;
  font-family: var(--sans); font-size: 0.84rem; font-weight: 500;
  color: var(--muted); letter-spacing: 0.03em;
  display: flex; align-items: center; gap: 4px;
  padding: 6px 2px;
  position: relative;
  transition: color 0.2s;
}
.nav-link-btn::after {
  content: ''; position: absolute; bottom: 0; left: 0;
  width: 0; height: 1.5px; background: var(--gold);
  transition: width 0.28s ease;
}
.nav-link-btn:hover { color: var(--white); }
.nav-link-btn:hover::after { width: 100%; }

/* ── buttons ── */
.btn-gold {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 13px 30px; border-radius: 4px;
  background: var(--gold); color: #111;
  font-family: var(--sans); font-weight: 700; font-size: 0.82rem;
  letter-spacing: 0.09em; text-transform: uppercase;
  border: none; cursor: pointer;
  transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
              box-shadow 0.22s ease;
}
.btn-gold:hover {
  transform: scale(1.04);
  box-shadow: 0 14px 40px rgba(212,160,23,0.45);
}
.btn-gold:active { transform: scale(0.97); }

.btn-outline {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 12px 30px; border-radius: 4px;
  background: transparent; color: var(--white);
  font-family: var(--sans); font-weight: 600; font-size: 0.82rem;
  letter-spacing: 0.09em; text-transform: uppercase;
  border: 1.5px solid rgba(250,250,250,0.22); cursor: pointer;
  transition: border-color 0.22s, color 0.22s, transform 0.22s;
}
.btn-outline:hover {
  border-color: var(--gold); color: var(--gold);
  transform: scale(1.02);
}

/* ── section label ── */
.sec-label {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--sans); font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 18px;
}
.sec-label span {
  display: inline-block; width: 22px; height: 1.5px; background: var(--gold);
}

/* ── gold shimmer ── */
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
.shimmer {
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold-lt) 40%, var(--gold) 60%, var(--gold-dk) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}

/* ── live pulse ── */
@keyframes live-ring {
  0%   { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.4); opacity: 0; }
}
.live-dot {
  position: relative; width: 10px; height: 10px;
  border-radius: 50%; background: #ef4444; flex-shrink: 0;
}
.live-dot::before {
  content: ''; position: absolute; inset: -4px;
  border-radius: 50%; background: #ef4444;
  animation: live-ring 1.5s ease-out infinite;
}

/* ── map pin pulse ── */
@keyframes map-ring {
  0%, 100% { box-shadow: 0 0 0 0   rgba(212,160,23,0.65); }
  50%       { box-shadow: 0 0 0 14px rgba(212,160,23,0); }
}
.pin-pulse { animation: map-ring 2.2s ease-in-out infinite; }

/* ── divider ── */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-b), transparent);
}

/* ── bento card hover ── */
.bento-card {
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
              box-shadow 0.3s ease;
}
.bento-card:hover {
  transform: scale(1.025) translateY(-5px);
  box-shadow: var(--shadow-h), 0 0 0 1px var(--gold-b);
}

/* ── sermon card hover ── */
.sermon-card {
  transition: transform 0.32s cubic-bezier(0.34,1.2,0.64,1),
              box-shadow 0.32s ease;
}
.sermon-card:hover {
  transform: translateY(-7px) scale(1.012);
  box-shadow: var(--shadow-h);
}

/* ── responsive grid helpers ── */
.bento-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
}
.bento-span { grid-row: 1 / 3; }

.sermon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--gold-b);
}

.location-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 44px;
}

/* ── grain overlay ── */
.grain::after {
  content: '';
  position: fixed; inset: 0; pointer-events: none; z-index: 9998;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.38;
}

/* ─── RESPONSIVE ─────────────────────────────────── */
@media (max-width: 1024px) {
  .bento-grid { grid-template-columns: 1fr 1fr; }
  .bento-span { grid-row: auto; }
}
@media (max-width: 900px) {
  .desktop-links { display: none !important; }
  .nav-plan-btn  { display: none !important; }
  .mobile-btn    { display: flex !important; }
  .sermon-grid   { grid-template-columns: repeat(2, 1fr); }
  .service-grid  { grid-template-columns: 1fr; }
  .location-grid { grid-template-columns: 1fr; gap: 40px; }
  .footer-grid   { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .bento-grid  { grid-template-columns: 1fr; }
  .sermon-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
}
`;

function GlobalCSS() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

/* ─── shared atoms ───────────────────────────────────────────────────────── */
function GoldBtn({ children, onClick, style, className, ...p }) {
  return (
    <button className={cn("btn-gold", className)} onClick={onClick} style={style} {...p}>
      {children}
    </button>
  );
}
function OutlineBtn({ children, onClick, style, className, ...p }) {
  return (
    <button className={cn("btn-outline", className)} onClick={onClick} style={style} {...p}>
      {children}
    </button>
  );
}
function SectionLabel({ children }) {
  return (
    <div className="sec-label">
      <span />{children}<span />
    </div>
  );
}
function Reveal({ children, delay = 0, x = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: x === 0 ? 36 : 0, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── countdown hook ─────────────────────────────────────────────────────── */
function useService() {
  const [state, setState] = useState({ live: false, cd: "" });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const d = now.getDay(), h = now.getHours();
      if (d === 0 && h >= 10 && h < 12) { setState({ live: true, cd: "" }); return; }
      const next = new Date(now);
      const days = (7 - d) % 7 || 7;
      next.setDate(now.getDate() + days);
      next.setHours(10, 0, 0, 0);
      const diff = next - now;
      const dd = Math.floor(diff / 86400000);
      const hh = Math.floor((diff % 86400000) / 3600000);
      const mm = Math.floor((diff % 3600000) / 60000);
      const ss = Math.floor((diff % 60000) / 1000);
      setState({ live: false, cd: `${dd}d ${String(hh).padStart(2,"0")}h ${String(mm).padStart(2,"0")}m ${String(ss).padStart(2,"0")}s` });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return state;
}

/* ─── data ───────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "About",   sub: ["Our Story", "Leadership", "Beliefs", "Locations"] },
  { label: "Sermons", sub: ["Watch Latest", "Series Archive", "Speakers", "Podcast"] },
  { label: "Connect", sub: ["Life Groups", "Serve", "Young Adults", "Women & Men"] },
  { label: "Give",    sub: [] },
];

const BENTO = [
  { id:"new",   Icon:Star,   label:"New Here",    title:"Your First Step",       desc:"Not sure where to begin? We've made it easy. Your journey into purpose begins this Sunday.", cta:"I'm New",      featured:true  },
  { id:"watch", Icon:Play,   label:"Watch Online", title:"Worship Anywhere",      desc:"Catch live services or the full sermon archive — any time, any device.",                     cta:"Watch Now",    featured:false },
  { id:"groups",Icon:Users,  label:"Life Groups",  title:"Find Your Tribe",       desc:"Real community. Real connection. Join a group near you this season.",                        cta:"Find a Group", featured:false },
  { id:"give",  Icon:Heart,  label:"Give",         title:"Fuel the Mission",      desc:"Your generosity builds the Kingdom. Give securely online, anytime.",                         cta:"Give Now",     featured:false },
];

const SERMONS = [
  { id:1, title:"The Warrior's Covenant",  series:"Firstborn Rising", speaker:"Pastor James A.", topic:"Identity",         date:"Mar 16", dur:"48 min", emoji:"🔥" },
  { id:2, title:"Walking Through Fire",    series:"Unbroken",         speaker:"Pastor Sarah M.", topic:"Faith",            date:"Mar 9",  dur:"52 min", emoji:"✨" },
  { id:3, title:"Kingdom Builders",        series:"Firstborn Rising", speaker:"Pastor James A.", topic:"Purpose",          date:"Mar 2",  dur:"44 min", emoji:"👑" },
  { id:4, title:"The Spirit of Adoption",  series:"Heirs of Grace",   speaker:"Pastor David R.", topic:"Family",           date:"Feb 23", dur:"50 min", emoji:"🕊️" },
  { id:5, title:"Intercession & Authority",series:"Prayer Unlocked",  speaker:"Pastor Sarah M.", topic:"Prayer",           date:"Feb 16", dur:"46 min", emoji:"🙏" },
  { id:6, title:"The Unseen Battle",       series:"Unbroken",         speaker:"Pastor James A.", topic:"Spiritual Warfare",date:"Feb 9",  dur:"55 min", emoji:"⚔️" },
];

const FILTER_CATS = {
  Series:  [...new Set(SERMONS.map(s => s.series))],
  Speaker: [...new Set(SERMONS.map(s => s.speaker))],
  Topic:   [...new Set(SERMONS.map(s => s.topic))],
};

/* ════════════════════════════════════════════════════════════════════════════
   NAV  — rewritten with className-based transitions, no inline style jank
════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropdown, setDropdown]   = useState(null);

  /* stable scroll listener — no re-render cascade */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on resize to desktop */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const fn = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <>
      <header
        className={cn("nav-root", scrolled ? "scrolled" : "at-top")}
        role="banner"
      >
        {/* ── logo ── */}
        <a
          href="#"
          aria-label="Army of the Firstborn — Home"
          style={{ display:"flex", alignItems:"center", gap:11, textDecoration:"none", flexShrink:0 }}
        >
          <div style={{
            width:38, height:38, borderRadius:"50%",
            background:"var(--gold-bg)", border:"2px solid var(--gold)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Flame size={16} color="var(--gold)" />
          </div>
          <div style={{ lineHeight:1.15 }}>
            <div style={{ fontFamily:"var(--serif)", fontSize:"0.98rem", fontWeight:700, color:"var(--white)" }}>Army of</div>
            <div style={{ fontFamily:"var(--serif)", fontSize:"0.6rem",  fontWeight:400, color:"var(--gold)", letterSpacing:"0.14em", textTransform:"uppercase" }}>The Firstborn</div>
          </div>
        </a>

        {/* ── desktop links ── */}
        <nav
          className="desktop-links"
          aria-label="Primary navigation"
          style={{ display:"flex", alignItems:"center", gap:32 }}
        >
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              style={{ position:"relative" }}
              onMouseEnter={() => item.sub.length && setDropdown(item.label)}
              onMouseLeave={() => setDropdown(null)}
            >
              <button
                className="nav-link-btn"
                aria-haspopup={item.sub.length > 0 || undefined}
                aria-expanded={dropdown === item.label || undefined}
              >
                {item.label}
                {item.sub.length > 0 && (
                  <ChevronDown size={12} style={{
                    opacity:0.55, transition:"transform 0.2s",
                    transform: dropdown === item.label ? "rotate(180deg)" : "rotate(0deg)",
                  }} />
                )}
              </button>

              <AnimatePresence>
                {item.sub.length > 0 && dropdown === item.label && (
                  <motion.div
                    initial={{ opacity:0, y:8, scale:0.97 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:5, scale:0.97 }}
                    transition={{ duration:0.18 }}
                    role="menu"
                    style={{
                      position:"absolute", top:"calc(100% + 12px)", left:"50%",
                      transform:"translateX(-50%)",
                      background:"rgba(10,10,10,0.97)", backdropFilter:"blur(22px)",
                      border:"1px solid var(--gold-b)", borderRadius:10,
                      padding:"10px 0", minWidth:182,
                      boxShadow:"0 28px 70px rgba(0,0,0,0.65)",
                      zIndex:10,
                    }}
                  >
                    {item.sub.map(s => (
                      <a
                        key={s}
                        href="#"
                        role="menuitem"
                        style={{
                          display:"block", padding:"9px 22px",
                          fontFamily:"var(--sans)", fontSize:"0.83rem", fontWeight:400,
                          color:"var(--muted)", textDecoration:"none",
                          transition:"color 0.15s, padding-left 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.paddingLeft = "26px"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.paddingLeft = "22px"; }}
                      >{s}</a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* ── right actions ── */}
        <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <button
            aria-label="Search"
            style={{ background:"none", border:"none", cursor:"pointer", color:"var(--muted)", transition:"color 0.2s", padding:4 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
          >
            <Search size={18} />
          </button>

          <GoldBtn className="nav-plan-btn" style={{ padding:"10px 22px", fontSize:"0.76rem" }}>
            Plan Your Visit
          </GoldBtn>

          <button
            className="mobile-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            style={{ display:"none", background:"none", border:"none", cursor:"pointer", color:"var(--white)", padding:4 }}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ── mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              exit={{ opacity:0 }}
              transition={{ duration:0.25 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
              style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:1000, backdropFilter:"blur(4px)" }}
            />
            <motion.div
              key="drawer"
              initial={{ x:"100%" }}
              animate={{ x:0 }}
              exit={{ x:"100%" }}
              transition={{ type:"spring", damping:30, stiffness:300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              style={{
                position:"fixed", top:0, right:0, bottom:0,
                width:"min(340px, 88vw)",
                background:"#0a0a0a",
                borderLeft:"1px solid var(--gold-b)",
                zIndex:1001,
                padding:"72px 32px 40px",
                overflowY:"auto",
              }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{ position:"absolute", top:20, right:20, background:"none", border:"none", cursor:"pointer", color:"var(--white)", padding:4 }}
              >
                <X size={22} />
              </button>

              <div style={{ fontFamily:"var(--serif)", fontSize:"0.62rem", letterSpacing:"0.22em", color:"var(--gold)", marginBottom:36, textTransform:"uppercase" }}>
                Navigation
              </div>

              {NAV_ITEMS.map(item => (
                <div key={item.label} style={{ marginBottom:28 }}>
                  <div
                    style={{ fontFamily:"var(--serif)", fontSize:"1.65rem", fontWeight:700, color:"var(--white)", marginBottom:10, cursor:"pointer", transition:"color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--white)"}
                  >
                    {item.label}
                  </div>
                  {item.sub.map(s => (
                    <a
                      key={s}
                      href="#"
                      style={{ display:"block", padding:"5px 0", fontFamily:"var(--sans)", fontSize:"0.87rem", color:"var(--muted)", textDecoration:"none", transition:"color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
                    >{s}</a>
                  ))}
                </div>
              ))}

              <div style={{ marginTop:36, paddingTop:36, borderTop:"1px solid var(--border)" }}>
                <GoldBtn style={{ width:"100%", justifyContent:"center" }}>Plan Your Visit</GoldBtn>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const yShift  = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      aria-label="Hero"
      style={{ position:"relative", height:"100vh", minHeight:680, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}
    >
      {/* parallax bg */}
      <motion.div style={{ scale, position:"absolute", inset:0, zIndex:0 }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#0a0a0a 0%,#1a1005 40%,#0d0a00 70%,#121212 100%)" }} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 55% at 50% 38%, rgba(212,160,23,0.09) 0%, transparent 68%)" }} />
        {/* light beam */}
        <div style={{ position:"absolute", top:"12%", left:"50%", transform:"translateX(-50%)", width:2, height:"42%", background:"linear-gradient(to bottom, transparent, rgba(212,160,23,0.32), transparent)", filter:"blur(4px)" }} />
        {/* cross */}
        <div style={{ position:"absolute", top:"18%", left:"50%", transform:"translateX(-50%)", opacity:0.055 }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:4,   height:280, background:"var(--gold)", borderRadius:2 }} />
          <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:150, height:4,   background:"var(--gold)", borderRadius:2 }} />
        </div>
        {/* particles */}
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} style={{
            position:"absolute",
            left:`${6 + (i * 5.2) % 88}%`,
            top: `${12 + (i * 7.6) % 75}%`,
            width:  i % 3 === 0 ? 3 : 1.5,
            height: i % 3 === 0 ? 3 : 1.5,
            borderRadius:"50%",
            background: i % 4 === 0 ? "var(--gold)" : "rgba(250,250,250,0.1)",
            animation:`live-ring ${2.5 + (i % 3) * 0.7}s ease-out ${i * 0.28}s infinite`,
          }} />
        ))}
      </motion.div>

      {/* overlays */}
      <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(to bottom, rgba(18,18,18,0.28) 0%, rgba(18,18,18,0.05) 45%, rgba(18,18,18,0.78) 100%)" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:220, zIndex:2, background:"linear-gradient(to top, var(--bg), transparent)" }} />

      {/* scroll label — hidden on mobile */}
      <motion.div
        style={{ y:yShift, opacity, position:"absolute", left:"clamp(18px,4vw,56px)", top:"45%", zIndex:5 }}
        initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:1.2, duration:0.8 }}
      >
        <div style={{ writingMode:"vertical-rl", fontFamily:"var(--sans)", fontSize:"0.6rem", fontWeight:600, color:"var(--faint)", letterSpacing:"0.28em", textTransform:"uppercase", display:"flex", flexDirection:"column", alignItems:"center", gap:13 }}>
          <div style={{ width:1, height:50, background:"linear-gradient(to bottom, transparent, var(--gold))" }} />
          Scroll
        </div>
      </motion.div>

      {/* social labels — hidden on mobile */}
      <motion.div
        style={{ y:yShift, opacity, position:"absolute", right:"clamp(18px,4vw,56px)", top:"45%", zIndex:5 }}
        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:1.4, duration:0.8 }}
      >
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:18 }}>
          {["YT","IG","FB"].map(s => (
            <button key={s} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--sans)", fontSize:"0.6rem", fontWeight:700, color:"var(--faint)", letterSpacing:"0.1em", transition:"color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--faint)"}
            >{s}</button>
          ))}
          <div style={{ width:1, height:50, background:"linear-gradient(to bottom, var(--gold), transparent)" }} />
        </div>
      </motion.div>

      {/* content */}
      <motion.div style={{ y:yShift, opacity, position:"relative", zIndex:4, textAlign:"center", padding:"0 clamp(20px,5vw,60px)", maxWidth:900, width:"100%" }}>
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8 }}
          style={{ display:"inline-flex", alignItems:"center", gap:9, marginBottom:28, background:"var(--gold-bg)", border:"1px solid var(--gold-b)", borderRadius:100, padding:"8px 20px" }}
        >
          <Flame size={12} color="var(--gold)" />
          <span style={{ fontFamily:"var(--sans)", fontSize:"0.66rem", fontWeight:700, color:"var(--gold)", letterSpacing:"0.2em", textTransform:"uppercase" }}>
            Welcome to Army of the Firstborn
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:1, ease:[0.22,1,0.36,1] }}
          style={{ fontFamily:"var(--serif)", fontSize:"clamp(3rem,9vw,7.5rem)", fontWeight:900, lineHeight:1.0, color:"var(--white)", marginBottom:24, letterSpacing:"-0.02em" }}
        >
          Faith.{" "}
          <em style={{ fontStyle:"italic", color:"var(--gold)" }}>Family.</em>
          {" "}Future.
        </motion.h1>

        <motion.p
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.75, duration:0.8 }}
          style={{ fontFamily:"var(--sans)", fontSize:"clamp(0.92rem,2vw,1.2rem)", fontWeight:300, color:"rgba(250,250,250,0.6)", maxWidth:500, margin:"0 auto 44px", lineHeight:1.75 }}
        >
          A covenant community ablaze with purpose — built for every soul called to stand in the congregation of the firstborn.
        </motion.p>

        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1, duration:0.8 }}
          style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}
        >
          <GoldBtn>Plan Your Visit <ArrowRight size={15} /></GoldBtn>
          <OutlineBtn><Play size={13} fill="currentColor" />Watch Live</OutlineBtn>
        </motion.div>

        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.35, duration:0.8 }}
          style={{ display:"flex", gap:"clamp(24px,5vw,56px)", justifyContent:"center", marginTop:64, flexWrap:"wrap" }}
        >
          {[["12+","Years of Grace"],["3K+","Family Members"],["2","Campuses"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div className="shimmer" style={{ fontFamily:"var(--serif)", fontSize:"clamp(1.7rem,3.5vw,2.2rem)", fontWeight:700 }}>{n}</div>
              <div style={{ fontFamily:"var(--sans)", fontSize:"0.64rem", fontWeight:600, color:"var(--faint)", letterSpacing:"0.18em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y:[0,9,0] }} transition={{ repeat:Infinity, duration:2.2, ease:"easeInOut" }}
        style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", zIndex:5 }}
        aria-hidden="true"
      >
        <ChevronDown size={22} color="var(--faint)" />
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SERVICE SELECTOR
════════════════════════════════════════════════════════════════════════════ */
function ServiceSelector() {
  const { live, cd } = useService();
  return (
    <section aria-label="Service times" style={{ background:"#0a0a0a" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"16px clamp(16px,5vw,72px)", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
          {live ? (
            <>
              <div className="live-dot" />
              <span style={{ fontFamily:"var(--sans)", fontSize:"0.8rem", fontWeight:700, color:"var(--white)" }}>We're Live Right Now</span>
              <span style={{ color:"var(--faint)" }}>·</span>
              <span style={{ fontFamily:"var(--sans)", fontSize:"0.8rem", color:"var(--muted)" }}>Sunday Morning Service — 10:00 AM</span>
            </>
          ) : (
            <>
              <Radio size={14} color="var(--gold)" />
              <span style={{ fontFamily:"var(--sans)", fontSize:"0.8rem", fontWeight:600, color:"var(--white)" }}>Next Service</span>
              <span style={{ color:"var(--faint)" }}>·</span>
              <span style={{ fontFamily:"var(--sans)", fontSize:"0.8rem", color:"var(--muted)" }}>Sunday · 10:00 AM & 12:00 PM</span>
            </>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:22, flexWrap:"wrap" }}>
          {!live && cd && (
            <div aria-live="polite" style={{ display:"flex", alignItems:"center", gap:7 }}>
              <Clock size={13} color="var(--gold)" />
              <span style={{ fontFamily:"var(--sans)", fontSize:"0.76rem", color:"var(--muted)" }}>Starts in</span>
              <span style={{ fontFamily:"'Courier New', monospace", fontSize:"0.88rem", fontWeight:700, color:"var(--gold)", textShadow:"0 0 20px rgba(212,160,23,0.45)" }}>{cd}</span>
            </div>
          )}
          <a href="#" style={{ fontFamily:"var(--sans)", fontSize:"0.76rem", color:"var(--faint)", textDecoration:"none", transition:"color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--faint)"}
          >Service Times →</a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   BENTO GRID
════════════════════════════════════════════════════════════════════════════ */
function BentoGrid() {
  return (
    <section aria-labelledby="bento-h" style={{ background:"var(--bg-alt)", padding:"96px clamp(16px,5vw,72px)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <Reveal style={{ textAlign:"center", marginBottom:52 }}>
          <SectionLabel>Next Steps</SectionLabel>
          <h2 id="bento-h" style={{ fontFamily:"var(--serif)", fontSize:"clamp(2rem,5vw,3.8rem)", fontWeight:700, color:"var(--white)", lineHeight:1.1 }}>
            Where do you<br />
            <em style={{ fontStyle:"italic", color:"var(--gold)" }}>want to go next?</em>
          </h2>
        </Reveal>

        <div className="bento-grid">
          {BENTO.map((item, i) => {
            const Icon = item.Icon;
            return (
              <Reveal key={item.id} delay={i * 0.08} style={item.featured ? { gridRow:"1 / 3" } : {}}>
                <div
                  className="bento-card"
                  role="article" tabIndex={0} aria-label={item.label}
                  style={{
                    height:"100%", minHeight: item.featured ? 360 : 200,
                    borderRadius:12, padding: item.featured ? "44px 40px" : "30px 28px",
                    display:"flex", flexDirection:"column",
                    background: item.featured
                      ? "linear-gradient(135deg, rgba(212,160,23,0.1), rgba(212,160,23,0.03))"
                      : "rgba(250,250,250,0.025)",
                    border:`1px solid ${item.featured ? "var(--gold-b)" : "var(--border)"}`,
                    cursor:"pointer", position:"relative", overflow:"hidden",
                  }}
                >
                  {item.featured && (
                    <div style={{ position:"absolute", bottom:-50, right:-50, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />
                  )}
                  <div style={{ width:46, height:46, borderRadius:10, border:`1px solid ${item.featured ? "var(--gold-b)" : "var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, background:"var(--gold-bg)" }}>
                    <Icon size={20} color="var(--gold)" />
                  </div>
                  <div style={{ fontFamily:"var(--sans)", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:10 }}>{item.label}</div>
                  <h3 style={{ fontFamily:"var(--serif)", fontSize: item.featured ? "2rem" : "1.32rem", fontWeight:700, color:"var(--white)", lineHeight:1.2, marginBottom:14 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily:"var(--sans)", fontSize:"0.87rem", color:"var(--muted)", lineHeight:1.72, flexGrow:1, marginBottom:24 }}>
                    {item.desc}
                  </p>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:7, fontFamily:"var(--sans)", fontSize:"0.82rem", fontWeight:700, color:"var(--gold)", letterSpacing:"0.06em", cursor:"pointer", transition:"gap 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.gap = "12px"}
                    onMouseLeave={e => e.currentTarget.style.gap = "7px"}
                  >
                    {item.cta} <ArrowRight size={14} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SERMON ARCHIVE
════════════════════════════════════════════════════════════════════════════ */
function SermonArchive() {
  const [active, setActive] = useState({ cat:null, val:"All" });
  const [openCat, setOpenCat] = useState(null);

  const visible = SERMONS.filter(s =>
    active.val === "All" || s[active.cat?.toLowerCase()] === active.val ||
    s.series === active.val || s.speaker === active.val || s.topic === active.val
  );

  const pick = (cat, val) => {
    setActive(val === "All" ? { cat:null, val:"All" } : { cat, val });
    setOpenCat(null);
  };

  return (
    <section aria-labelledby="sermons-h" style={{ background:"var(--bg)", padding:"96px clamp(16px,5vw,72px)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <Reveal style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:28, marginBottom:52 }}>
          <div>
            <SectionLabel>The Word</SectionLabel>
            <h2 id="sermons-h" style={{ fontFamily:"var(--serif)", fontSize:"clamp(2rem,5vw,3.5rem)", fontWeight:700, color:"var(--white)", lineHeight:1.1 }}>
              Sermons that{" "}
              <em style={{ color:"var(--gold)", fontStyle:"italic" }}>ignite</em>
            </h2>
          </div>

          {/* filters */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }} role="group" aria-label="Filter sermons">
            {/* All button */}
            <button
              onClick={() => pick(null, "All")}
              style={{ padding:"7px 18px", borderRadius:100, fontFamily:"var(--sans)", fontSize:"0.77rem", fontWeight:600, cursor:"pointer", transition:"all 0.2s", letterSpacing:"0.04em",
                background: active.val === "All" ? "var(--gold)" : "transparent",
                color:      active.val === "All" ? "#111"        : "var(--muted)",
                border:    `1px solid ${active.val === "All" ? "var(--gold)" : "var(--border)"}`,
              }}
            >All</button>

            {Object.entries(FILTER_CATS).map(([cat, vals]) => (
              <div key={cat} style={{ position:"relative" }}>
                <button
                  onClick={() => setOpenCat(openCat === cat ? null : cat)}
                  style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 18px", borderRadius:100, fontFamily:"var(--sans)", fontSize:"0.77rem", fontWeight:600, cursor:"pointer", transition:"all 0.2s",
                    background: (active.cat === cat || vals.includes(active.val) && cat === Object.keys(FILTER_CATS).find(k => FILTER_CATS[k].includes(active.val))) ? "var(--gold)" : "transparent",
                    color:      vals.includes(active.val) ? "#111" : "var(--muted)",
                    border:    `1px solid ${vals.includes(active.val) ? "var(--gold)" : "var(--border)"}`,
                    background: vals.includes(active.val) ? "var(--gold)" : "transparent",
                  }}
                  aria-expanded={openCat === cat}
                >
                  <Filter size={10} />{cat}{vals.includes(active.val) && `: ${active.val}`}
                </button>
                <AnimatePresence>
                  {openCat === cat && (
                    <motion.ul
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:5 }}
                      role="listbox"
                      style={{ position:"absolute", top:"calc(100% + 8px)", left:0, minWidth:190, background:"rgba(10,10,10,0.97)", border:"1px solid var(--gold-b)", borderRadius:10, padding:"8px 0", zIndex:20, boxShadow:"0 24px 60px rgba(0,0,0,0.6)", listStyle:"none" }}
                    >
                      <li onClick={() => pick(cat, "All")} role="option" aria-selected={active.val === "All"}
                        style={{ padding:"9px 20px", cursor:"pointer", fontFamily:"var(--sans)", fontSize:"0.81rem", color:"var(--muted)", transition:"color 0.15s, padding-left 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.paddingLeft = "24px"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.paddingLeft = "20px"; }}
                      >All</li>
                      {vals.map(v => (
                        <li key={v} onClick={() => pick(cat, v)} role="option" aria-selected={active.val === v}
                          style={{ padding:"9px 20px", cursor:"pointer", fontFamily:"var(--sans)", fontSize:"0.81rem", fontWeight: active.val === v ? 700 : 400,
                            background: active.val === v ? "var(--gold)" : "transparent",
                            color:      active.val === v ? "#111"        : "var(--muted)",
                            transition:"all 0.15s",
                          }}
                          onMouseEnter={e => { if (active.val !== v) { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.paddingLeft = "24px"; }}}
                          onMouseLeave={e => { if (active.val !== v) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.paddingLeft = "20px"; }}}
                        >{v}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.p key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ textAlign:"center", padding:"72px 0", fontFamily:"var(--sans)", color:"var(--faint)" }}>
              No messages match your filters.
            </motion.p>
          ) : (
            <motion.div layout className="sermon-grid">
              {visible.map((s, i) => (
                <motion.article
                  key={s.id} layout
                  initial={{ opacity:0, scale:0.93 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:0.93 }}
                  transition={{ duration:0.36, delay:i * 0.05 }}
                  className="sermon-card"
                  tabIndex={0} aria-label={`${s.title} by ${s.speaker}`}
                  style={{ background:"rgba(250,250,250,0.028)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", cursor:"pointer" }}
                >
                  {/* thumb */}
                  <div style={{ height:168, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3rem", position:"relative", background:"linear-gradient(135deg, var(--gold-bg), var(--bg))", borderBottom:"1px solid var(--border)" }}>
                    {s.emoji}
                    <div style={{ position:"absolute", bottom:10, right:10, background:"rgba(18,18,18,0.88)", backdropFilter:"blur(8px)", borderRadius:100, padding:"4px 11px", fontFamily:"var(--sans)", fontSize:"0.66rem", fontWeight:600, color:"var(--muted)", display:"flex", alignItems:"center", gap:4 }}>
                      <Headphones size={10} />{s.dur}
                    </div>
                    <div style={{ position:"absolute", top:10, left:10, background:"var(--gold)", borderRadius:100, padding:"4px 10px", fontFamily:"var(--sans)", fontSize:"0.6rem", fontWeight:700, color:"#111", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                      {s.topic}
                    </div>
                  </div>
                  <div style={{ padding:"20px 20px 24px" }}>
                    <div style={{ fontFamily:"var(--sans)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>{s.series}</div>
                    <h3 style={{ fontFamily:"var(--serif)", fontSize:"1.15rem", fontWeight:700, color:"var(--white)", marginBottom:7, lineHeight:1.3, transition:"color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--white)"}
                    >{s.title}</h3>
                    <div style={{ fontFamily:"var(--sans)", fontSize:"0.78rem", color:"var(--muted)", marginBottom:16, display:"flex", alignItems:"center", gap:5 }}>
                      <Mic size={11} />{s.speaker}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:13, borderTop:"1px solid var(--border)" }}>
                      <span style={{ fontFamily:"var(--sans)", fontSize:"0.7rem", color:"var(--faint)", display:"flex", alignItems:"center", gap:4 }}>
                        <Calendar size={10} />{s.date}
                      </span>
                      <div style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"var(--sans)", fontSize:"0.77rem", fontWeight:700, color:"var(--gold)", cursor:"pointer", transition:"gap 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.gap = "10px"}
                        onMouseLeave={e => e.currentTarget.style.gap = "6px"}
                      >
                        <Play size={11} fill="var(--gold)" />Watch
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal style={{ textAlign:"center", marginTop:52 }}>
          <OutlineBtn><BookOpen size={14} />View Full Archive</OutlineBtn>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SERVICE TIMES PANEL
════════════════════════════════════════════════════════════════════════════ */
function ServicePanel() {
  const { live, cd } = useService();
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section ref={ref} aria-label="Service times panel" style={{ background:"var(--bg-alt)", padding:"96px clamp(16px,5vw,72px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.8 }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <SectionLabel>Join Us In Person</SectionLabel>
            <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(2rem,5vw,3.6rem)", fontWeight:700, color:"var(--white)", lineHeight:1.1 }}>
              Every Sunday,<br />
              <span style={{ color:"var(--gold)" }}>A Fresh Encounter.</span>
            </h2>
          </div>

          <div className="service-grid">
            {/* countdown / live */}
            <div style={{ padding:"clamp(32px,5vw,56px) clamp(24px,4vw,48px)", background: live ? "rgba(212,160,23,0.05)" : "rgba(250,250,250,0.018)", display:"flex", flexDirection:"column", justifyContent:"center", borderRight:"1px solid var(--gold-b)" }}>
              {live ? (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
                    <div className="live-dot" />
                    <span style={{ fontFamily:"var(--sans)", fontSize:"0.72rem", fontWeight:700, color:"#ef4444", letterSpacing:"0.2em", textTransform:"uppercase" }}>Service is Live Now</span>
                  </div>
                  <h3 style={{ fontFamily:"var(--serif)", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700, color:"var(--white)", marginBottom:14 }}>We're Live!</h3>
                  <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", marginBottom:28, lineHeight:1.65, fontSize:"0.92rem" }}>Join thousands worshipping together right now.</p>
                  <GoldBtn style={{ alignSelf:"flex-start" }}>Watch Live Stream <ArrowRight size={15} /></GoldBtn>
                </>
              ) : (
                <>
                  <SectionLabel>Next Service</SectionLabel>
                  <h3 style={{ fontFamily:"var(--serif)", fontSize:"clamp(1.6rem,3vw,2rem)", fontWeight:700, color:"var(--white)", marginBottom:6 }}>Sunday Morning</h3>
                  <div style={{ fontFamily:"var(--sans)", fontSize:"1rem", color:"var(--muted)", marginBottom:28 }}>10:00 AM — 12:00 PM</div>
                  <div aria-live="polite" style={{ fontFamily:"'Courier New', monospace", fontSize:"clamp(1.3rem,3vw,2.1rem)", fontWeight:700, color:"var(--gold)", letterSpacing:"0.08em", marginBottom:28, textShadow:"0 0 36px rgba(212,160,23,0.38)" }}>
                    {cd}
                  </div>
                  <GoldBtn style={{ alignSelf:"flex-start" }}>Plan Your Visit <ArrowRight size={15} /></GoldBtn>
                </>
              )}
            </div>

            {/* locations */}
            <div style={{ padding:"clamp(32px,5vw,56px) clamp(24px,4vw,48px)", background:"rgba(250,250,250,0.012)" }}>
              <h3 style={{ fontFamily:"var(--serif)", fontSize:"clamp(1.3rem,2.5vw,1.55rem)", fontWeight:600, color:"var(--white)", marginBottom:32 }}>Service Times & Locations</h3>
              {[
                { campus:"Main Sanctuary",  time:"10:00 AM",          addr:"123 Kingdom Way, City Center" },
                { campus:"North Campus",    time:"9:00 AM & 11:30 AM", addr:"456 Covenant Blvd, Northside" },
              ].map(loc => (
                <div key={loc.campus} style={{ padding:"20px 0", borderBottom:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                    <div>
                      <div style={{ fontFamily:"var(--sans)", fontWeight:600, color:"var(--white)", marginBottom:4, fontSize:"0.9rem" }}>{loc.campus}</div>
                      <div style={{ fontFamily:"var(--sans)", fontSize:"0.8rem", color:"var(--muted)", display:"flex", alignItems:"center", gap:4 }}>
                        <MapPin size={10} />{loc.addr}
                      </div>
                    </div>
                    <div style={{ fontFamily:"var(--sans)", fontSize:"0.86rem", fontWeight:600, color:"var(--gold)", whiteSpace:"nowrap" }}>{loc.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:28 }}>
                <OutlineBtn><MapPin size={13} />Get Directions</OutlineBtn>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MISSION BANNER
════════════════════════════════════════════════════════════════════════════ */
function MissionBanner() {
  return (
    <section aria-label="Mission" style={{ position:"relative", overflow:"hidden", padding:"100px clamp(16px,5vw,72px)", background:"linear-gradient(135deg,#100e00 0%,#0a0a0a 50%,#100800 100%)" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{ position:"absolute", top:0, left:"50%", width:1, height:"100%", background:`linear-gradient(to bottom, rgba(212,160,23,${0.09 + i * 0.02}), transparent)`, transform:`rotate(${-20 + i * 10}deg)`, transformOrigin:"top center", pointerEvents:"none" }} />
      ))}
      <Reveal style={{ textAlign:"center", position:"relative", zIndex:1, maxWidth:800, margin:"0 auto" }}>
        <SectionLabel>Our Mission</SectionLabel>
        <blockquote style={{ fontFamily:"var(--serif)", fontSize:"clamp(1.45rem,4vw,2.7rem)", fontWeight:700, lineHeight:1.3, color:"var(--white)", marginBottom:22, fontStyle:"italic" }}>
          "To the general assembly and church of the firstborn, whose names are written in heaven."
        </blockquote>
        <div style={{ fontFamily:"var(--sans)", fontSize:"0.72rem", fontWeight:700, color:"var(--gold)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:36 }}>
          Hebrews 12:23
        </div>
        <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", fontSize:"0.97rem", lineHeight:1.8, maxWidth:560, margin:"0 auto 44px" }}>
          We exist to deploy a generation of covenant believers — trained, transformed, and sent as a holy army into every sphere of society.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <GoldBtn>Our Story <ArrowRight size={15} /></GoldBtn>
          <OutlineBtn>Core Beliefs</OutlineBtn>
        </div>
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LOCATION
════════════════════════════════════════════════════════════════════════════ */
function Location() {
  return (
    <section aria-labelledby="loc-h" style={{ background:"var(--bg-deep)", padding:"96px clamp(16px,5vw,72px)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="location-grid">
          <Reveal x={-36}>
            <SectionLabel>Find Us</SectionLabel>
            <h2 id="loc-h" style={{ fontFamily:"var(--serif)", fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:700, color:"var(--white)", lineHeight:1.15, marginBottom:26 }}>
              Come Home to<br />
              <span style={{ color:"var(--gold)" }}>The Sanctuary.</span>
            </h2>
            <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", lineHeight:1.8, marginBottom:34, fontSize:"0.92rem", maxWidth:460 }}>
              Our doors are open. Our table is set. Whether you're returning or stepping in for the very first time — you belong here.
            </p>
            {[
              { Icon:MapPin, label:"Main Campus",    val:"123 Kingdom Way, City Center, State 00000" },
              { Icon:Clock,  label:"Sunday Services",val:"10:00 AM · 12:00 PM" },
              { Icon:Globe,  label:"Online Campus",  val:"Live every Sunday at 10AM EST" },
              { Icon:Phone,  label:"Phone",          val:"+1 (615) 000-0000" },
            ].map(({ Icon, label, val }) => (
              <div key={label} style={{ display:"flex", gap:15, marginBottom:20, alignItems:"flex-start" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"var(--gold-bg)", border:"1px solid var(--gold-b)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"var(--gold)" }}>
                  <Icon size={15} />
                </div>
                <div>
                  <div style={{ fontFamily:"var(--sans)", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--gold)", marginBottom:3 }}>{label}</div>
                  <div style={{ fontFamily:"var(--sans)", color:"var(--muted)", fontSize:"0.86rem" }}>{val}</div>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:14, marginTop:32, flexWrap:"wrap" }}>
              <GoldBtn>Get Directions <ArrowRight size={15} /></GoldBtn>
              <OutlineBtn>All Campuses</OutlineBtn>
            </div>
          </Reveal>

          {/* SVG map */}
          <Reveal x={36} delay={0.12}>
            <div style={{ position:"relative", borderRadius:14, overflow:"hidden", border:"1px solid var(--gold-b)", height:460, background:"linear-gradient(135deg,#1a1a0e 0%,#0d0d0d 100%)" }}>
              <svg width="100%" height="100%" viewBox="0 0 500 460" xmlns="http://www.w3.org/2000/svg" style={{ position:"absolute", inset:0, opacity:0.16 }}>
                {Array.from({length:12},(_,i) => <line key={`v${i}`} x1={i*45} y1={0} x2={i*45} y2={460} stroke="var(--gold)" strokeWidth={0.5} />)}
                {Array.from({length:12},(_,i) => <line key={`h${i}`} x1={0} y1={i*42} x2={500} y2={i*42} stroke="var(--gold)" strokeWidth={0.5} />)}
                <path d="M 0 195 Q 150 190 250 195 Q 350 200 500 195" stroke="var(--gold)" strokeWidth={3} fill="none" opacity="0.75"/>
                <line x1={250} y1={0} x2={250} y2={460} stroke="var(--gold)" strokeWidth={1.8} opacity="0.55"/>
                <rect x={55} y={75} width={95} height={75} rx={4} fill="var(--gold-bg)" stroke="var(--gold)" strokeWidth={0.7} />
                <rect x={295} y={58} width={115} height={95} rx={4} fill="var(--gold-bg)" stroke="var(--gold)" strokeWidth={0.7} />
                <rect x={58} y={268} width={86} height={85} rx={4} fill="var(--gold-bg)" stroke="var(--gold)" strokeWidth={0.7} />
                <rect x={305} y={278} width={106} height={76} rx={4} fill="var(--gold-bg)" stroke="var(--gold)" strokeWidth={0.7} />
              </svg>

              {/* pin */}
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-62%)", display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div className="pin-pulse" style={{ width:50, height:50, borderRadius:"50%", background:"var(--gold)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Flame size={22} color="#111" />
                </div>
                <div style={{ width:2, height:22, background:"linear-gradient(to bottom, var(--gold), transparent)" }} />
                <div style={{ background:"rgba(10,10,10,0.94)", backdropFilter:"blur(14px)", border:"1px solid var(--gold-b)", borderRadius:8, padding:"10px 18px", textAlign:"center", marginTop:4 }}>
                  <div style={{ fontFamily:"var(--serif)", fontSize:"0.9rem", fontWeight:700, color:"var(--white)" }}>Army of the Firstborn</div>
                  <div style={{ fontFamily:"var(--sans)", fontSize:"0.65rem", color:"var(--gold)", marginTop:2 }}>Main Sanctuary · City Center</div>
                </div>
              </div>

              <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 50%, transparent 26%, rgba(10,10,10,0.58) 100%)", pointerEvents:"none" }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer role="contentinfo" style={{ background:"#080808", borderTop:"1px solid rgba(212,160,23,0.1)", padding:"68px clamp(16px,5vw,72px) 36px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="footer-grid" style={{ marginBottom:52, paddingBottom:52, borderBottom:"1px solid var(--border)" }}>
          {/* brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:18 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:"var(--gold-bg)", border:"2px solid var(--gold)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Flame size={17} color="var(--gold)" />
              </div>
              <div>
                <div style={{ fontFamily:"var(--serif)", fontSize:"1rem", fontWeight:700, color:"var(--white)" }}>Army of</div>
                <div style={{ fontFamily:"var(--serif)", fontSize:"0.6rem", color:"var(--gold)", letterSpacing:"0.16em", textTransform:"uppercase" }}>The Firstborn</div>
              </div>
            </div>
            <p style={{ fontFamily:"var(--sans)", fontSize:"0.84rem", color:"rgba(250,250,250,0.32)", lineHeight:1.8, maxWidth:260, marginBottom:22 }}>
              A covenant community walking in the fullness of kingdom inheritance.
            </p>
            <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
              {["YouTube","Instagram","Facebook","Podcast"].map(s => (
                <button key={s} style={{ background:"rgba(250,250,250,0.04)", border:"1px solid var(--border)", borderRadius:7, padding:"7px 12px", cursor:"pointer", fontFamily:"var(--sans)", fontSize:"0.65rem", fontWeight:600, color:"rgba(250,250,250,0.36)", letterSpacing:"0.07em", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)";  e.currentTarget.style.color = "rgba(250,250,250,0.36)"; }}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* link columns */}
          {[
            { title:"Ministries", links:["Life Groups","Youth","Women","Men","Worship"] },
            { title:"Resources",  links:["Sermons","Podcast","Bible Plans","Prayer"] },
            { title:"Connect",    links:["Plan a Visit","New Here","Give","Contact"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily:"var(--sans)", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>{col.title}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display:"block", marginBottom:9, fontFamily:"var(--sans)", fontSize:"0.84rem", color:"rgba(250,250,250,0.36)", textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--white)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,0.36)"}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
          <div style={{ fontFamily:"var(--sans)", fontSize:"0.74rem", color:"rgba(250,250,250,0.2)" }}>
            © {new Date().getFullYear()} Army of the Firstborn. All rights reserved.
          </div>
          <div style={{ display:"flex", gap:22, flexWrap:"wrap" }}>
            {["Privacy Policy","Terms","Accessibility"].map(l => (
              <a key={l} href="#" style={{ fontFamily:"var(--sans)", fontSize:"0.74rem", color:"rgba(250,250,250,0.2)", textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,0.2)"}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   APP ROOT
════════════════════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <GlobalCSS />
      <div className="grain" style={{ minHeight:"100vh" }}>
        <a
          href="#main"
          style={{ position:"absolute", top:-100, left:16, background:"var(--gold)", color:"#111", padding:"11px 18px", borderRadius:4, fontFamily:"var(--sans)", fontWeight:700, zIndex:9999, transition:"top 0.2s", textDecoration:"none" }}
          onFocus={e => e.currentTarget.style.top = "16px"}
          onBlur={e  => e.currentTarget.style.top = "-100px"}
        >
          Skip to content
        </a>

        <Nav />

        <main id="main">
          <Hero />
          <ServiceSelector />
          <div className="divider" />
          <BentoGrid />
          <div className="divider" />
          <SermonArchive />
          <div className="divider" />
          <ServicePanel />
          <div className="divider" />
          <MissionBanner />
          <div className="divider" />
          <Location />
        </main>

        <Footer />
      </div>
    </>
  );
}