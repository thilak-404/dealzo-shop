"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Flame, ExternalLink, Clock, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";

interface DealCardProps {
    deal: {
        id: string;
        title: string;
        price: number;
        originalPrice: number;
        platform: string;
        image: string;
        link: string;
        category: string;
        trendingCount?: number;
        expiresAt?: number;
    };
    isSpecial?: boolean;
}

export default function DealCard({ deal, isSpecial }: DealCardProps) {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isHovered, setIsHovered] = useState(false);
    const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);

    useEffect(() => {
        if (!deal.expiresAt) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = deal.expiresAt! - now;

            if (distance < 0) {
                setTimeLeft("OFFER ENDED");
                return true;
            }

            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${h}h ${m}m ${s}s`);
            return false;
        };

        updateTimer();
        const timer = setInterval(() => {
            if (updateTimer()) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [deal.expiresAt]);

    const platformConfig: Record<string, { color: string, text: string }> = {
        Amazon: { color: "from-[#FF9900] to-[#E47911]", text: "text-white" },
        Flipkart: { color: "from-[#2874f0] to-[#04337b]", text: "text-white" },
        Myntra: { color: "from-[#ff3f6c] to-[#d41c4c]", text: "text-white" },
        Ajio: { color: "from-[#2c333e] to-[#000000]", text: "text-white" },
    };

    const config = platformConfig[deal.platform] || { color: "from-slate-700 to-slate-900", text: "text-white" };

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col h-full bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden"
        >
            {/* Countdown Badge */}
            <AnimatePresence>
                {timeLeft && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute top-0 left-0 right-0 py-1.5 px-4 text-center text-[9px] font-black uppercase tracking-[2px] z-20 flex items-center justify-center gap-2 ${timeLeft === "OFFER ENDED" ? "bg-rose-500 text-white" : "bg-slate-900 text-white"}`}
                    >
                        <Clock size={10} className={timeLeft !== "OFFER ENDED" ? "animate-pulse" : ""} />
                        <span>{timeLeft}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Badge Container */}
            <div className={`absolute left-4 z-10 flex flex-col gap-2 ${timeLeft ? 'top-10' : 'top-4'}`}>
                {isSpecial && (
                    <div className="badge-premium px-3 py-1 text-[8px] flex items-center gap-1.5 shadow-lg">
                        <Sparkles size={10} /> 2026 TOP ASSET
                    </div>
                )}
                <div className={`bg-gradient-to-br ${config.color} ${config.text} text-[8px] font-black px-3 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-widest`}>
                    {deal.platform}
                </div>
            </div>

            {/* Discount Tag */}
            <div className={`absolute right-4 z-10 ${timeLeft ? 'top-10' : 'top-4'}`}>
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 border border-slate-100 shadow-xl flex flex-col items-center justify-center">
                    <span className="text-rose-600 text-[14px] font-black">-{discount}%</span>
                    <span className="text-slate-400 text-[8px] font-bold uppercase tracking-tight">SAVE</span>
                </div>
            </div>

            {/* Image Section */}
            <div className="relative w-full aspect-square bg-white flex items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)]" />

                <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-contain p-6 transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 50vw, 20vw"
                />

                {/* Verified Overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 border-2 border-white">
                        <CheckCircle2 size={12} /> HUMAN VERIFIED
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 md:p-6 flex-1 flex flex-col bg-slate-50/50 rounded-b-[32px] border-t border-slate-100 mt-[-10px] relative z-20">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex -space-x-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-4 h-4 rounded-full border border-white bg-slate-200" />
                        ))}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        Active Looting Now
                    </span>
                </div>

                <h3 className="text-slate-900 font-extrabold text-[13px] md:text-[15px] leading-[1.4] line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors" title={deal.title}>
                    {deal.title}
                </h3>

                <div className="flex flex-col gap-1 mb-6">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">₹{deal.price.toLocaleString()}</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 line-through font-bold opacity-60">₹{deal.originalPrice.toLocaleString()}</span>
                            <span className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter leading-none">Price Secure</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Asset Status</span>
                        <div className="flex items-center gap-1.5 text-orange-500">
                            <TrendingUp size={14} />
                            <span className="text-[11px] font-black uppercase tracking-tighter">Hyper-Viral</span>
                        </div>
                    </div>

                    <motion.a
                        href={deal.link}
                        target="_blank"
                        rel="nofollow sponsored"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-500/20 transition-all border border-white/10"
                    >
                        <ArrowRight size={20} />
                    </motion.a>
                </div>
            </div>
        </motion.article>
    );
}
