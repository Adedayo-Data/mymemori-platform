import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiArrowRight, FiCamera, FiBook, FiZap } from 'react-icons/fi';

const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-inter selection:bg-pink-500/30 overflow-x-hidden flex flex-col items-center justify-center relative">
      {/* Mesh Gradients for Premium Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-4xl px-6 py-20 flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-center"
        >
          {/* Logo / Badge */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-pink-200/80">MyMemori is evolving</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="text-[2.8rem] md:text-[4.5rem] font-black leading-[1] tracking-tighter mb-8 text-white">
            Capturing the <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              unforgettable.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            We're building the future of event photo sharing. 
            Sign up to be the first to experience the new MyMemori.
          </motion.p>

          {/* High-End Glass Card */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-xl mx-auto bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 md:p-6 shadow-2xl shadow-black/50"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col md:flex-row gap-3"
                >
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-8 py-5 rounded-[1.5rem] bg-white/5 border border-white/5 outline-none text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-pink-500/30 transition-all font-medium text-lg"
                  />
                  <button
                    type="submit"
                    className="px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg group"
                  >
                    Join Waitlist <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-10 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20">
                    <FiCheckCircle className="text-4xl text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                  <p className="text-gray-400 font-light">We'll reach out the moment we're ready for you.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Minimal Features List */}
          <motion.div variants={itemVariants} className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-3xl mx-auto">
            {[
              { icon: <FiCamera className="text-pink-500" />, title: 'In-app Camera', desc: 'Snap and share instantly.' },
              { icon: <FiZap className="text-rose-500" />, title: 'Fast Uploads', desc: 'No more waiting for bars.' },
              { icon: <FiBook className="text-purple-500" />, title: 'Photobooks', desc: 'Physical memories, delivered.' },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    {f.icon}
                  </div>
                  <span className="font-bold text-sm text-gray-200">{f.title}</span>
                </div>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto py-12 relative z-10 w-full flex flex-col items-center gap-6 border-t border-white/5">
        <div className="text-xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent opacity-50">
          MyMemori
        </div>
        <div className="flex gap-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <Link to="/privacy" className="hover:text-pink-400 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-pink-400 transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-pink-400 transition-colors">Contact</Link>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default Waitlist;
