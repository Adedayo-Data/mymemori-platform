import { motion, type Variants } from 'framer-motion';
import { FiArrowUpRight, FiDownload, FiMail, FiMapPin, FiCpu, FiShield, FiZap, FiLayout, FiMaximize, FiGlobe } from 'react-icons/fi';

const Recruiters = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const codeBlockVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-inter selection:bg-pink-500/30">
      {/* Fixed Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent tracking-tighter">
            MyMemori
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#product" className="hover:text-pink-500 transition-colors">Product</a>
            <a href="#engineering" className="hover:text-pink-500 transition-colors">Engineering</a>
            <a href="#stack" className="hover:text-pink-500 transition-colors">Stack</a>
            <a href="mailto:dayo@mymemori.site" className="px-5 py-2 rounded-full border border-white/10 hover:border-pink-500 hover:text-pink-500 transition-all">Get in touch</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Subtle radial glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div variants={itemVariants} className="font-mono text-pink-500 mb-6 text-sm tracking-[0.2em] uppercase">
              Adedayo Adewusi — Senior Backend Engineer
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold leading-[1.1] tracking-tighter mb-8">
              I build resilient systems <br />
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                that scale in production.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed font-light">
              Java/Spring Boot specialist crafting high-performance distributed systems. 
              MyMemori is my production laboratory.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-5 mb-20">
              <a 
                href="#" 
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-10 py-5 rounded-full shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-105 transition-all flex items-center gap-3 text-lg"
              >
                <FiDownload className="text-xl" /> Download CV
              </a>
              <a 
                href="#" 
                className="group px-10 py-5 rounded-full border border-white/10 hover:border-pink-500 transition-all flex items-center gap-3 font-bold hover:text-pink-500 text-lg"
              >
                View LinkedIn <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-white/5">
              <div>
                <div className="text-3xl font-black mb-1">3+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">Live deployments</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">100/m</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">IP Rate Limit</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">Async</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">Event Processing</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">OSS</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">Active Contributor</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="font-mono text-pink-500 mb-6 text-xs tracking-[0.3em] uppercase">The Product</div>
          <h2 className="text-5xl font-extrabold mb-16 tracking-tighter leading-tight">
            MyMemori — High-fidelity photo <br />
            <span className="text-gray-500">sharing for high-stakes events.</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[2.5rem] p-10 md:p-14 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-pink-500/20 transition-all duration-700" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-12">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Production Ready
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-white leading-tight">Zero-Friction <br />Guest Experience</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                    Engineered to handle the "organic upload storm" during major events. Guest-side performance is optimized via a sophisticated background upload queue and instant image processing.
                  </p>
                  <div className="flex gap-4">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-pink-400">99.9% Uptime</div>
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-rose-400">Low Latency</div>
                  </div>
                </div>
                
                <div className="w-full md:w-72 flex flex-col gap-4">
                  {[
                    { label: 'Event Status', value: 'Active', color: 'text-green-500' },
                    { label: 'Avg Upload Speed', value: '1.2s', color: 'text-pink-500' },
                    { label: 'Success Rate', value: '99.8%', color: 'text-rose-500' },
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#0d0d15] border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{stat.label}</span>
                      <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-[#0d0d15] border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between group hover:border-pink-500/50 transition-all duration-500">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <FiLayout className="text-2xl text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Masonry Architecture</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  A custom-built masonry grid system optimized for high-res galleries, implementing virtualization to maintain 60fps scrolling even with thousands of images.
                </p>
              </div>
              <div className="mt-8 text-pink-500 font-mono text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                Learn more <FiArrowUpRight />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Depth Section */}
      <section id="engineering" className="py-32 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="font-mono text-pink-500 mb-6 text-xs tracking-[0.3em] uppercase">Engineering Depth</div>
          <h2 className="text-5xl font-extrabold mb-16 tracking-tighter leading-tight">
            Beyond the surface. <br />
            <span className="text-gray-500">Real-world system design.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { id: '01', icon: <FiCpu />, title: 'Factory Pattern + Spring DI', desc: 'Type-safe service resolution using Spring Boot components to avoid tight coupling and "new" keyword antipatterns.' },
              { id: '02', icon: <FiShield />, title: 'Bucket4j Rate Limiting', desc: 'IP-based rate limiting (100 req/min) implemented via custom filter and Bucket4j for distributed resilience.' },
              { id: '03', icon: <FiZap />, title: 'Async Webhook Processing', desc: '@Async execution for payment reconciliation with immediate HTTP 200 responses to ensure idempotency.' },
              { id: '04', icon: <FiGlobe />, title: 'IP-Based Gateway Routing', desc: 'Dynamic payment gateway resolution (Paystack vs Flutterwave) based on incoming client geo-location data.' },
              { id: '05', icon: <FiMaximize />, title: 'Background Upload Queue', desc: 'Frontend-side state machine managing image compression, retries, and background uploads without blocking UI threads.' },
              { id: '06', icon: <FiCpu />, title: 'Cloudinary Optimization', desc: 'Server-side and client-side image optimization pipeline reducing asset size by ~70% without perceptible loss.' },
            ].map((card) => (
              <div key={card.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-pink-500/30 transition-all duration-500 group">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <div className="text-gray-600 font-mono text-xs">{card.id}</div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-pink-50 transition-colors">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{card.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              variants={codeBlockVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[#0d0d15] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-8 py-5 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="ml-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">RateLimitFilter.java</span>
                </div>
                <div className="px-3 py-1 rounded-md bg-white/5 text-[10px] font-mono text-pink-500/70">Resilience</div>
              </div>
              <pre className="p-8 text-[13px] font-mono text-gray-300 overflow-x-auto leading-relaxed scrollbar-hide">
                <code>{`@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

  @Override
  protected void doFilterInternal(HttpServletRequest request, ...) {
    String key = getClientIP(request);
    Bucket bucket = cache.computeIfAbsent(key, k -> createNewBucket());

    if (bucket.tryConsume(1)) {
      filterChain.doFilter(request, response);
    } else {
      response.setStatus(429); // Too Many Requests
    }
  }
}`}</code>
              </pre>
            </motion.div>

            <motion.div 
              variants={codeBlockVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[#0d0d15] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-8 py-5 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="ml-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">UploadQueue.ts</span>
                </div>
                <div className="px-3 py-1 rounded-md bg-white/5 text-[10px] font-mono text-rose-500/70">UX Logic</div>
              </div>
              <pre className="p-8 text-[13px] font-mono text-gray-300 overflow-x-auto leading-relaxed scrollbar-hide">
                <code>{`class UploadQueueManager {
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const task = this.queue[0];
      try {
        await this.processTask(task); // Compression -> Cloudinary
      } finally {
        this.queue.shift();
        this.notifyListeners();
      }
    }
  }
}`}</code>
              </pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section id="stack" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="font-mono text-pink-500 mb-10 text-xs tracking-[0.3em] uppercase">The Tech Stack</div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Java 17', type: 'Core' },
              { label: 'Spring Boot 3', type: 'Core' },
              { label: 'Spring Security', type: 'Auth' },
              { label: 'JWT / OAuth2', type: 'Auth' },
              { label: 'PostgreSQL', type: 'Data' },
              { label: 'Hibernate', type: 'Data' },
              { label: 'React 19', type: 'Frontend' },
              { label: 'TypeScript', type: 'Frontend' },
              { label: 'Tailwind v4', type: 'Style' },
              { label: 'Framer Motion', type: 'Motion' },
              { label: 'Docker', type: 'DevOps' },
              { label: 'Hetzner', type: 'DevOps' },
              { label: 'Stellar SDK', type: 'Web3' },
              { label: 'Bucket4j', type: 'Security' },
              { label: 'Cloudinary', type: 'Media' },
              { label: 'Paystack API', type: 'Fintech' },
              { label: 'Flutterwave', type: 'Fintech' },
              { label: 'JUnit / Mockito', type: 'Testing' },
            ].map((tech) => (
              <div key={tech.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 hover:bg-white/5 hover:border-pink-500/20 transition-all cursor-default group">
                <span className="text-[10px] font-mono text-gray-600 group-hover:text-pink-500/70 transition-colors uppercase tracking-widest">{tech.type}</span>
                <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-extrabold mb-10 tracking-tighter"
          >
            Let's talk.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Currently open to senior backend or full-stack roles in fintech, high-growth startups, or European tech.
          </motion.p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-24">
            <a 
              href="mailto:dayo@mymemori.site" 
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-12 py-6 rounded-full shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-105 transition-all flex items-center gap-3 text-xl"
            >
              <FiMail className="text-2xl" /> dayo@mymemori.site
            </a>
            <a 
              href="#" 
              className="group px-12 py-6 rounded-full border border-white/10 hover:border-pink-500 transition-all flex items-center gap-3 font-bold hover:text-pink-500 text-xl"
            >
              LinkedIn <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-gray-500 font-mono text-sm tracking-widest uppercase">
            <a href="mailto:dayo@mymemori.site" className="hover:text-pink-500 transition-colors">dayo@mymemori.site</a>
            <div className="hidden md:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-3">
              <FiMapPin className="text-pink-500" />
              Remote First
            </div>
            <div className="hidden md:block w-px h-4 bg-white/10" />
            <div className="text-gray-400">Open to Relocation</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Recruiters;
