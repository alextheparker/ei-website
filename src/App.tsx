import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircle,
  Presentation,
  X,
  Zap,
} from 'lucide-react';

type SlideLayout = 'single-card' | 'multi-card' | 'comparison' | 'cta';

type SlideCard = {
  title: string;
  text: string;
  type?: 'positive' | 'negative';
};

type Slide = {
  id: string;
  layout: SlideLayout;
  title: React.ReactNode;
  subtitle?: string;
  cards?: SlideCard[];
  footer?: string;
  cta?: boolean;
};

// --- Presentation Data ---
const SLIDES: Slide[] = [
  {
    id: 'intro',
    layout: 'single-card',
    title: (
      <span>
        Never Miss a <span className="text-[#FBBF24]">Milestone.</span>
        <br />
        Get Paid Faster.
      </span>
    ),
    subtitle:
      'AI-powered operations for solar TPO projects. We eliminate the friction between installation and funding.',
    cards: [
      {
        title: 'Institutional Grade Ops',
        text: 'Built for residential installers with diverse financing options who need predictable, uninterrupted cash flow.',
      },
    ],
  },
  {
    id: 'problem',
    layout: 'multi-card',
    title: (
      <span>
        Cash is Stuck in <span className="text-[#FBBF24]">Paperwork.</span>
      </span>
    ),
    subtitle: 'The complexity of TPO financing is your biggest bottleneck.',
    cards: [
      {
        title: 'Rule Complexity',
        text: 'Each financier has unique document sets and validation rules that change without notice.',
      },
      {
        title: 'Visibility Gap',
        text: 'CRM status rarely matches what the financier actually expects next for each funding milestone.',
      },
      {
        title: 'Tribal Knowledge',
        text: "When an admin leaves, your pipeline stalls because the 'process' lived in their head.",
      },
    ],
  },
  {
    id: 'gap-logic',
    layout: 'comparison',
    title: (
      <span>
        The <span className="text-[#FBBF24]">"Gap"</span> Logic.
      </span>
    ),
    subtitle: 'How we solve the funding delay.',
    cards: [
      {
        title: 'What happens now?',
        text: 'You guess what is missing. You wait for rejections. You resubmit and wait again.',
        type: 'negative',
      },
      {
        title: 'The Equitable Way',
        text: 'We compare your CRM data against financier playbooks in real-time to find the "Gap."',
        type: 'positive',
      },
    ],
    footer: 'Result: A live list of exactly what must be done to get paid today.',
  },
  {
    id: 'partner-modes',
    layout: 'multi-card',
    title: (
      <span>
        Two Ways to <span className="text-[#FBBF24]">Partner.</span>
      </span>
    ),
    cards: [
      {
        title: 'Software Mode',
        text: "We provide the intelligence. You get alerts on what's needed and what's blocking. Your team executes.",
      },
      {
        title: 'Managed Ops Mode',
        text: 'We do the heavy lifting. We assemble packages, submit to portals, and track approvals. You focus on sales and installs.',
      },
    ],
  },
  {
    id: 'efficiency',
    layout: 'multi-card',
    title: (
      <span>
        Efficiency, Not <span className="text-[#FBBF24]">Headcount.</span>
      </span>
    ),
    subtitle: 'Scalability without the linear payroll growth.',
    cards: [
      {
        title: 'Faster Milestones',
        text: 'Shorten funding cycles by applying a "just-in-time" submission policy. Immediate notification of when you\'re ready to submit a milestone.',
      },
      {
        title: 'Fewer Rejections',
        text: 'Shorten your funding cycles by 7 to 14 days on average by eliminating submission errors with our pre-validation engine catching missing data or incomplete documents.',
      },
      {
        title: 'Happier Reps',
        text: 'Sales teams get paid faster because commissions are tied to funded milestones.',
      },
    ],
  },
  {
    id: 'timeline',
    layout: 'multi-card',
    title: (
      <span>
        Onboarding <span className="text-[#FBBF24]">Timeline.</span>
      </span>
    ),
    cards: [
      {
        title: 'Step 1: Audit',
        text: 'Consult with our experts to ensure that your system is optimized for project and financing requirements.',
      },
      {
        title: 'Step 2: Connect',
        text: 'Connect your CRM (Salesforce, Zoho, etc.). Quick API sync to ingest your current pipeline.',
      },
      {
        title: 'Step 3: Configure',
        text: 'We load your specific financier rules and document requirements into the engine.',
      },
      {
        title: 'Step 4: Action',
        text: 'Projects start hitting your queue, your team starts clearing the backlog.',
      },
    ],
  },
  {
    id: 'cta',
    layout: 'cta',
    title: (
      <span>
        Don't wait for a <span className="text-[#FBBF24]">Cashflow Crisis.</span>
      </span>
    ),
    subtitle:
      'TPO scrutiny is increasing. Funding requirements are stricter. Ops mistakes now directly threaten survival.',
    cta: true,
  },
];

const PROJECTS = [
  { id: '4423', financier: 'Goodleap', stage: 'NTP', homeowner: 'Henderson', address: '1234 Oak Street, Austin TX', nextTask: '2D plans ready, submit NTP finance milestone' },
  { id: '8891', financier: 'Sunpower', stage: 'Mechanical Completion', homeowner: 'Vazquez', address: '5678 Pine Ave, Dallas TX', nextTask: 'Final inspection complete, submit mechanical completion milestone' },
  { id: '1102', financier: 'Mosaic', stage: 'Project Completion', homeowner: 'Larsen', address: '9012 Elm Blvd, Houston TX', nextTask: 'PTO letter complete, submit project completion milestone' },
  { id: '3394', financier: 'Sunrun', stage: 'NTP', homeowner: 'Thompson', address: '3456 Maple Dr, San Antonio TX', nextTask: '2D plans ready, but utility bill missing. Retrieve utility bill before submitting NTP milestone' },
  { id: '5561', financier: 'Goodleap', stage: 'Mechanical Completion', homeowner: 'Gomez', address: '7890 Cedar Ln, Fort Worth TX', nextTask: 'Final inspection complete but installation pictures missing, collect installation pictures and submit mechanical completion milestone' },
  { id: '2201', financier: 'Everbright', stage: 'Project Completion', homeowner: 'Brighton', address: '2345 Birch Ct, El Paso TX', nextTask: 'PTO letter complete, but monitoring sharing is incomplete. Share monitoring to finance company and submit project completion' },
  { id: '6789', financier: 'Mosaic', stage: 'NTP', homeowner: 'Martinez', address: '6789 Willow Way, Plano TX', nextTask: 'NTP rejection follow up: need proof of title to corroborate contract signer is the property owner' },
  { id: '4512', financier: 'Sunpower', stage: 'Mechanical Completion', homeowner: 'Anderson', address: '8901 Spruce St, Irving TX', nextTask: 'M1 rejection follow up. Installation pictures are incomplete. Retrieve photos and resubmit M1' },
  { id: '7823', financier: 'Goodleap', stage: 'Project Completion', homeowner: 'Williams', address: '1234 Ash Ave, Frisco TX', nextTask: 'Project completion rejection follow up, monitoring shows connection error. Fix monitoring and resubmit project completion' },
  { id: '9034', financier: 'Sunrun', stage: 'NTP', homeowner: 'Taylor', address: '5678 Poplar Rd, McKinney TX', nextTask: '2D plans ready, submit NTP finance milestone' },
  { id: '3456', financier: 'Everbright', stage: 'Mechanical Completion', homeowner: 'Brown', address: '9012 Walnut Pl, Arlington TX', nextTask: 'Final inspection complete, submit mechanical completion milestone' },
  { id: '6712', financier: 'Mosaic', stage: 'Project Completion', homeowner: 'Davis', address: '3456 Cherry Ln, Denton TX', nextTask: 'PTO letter complete, submit project completion milestone' },
  { id: '8945', financier: 'Goodleap', stage: 'NTP', homeowner: 'Miller', address: '7890 Hickory Dr, Lewisville TX', nextTask: '2D plans ready, but utility bill missing. Retrieve utility bill before submitting NTP milestone' },
  { id: '2378', financier: 'Sunpower', stage: 'Mechanical Completion', homeowner: 'Wilson', address: '2345 Sycamore Ct, Carrollton TX', nextTask: 'Final inspection complete but installation pictures missing, collect installation pictures and submit mechanical completion milestone' },
  { id: '5690', financier: 'Sunrun', stage: 'Project Completion', homeowner: 'Moore', address: '6789 Magnolia Way, Richardson TX', nextTask: 'PTO letter complete, but monitoring sharing is incomplete. Share monitoring to finance company and submit project completion' },
  { id: '7812', financier: 'Everbright', stage: 'NTP', homeowner: 'Jackson', address: '8901 Dogwood St, Garland TX', nextTask: 'NTP rejection follow up: need proof of title to corroborate contract signer is the property owner' },
  { id: '4523', financier: 'Mosaic', stage: 'Mechanical Completion', homeowner: 'White', address: '1234 Redwood Ave, Grand Prairie TX', nextTask: 'M1 rejection follow up. Installation pictures are incomplete. Retrieve photos and resubmit M1' },
  { id: '9156', financier: 'Goodleap', stage: 'Project Completion', homeowner: 'Harris', address: '5678 Cypress Rd, Mesquite TX', nextTask: 'Project completion rejection follow up, monitoring shows connection error. Fix monitoring and resubmit project completion' },
  { id: '3267', financier: 'Sunpower', stage: 'NTP', homeowner: 'Martin', address: '9012 Fir Pl, Allen TX', nextTask: '2D plans ready, submit NTP finance milestone' },
  { id: '6834', financier: 'Sunrun', stage: 'Mechanical Completion', homeowner: 'Garcia', address: '3456 Beech Ln, Flower Mound TX', nextTask: 'Final inspection complete, submit mechanical completion milestone' },
  { id: '8901', financier: 'Everbright', stage: 'Project Completion', homeowner: 'Rodriguez', address: '7890 Juniper Dr, Euless TX', nextTask: 'PTO letter complete, submit project completion milestone' },
  { id: '2445', financier: 'Mosaic', stage: 'NTP', homeowner: 'Lewis', address: '2345 Alder Ct, Bedford TX', nextTask: '2D plans ready, but utility bill missing. Retrieve utility bill before submitting NTP milestone' },
  { id: '5778', financier: 'Goodleap', stage: 'Mechanical Completion', homeowner: 'Walker', address: '6789 Laurel Way, Grapevine TX', nextTask: 'Final inspection complete but installation pictures missing, collect installation pictures and submit mechanical completion milestone' },
  { id: '7923', financier: 'Sunpower', stage: 'Project Completion', homeowner: 'Hall', address: '8901 Hawthorn St, Coppell TX', nextTask: 'PTO letter complete, but monitoring sharing is incomplete. Share monitoring to finance company and submit project completion' },
];

type ViewMode = 'presentation' | 'dashboard';

const App = () => {
  const [view, setView] = useState<ViewMode>('presentation');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlideIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'presentation') {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, nextSlide, prevSlide]);

  const renderSlideContent = (slide: Slide) => {
    switch (slide.layout) {
      case 'single-card':
        return (
          <div className="relative p-10 bg-[#161618] rounded-3xl border border-white/5 shadow-2xl max-w-2xl">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#FBBF24]" />
            <h3 className="text-[#FBBF24] text-xl font-bold mb-4">{slide.cards?.[0]?.title}</h3>
            <p className="text-gray-300 text-lg leading-relaxed">{slide.cards?.[0]?.text}</p>
          </div>
        );
      case 'multi-card':
      case 'comparison': {
        const cardCount = slide.cards?.length ?? 1;
        const mdColsClass =
          cardCount === 2
            ? 'md:grid-cols-2'
            : cardCount === 3
              ? 'md:grid-cols-3'
              : cardCount === 4
                ? 'md:grid-cols-4'
                : 'md:grid-cols-1';

        return (
          <div className={`grid grid-cols-1 ${mdColsClass} gap-8 w-full`}>
            {(slide.cards ?? []).map((card, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl border transition-all ${
                  card.type === 'positive'
                    ? 'border-[#FBBF24]/40 bg-[#FBBF24]/5'
                    : card.type === 'negative'
                      ? 'border-white/10 bg-white/5 opacity-80'
                      : 'border-white/5 bg-[#161618]'
                }`}
              >
                <h3
                  className={`text-lg font-black mb-4 ${
                    card.type === 'negative' ? 'text-gray-400' : 'text-[#FBBF24]'
                  }`}
                >
                  {card.title}
                </h3>
                <p className={`leading-relaxed text-sm ${card.type === 'negative' ? 'text-gray-300' : 'text-gray-400'}`}>{card.text}</p>
              </div>
            ))}
          </div>
        );
      }
      case 'cta':
        return (
          <div className="flex flex-col items-center gap-10 mt-8">
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setView('dashboard');
                }}
                className="px-12 py-6 bg-white text-black font-black rounded-full hover:scale-105 transition-all uppercase tracking-widest text-xs z-50"
              >
                Enter Sandbox Dashboard
              </button>
              <button className="px-12 py-6 border-2 border-[#FBBF24] text-[#FBBF24] font-black rounded-full hover:bg-[#FBBF24]/10 transition-all uppercase tracking-widest text-xs z-50">
                Book Integration Audit
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const PresentationView = () => {
    const slide = SLIDES[activeSlideIndex];
    return (
      <div className="flex-1 relative flex flex-col bg-[#0A0A0B] overflow-hidden">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlideIndex ? 'w-8 bg-[#FBBF24]' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-24 py-12 sm:py-20 relative">
          <div className="max-w-6xl w-full mx-auto">
            <span className="text-[#FBBF24] font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
              Page 0{activeSlideIndex + 1}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-6 sm:mb-8 max-w-4xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mb-8 sm:mb-12 font-medium leading-relaxed">
                {slide.subtitle}
              </p>
            )}

            <div className="w-full">{renderSlideContent(slide)}</div>

            {slide.footer && (
              <div className="mt-8 p-5 bg-white/5 border border-white/5 rounded-2xl inline-block">
                <p className="text-gray-300 text-sm">
                  <strong className="text-[#FBBF24]">Result:</strong>{' '}
                  {slide.footer.split('Result:')[1]}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-10 left-0 w-full px-4 sm:px-12 flex justify-between items-center z-50 gap-2">
          <div>
            {activeSlideIndex > 0 && (
              <button
                onClick={prevSlide}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-full font-bold text-white hover:bg-white/10 transition-all active:scale-95 text-sm sm:text-base"
              >
                <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Previous</span>
              </button>
            )}
          </div>
          <div>
            {activeSlideIndex < SLIDES.length - 1 ? (
              <button
                onClick={nextSlide}
                className="flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-[#FBBF24] text-black rounded-full font-bold hover:scale-105 transition-all active:scale-95 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            ) : (
              <button
                onClick={() => setActiveSlideIndex(0)}
                className="flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-all text-sm sm:text-base"
              >
                Restart
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DashboardView = () => {
    const totalProjects = PROJECTS.length;

    const mulberry32 = (seed: number) => {
      let t = seed >>> 0;
      return () => {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
      };
    };

    const allocateWeighted = (total: number, weights: number[]) => {
      const sum = weights.reduce((a, b) => a + b, 0);
      const normalized = weights.map((w) => w / sum);
      const raw = normalized.map((w) => total * w);
      const base = raw.map((v) => Math.floor(v));
      let remaining = total - base.reduce((a, b) => a + b, 0);

      const frac = raw.map((v, idx) => ({ idx, frac: v - Math.floor(v) }));
      frac.sort((a, b) => b.frac - a.frac);

      for (let i = 0; i < frac.length && remaining > 0; i += 1) {
        base[frac[i].idx] += 1;
        remaining -= 1;
      }

      return base;
    };

    const formatUSDCompact = (amount: number) => {
      if (!Number.isFinite(amount)) return '';
      if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}m`;
      if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
      return `$${Math.round(amount)}`;
    };

    const rng = mulberry32(totalProjects * 1337 + 42);

    const atRiskProjects = Math.max(1, Math.min(totalProjects, Math.round(totalProjects * (0.08 + rng() * 0.08))));

    const stageWeights = [0.46 + rng() * 0.12, 0.30 + rng() * 0.10, 0.20 + rng() * 0.10];
    const [ntpCount, mechCount, completionCount] = allocateWeighted(totalProjects, stageWeights);

    const avgPerProject = 35000;
    const activePipelineAmount = totalProjects * avgPerProject * (0.9 + rng() * 0.25);

    const stageAmountsRaw = allocateWeighted(Math.round(activePipelineAmount), stageWeights);
    const atRiskAmount = Math.round(activePipelineAmount * (0.06 + rng() * 0.08));

    const stats = [
      { label: 'Active Pipeline', value: `${totalProjects} Projects`, subvalue: formatUSDCompact(activePipelineAmount), icon: Activity, color: 'text-blue-400' },
      { label: 'At Risk Pipeline', value: `${atRiskProjects} Projects`, subvalue: formatUSDCompact(atRiskAmount), icon: CheckCircle2, color: 'text-red-400' },
      { label: 'NTP', value: `${ntpCount} Projects`, subvalue: formatUSDCompact(stageAmountsRaw[0]), icon: Activity, color: 'text-purple-400' },
      { label: 'Mechanical Completion', value: `${mechCount} Projects`, subvalue: formatUSDCompact(stageAmountsRaw[1]), icon: Activity, color: 'text-yellow-400' },
      { label: 'Project Completion', value: `${completionCount} Projects`, subvalue: formatUSDCompact(stageAmountsRaw[2]), icon: Activity, color: 'text-green-400' },
    ];

    return (
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 bg-[#0F0F11] overflow-hidden">
        <div className="basis-[30%] min-h-0 flex flex-col">
          <div className="mb-6">
            <span className="bg-[#FBBF24] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest inline-block mb-3">
              Active Partner
            </span>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Ops Dashboard</h2>
            <p className="text-gray-500">Real-time status of your solar TPO pipeline.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#161618] border border-white/5 p-4 sm:p-6 rounded-3xl flex flex-col h-full">
                <div className={`mb-4 inline-flex p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <div className="min-h-[28px]">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-tight">
                    {stat.label}
                  </p>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mt-1">{stat.value}</h4>
                {stat.subvalue && <p className="text-gray-400 text-sm font-medium mt-1">{stat.subvalue}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="basis-[70%] min-h-0 bg-[#161618] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-3 sm:p-4 border-b border-white/5 flex-shrink-0">
            <h3 className="font-black text-white uppercase tracking-widest text-sm">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto overflow-y-auto -mx-4 sm:mx-0 flex-1 min-h-0">
            <table className="w-full text-left min-w-[600px]">
              <thead className="sticky top-0 bg-[#161618] z-10">
                <tr className="text-gray-600 text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="px-4 sm:px-8 py-2.5 sm:py-3.5">Property</th>
                  <th className="px-4 sm:px-8 py-2.5 sm:py-3.5">Stage</th>
                  <th className="px-4 sm:px-8 py-2.5 sm:py-3.5">Financier</th>
                  <th className="px-4 sm:px-8 py-2.5 sm:py-3.5">Next Step</th>
                  <th className="px-4 sm:px-8 py-2.5 sm:py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PROJECTS.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-8 py-3 sm:py-4">
                      <p className="text-white font-bold">{p.homeowner}</p>
                      <p className="text-gray-400 text-sm">{p.address}</p>
                    </td>
                    <td className="px-4 sm:px-8 py-3 sm:py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-400">
                        {p.stage}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-3 sm:py-4">
                      <p className="text-white font-bold">{p.financier}</p>
                      <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{p.id}</p>
                    </td>
                    <td className="px-4 sm:px-8 py-3 sm:py-4">
                      <p className={`text-sm font-medium ${
                        p.nextTask.startsWith('Ready') ? 'text-green-400' :
                        p.nextTask.startsWith('Missing') ? 'text-yellow-400' :
                        p.nextTask.startsWith('Expired') ? 'text-red-400' :
                        p.nextTask.startsWith('Rule Change') ? 'text-red-400' :
                        'text-gray-400'
                      }`}>{p.nextTask}</p>
                    </td>
                    <td className="px-4 sm:px-8 py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-gray-500 hover:text-white transition-colors" title="Copy">
                          <Copy size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-white transition-colors" title="Message">
                          <MessageCircle size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-white transition-colors" title="Email">
                          <Mail size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-white transition-colors" title="Complete">
                          <Check size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0A0B] text-white font-sans overflow-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-[60] lg:hidden bg-[#FBBF24] text-black p-3 rounded-xl shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`w-64 border-r border-white/10 flex flex-col shrink-0 bg-[#0A0A0B] z-50 fixed lg:relative h-full transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 lg:p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FBBF24] rounded-2xl flex items-center justify-center text-black shadow-2xl shadow-yellow-500/20">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-[0.2em] leading-tight text-white">Equitable</h2>
              <h2 className="font-black text-sm uppercase tracking-[0.2em] leading-tight text-[#FBBF24]">
                Industries
              </h2>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => {
              setView('presentation');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
              view === 'presentation'
                ? 'bg-white/5 text-[#FBBF24] border border-white/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Presentation size={20} />
            <span className="font-bold text-sm">Presentation</span>
          </button>
          <button
            onClick={() => {
              setView('dashboard');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
              view === 'dashboard'
                ? 'bg-white/5 text-[#FBBF24] border border-white/10'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-bold text-sm">Sandbox Dashboard</span>
          </button>
        </nav>

        <div className="p-6">
          <div className="p-6 bg-[#161618] rounded-3xl border border-white/5 text-center">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Live Demo</p>
            <button className="w-full bg-[#FBBF24] text-black font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest uppercase">
              Book Consultation
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative w-full lg:w-auto">
        {view === 'presentation' ? <PresentationView /> : <DashboardView />}
      </main>
    </div>
  );
};

export default App;
