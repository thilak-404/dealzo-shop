"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSetupMode, setIsSetupMode] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isSetupMode) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-blue-500/5 border border-slate-100 p-8 md:p-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white mb-6 shadow-xl shadow-blue-200">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                        {isSetupMode ? "Initialize Admin" : "DealzoShop Console"}
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium">
                        {isSetupMode ? "Create your master admin account" : "Secure Administrative Access Console"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600/50 transition-all font-medium"
                                placeholder="admin@dealzoshop.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600/50 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold py-3 px-4 rounded-xl text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        {loading ? "Processing..." : (isSetupMode ? "Create Admin Credentials" : "Login to Console")}
                        {!loading && (isSetupMode ? <UserPlus size={16} /> : <ArrowRight size={16} />)}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                    <button
                        onClick={() => setIsSetupMode(!isSetupMode)}
                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all"
                    >
                        {isSetupMode ? "Already have account? Login" : "First time? Setup Admin Account"}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <a href="/" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                        ← Back to Storefront
                    </a>
                </div>
            </motion.div>
        </div>
    );
}

