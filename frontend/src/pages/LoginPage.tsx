import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Eye, EyeOff, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

/* ─── Palette: Navy & Stone Grey ───────────────────────────── */
const C = {
  navy:    "#1D2D44",
  stone:   "#D4D4CE",
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const success = await login(email, password);
    setLoading(false);
    
    if (!success) {
        setError("Invalid email or password. Please try again.");
    } else {
        navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{
        background: C.navy,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Google Fonts and Custom Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 20s linear infinite; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 50px #1E2E46 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* ── Left decorative panel ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative items-center justify-center p-14 overflow-hidden">

        {/* Background image with high-definition Navy overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/login.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(29,45,68,0.92) 0%, rgba(29,45,68,0.85) 100%)`,
            backdropFilter: "blur(2px)",
          }}
        />

        {/* Cinematic spinning ring decorations in Stone Grey */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full spin-slow opacity-[0.08]"
          style={{ border: `1px solid ${C.stone}` }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full spin-slow opacity-[0.05]"
          style={{ border: `1px dashed ${C.stone}`, animationDirection: "reverse" }}
        />

        {/* Brand Content - Centered */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 mb-10"
          >
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center"
              style={{
                background: `rgba(212,212,206, 0.1)`,
                border: `1px solid rgba(212,212,206, 0.3)`,
              }}
            >
              <BrandLogo size={36} />
            </div>
            <span
              className="text-4xl font-black text-[#D4D4CE] tracking-tight"
              style={{ fontFamily: "'Analogue', serif" }}
            >
              ServiceFlow
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl xl:text-6xl font-semibold text-white leading-[1.1] mb-8"
            style={{ fontFamily: "'Zephyr', sans-serif" }}
          >
            Smarter <span style={{ color: C.stone }}>Service</span><br />
            <span className="text-white">Requests.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[#D4D4CE]/60 text-xl leading-relaxed mb-12 font-medium"
            style={{ fontFamily: "'Zephyr', sans-serif" }}
          >
            Designed for seamless workflow management and team collaboration.
          </motion.p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative bg-[#1D2D44]">

        {/* Subtle holographic grid bg */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(${C.stone} 1px, transparent 1px), linear-gradient(90deg, ${C.stone} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] relative z-10"
          style={{
            background: "rgba(212,212,206,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(28px)",
            borderRadius: 28,
            boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,212,206,0.04) inset`,
            padding: "40px 36px",
          }}
        >
          {/* Top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${C.stone}, transparent)` }}
          />

          {/* Mobile brand header */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `rgba(212,212,206,0.1)`, border: `1px solid rgba(212,212,206,0.25)` }}
            >
              <BrandLogo size={28} />
            </div>
            <span className="text-xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
              ServiceFlow
            </span>
          </div>

          {/* Heading Section */}
          <div className="mb-10">
            <h2
              className="text-3xl font-black text-white leading-tight"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Welcome back!!
            </h2>
            <p className="text-[#D4D4CE]/40 text-sm mt-3 font-medium">
              Sign in to your workspace to continue.
            </p>
          </div>

          {/* Form Replacement (bypasses password managers) */}
          <div 
            className="space-y-6"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          >

            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-bold uppercase tracking-widest ml-0.5 text-[#D4D4CE]/50"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fake_idfield"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@gmail.com"
                  autoComplete="none"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  required
                  className="w-full h-12 rounded-xl px-4 text-sm font-medium text-white placeholder-[#D4D4CE]/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1.5px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.stone;
                    e.currentTarget.style.boxShadow   = `0 0 0 4px rgba(212,212,206,0.05)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow   = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                className="text-[11px] font-bold uppercase tracking-widest ml-0.5 text-[#D4D4CE]/50"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fake_passfield"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="none"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  required
                  className="w-full h-12 rounded-xl px-4 pr-12 text-sm font-medium text-white placeholder-[#D4D4CE]/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1.5px solid rgba(255,255,255,0.08)",
                    WebkitTextSecurity: showPass ? "none" : "disc",
                  } as React.CSSProperties & { WebkitTextSecurity?: string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.stone;
                    e.currentTarget.style.boxShadow   = `0 0 0 4px rgba(212,212,206,0.05)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow   = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-white/5"
                  style={{ color: "rgba(212,212,206,0.4)" }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-4 py-3 rounded-xl text-xs font-semibold"
                    style={{
                      background: "rgba(251,113,133,0.05)",
                      border: "1px solid rgba(251,113,133,0.15)",
                      color: "#fb7185",
                    }}
                  >
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="button"
              onClick={(e) => handleSubmit(e as any)}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 relative overflow-hidden transition-all mt-2"
              style={{
                background: loading ? "rgba(255,255,255,0.08)" : C.stone,
                color: loading ? "rgba(255,255,255,0.4)" : C.navy,
                boxShadow: loading ? "none" : `0 12px 32px rgba(0,0,0,0.3)`,
              }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                </>
              )}
            </motion.button>
          </div>

          {/* TOS Footer */}
          <p className="text-center text-[10px] text-[#D4D4CE]/30 mt-8 font-medium uppercase tracking-widest">
            By signing in, you agree to our{" "}
            <span className="underline cursor-pointer decoration-[#D4D4CE]/30 underline-offset-4">
              Terms
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
