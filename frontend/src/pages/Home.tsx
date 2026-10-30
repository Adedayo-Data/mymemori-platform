import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { LegalModal, type LegalTab } from "../components/LegalModal";

/* ─── Data ─────────────────────────────────────────────────── */

const CAROUSEL_ITEMS: { label: string; src: string }[] = [
  { label: "Rooftop Sessions", src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80" },
  { label: "Neon Nights", src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80" },
  { label: "Festival Vibes", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80" },
  { label: "VIP Lounge", src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&auto=format&fit=crop&q=80" },
  { label: "Main Stage", src: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&auto=format&fit=crop&q=80" },
  { label: "DJ Set", src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80" },
];

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", tall: true },
  { src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&auto=format&fit=crop&q=80", tall: false },
  { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&auto=format&fit=crop&q=80", tall: false },
  { src: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&auto=format&fit=crop&q=80", tall: true },
  { src: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=500&auto=format&fit=crop&q=80", tall: false },
  { src: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=500&auto=format&fit=crop&q=80", tall: false },
];

const STATS = [
  { value: "550+", label: "Photos Shared" },
  { value: "5+", label: "Events Hosted" },
  { value: "30+", label: "Memory Makers" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "photo_camera",
    title: "Capture",
    desc: "Shoot or upload from any device. Every click is synced to the event album in real time.",
    color: "#ffb0cd",
  },
  {
    step: "02",
    icon: "share",
    title: "Share",
    desc: "Create private or public event albums. Invite your crew with a single link.",
    color: "#ddb7ff",
  },
  {
    step: "03",
    icon: "auto_stories",
    title: "Relive",
    desc: "Browse your timeline, download originals, or order a premium printed photobook.",
    color: "#ffb2b7",
  },
];

/* ─── Component ─────────────────────────────────────────────── */

const Home = () => {
  const navigate = useNavigate();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>("privacy");

  const handleOpenLegalModal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);
    };
    const items = document.querySelectorAll(".bento-item");
    items.forEach((item) => item.addEventListener("mousemove", handleMouseMove as EventListener));
    return () => {
      items.forEach((item) => item.removeEventListener("mousemove", handleMouseMove as EventListener));
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0f] text-[#e4e1e9]">
      <div className="grain-overlay" />
      <div className="aura-bg">
        <div className="aura-orb orb-1" />
        <div className="aura-orb orb-2" />
        <div className="aura-orb orb-3" />
      </div>

      {/* ── HEADER ── */}
      <header className="glass-header font-sora fixed top-0 left-0 right-0 h-20 w-full z-50 hidden md:flex justify-between items-center px-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden glass-2-0 p-1 flex items-center justify-center">
            <img alt="MyMemori" className="w-full h-full object-contain mix-blend-screen" src="logo.png" />
          </div>
          <span className="text-[21px] font-bold tracking-[-0.02em] text-white/90 font-sora">
            MyMemori
          </span>
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate("/auth?mode=login")}>
            Log in
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate("/auth?mode=signup")}>
            Sign up free
          </Button>
        </nav>

        {/* Mobile — just sign up, no hamburger */}
        {/* <Button
          variant="primary"
          size="sm"
          className="md:hidden"
          onClick={() => navigate("/auth?mode=signup")}
        >
          Sign up
        </Button> */}
      </header>

      {/* ── PAGE CONTENT ── */}
      <div className="md:pt-20">

        {/* ── HERO ── */}
        <section className="w-full relative mx-auto grid grid-cols-1 md:grid-cols-2 items-center min-h-[90vh] px-5 py-20 pb-10 max-w-7xl gap-12">
          <div className="flex flex-col items-start w-full">
            <h1 className="text-fluid-display font-bold font-sora mb-5 w-full leading-[1.1]">
              <span className="text-white/90 block">Own Your</span>
              <span className="text-gradient-exotic block">Memories.</span>
            </h1>

            <p className="font-hanken text-[clamp(16px,2.2vw,19px)] leading-relaxed text-white/65 font-light max-w-[500px] w-full mb-9">
              The social platform built for nightlife, events, and unforgettable moments. Capture, share and relive every shot — in stunning quality.
            </p>

            <div className="flex items-center gap-3 w-full max-w-full overflow-x-auto scrollbar-hide pb-2 sm:pb-0 md:hidden">
              <Button
                variant="primary"
                size="lg"
                icon="arrow_forward"
                className="max-sm:px-5 max-sm:text-[12px]"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Get started free
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="max-sm:px-5 max-sm:text-[12px]"
                onClick={() => navigate("/auth?mode=login")}
              >
                Log in
              </Button>
            </div>
          </div>

          {/* Right hero card */}
          <div className="w-full relative pt-4">
            <div className="absolute -top-10 -right-5 w-[200px] h-[200px] rounded-full blur-[80px] bg-[#ffb0cd]/25 pointer-events-none" />
            <div className="absolute -bottom-10 -left-5 w-[200px] h-[200px] rounded-full blur-[80px] bg-[#ddb7ff]/20 pointer-events-none" />
            <div
              className="glass-2-0 group rounded-[2rem] overflow-hidden relative p-2 rotate-2 transition-transform duration-700 ease-out w-full hover:rotate-0"
            >
              <div className="rounded-[1.5rem] overflow-hidden relative h-[420px] w-full">
                <img className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" alt="Live event" src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute top-4 right-4 glass-2-0 rounded-full px-4 py-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse bg-[#ffb0cd]" />
                  <span className="text-white uppercase font-hanken text-[11px] font-semibold tracking-widest">Live</span>
                </div>
                <div className="absolute top-4 left-4 glass-2-0 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#ddb7ff]">cloud_upload</span>
                  <div>
                    <p className="font-hanken text-[11px] text-white/90 font-semibold">342 photos synced</p>
                    <p className="font-hanken text-[10px] text-white/50">Summer Gala '24</p>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white mb-4 font-sora text-2xl font-bold">Summer Gala '24</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-3">
                      <div className="w-9 h-9 rounded-full glass-2-0 flex items-center justify-center border-2 border-[#131318] font-hanken text-[11px] text-white/90 font-bold">+44</div>
                    </div>
                    <div className="flex items-center gap-1 text-white/70 font-hanken text-[12px] font-semibold">
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                      <span>342</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="w-full px-5 pb-12 max-w-7xl mx-auto">
          <div className="glass-2-0 rounded-[1.5rem] p-7 md:p-8 grid grid-cols-3 gap-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-sora text-[clamp(22px,3vw,36px)] font-bold text-white leading-[1.1]">{value}</p>
                <p className="font-hanken text-[11px] text-white/45 font-medium mt-1 tracking-wider uppercase">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CAROUSEL ── */}
        <section className="w-full py-10 md:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto mb-8 px-5 md:px-6">
            <h2 className="font-sora text-white/90 font-semibold text-[clamp(22px,3vw,32px)]">
              Neon Nights{" "}
              <span className="text-[#ddb7ff]/80 font-light italic">Live</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-0 w-24 h-full z-10 pointer-events-none bg-gradient-to-r from-[#0a0a0f] to-transparent" />
            <div className="absolute top-0 right-0 w-24 h-full z-10 pointer-events-none bg-gradient-to-l from-[#0a0a0f] to-transparent" />
            <div className="carousel-track">
              {[...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS].map((item, i) => (
                <div key={i} className="carousel-item">
                  <div className="carousel-inner glass-2-0 rounded-2xl h-64 overflow-hidden relative group">
                    <img alt={item.label} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" src={item.src} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="font-hanken text-[13px] font-semibold text-white/90">{item.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="w-full px-5 py-10 pb-16 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-hanken text-[12px] font-semibold tracking-widest uppercase text-[#ddb7ff] mb-3">The Process</p>
            <h2 className="font-sora text-[clamp(28px,4vw,48px)] font-bold text-white/90 leading-[1.15]">
              Three steps to{" "}
              <span className="text-gradient-exotic">immortal memories</span>
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {HOW_IT_WORKS.map(({ step, icon, title, desc, color }) => (
              <div key={step} className="bento-item glass-2-0 group rounded-[1.5rem] p-8 pb-10 relative overflow-hidden">
                <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full blur-[30px] pointer-events-none" style={{ background: `${color}18` }} />
                <p className="font-sora text-7xl font-extrabold text-white/5 absolute top-3 right-5 leading-none">{step}</p>
                <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center mb-6" style={{ background: `${color}22` }}>
                  <span className="material-symbols-outlined text-[26px]" style={{ color }}>{icon}</span>
                </div>
                <h3 className="font-sora text-[22px] font-semibold text-white/90 mb-3">{title}</h3>
                <p className="font-hanken text-[15px] text-white/60 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── GALLERY SHOWCASE ── */}
        <section className="w-full px-5 py-10 pb-16 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <p className="font-hanken text-[12px] font-semibold tracking-widest uppercase text-[#ffb0cd] mb-2.5">Real Moments</p>
              <h2 className="font-sora text-[clamp(26px,3.5vw,42px)] font-bold text-white/90">
                Your <span className="text-gradient-exotic">gallery</span>, elevated.
              </h2>
            </div>
            <Button
              variant="ghost"
              icon="arrow_forward"
              className="text-white/50"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Browse events
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-2.5 auto-rows-[140px] md:auto-rows-[180px]">
            {GALLERY_IMAGES.map((img, i) => (
              <div key={i} className={`group rounded-2xl overflow-hidden relative cursor-pointer ${img.tall ? "row-span-2" : "row-span-1"}`}>
                <img src={img.src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[20px] text-white/90">open_in_full</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES BENTO ── */}
        <section className="w-full px-5 py-10 pb-16 max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="font-hanken text-[12px] font-semibold tracking-widest uppercase text-[#ddb7ff] mb-3">Why MyMemori</p>
            <h2 className="font-sora text-[clamp(28px,4vw,48px)] font-bold">
              <span className="text-white/90">Immersive</span>{" "}
              <span className="text-gradient-exotic font-light italic">Features</span>
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-3.5">
            {/* Big card */}
            <div className="bento-item glass-2-0 group col-span-4 md:col-span-2 row-span-2 rounded-[1.5rem] p-9 relative overflow-hidden min-h-[280px] flex flex-col justify-end">
              <div className="absolute top-7 right-7 w-[52px] h-[52px] rounded-full bg-[#ffb0cd]/15 flex items-center justify-center border border-[#ffb0cd]/20 text-[#ffb0cd]">
                <span className="material-symbols-outlined text-[26px]">photo_camera</span>
              </div>
              <h3 className="font-sora text-[clamp(20px,2.2vw,26px)] font-semibold text-white/90 mb-3.5">Seamless Camera Sync</h3>
              <p className="font-hanken text-white/60 text-[15px] leading-relaxed font-light">Upload straight from any device in full resolution. Every shot, instantly available to everyone at the event.</p>
            </div>
            {[
              { icon: "bolt", title: "Luminous Uploads", desc: "Zero-compression, high-speed transfers. Crystal-clear memories, instantly shared.", color: "#ddb7ff" },
              { icon: "menu_book", title: "Physical Photobooks", desc: "Turn digital memories into premium printed albums delivered to your door.", color: "#ffb2b7", hideOnMobile: true },
              { icon: "group", title: "Collaborative Albums", desc: "Invite everyone. One album, hundreds of perspectives.", color: "#ffb0cd" },
              { icon: "privacy_tip", title: "Private by Default", desc: "Granular privacy controls. You choose exactly who sees what.", color: "#ddb7ff", hideOnMobile: true },
            ].map(({ icon, title, desc, color, hideOnMobile }) => (
              <div key={title} className={`bento-item glass-2-0 group col-span-4 sm:col-span-2 md:col-span-2 rounded-[1.5rem] p-7 relative overflow-hidden ${hideOnMobile ? 'hidden md:block' : ''}`}>
                <div className="flex items-start gap-4.5">
                  <div className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center" style={{ background: `${color}20`, color }}>
                    <span className="material-symbols-outlined text-[22px]">{icon}</span>
                  </div>
                  <div>
                    <h3 className="font-sora text-[18px] font-semibold text-white/90 mb-2">{title}</h3>
                    <p className="font-hanken text-white/55 text-[14px] leading-relaxed font-light">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="w-full px-5 py-5 pb-20 max-w-7xl mx-auto">
          <div className="glass-2-0 rounded-[2rem] p-[clamp(40px,6vw,80px)_clamp(24px,5vw,80px)] relative overflow-hidden text-center">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] bg-[#ffb0cd]/10 pointer-events-none" />
            <div className="relative z-10">
              <p className="font-hanken text-[12px] font-semibold tracking-widest uppercase text-[#ffb0cd] mb-4">Start free today</p>
              <h2 className="font-sora text-[clamp(28px,5vw,56px)] font-bold text-white/95 mb-5 leading-[1.1]">
                Ready to own your<br /><span className="text-gradient-exotic">memories?</span>
              </h2>
              <p className="font-hanken text-[clamp(15px,2vw,18px)] text-white/55 mb-9 font-light max-w-[420px] mx-auto">
                Join thousands of memory makers. No credit card required.
              </p>
              <Button
                variant="primary"
                size="lg"
                icon="arrow_forward"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Create free account
              </Button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="w-full border-t border-white/5 py-12 px-5 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] max-md:grid-cols-[1fr_1fr] max-sm:grid-cols-1 gap-10 mb-12">
              <div className="max-md:col-span-full">
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden glass-2-0 p-1 flex items-center justify-center">
                    <img alt="Logo" className="w-full h-full object-contain mix-blend-screen" src="logo.png" />
                  </div>
                  <span className="text-[17px] font-bold tracking-[-0.02em] text-white/65 font-sora">MyMemori</span>
                </div>
                <p className="font-hanken text-[13px] text-white/35 leading-relaxed max-w-[220px]">
                  The social platform for capturing and sharing your best nightlife moments.
                </p>
              </div>
              {[
                { heading: "Product", links: ["Features", "Pricing", "Changelog"] },
                { heading: "Company", links: ["About", "Blog", "Careers"] },
                { heading: "Legal", links: ["Privacy", "Terms", "Contact"] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <p className="font-hanken text-[10px] font-semibold tracking-widest uppercase text-white/35 mb-4">{heading}</p>
                  <ul className="list-none flex flex-col gap-2.5">
                    {links.map((l) => {
                      const isLegal = heading === "Legal";
                      const legalTabMap: Record<string, LegalTab> = {
                        Privacy: "privacy",
                        Terms: "terms",
                        Contact: "contact",
                      };
                      const tab = legalTabMap[l];
                      const href = tab ? `/${tab}` : "#";

                      return (
                        <li key={l}>
                          <Link
                            to={href}
                            onClick={(e) => {
                              if (isLegal && tab) {
                                e.preventDefault();
                                handleOpenLegalModal(tab);
                              }
                            }}
                            className="inline-block hover:text-[#ffb0cd] hover:translate-x-1 transition-all font-hanken text-[14px] text-white/45 font-normal cursor-pointer"
                          >
                            {l}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6">
              <p className="font-hanken text-[12px] text-white/20">
                &copy; {new Date().getFullYear()} MyMemori. All rights reserved.
              </p>
              <div className="flex items-center gap-6 md:gap-5 mb-2 md:mb-0">
                {["Instagram", "Twitter", "TikTok"].map(social => (
                  <a key={social} href="#" className="hover:text-[#ffb0cd] hover:-translate-y-0.5 transition-all text-white/40 font-hanken text-[13px] font-medium">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* Reusable Legal & Contact Modal */}
        <LegalModal
          isOpen={legalModalOpen}
          onClose={() => setLegalModalOpen(false)}
          initialTab={legalModalTab}
        />
      </div>
    </div>
  );
};

export default Home;
