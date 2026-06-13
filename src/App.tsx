import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Layers, ArrowRight, ArrowDown, Shield, Home as HomeIcon, Briefcase, UserCheck, Calendar, Clock, Check, X } from "lucide-react";

// Types
interface Branch {
  id: string;
  label: string;
  angle: number; // in degrees
  description: string;
  bullets: string[];
  r?: number; // Custom radius offset closer to centered hub
}

// Data matching original mind map
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
    r: 210
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
    r: 210
  }
];

// Made-up director profiles for About Us
interface Director {
  name: string;
  title: string;
  profile: string;
}

const directors: Director[] = [
  {
    name: "Pierre Bourgouin",
    title: "Managing Partner & Founder",
    profile: "Pierre established Bourgouin & Associates with a vision to redefine bespoke wealth orchestration. With over two decades of advisory experience, he leads the firm's strategic architecture, aligning complex cross-border family estates with enduring institutional frameworks."
  },
  {
    name: "Hélène Vance",
    title: "Director of Succession & Trust Governance",
    profile: "Hélène specializes in the creation of intergenerational governance models. She advises multi-generational families on wealth preservation, trust configurations, and friction-free asset transitions, ensuring legacy continuity with absolute discretion."
  },
  {
    name: "Marcus Kross",
    title: "Director of Corporate & Private Placements",
    profile: "Marcus manages the intersection of corporate treasury optimization and private equity placements. He works closely with enterprise owners and founders to design tailored capital structures, liquidity access, and transaction pathways."
  }
];

// Product Descriptions
interface Product {
  title: string;
  tagline: string;
  description: string;
}

const products: Product[] = [
  {
    title: "Life Insurance",
    tagline: "Intergenerational Liquidity Preservation",
    description: "Sophisticated private placement life insurance and customized estate plans structured to maximize liquidity preservation, minimize transfer friction, and safeguard familial wealth across generations."
  },
  {
    title: "Home Protection",
    tagline: "Asset Shielding & Estate Security",
    description: "Bespoke risk mitigation and comprehensive coverage profiles for high-value residential holdings, estate properties, and private real estate portfolios, aligned with overall asset structures."
  },
  {
    title: "Succession Planning",
    tagline: "Frictionless Legacy Transitions",
    description: "Structured governance systems including family trusts, entity organization, and generational transition methodologies designed to preserve legacy stability and prevent friction during asset transfers."
  },
  {
    title: "Corporate Advisory",
    tagline: "Balance-Sheet Design & Capital Pathways",
    description: "Comprehensive balance-sheet design, personnel optimization programs, capital structuring, and private lending facilities tailored to align corporate structures with the ultimate growth goals of the founders."
  }
];

type ViewState = "home" | "about" | "products";

export default function App() {
  const [view, setView] = useState<ViewState>("home");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mindMapSectionRef = useRef<HTMLElement>(null);

  // Booking states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [bookingStep, setBookingStep] = useState<"calendar" | "form" | "success">("calendar");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [bookingNotes, setBookingNotes] = useState("");

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setTimeout(() => {
      setSelectedDate(null);
      setBookingStep("calendar");
      setBookingName("");
      setBookingEmail("");
      setBookingTime("10:00 AM");
      setBookingNotes("");
    }, 300);
  };

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

  // Scroll to view
  const navigateToView = (targetView: ViewState) => {
    setView(targetView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToMindMap = () => {
    mindMapSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col selection:bg-black selection:text-white">
      
      {/* NAVIGATION BAR - Sleek Black & White Minimalist */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xs border-b border-black">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Left: Home Button */}
          <button 
            onClick={() => navigateToView("home")}
            className="group flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <span className="w-3 h-3 bg-black transition-transform group-hover:scale-125" />
            <span className="font-serif text-xl font-bold tracking-tight uppercase">
              Bourgouin & Associates
            </span>
          </button>

          {/* Right: Navigation Links */}
          <div className="flex items-center gap-8 font-mono text-[13px] uppercase tracking-wider">
            <button
              onClick={() => navigateToView("about")}
              className={`hover:text-neutral-500 cursor-pointer relative py-1 focus:outline-none transition-colors ${
                view === "about" ? "font-bold border-b border-black" : ""
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => navigateToView("products")}
              className={`hover:text-neutral-500 cursor-pointer relative py-1 focus:outline-none transition-colors ${
                view === "products" ? "font-bold border-b border-black" : ""
              }`}
            >
              Products
            </button>
            {/* Login button - styled but inactive (does not lead anywhere) */}
            <button
              onClick={(e) => e.preventDefault()}
              className="bg-black text-white px-4 py-2 border border-black hover:bg-white hover:text-black transition-all cursor-default select-none focus:outline-none"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
            >
              {/* HERO SECTION */}
              <section className="min-h-[110vh] flex flex-col justify-center items-center px-6 text-center max-w-6xl mx-auto pt-24 pb-32">
                {/* Big Chic Title */}
                <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-light tracking-tight text-black select-none max-w-5xl leading-[0.95] mb-12">
                  BOURGOUIN<br/>& ASSOCIATES
                </h1>
                
                {/* Write-up (2 sentences) */}
                <p className="font-sans text-lg md:text-2xl text-neutral-800 max-w-3xl leading-relaxed font-light mb-24 px-4">
                  At Bourgouin & Associates, we reject the notion of standardized wealth management in favor of deeply personalized financial architecture. 
                  We believe every client represents a unique legacy, demanding tailored solutions that align with their distinct personal and professional objectives.
                </p>

                {/* Smooth Scroll Indicator */}
                <button
                  onClick={scrollToMindMap}
                  className="flex flex-col items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400 hover:text-black cursor-pointer group transition-colors"
                >
                  <span>Explore Wealth Architecture</span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowDown size={14} className="text-neutral-500 group-hover:text-black" />
                  </motion.div>
                </button>
              </section>

              {/* MIND MAP SECTION */}
              <section 
                ref={mindMapSectionRef}
                className="py-20 border-t border-black bg-neutral-50 flex flex-col items-center"
              >
                <div className="max-w-6xl w-full px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest block mb-1">
                      Interactive Architecture
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase tracking-tight">
                      Wealth Management Mind Map
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 bg-white border border-neutral-300 rounded-md py-1.5 px-3 shadow-xs">
                      <Info size={13} className="text-neutral-500 shrink-0" />
                      <span className="text-[11px] font-mono text-neutral-600">
                        Hover branches to reveal details. Click to lock view.
                      </span>
                    </div>
                    {activeId && (
                      <button
                        onClick={() => {
                          setHoveredId(null);
                          setSelectedId(null);
                        }}
                        className="text-[11px] font-mono text-neutral-500 hover:text-black hover:underline cursor-pointer bg-white border border-neutral-300 rounded-md py-1.5 px-3 transition-colors"
                      >
                        Reset view
                      </button>
                    )}
                  </div>
                </div>

                {/* Radial Mind Map Container */}
                <div className="w-full max-w-6xl px-6 flex justify-center">
                  <div
                    ref={containerRef}
                    className="w-full max-w-[900px] aspect-[4/3] bg-white rounded-none border border-black relative overflow-visible shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {/* SVG Connections */}
                    <svg
                      viewBox="0 0 1000 750"
                      className="absolute inset-0 w-full h-full select-none overflow-visible z-0"
                    >
                      {/* Geometric Grid Lines */}
                      <circle cx={cx} cy={cy} r={R} stroke="#e5e5e5" strokeWidth={1} fill="none" strokeDasharray="4,8" />
                      <circle cx={cx} cy={cy} r={R * 0.55} stroke="#f5f5f5" strokeWidth={1} fill="none" strokeDasharray="2,6" />

                      {/* RADIATING BRANCH LINES */}
                      {branches.map((branch) => {
                        const angleRad = (branch.angle * Math.PI) / 180;
                        const branchR = branch.r || R;
                        
                        const xStart = cx + rInner * Math.cos(angleRad);
                        const yStart = cy + rInner * Math.sin(angleRad);
                        
                        const xEnd = cx + (branchR - 25) * Math.cos(angleRad);
                        const yEnd = cy + (branchR - 25) * Math.sin(angleRad);

                        const isCurrentActive = activeId === branch.id;
                        const isAnyActive = activeId !== null;

                        return (
                          <g key={`line-group-${branch.id}`}>
                            {isCurrentActive && (
                              <line
                                x1={xStart}
                                y1={yStart}
                                x2={xEnd}
                                y2={yEnd}
                                stroke="#f5f5f5"
                                strokeWidth={12}
                                strokeLinecap="round"
                              />
                            )}
                            <line
                              x1={xStart}
                              y1={yStart}
                              x2={xEnd}
                              y2={yEnd}
                              stroke="black"
                              strokeWidth={isCurrentActive ? 2.5 : 1}
                              opacity={isCurrentActive ? 1 : isAnyActive ? 0.08 : 0.6}
                              className="transition-all duration-300 ease-out"
                            />
                            <circle
                              cx={xEnd}
                              cy={yEnd}
                              r={isCurrentActive ? 5 : 3}
                              fill="black"
                              opacity={isCurrentActive ? 1 : isAnyActive ? 0.08 : 0.6}
                              className="transition-all duration-300"
                            />
                          </g>
                        );
                      })}

                      {/* CENTRAL CORE ANCHOR */}
                      <g
                        onClick={() => {
                          setHoveredId(null);
                          setSelectedId(null);
                        }}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={rInner + 10}
                          fill="none"
                          stroke="black"
                          strokeWidth={1}
                          opacity={activeId ? 0.05 : 0.2}
                          className="transition-all duration-500 ease-out"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={rInner}
                          fill="white"
                          stroke="black"
                          strokeWidth={2.5}
                          className="transition-all duration-300 shadow-sm"
                        />
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="font-serif text-xl font-bold tracking-widest fill-black select-none"
                        >
                          B&A
                        </text>
                      </g>
                    </svg>

                    {/* Interactive HTML Node Labels */}
                    {branches.map((branch) => {
                      const angleRad = (branch.angle * Math.PI) / 180;
                      const branchR = branch.r || R;
                      const x = cx + branchR * Math.cos(angleRad);
                      const y = cy + branchR * Math.sin(angleRad);

                      const xPct = (x / 1000) * 100;
                      const yPct = (y / 750) * 100;

                      const isCurrentActive = activeId === branch.id;
                      const isAnyActive = activeId !== null;

                      // Card positioning strategies
                      const isLeftHalf = x < 450;
                      const isRightHalf = x > 550;
                      const isTopCenter = x >= 450 && x <= 550 && y < 350;
                      const isBottomCenter = x >= 450 && x <= 550 && y >= 350;

                      let cardAlignmentClass = "";
                      if (isLeftHalf) {
                        cardAlignmentClass = "left-full ml-4 top-1/2 -translate-y-1/2";
                      } else if (isRightHalf) {
                        cardAlignmentClass = "right-full mr-4 top-1/2 -translate-y-1/2";
                      } else if (isTopCenter) {
                        cardAlignmentClass = "top-full mt-4 left-1/2 -translate-x-1/2";
                      } else if (isBottomCenter) {
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
                            isCurrentActive ? "z-50" : isAnyActive ? "z-0 opacity-20" : "z-10"
                          }`}
                        >
                          {/* Label Box */}
                          <div
                            onMouseEnter={() => setHoveredId(branch.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(selectedId === branch.id ? null : branch.id);
                            }}
                            className={`px-4 py-2 border text-[13px] font-sans font-semibold cursor-pointer select-none transition-all duration-300 shadow-xs whitespace-nowrap ${
                              isCurrentActive
                                ? "bg-black text-white border-black scale-105"
                                : isAnyActive
                                ? "bg-white text-neutral-300 border-neutral-100 scale-95"
                                : "bg-white text-black border-black hover:bg-black hover:text-white"
                            }`}
                          >
                            {branch.label}
                          </div>

                          {/* Hover Popup Card */}
                          <AnimatePresence>
                            {isCurrentActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                onMouseEnter={() => setHoveredId(branch.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={`absolute ${cardAlignmentClass} bg-white border-2 border-black p-5 rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[320px] max-w-[360px] z-50 pointer-events-auto`}
                              >
                                <div className="flex items-center justify-between pb-2 mb-3 border-b border-black">
                                  <span className="text-[12px] font-mono uppercase tracking-widest font-bold text-black flex items-center gap-1.5">
                                    <Layers size={12} className="text-black" />
                                    {branch.label}
                                  </span>
                                  <div className="p-1 bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center">
                                    <ArrowRight size={12} strokeWidth={2.5} />
                                  </div>
                                </div>

                                <p className="text-neutral-900 text-[14px] leading-relaxed font-sans font-normal mb-4">
                                  {branch.description}
                                </p>

                                <div className="space-y-2.5">
                                  {branch.bullets.map((bullet, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5 text-[13px] text-black">
                                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 bg-black rotate-45" />
                                      <span className="font-mono text-neutral-700 leading-snug">
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
                </div>
              </section>

              {/* BOOK US SECTION */}
              <section className="py-20 border-t border-black bg-white flex flex-col items-center">
                <div className="max-w-xl w-full px-6 text-center">
                  <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest block mb-2">
                    Direct Consultation
                  </span>
                  <h3 className="font-serif text-3xl font-bold uppercase tracking-tight mb-4 text-black">
                    Begin Your Architecture
                  </h3>
                  <p className="font-sans text-[15px] text-neutral-600 mb-8 leading-relaxed font-light">
                    Arrange a private consultation with one of our directors to align your estate or corporate balance sheet requirements.
                  </p>
                  
                  {/* Book Us button */}
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="inline-block bg-black text-white px-10 py-4 font-mono text-xs uppercase tracking-widest border border-black hover:bg-white hover:text-black transition-all cursor-pointer focus:outline-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                  >
                    Book Us
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {view === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto px-6 py-20"
            >
              {/* Header */}
              <div className="border-b border-black pb-8 mb-16">
                <span className="font-mono text-[12px] text-neutral-500 uppercase tracking-widest block mb-2">
                  Partnership Structure
                </span>
                <h1 className="font-serif text-5xl md:text-7xl uppercase font-light tracking-tight">
                  ABOUT US
                </h1>
              </div>

              {/* Profiles Grid */}
              <div className="grid md:grid-cols-3 gap-12">
                {directors.map((director, index) => (
                  <div key={index} className="flex flex-col border border-black p-8 bg-neutral-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                    <div className="mb-6">
                      <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center mb-4 bg-white">
                        <UserCheck size={18} className="text-black" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-black mb-1">
                        {director.name}
                      </h2>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                        {director.title}
                      </p>
                    </div>
                    <p className="font-sans text-[14.5px] leading-relaxed text-neutral-800 font-light flex-1">
                      {director.profile}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto px-6 py-20"
            >
              {/* Header */}
              <div className="border-b border-black pb-8 mb-16">
                <span className="font-mono text-[12px] text-neutral-500 uppercase tracking-widest block mb-2">
                  Client Disciplines
                </span>
                <h1 className="font-serif text-5xl md:text-7xl uppercase font-light tracking-tight">
                  OUR PRODUCTS
                </h1>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 gap-10">
                {products.map((product, index) => (
                  <div key={index} className="flex flex-col border-2 border-black p-10 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-black text-white">
                        {index === 0 && <Shield size={20} />}
                        {index === 1 && <HomeIcon size={20} />}
                        {index === 2 && <Layers size={20} />}
                        {index === 3 && <Briefcase size={20} />}
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-black">
                          {product.title}
                        </h2>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                          {product.tagline}
                        </span>
                      </div>
                    </div>
                    <p className="font-sans text-[15px] leading-relaxed text-neutral-800 font-light">
                      {product.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-black py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[11px] font-mono text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} BOURGOUIN & ASSOCIATES. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-black transition-colors cursor-pointer" onClick={() => navigateToView("home")}>HOME</span>
            <span className="hover:text-black transition-colors cursor-pointer" onClick={() => navigateToView("about")}>ABOUT US</span>
            <span className="hover:text-black transition-colors cursor-pointer" onClick={() => navigateToView("products")}>PRODUCTS</span>
            <span className="text-neutral-300">|</span>
            <span>BW MINIMALIST STYLE v1.0</span>
          </div>
        </div>
      </footer>
      {/* BOOKING MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseBooking}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseBooking}
                className="absolute top-4 right-4 text-black hover:text-neutral-500 cursor-pointer focus:outline-none"
              >
                <X size={18} />
              </button>

              {/* STEP 1: CALENDAR */}
              {bookingStep === "calendar" && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar size={18} className="text-black" />
                    <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-black">
                      Step 1: Select Date
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-bold uppercase tracking-tight text-black mb-4">
                    June 2026
                  </h4>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] mb-6">
                    {/* Days of Week */}
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="font-bold text-black py-1 border-b border-black">
                        {d}
                      </div>
                    ))}
                    
                    {/* Days in Month */}
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const day = idx + 1;
                      const isWeekend = day === 6 || day === 7 || day === 13 || day === 14 || day === 20 || day === 21 || day === 27 || day === 28;
                      const isSelected = selectedDate === day;
                      
                      return (
                        <button
                          key={idx}
                          disabled={isWeekend}
                          onClick={() => setSelectedDate(day)}
                          className={`py-2 text-xs focus:outline-none transition-all ${
                            isWeekend
                              ? "text-neutral-300 line-through cursor-not-allowed"
                              : isSelected
                              ? "bg-black text-white font-bold cursor-pointer"
                              : "text-black hover:bg-neutral-100 cursor-pointer"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseBooking}
                      className="px-4 py-2 border border-neutral-300 hover:border-black font-mono text-[10px] uppercase tracking-wider text-neutral-600 hover:text-black cursor-pointer focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={selectedDate === null}
                      onClick={() => setBookingStep("form")}
                      className={`px-6 py-2 font-mono text-[10px] uppercase tracking-wider text-white bg-black border border-black focus:outline-none ${
                        selectedDate === null
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-white hover:text-black cursor-pointer"
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DETAILS FORM */}
              {bookingStep === "form" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (bookingName.trim() && bookingEmail.trim()) {
                      setBookingStep("success");
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Clock size={18} className="text-black" />
                    <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-black">
                      Step 2: Your Details
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-bold uppercase tracking-tight text-black mb-1">
                    Confirm Consultation
                  </h4>
                  <p className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider mb-6">
                    June {selectedDate}, 2026 at {bookingTime}
                  </p>

                  <div className="space-y-4 mb-6">
                    {/* Time Slot Select */}
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        Time Slot
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full border-b border-black py-1.5 focus:outline-none font-sans text-sm bg-white cursor-pointer"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full border-b border-black py-1.5 focus:outline-none font-sans text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="w-full border-b border-black py-1.5 focus:outline-none font-sans text-sm"
                      />
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="Topics for discussion..."
                        className="w-full border-b border-black py-1.5 focus:outline-none font-sans text-sm h-16 resize-none"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingStep("calendar")}
                      className="px-4 py-2 border border-neutral-300 hover:border-black font-mono text-[10px] uppercase tracking-wider text-neutral-600 hover:text-black cursor-pointer focus:outline-none"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 font-mono text-[10px] uppercase tracking-wider text-white bg-black border border-black hover:bg-white hover:text-black transition-all cursor-pointer focus:outline-none"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SUCCESS */}
              {bookingStep === "success" && (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-6 bg-black text-white">
                    <Check size={24} />
                  </div>
                  <h4 className="font-serif text-2xl font-bold uppercase tracking-tight text-black mb-3">
                    Request Received
                  </h4>
                  <p className="font-sans text-sm text-neutral-600 mb-8 max-w-xs mx-auto leading-relaxed font-light">
                    Thank you, <span className="font-semibold text-black">{bookingName}</span>. Your request for <span className="font-semibold text-black">June {selectedDate}, 2026 at {bookingTime}</span> has been processed. A coordinator will contact you shortly.
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="inline-block bg-black text-white px-8 py-2.5 font-mono text-[10px] uppercase tracking-widest border border-black hover:bg-white hover:text-black transition-all cursor-pointer focus:outline-none"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
