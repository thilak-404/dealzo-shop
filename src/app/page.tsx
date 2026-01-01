"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, Zap, Laptop, ShoppingBag, Home as HomeIcon, Sparkles, Filter, LayoutGrid, X, TrendingUp, ArrowRight } from "lucide-react";
import DealCard from "@/components/DealCard";

export default function Home() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [liveLooters, setLiveLooters] = useState(4281);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLooters(prev => {
        const change = Math.floor(Math.random() * 200) - 100;
        const next = prev + change;
        return Math.min(Math.max(next, 2500), 8000);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-mesh font-outfit pb-24 md:pb-0 overflow-x-hidden">
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center flex-col gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] scale-150" />
            <motion.h1
              initial={{ scale: 3, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-8xl md:text-[14rem] font-black text-gradient-gold italic tracking-tighter"
            >
              2026
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-yellow-500/80 font-black uppercase tracking-[1.5em] text-[10px] md:text-sm text-center"
            >
              The Future of Loot
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-950 text-yellow-500 text-[10px] md:text-xs py-2.5 font-black text-center uppercase tracking-[3px] z-[60] relative border-b border-yellow-500/20">
        <span className="flex items-center justify-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          🎆 2026 GRAND LOOT FESTIVAL IS LIVE 🎆
        </span>
      </div>

      {/* PREMIUM STICKY HEADER */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-500/20 text-sm transform hover:rotate-6 transition-transform">
              DS
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-outfit uppercase leading-none">Dealzo<span className="text-blue-600">Shop</span></span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Premium</span>
            </div>
          </motion.div>

          {/* Desktop Search - Slimmer & Sleeker */}
          <div className="hidden md:flex flex-1 max-w-lg relative group">
            <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="What high-value asset are you hunting today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-200/50 rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600/30 transition-all font-medium text-sm placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-all active:scale-90"
            >
              <Search size={20} />
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

      {/* MODERN HERO SECTION */}
      <section className="relative w-full bg-slate-950 overflow-hidden py-16 md:py-32 px-4 shadow-[inset_0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="firework opacity-40" />
        <div className="firework opacity-20 scale-150 rotate-45" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

        <div className="container mx-auto relative z-10 text-center">
          {/* LIVE MINI TICKER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 flex items-center gap-6 shadow-2xl mb-12 mx-auto"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Engine Live</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-blue-400" />
              <span className="text-[10px] font-black text-white tabular-nums">{deals.length} Active Deployed</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-yellow-400" />
              <span className="text-[10px] font-black text-white tabular-nums">{liveLooters.toLocaleString()} Hunting</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <div className="badge-premium px-6 py-2 md:py-3 text-[10px] md:text-sm tracking-[0.3em] flex items-center gap-3">
              <Zap size={14} fill="black" />
              <span>Grand Festival Edition</span>
              <Zap size={14} fill="black" />
            </div>

            <div className="relative">
              <h2 className="text-5xl md:text-[9rem] font-black text-gradient-gold uppercase italic tracking-tighter leading-none mb-4 animate-float drop-shadow-2xl">
                LOOT SALE
              </h2>
              <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="bg-blue-600 text-white w-14 h-14 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 border-slate-950 text-[10px] md:text-xs font-black uppercase text-center leading-tight shadow-xl shadow-blue-500/30"
                >
                  UP TO<br />90% OFF
                </motion.div>
              </div>
            </div>

            <p className="text-slate-400 text-xs md:text-xl font-medium max-w-sm md:max-w-2xl mx-auto px-4 leading-relaxed tracking-wide">
              Level up your lifestyle with <span className="text-white font-bold">verified high-tier assets</span>.
              The most aggressive price cuts of 2026 are dropping <span className="text-blue-500 font-black italic underline decoration-blue-500/30">every hour</span>.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-blue-500" /> Secure Checkouts
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <Zap size={14} className="text-yellow-500" /> Instant Alerts
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* CATEGORY NAV - Colorful Glassmorphism */}
      <section className="sticky top-[69px] md:top-[85px] z-40 py-4 bg-white/60 backdrop-blur-md border-b border-slate-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 shadow-sm transform active:scale-95 ${activeCategory === cat.name
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-300 -translate-y-0.5"
                  : "bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600"
                  }`}
              >
                <span className={activeCategory === cat.name ? "text-blue-400" : "text-slate-400"}>
                  {cat.icon}
                </span>
                {cat.name === "All" ? "Loot Feed" : cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN DEAL GRID SECTION */}
      <main className="container mx-auto px-4 md:px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-5 overflow-hidden relative">
                <div className="aspect-square bg-slate-100 rounded-[24px] animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded-full w-2/3 animate-pulse" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="h-8 bg-slate-100 rounded-xl w-24 animate-pulse" />
                  <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse" />
                </div>
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-[11px] md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Active Market Listings
                </h3>
                <span className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">
                  {activeCategory === "All" ? "Everything" : activeCategory} <span className="text-blue-600 font-medium">({filteredDeals.length})</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-3 flex items-center gap-4 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Deals</span>
                    <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {deals.length} Active
                    </span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Festival</span>
                    <span className="text-sm font-black text-blue-600">Grand 2026</span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Looters</span>
                    <span className="text-sm font-black text-slate-900">{(liveLooters / 1000).toFixed(1)}k Online</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              layout
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, y: 30 },
                      visible: { opacity: 1, scale: 1, y: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <DealCard
                      deal={deal}
                      isSpecial={index < 5 && activeCategory === "All"}
                      onClick={() => {
                        setSelectedDeal(deal);
                        setActiveImageIdx(0);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredDeals.length === 0 && (
              <div className="py-32 text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <Search size={40} />
                </div>
                <h4 className="text-xl font-black text-slate-800 tracking-tighter uppercase">No assets found</h4>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Try adjusting your filters or search query to find more listings.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* NATIVE-STYLE MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-md">
        <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around">
          <button
            onClick={() => { setActiveCategory("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeCategory === "All" ? "text-blue-500 scale-110" : "text-slate-500 hover:text-slate-400"}`}
          >
            <HomeIcon size={24} strokeWidth={activeCategory === "All" ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">Feed</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <Search size={24} />
            <span className="text-[8px] font-black uppercase tracking-widest">Find</span>
          </button>

          <div className="relative -top-10">
            <button
              onClick={() => { setActiveCategory("Tech"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(37,99,235,0.4)] border-4 border-slate-950 active:scale-90 transition-transform"
            >
              <Zap size={28} fill="currentColor" />
            </button>
          </div>

          <button
            onClick={() => { setActiveCategory("Fashion"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeCategory === "Fashion" ? "text-blue-500 scale-110" : "text-slate-500 hover:text-slate-400"}`}
          >
            <ShoppingBag size={24} strokeWidth={activeCategory === "Fashion" ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">Style</span>
          </button>

        </div>
      </nav>

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDeal(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-white w-full max-w-6xl h-full md:h-auto max-h-[95vh] rounded-[32px] md:rounded-[40px] overflow-hidden relative z-10 flex flex-col md:flex-row shadow-2xl"
            >
              <button
                onClick={() => setSelectedDeal(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-all border border-slate-200 shadow-xl"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>

              {/* IMAGE GALLERY SECTION */}
              <div className="w-full md:w-[45%] h-[40%] md:h-full bg-white relative flex flex-col border-b md:border-b-0 md:border-r border-slate-100 p-6 md:p-8">
                <div className="flex-1 relative mb-6">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImageIdx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      src={selectedDeal.images?.[activeImageIdx] || selectedDeal.image}
                      className="w-full h-full object-contain"
                    />
                  </AnimatePresence>
                </div>

                {/* Thumbnail Selection */}
                {selectedDeal.images && selectedDeal.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-2 border-t border-slate-50">
                    {selectedDeal.images.map((img: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIdx(i)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIdx === i ? 'border-blue-600 scale-105 shadow-lg' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-1 p-6 md:p-14 overflow-y-auto no-scrollbar flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {selectedDeal.platform}
                  </span>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    {selectedDeal.category} Asset
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
                  {selectedDeal.title}
                </h2>

                <div className="flex items-baseline gap-4 mb-10 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Current Offer</span>
                    <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">₹{selectedDeal.price.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col mb-1">
                    <span className="text-slate-400 text-sm line-through font-bold">₹{selectedDeal.originalPrice.toLocaleString()}</span>
                    <span className="text-emerald-600 text-xs font-black uppercase tracking-widest italic decoration-emerald-500/30">
                      Secure -{Math.round(((selectedDeal.originalPrice - selectedDeal.price) / selectedDeal.originalPrice) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-12">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Filter size={14} className="text-blue-600" /> Executive Summary
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {selectedDeal.description || "No deep description provided for this high-tier asset. Verified Loot Grade."}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Confidence Score</span>
                    <span className="text-blue-700 font-bold text-sm">98.4% Ultra Safe</span>
                  </div>
                  <a
                    href={selectedDeal.link}
                    target="_blank"
                    rel="nofollow"
                    className="w-full bg-slate-900 text-white py-6 rounded-[28px] text-center font-black uppercase tracking-[4px] text-xs hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-4 group"
                  >
                    EXECUTE ACQUISITION
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM FOOTER */}
      <footer className="bg-slate-950 text-white py-20 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="container mx-auto px-4 text-center">
          <div className="text-3xl font-black italic tracking-tighter uppercase mb-6">
            Dealzo<span className="text-blue-500">Shop</span>
          </div>
          <div className="flex justify-center gap-8 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Support</a>
          </div>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[4px]">
            &copy; 2026 DealzoShop Grand Festival Edition • Verified Premium Loot Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
