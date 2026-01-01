"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, Zap, Laptop, ShoppingBag, Home as HomeIcon, Sparkles, Filter, LayoutGrid, X } from "lucide-react";
import DealCard from "@/components/DealCard";

export default function Home() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeals(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const hasSeenOverlay = sessionStorage.getItem('welcome2026');
    if (!hasSeenOverlay) {
      setShowOverlay(true);
      sessionStorage.setItem('welcome2026', 'true');
      const timer = setTimeout(() => setShowOverlay(false), 2000);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.onload = () => {
        (window as any).confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFFFFF', '#FFA500']
        });
      };
      document.head.appendChild(script);
      return () => clearTimeout(timer);
    }
  }, []);

  const filteredDeals = deals.filter(deal => {
    const matchesCat = activeCategory === "All" || deal.category === activeCategory;
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { name: "All", icon: <LayoutGrid size={14} /> },
    { name: "Tech", icon: <Laptop size={14} /> },
    { name: "Fashion", icon: <ShoppingBag size={14} /> },
    { name: "Home", icon: <HomeIcon size={14} /> },
    { name: "Beauty", icon: <Sparkles size={14} /> }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-outfit pb-24 md:pb-0">
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center flex-col gap-4"
          >
            <motion.h1
              initial={{ scale: 5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-7xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 italic tracking-tighter"
            >
              2026
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-yellow-500 font-black uppercase tracking-[1em] text-[10px] md:text-sm text-center"
            >
              Welcome to the Future
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-black text-yellow-500 text-[9px] md:text-xs py-2 font-black text-center uppercase tracking-[2px] md:tracking-[3px] z-[60] relative border-b border-yellow-500/10">
        <Zap size={10} className="inline mr-2 text-yellow-500 animate-pulse" /> 🎆 2026 Grand Loot Festival: Verified 🎆
      </div>

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 mb-0">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-9 h-9 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-200 text-sm">DS</div>
            <span className="text-lg md:text-2xl font-black tracking-tight text-slate-900 hidden xs:block font-outfit uppercase">DealzoShop</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search premium deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 border border-transparent rounded-[18px] py-2.5 pl-10 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600/20 transition-all font-medium text-sm placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[70] bg-white p-4 md:hidden"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  autoFocus
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-10 pr-4 outline-none font-bold text-slate-800"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Quick Filters</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c.name}
                    onClick={() => { setActiveCategory(c.name); setIsSearchOpen(false); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeCategory === c.name ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW YEAR HERO - Responsive */}
      <section className="relative w-full bg-[#0a0a0a] overflow-hidden py-10 md:py-20 px-4">
        <div className="firework"></div>
        <div className="firework"></div>
        <div className="firework opacity-30"></div>

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-2 md:gap-4"
          >
            <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[2px] md:tracking-[4px]">
              <Sparkles size={10} /> Grand Loot Festival
            </div>
            <h2 className="text-3xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-100 to-yellow-600 uppercase italic tracking-tighter leading-none mb-1 md:mb-2">
              2026 LOOT SALE 🎆
            </h2>
            <p className="text-slate-400 text-[10px] md:text-lg font-medium max-w-sm md:max-w-xl mx-auto px-4">
              Premium deals verified for the new era. <span className="text-yellow-500 font-bold block md:inline">Starts Right Now.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY NAV - Responsive Horizontal Scroll */}
      <section className="bg-white border-b border-slate-100 sticky top-[56px] md:top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] md:text-sm font-black uppercase tracking-tight transition-all whitespace-nowrap border-2 ${activeCategory === cat.name
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-105"
                  : "bg-slate-50 text-slate-400 border-slate-50 hover:border-slate-200"
                  }`}
              >
                {cat.icon}
                {cat.name === "All" ? "Everything" : cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DEAL GRID */}
      <main className="container mx-auto px-3 md:px-4 py-6 md:py-10">
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 p-4 md:p-5 space-y-4 md:space-y-5 overflow-hidden relative shadow-sm">
                <div className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2 animate-pulse" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 bg-slate-100 rounded-lg w-12 animate-pulse" />
                  <div className="w-8 h-8 bg-slate-100 rounded-lg animate-pulse" />
                </div>
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Filter size={12} className="text-blue-600" />
                Currently Showing {activeCategory} ({filteredDeals.length})
              </h3>
            </div>

            <motion.div
              layout
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-7"
            >
              <AnimatePresence mode="popLayout">
                {filteredDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <DealCard deal={deal} isSpecial={index < 4 && activeCategory === "All"} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-100 px-4 py-2 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => { setActiveCategory("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${activeCategory === "All" ? "text-blue-600 scale-110" : "text-slate-400 hover:text-slate-600"}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${activeCategory === "All" ? "bg-blue-50" : "bg-transparent"}`}>
              <HomeIcon size={22} strokeWidth={activeCategory === "All" ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Feed</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-slate-400"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <Search size={22} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Find</span>
          </button>

          <div className="relative -top-4">
            <div className="absolute -inset-2 bg-blue-600/10 rounded-full animate-ping" />
            <button
              onClick={() => { setActiveCategory("Tech"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="bg-blue-600 text-white w-14 h-14 rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-200 relative transform transition-transform active:scale-95"
            >
              <Zap size={24} fill="currentColor" />
            </button>
          </div>

          <button
            onClick={() => { setActiveCategory("Fashion"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${activeCategory === "Fashion" ? "text-blue-600 scale-110" : "text-slate-400 hover:text-slate-600"}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${activeCategory === "Fashion" ? "bg-blue-50" : "bg-transparent"}`}>
              <ShoppingBag size={22} strokeWidth={activeCategory === "Fashion" ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Style</span>
          </button>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex flex-col items-center gap-1 p-2 text-slate-400"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Admin</span>
          </button>
        </div>
      </nav>

      {/* DESKTOP FOOTER */}
      <footer className="hidden md:block bg-white border-t border-slate-100 py-12 mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-[2px]">
        &copy; 2026 DealzoShop Grand Festival Edition • Verified Premium Loot Engine
      </footer>
    </div>
  );
}
