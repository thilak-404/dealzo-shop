"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Flame, ExternalLink, Clock } from "lucide-react";
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
    const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);

    useEffect(() => {
        if (!deal.expiresAt) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = deal.expiresAt! - now;

            if (distance < 0) {
                setTimeLeft("EXPIRED");
                return true; // stop
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

    const platformColors: Record<string, string> = {
        Amazon: "bg-[#FF9900] text-black",
        Flipkart: "bg-[#2874f0] text-white",
        Myntra: "bg-[#ff3f6c] text-white",
        Ajio: "bg-[#2c333e] text-white",
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
        >
            {/* Expiry Timer */}
            {timeLeft && (
                <div className={`absolute top-0 left-0 right-0 py-1 text-center text-[10px] font-black uppercase tracking-[1px] z-20 ${timeLeft === "EXPIRED" ? "bg-rose-600 text-white" : "bg-amber-100 text-amber-700 border-b border-amber-200/50"}`}>
                    <Clock size={10} className="inline mr-1 mb-0.5" /> {timeLeft === "EXPIRED" ? "Offer Expired" : `Ends in: ${timeLeft}`}
                </div>
            )}

            {/* Trust Badges */}
            <div className={`absolute left-3 z-10 flex flex-col gap-2 ${timeLeft ? 'top-8' : 'top-3'}`}>
                {isSpecial && (
                    <span className="badge-2026 text-[9px] px-2 py-0.5 shadow-xl flex items-center gap-1">
                        ✨ 2026 Special
                    </span>
                )}
                <span className={`${platformColors[deal.platform] || "bg-slate-800 text-white"} text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter`}>
                    {deal.platform}
                </span>
                <span className="bg-emerald-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                    <CheckCircle2 size={10} /> VERIFIED
                </span>
            </div>

            {/* Discount Circle */}
            <div className={`absolute right-3 z-10 ${timeLeft ? 'top-8' : 'top-3'}`}>
                <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="bg-rose-500 text-white text-[11px] font-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                >
                    -{discount}%
                </motion.div>
            </div>

            <div className="relative w-full aspect-square md:aspect-[5/4] bg-white flex items-center justify-center p-4 md:p-6 overflow-hidden">
                <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 80vw, 20vw"
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] transition-opacity hidden md:flex items-center justify-center"
                >
                    <span className="bg-white/90 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <ExternalLink size={12} /> View on {deal.platform}
                    </span>
                </motion.div>
            </div>

            <div className="p-3 md:p-5 flex-1 flex flex-col">
                <h3 className="text-slate-800 font-bold text-xs md:text-sm leading-snug line-clamp-2 mb-2 md:mb-3 min-h-[2.4rem] md:min-h-[2.8rem]" title={deal.title}>
                    {deal.title}
                </h3>

                <div className="flex items-baseline gap-2 mb-3 md:mb-4">
                    <span className="text-lg md:text-2xl font-black text-slate-900">₹{deal.price.toLocaleString()}</span>
                    <span className="text-[10px] md:text-xs text-slate-400 line-through font-medium">₹{deal.originalPrice.toLocaleString()}</span>
                </div>

                <div className="mt-auto pt-3 md:pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                    <div className="text-[9px] md:text-[10px] font-bold text-orange-500 uppercase flex items-center gap-1">
                        <Flame size={12} className="animate-pulse flex-shrink-0" />
                        <span className="truncate">{deal.trendingCount?.toLocaleString() || "1,200+"}</span>
                    </div>
                    <motion.a
                        href={deal.link}
                        target="_blank"
                        rel="nofollow sponsored"
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#fb641b] text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase hover:bg-orange-600 transition-all shadow-md shadow-orange-200 whitespace-nowrap inline-block"
                    >
                        Grab Now
                    </motion.a>
                </div>
            </div>
        </motion.article>
    );
}
