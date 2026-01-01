"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    getDocs,
    writeBatch
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    LogOut,
    Package,
    Globe,
    Tag,
    Image as ImageIcon,
    Link as LinkIcon,
    CheckCircle,
    Trash2,
    Calendar,
    AlertTriangle,
    LayoutGrid,
    ChevronRight,
    ArrowLeft
} from "lucide-react";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [deals, setDeals] = useState<any[]>([]);
    const router = useRouter();

    // Form State
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [platform, setPlatform] = useState("Amazon");
    const [category, setCategory] = useState("Tech");
    const [image, setImage] = useState("");
    const [link, setLink] = useState("");
    const [expiryHours, setExpiryHours] = useState("24");

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showConfirmAll, setShowConfirmAll] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/login");
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setDeals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handlePostDeal = async (e: React.FormEvent) => {
        e.preventDefault();
        setPublishing(true);
        setSuccess(false);

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + parseInt(expiryHours));

        try {
            await addDoc(collection(db, "deals"), {
                title,
                price: parseFloat(price),
                originalPrice: parseFloat(originalPrice),
                platform,
                category,
                image,
                link,
                verified: true,
                trendingCount: Math.floor(Math.random() * 2000) + 500,
                createdAt: serverTimestamp(),
                expiresAt: expiryDate.getTime()
            });
            setSuccess(true);
            setTitle(""); setPrice(""); setOriginalPrice(""); setImage(""); setLink(""); setExpiryHours("24");
            setTimeout(() => setSuccess(false), 3000);
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setPublishing(false);
        }
    };

    const confirmDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "deals", id));
            setDeletingId(null);
        } catch (err: any) {
            alert("Delete Failed: " + err.message);
        }
    };

    const handlePurgeAll = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "deals"));
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            setShowConfirmAll(false);
            alert("Database Wiped.");
        } catch (err: any) {
            alert("Wipe Failed: " + err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* STICKY HEADER */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push('/')} className="bg-slate-100 p-2 rounded-xl text-slate-500 md:hidden">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-lg md:text-xl font-black text-slate-800 italic tracking-tighter uppercase flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-[10px]">DS</span>
                        <span className="hidden xs:inline">Console v3.1</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <span className="hidden lg:block text-[10px] font-bold text-slate-400 font-mono">{user?.email}</span>
                    <button onClick={() => signOut(auth)} className="bg-rose-50 text-rose-600 px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2">
                        <LogOut size={14} /> <span className="hidden xs:inline">Exit</span>
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 md:py-10 max-w-5xl space-y-8 md:space-y-12">

                {/* PUBLISH SECTION */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[24px] md:rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50/50 px-6 md:px-8 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Plus size={18} className="text-blue-600" />
                            <h2 className="font-black text-slate-700 uppercase tracking-widest text-[10px]">Initialize Market Asset</h2>
                        </div>
                        <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded">FAST SYNC</span>
                    </div>

                    <form onSubmit={handlePostDeal} className="p-6 md:p-8 grid md:grid-cols-2 gap-x-8 gap-y-5 md:gap-y-6">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Package size={12} /> Product Title
                            </label>
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600/30 outline-none transition-all font-bold text-sm" placeholder="Asset Identifier..." />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Offer Price (₹)</label>
                            <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-black text-blue-600" placeholder="0" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Original Price (₹)</label>
                            <input type="number" required value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-medium text-slate-400" placeholder="0" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Globe size={12} /> Platform
                            </label>
                            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs md:text-sm outline-none appearance-none">
                                <option value="Amazon">Amazon</option>
                                <option value="Flipkart">Flipkart</option>
                                <option value="Myntra">Myntra</option>
                                <option value="Ajio">Ajio</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Tag size={12} /> Category
                            </label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs md:text-sm outline-none appearance-none">
                                <option value="Tech">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home">Home</option>
                                <option value="Beauty">Beauty</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calendar size={12} /> Duration (Hours)
                            </label>
                            <input type="number" value={expiryHours} onChange={(e) => setExpiryHours(e.target.value)} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-bold" />
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <ImageIcon size={12} /> Image Endpoint
                            </label>
                            <input type="url" required value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-xs md:text-sm italic" placeholder="https://..." />
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <LinkIcon size={12} /> Logic Redirect URL
                            </label>
                            <input type="url" required value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-xs md:text-sm italic" placeholder="https://..." />
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button type="submit" disabled={publishing} className="w-full bg-blue-600 text-white font-black py-4 md:py-5 rounded-[20px] shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[2px] text-[10px] md:text-xs disabled:opacity-50">
                                {publishing ? "Processing Feed Write..." : "DEPLOY ASSET LIVE"}
                                {!publishing && <ChevronRight size={18} />}
                            </button>
                            <AnimatePresence>
                                {success && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center mt-5 text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                        <CheckCircle size={14} /> Propagation Complete
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </motion.div>

                {/* INVENTORY SECTION */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2">
                            <LayoutGrid size={16} className="text-blue-600" />
                            Active Inventory
                        </h3>
                        <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black tracking-tight">
                            {deals.length} NODES
                        </span>
                    </div>

                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden shadow-slate-200/40">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                    <th className="px-8 py-5">View</th>
                                    <th className="px-6 py-5">Product Metadata</th>
                                    <th className="px-6 py-5">Valuation</th>
                                    <th className="px-6 py-5">Platform</th>
                                    <th className="px-8 py-5 text-right">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {deals.map((deal) => (
                                    <tr key={deal.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-1">
                                                <img src={deal.image} className="max-w-full max-h-full object-contain" alt="" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[200px]">{deal.title}</div>
                                            <div className="text-[9px] font-black text-blue-500 uppercase mt-0.5">{deal.category}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-black text-slate-900">₹{deal.price}</div>
                                            <div className="text-[10px] text-slate-300 line-through">₹{deal.originalPrice}</div>
                                        </td>
                                        <td className="px-6 py-4 uppercase font-black text-[10px] text-slate-400">{deal.platform}</td>
                                        <td className="px-8 py-4 text-right">
                                            {deletingId === deal.id ? (
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button onClick={() => setDeletingId(null)} className="text-[9px] font-black uppercase text-slate-400 px-2">No</button>
                                                    <button onClick={() => confirmDelete(deal.id)} className="bg-rose-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg">Yes</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeletingId(deal.id)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all ml-auto">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARDS */}
                    <div className="md:hidden space-y-3">
                        {deals.map((deal) => (
                            <div key={deal.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
                                <div className="w-16 h-16 bg-white rounded-xl border border-slate-100 flex-shrink-0 flex items-center justify-center p-1">
                                    <img src={deal.image} className="max-w-full max-h-full object-contain" alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{deal.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-black text-blue-600">₹{deal.price}</span>
                                        <span className="text-[10px] text-slate-400 line-through">₹{deal.originalPrice}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{deal.platform}</span>
                                </div>
                                {deletingId === deal.id ? (
                                    <button onClick={() => confirmDelete(deal.id)} className="bg-rose-600 text-white p-3 rounded-xl shadow-lg shadow-rose-200">
                                        <Trash2 size={18} />
                                    </button>
                                ) : (
                                    <button onClick={() => setDeletingId(deal.id)} className="bg-slate-50 text-slate-400 p-3 rounded-xl border border-slate-100">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {deals.length === 0 && <div className="py-12 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Empty Inventory</div>}
                    </div>
                </div>

                {/* DANGER PURGE */}
                <div className="bg-rose-50/50 rounded-[24px] md:rounded-[32px] border border-rose-100 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                        <div className="bg-rose-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 flex-shrink-0">
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <h4 className="text-rose-900 font-extrabold uppercase text-xs md:text-sm tracking-widest">Master Node Wipe</h4>
                            <p className="text-rose-600/70 text-[10px] md:text-xs font-medium mt-1">Permanently purge all distributed deal assets.</p>
                        </div>
                    </div>

                    {showConfirmAll ? (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button onClick={() => setShowConfirmAll(false)} className="flex-1 md:flex-none text-[10px] font-black uppercase text-slate-500 px-6 py-4">Cancel</button>
                            <button onClick={handlePurgeAll} className="flex-1 md:flex-none bg-rose-600 text-white px-8 py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-600/20 active:scale-95 transition-all">PURGE NODES</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowConfirmAll(true)} className="w-full md:w-auto bg-rose-600 text-white px-10 py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-600/20 active:scale-95 transition-all">
                            Purge Inventory
                        </button>
                    )}
                </div>

            </main>

            <footer className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-[4px]">
                PARTNER CONSOLE v3.1 • 2026 STANDARD
            </footer>
        </div>
    );
}
