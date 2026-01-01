"use client";

import { motion } from "framer-motion";
import { Laptop, Shirt, Home, Sparkles, LayoutGrid } from "lucide-react";

interface FilterBarProps {
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
}

const categories = [
    { id: "All", label: "All Deals", Icon: LayoutGrid },
    { id: "Tech", label: "Electronics", Icon: Laptop },
    { id: "Fashion", label: "Fashion", Icon: Shirt },
    { id: "Home", label: "Home", Icon: Home },
    { id: "Beauty", label: "Beauty", Icon: Sparkles },
];

export default function FilterBar({ activeCategory, setActiveCategory }: FilterBarProps) {
    return (
        <div className="bg-white border-b border-slate-200 sticky top-14 md:top-16 z-40 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="container mx-auto px-4 py-3 flex items-center justify-start md:justify-center gap-3">
                {categories.map(({ id, label, Icon }) => {
                    const isActive = activeCategory === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActiveCategory(id)}
                            className="relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                />
                            )}

                            <Icon
                                size={16}
                                className={`relative z-10 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-600"}`}
                            />
                            <span className={`relative z-10 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-600"}`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
