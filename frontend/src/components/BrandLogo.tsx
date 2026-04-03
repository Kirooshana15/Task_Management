import { motion } from "framer-motion";

export const BrandLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <defs>
      <linearGradient id="topArrow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
      <linearGradient id="bottomArrow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <motion.path 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      d="M20 35C20 25 30 20 50 20C70 20 80 25 80 35C80 45 70 50 50 50M20 35L35 45M20 35L5 45" 
      stroke="url(#topArrow)" 
      strokeWidth="12" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <motion.path 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
      d="M80 65C80 75 70 80 50 80C30 80 20 75 20 65C20 55 30 50 50 50M80 65L65 55M80 65L95 55" 
      stroke="url(#bottomArrow)" 
      strokeWidth="12" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);
