/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Sparkles, Layers, HelpCircle, ArrowRight } from "lucide-react";

interface Branch {
  id: string;
  label: string;
  angle: number; // in degrees
  description: string;
  bullets: string[];
  r?: number; // Custom radius offset closer to centered hub
}

const branches: Branch[] = [
  {
    id: "investments",
    label: "Investment Management",
    angle: -90,
    description: "Custom discrete portfolios spanning liquid public markets, secure digital reserves, and handpicked private placements.",
    bullets: [
      "Private investment opportunities by R&D securities",
      "Public portfolio managers custom-fit allocations",
      "Cryptocurrency assets with institutional custody"
    ]
  },
  {
    id: "mortgages",
    label: "Mortgages",
    angle: -38.57,
    description: "Bespoke property financing matching overall balance sheet parameters and liquidity preservation.",
    bullets: [
      "Residential mortgages",
      "Commercial mortgages",
      "Leverage optimization & competitive rates"
    ],
    r: 210 // Brought closer to the center
  },
  {
    id: "realestate",
    label: "Real Estate",
    angle: 12.86,
    description: "Strategic representation for security-focused residential acquisitions and luxury asset transitions.",
    bullets: [
      "Confidential off-market real estate transactions",
      "Asset valuation modeling and strategic counsel",
      "Premium residence acquisitions"
    ]
  },
  {
    id: "insurance",
    label: "Insurance",
    angle: 64.29,
    description: "Sophisticated corporate and family risk mitigation designed to permanently protect intergenerational liquidity.",
    bullets: [
      "Life insurance estate plans",
      "Home estate protection",
      "Corporate business continuation",
      "Investment annuities structures"
    ]
  },
  {
    id: "accounting",
    label: "Accounting",
    angle: 115.71,
    description: "Integrated analysis and proactive corporate configuration matching ultimate tax-minimization goals.",
    bullets: [
      "Holding company structuring",
      "Strategic corporate tax planning",
      "Entity structural consulting"
    ]
  },
  {
    id: "succession",
    label: "Succession Planning",
    angle: 167.14,
    description: "Governance structures facilitating friction-free generational transfer of private operational assets and family estates.",
    bullets: [
      "Family trust allocations",
      "Generational estate transitions",
      "Business ownership continuation legacy"
    ]
  },
  {
    id: "corporation",
    label: "Corporation Management",
    angle: 218.57,
    description: "Unified corporate balance-sheet design comprising personnel plans, institutional liquidity lines, and transactional structuring.",
    bullets: [
      "Corporate benefits structures",
      "Corporate lending facilities",
      "Corporate funding allocations",
      "MRC share structures",
      "Corporate mergers & acquisitions"
    ],
    r: 210 // Brought closer to the center
  }
];

export default function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Geometric center & coordinates of our 1000x750 coordinate web
  const cx = 500;
  const cy = 375;
  const rInner = 68; // Radius of central RWM circle
  const R = 270;     // Radius distance of the branch names from center

  // Disable selected branch when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeId = hoveredId || selectedId;

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans flex flex-col justify-between overflow-x-hidden p-4 md:p-8 selection:bg-black selection:text-white">
      {/* HEADER SECTION - Minimal and Elegant */}
      <header className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-zinc-950 uppercase font-sans">
              RWM Wealth Architecture
            </h1>
          </div>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">
            Interactive Full Wealth Management Mind Map
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-md py-1.5 px-3 shadow-xs">
            <Info size={13} className="text-zinc-500 shrink-0" />
            <span className="text-[11px] font-mono text-zinc-600">
              Hover over branches or tap on mobile to reveal detailed structures
            </span>
          </div>
          {activeId && (
            <button
              onClick={() => {
                setHoveredId(null);
                setSelectedId(null);
              }}
              className="text-[11px] font-mono text-zinc-500 hover:text-black hover:underline cursor-pointer bg-white border border-zinc-200 rounded-md py-1.5 px-3 transition-colors"
            >
              Reset view
            </button>
          )}
        </div>
      </header>

      {/* RE-ARCHITECTED INTERACTIVE MIND MAP STAGE */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex items-center justify-center py-6 md:py-12">
        <div
          ref={containerRef}
          className="w-full max-w-[900px] aspect-[4/3] bg-white rounded-xl border border-zinc-200 shadow-sm relative overflow-visible"
        >
          {/* STATIC & INTERACTIVE SVG LAYERS */}
          <svg
            viewBox="0 0 1000 750"
            className="absolute inset-0 w-full h-full select-none overflow-visible z-0"
          >
            {/* Background alignment grid elements for crisp clean schematic look */}
            <circle cx={cx} cy={cy} r={R} stroke="#f4f4f5" strokeWidth={1} fill="none" strokeDasharray="3,6" />
            <circle cx={cx} cy={cy} r={R * 0.5} stroke="#fafafa" strokeWidth={1} fill="none" strokeDasharray="2,4" />

            {/* RADIATING BRANCH LINES */}
            {branches.map((branch) => {
              const angleRad = (branch.angle * Math.PI) / 180;
              const branchR = branch.r || R;
              
              // Exactly where the line begins (outer rim of the central circle)
              const xStart = cx + rInner * Math.cos(angleRad);
              const yStart = cy + rInner * Math.sin(angleRad);
              
              // End point of the line inside the label area
              const xEnd = cx + (branchR - 25) * Math.cos(angleRad);
              const yEnd = cy + (branchR - 25) * Math.sin(angleRad);

              const isCurrentActive = activeId === branch.id;
              const isAnyActive = activeId !== null;

              return (
                <g key={`line-group-${branch.id}`}>
                  {/* Glowing background line on hover */}
                  {isCurrentActive && (
                    <line
                      x1={xStart}
                      y1={yStart}
                      x2={xEnd}
                      y2={yEnd}
                      stroke="#f4f4f5"
                      strokeWidth={8}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Master connecting branch line (Always clean solid black) */}
                  <line
                    x1={xStart}
                    y1={yStart}
                    x2={xEnd}
                    y2={yEnd}
                    stroke="black"
                    strokeWidth={isCurrentActive ? 2 : 1}
                    opacity={isCurrentActive ? 1 : isAnyActive ? 0.08 : 0.8}
                    className="transition-all duration-300 ease-out"
                  />
                  {/* Micro connection anchor dot */}
                  <circle
                    cx={xEnd}
                    cy={yEnd}
                    r={isCurrentActive ? 4 : 2.5}
                    fill="black"
                    opacity={isCurrentActive ? 1 : isAnyActive ? 0.08 : 0.8}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* CENTRAL ANCHOR (RWM CORE EMBLEM) */}
            <g
              onClick={() => {
                setHoveredId(null);
                setSelectedId(null);
              }}
              className="cursor-pointer group"
            >
              {/* Pulsating background ring for aesthetic polish */}
              <circle
                cx={cx}
                cy={cy}
                r={rInner + 6}
                fill="none"
                stroke="black"
                strokeWidth={1}
                opacity={activeId ? 0.05 : 0.15}
                className="transition-all duration-500 ease-out"
              />
              
              {/* Main circle */}
              <circle
                cx={cx}
                cy={cy}
                r={rInner}
                fill="white"
                stroke="black"
                strokeWidth={2}
                className="transition-all duration-300 shadow-sm"
              />
              
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-sans text-2xl font-bold tracking-widest fill-black select-none transition-transform"
              >
                RWM
              </text>
            </g>
          </svg>

          {/* ABSOLUTELY POSITIONED INTERACTIVE HTML OVERLAY NODES */}
          {branches.map((branch) => {
            const angleRad = (branch.angle * Math.PI) / 180;
            const branchR = branch.r || R;
            const x = cx + branchR * Math.cos(angleRad);
            const y = cy + branchR * Math.sin(angleRad);

            // Compute exact relative percentages for CSS positioning
            const xPct = (x / 1000) * 100;
            const yPct = (y / 750) * 100;

            const isCurrentActive = activeId === branch.id;
            const isAnyActive = activeId !== null;

            // Determine overlay placement parameters to absolute-guarantee no card goes off screen
            const isLeftHalf = x < 450;
            const isRightHalf = x > 550;
            const isTopCenter = x >= 450 && x <= 550 && y < 350;
            const isBottomCenter = x >= 450 && x <= 550 && y >= 350;

            let cardAlignmentClass = "";
            if (isLeftHalf) {
              // Node is on the left: popover opens to the right, toward empty diagram center
              cardAlignmentClass = "left-full ml-4 top-1/2 -translate-y-1/2";
            } else if (isRightHalf) {
              // Node is on the right: popover opens to the left, toward empty diagram center
              cardAlignmentClass = "right-full mr-4 top-1/2 -translate-y-1/2";
            } else if (isTopCenter) {
              // Node is central top: popover opens downward
              cardAlignmentClass = "top-full mt-4 left-1/2 -translate-x-1/2";
            } else if (isBottomCenter) {
              // Node is central bottom: popover opens upward
              cardAlignmentClass = "bottom-full mb-4 left-1/2 -translate-x-1/2";
            }

            return (
              <div
                key={branch.id}
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isCurrentActive ? "z-50" : isAnyActive ? "z-0 opacity-40" : "z-10"
                }`}
              >
                {/* BRANCH WORD BUTTON / ANCHOR */}
                <div
                  onMouseEnter={() => setHoveredId(branch.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(selectedId === branch.id ? null : branch.id);
                  }}
                  className={`px-3 py-1.5 rounded-md border text-[13px] font-sans font-semibold cursor-pointer select-none transition-all duration-300 shadow-xs whitespace-nowrap ${
                    isCurrentActive
                      ? "bg-black text-white border-black scale-105"
                      : isAnyActive
                      ? "bg-white text-zinc-300 border-zinc-100 scale-95"
                      : "bg-white text-zinc-900 border-zinc-900 hover:bg-black hover:text-white"
                  }`}
                >
                  {branch.label}
                </div>

                {/* THE SOPHISTICATED WHITE HOVER POPUP CARD */}
                <AnimatePresence>
                  {isCurrentActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onMouseEnter={() => setHoveredId(branch.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`absolute ${cardAlignmentClass} bg-white border-2 border-black p-5 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[325px] max-w-[365px] z-50 pointer-events-auto`}
                    >
                      {/* CARD HEADER */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-zinc-900">
                        <span className="text-[14px] font-mono uppercase tracking-wider font-bold text-black flex items-center gap-1.5">
                          <Layers size={13} className="text-black" />
                          {branch.label}
                        </span>
                        {/* Interactive future-proof click indicator */}
                        <div className="p-1 rounded bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center" title="Explore branch detail">
                          <ArrowRight size={13} strokeWidth={2.5} />
                        </div>
                      </div>

                      {/* EXACT ONE-SENTENCE DESCRIPTION */}
                      <p className="text-zinc-950 text-[14.5px] leading-relaxed font-sans font-semibold mb-3.5">
                        {branch.description}
                      </p>

                      {/* BULLET POINTS LIST */}
                      <div className="space-y-2.5">
                        {branch.bullets.map((bullet, index) => (
                          <div key={index} className="flex items-start gap-3 text-[13.5px] text-zinc-900">
                            <span className="mt-1.5 shrink-0 w-2 h-2 bg-black rounded-none rotate-45" />
                            <span className="font-mono text-zinc-800 leading-snug">
                              {bullet}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER DETAILS */}
      <footer className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center pt-6 border-t border-zinc-200 text-[10px] font-mono text-zinc-400 gap-4">
        <div className="flex items-center gap-2">
          <span>REMAKE OF THE FULL WEALTH MANAGEMENT MIND MAP</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="uppercase text-zinc-500 font-semibold bg-zinc-150 py-0.5 px-2 rounded">
            Symmetric radial 7-branch spread
          </span>
          <span>BLACK & WHITE INTERACTIVE LAYOUT</span>
        </div>
      </footer>
    </div>
  );
}
