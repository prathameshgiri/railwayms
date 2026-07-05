import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
  Search, ArrowRight, ArrowLeftRight, Calendar, Users,
  ChevronDown, Star, Shield, Zap, Award, TrendingUp,
  MapPin, Clock, Train, ChevronUp, Mail, Sparkles
} from 'lucide-react';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { setSearchParams } from '@/store/slices/bookingSlice';
import { stations, popularDestinations } from '@/data/stations';
import { offers, testimonials, faqs } from '@/data/offers';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { setStarted(true); }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Train Hero SVG ── */
function TrainGraphic() {
  return (
    <>
      <svg viewBox="0 0 520 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
        {/* Track */}
        <rect x="0" y="175" width="520" height="6" rx="3" fill="#e2e8f0"/>
        <rect x="0" y="183" width="520" height="3" rx="1" fill="#cbd5e1"/>
        {[0,60,120,180,240,300,360,420,480].map((x,i)=>(
          <rect key={i} x={x} y="170" width="30" height="14" rx="2" fill="#94a3b8"/>
        ))}

        {/* Train body */}
        <rect x="60" y="95" width="400" height="75" rx="18" fill="url(#bodyGrad)"/>
        {/* Roof */}
        <rect x="75" y="78" width="370" height="30" rx="14" fill="url(#roofGrad)"/>
        {/* Nose */}
        <ellipse cx="460" cy="133" rx="22" ry="37" fill="url(#bodyGrad)"/>

        {/* Windows */}
        {[100,170,240,310,370].map((x,i)=>(
          <g key={i}>
            <rect x={x} y="108" width="52" height="38" rx="8" fill="url(#winGrad)" opacity="0.9"/>
            <rect x={x+3} y="111" width="46" height="14" rx="4" fill="rgba(255,255,255,0.4)"/>
          </g>
        ))}

        {/* Door */}
        <rect x="430" y="110" width="22" height="55" rx="4" fill="rgba(255,255,255,0.25)"/>

        {/* Wheels */}
        {[100,180,310,390].map((cx,i)=>(
          <g key={i}>
            <circle cx={cx} cy="175" r="20" fill="url(#wheelGrad)" />
            <circle cx={cx} cy="175" r="12" fill="#475569" />
            <circle cx={cx} cy="175" r="5" fill="#e2e8f0" />
          </g>
        ))}

        {/* Light */}
        <ellipse cx="480" cy="118" rx="10" ry="10" fill="#FEF08A" opacity="0.9"/>
        <motion.ellipse cx="480" cy="118" rx="14" ry="14" fill="#FDE68A" opacity="0.4"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Speed lines */}
        {[110,130,150].map((y,i)=>(
          <motion.rect key={i} x="20" y={y} width={40+i*10} height="3" rx="1.5"
            fill="#bfdbfe" opacity="0.7"
            animate={{ scaleX: [1, 1.4, 1], opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        <defs>
          <linearGradient id="bodyGrad" x1="60" y1="95" x2="480" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB"/>
            <stop offset="100%" stopColor="#3B82F6"/>
          </linearGradient>
          <linearGradient id="roofGrad" x1="75" y1="78" x2="445" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1D4ED8"/>
            <stop offset="100%" stopColor="#2563EB"/>
          </linearGradient>
          <linearGradient id="winGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#BAE6FD"/>
            <stop offset="100%" stopColor="#E0F2FE"/>
          </linearGradient>
          <linearGradient id="wheelGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#64748b"/>
            <stop offset="100%" stopColor="#1e293b"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Steam */}
      {[0,1,2].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 20 + i * 10, height: 20 + i * 10,
            background: 'rgba(255,255,255,0.6)',
            top: 20 + i * 8, right: 60 + i * 15,
            filter: 'blur(6px)',
          }}
          animate={{ y: [-10, -50], opacity: [0.8, 0], scale: [1, 2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

function TrainIllustration() {
  return (
    <div className="relative w-full h-[220px] overflow-hidden flex items-center justify-center pointer-events-none">
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[520px]"
        animate={{ x: ['-120vw', '120vw'], y: [0, -12, 0] }}
        transition={{ 
          x: { duration: 10, repeat: Infinity, ease: 'linear' },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <TrainGraphic />
      </motion.div>
      
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[520px]"
        animate={{ x: ['-120vw', '120vw'], y: [0, -12, 0] }}
        transition={{ 
          x: { duration: 10, repeat: Infinity, ease: 'linear', delay: 5 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 5 }
        }}
      >
        <TrainGraphic />
      </motion.div>
    </div>
  );
}

/* ── Moving Clouds ── */
function MovingClouds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { size: 80, top: '8%', delay: 0, duration: 35 },
        { size: 60, top: '18%', delay: 8, duration: 28 },
        { size: 100, top: '5%', delay: 15, duration: 42 },
        { size: 50, top: '25%', delay: 3, duration: 32 },
      ].map((cloud, i) => (
        <motion.div key={i}
          className="absolute"
          style={{ top: cloud.top }}
          initial={{ x: '-15%' }}
          animate={{ x: '115%' }}
          transition={{ duration: cloud.duration, repeat: Infinity, delay: cloud.delay, ease: 'linear' }}
        >
          <svg width={cloud.size} height={cloud.size * 0.6} viewBox="0 0 100 60">
            <ellipse cx="50" cy="40" rx="45" ry="22" fill="rgba(255,255,255,0.7)"/>
            <ellipse cx="35" cy="32" rx="28" ry="20" fill="rgba(255,255,255,0.8)"/>
            <ellipse cx="62" cy="28" rx="22" ry="18" fill="rgba(255,255,255,0.75)"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Search Form ── */
function SearchForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ from: '', to: '', date: '', classType: 'All', passengers: 1 });
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [focused, setFocused] = useState(null);

  const getSuggestions = (val) =>
    stations.filter(s =>
      s.name.toLowerCase().includes(val.toLowerCase()) ||
      s.city.toLowerCase().includes(val.toLowerCase()) ||
      s.code.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5);

  const handleSwap = () => setForm(f => ({ ...f, from: f.to, to: f.from }));

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchParams(form));
    navigate('/search');
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      className="glass shadow-large p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 relative">
        {/* From */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <MapPin size={11} /> From
          </label>
          <div className="relative">
            <input
              value={form.from}
              onChange={e => { setForm(f => ({...f, from: e.target.value})); setFromSuggestions(getSuggestions(e.target.value)); }}
              onFocus={() => setFocused('from')}
              onBlur={() => setTimeout(() => setFocused(null), 200)}
              placeholder="Source city or station"
              className="input-glass pl-4 pr-10 font-semibold"
            />
            {focused === 'from' && fromSuggestions.length > 0 && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-1 glass shadow-large z-20 overflow-hidden rounded-xl"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {fromSuggestions.map(s => (
                  <button type="button" key={s.code}
                    onClick={() => { setForm(f => ({...f, from: s.city})); setFromSuggestions([]); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                  >
                    <Train size={14} className="text-blue-400 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.city}, {s.state} · {s.code}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile swap button */}
        <div className="flex sm:hidden justify-center my-1">
          <motion.button
            type="button"
            onClick={handleSwap}
            className="w-9 h-9 rounded-full shadow-medium flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}
          >
            <ArrowLeftRight size={16} />
          </motion.button>
        </div>
        {/* Desktop swap button */}
        <div className="hidden sm:flex absolute left-1/2 top-8 -translate-x-1/2 z-10">
          <motion.button
            type="button"
            onClick={handleSwap}
            className="w-9 h-9 rounded-full shadow-medium flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            whileHover={{ rotate: 180, scale: 1.15 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeftRight size={16} />
          </motion.button>
        </div>

        {/* To */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <MapPin size={11} /> To
          </label>
          <div className="relative">
            <input
              value={form.to}
              onChange={e => { setForm(f => ({...f, to: e.target.value})); setToSuggestions(getSuggestions(e.target.value)); }}
              onFocus={() => setFocused('to')}
              onBlur={() => setTimeout(() => setFocused(null), 200)}
              placeholder="Destination city or station"
              className="input-glass pl-4 pr-10 font-semibold"
            />
            {focused === 'to' && toSuggestions.length > 0 && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-1 glass shadow-large z-20 overflow-hidden rounded-xl"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {toSuggestions.map(s => (
                  <button type="button" key={s.code}
                    onClick={() => { setForm(f => ({...f, to: s.city})); setToSuggestions([]); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                  >
                    <Train size={14} className="text-blue-400 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.city}, {s.state} · {s.code}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <Calendar size={11} /> Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({...f, date: e.target.value}))}
            min={new Date().toISOString().split('T')[0]}
            className="input-glass"
          />
        </div>
        {/* Class */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Class</label>
          <select
            value={form.classType}
            onChange={e => setForm(f => ({...f, classType: e.target.value}))}
            className="input-glass"
          >
            {['All','1A','2A','3A','SL','CC','EC'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {/* Passengers */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <Users size={11} /> Passengers
          </label>
          <select
            value={form.passengers}
            onChange={e => setForm(f => ({...f, passengers: Number(e.target.value)}))}
            className="input-glass"
          >
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        {/* Search */}
        <div className="flex items-end">
          <motion.button
            type="submit"
            className="btn-primary w-full justify-center rounded-xl py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Search size={16} />
            Search
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}

/* ── Stats ── */
const stats = [
  { label: 'Tickets Booked', value: 2400000, suffix: '+', icon: Train },
  { label: 'Happy Travelers', value: 850000, suffix: '+', icon: Users },
  { label: 'Train Routes', value: 14000, suffix: '+', icon: Train },
  { label: 'Cities Covered', value: 500, suffix: '+', icon: MapPin },
];

/* ── FAQ Accordion ── */
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="glass overflow-hidden"
      initial={false}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-slate-800 pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-slate-400 shrink-0" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-white/50 pt-3">
          {a}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Why Choose Us ── */
const whyUs = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Book tickets in under 60 seconds with our streamlined booking flow', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { icon: Shield, title: 'Secure Payments', desc: '256-bit encryption and PCI DSS compliant payment processing', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: Clock, title: 'Real-time Updates', desc: 'Live train status, seat availability updated every 30 seconds', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Award, title: 'Best Price Guarantee', desc: 'We match any lower fare with our exclusive price promise', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: TrendingUp, title: 'Reward Points', desc: 'Earn points on every booking and redeem for free tickets', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: Sparkles, title: 'AI Suggestions', desc: 'Personalized travel recommendations powered by machine learning', color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

/* ── Main Landing Page ── */
export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const destinationColors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-rose-500',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
  ];

  return (
    <div className="min-h-screen">
      <AnimatedBackground />

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 overflow-hidden">
        <MovingClouds />

        <motion.div style={{ y: heroY }} className="relative z-10 text-center max-w-4xl mx-auto w-full">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass shadow-soft mb-4 sm:mb-6 text-[11px] sm:text-sm font-semibold text-blue-600 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            Live seat availability Real-time booking
            <Sparkles size={14} className="shrink-0" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Book Your Journey{' '}
            <span className="gradient-text animate-gradient"
              style={{ backgroundImage: 'linear-gradient(90deg, #2563EB, #7C3AED, #2563EB)', backgroundSize: '200%' }}>
              Across India
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Book train tickets in seconds with a seamless experience. Real-time availability,
            secure payments, and instant confirmation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <button className="btn-primary px-8 py-4 text-base rounded-2xl animate-pulse-glow"
              onClick={() => navigate('/search')}>
              <Train size={18} /> Book Ticket
            </button>
            <button className="btn-ghost px-8 py-4 text-base rounded-2xl"
              onClick={() => document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' })}>
              Explore Routes <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Train illustration */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <TrainIllustration />
          </motion.div>

          {/* Search Form */}
          <SearchForm />

          {/* Quick stats */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {['2.4M+ tickets booked', '14,000+ routes', '99.9% uptime', 'Instant confirmation'].map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {s}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} className="text-slate-300" />
        </motion.div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section id="destinations" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="blue" className="mb-3">Popular Routes</Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-3">Trending Destinations</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Discover the most popular train routes across India, loved by millions of travelers.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((dest, i) => (
              <ScrollReveal key={i} delay={i * 0.08} direction="up">
                <motion.div
                  onClick={() => navigate('/search')}
                  className="group cursor-pointer glass rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Gradient top bar */}
                  <div className={`h-2 w-full bg-gradient-to-r ${destinationColors[i]}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Route</div>
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          {dest.from}
                          <ArrowRight size={14} className="text-slate-400" />
                          {dest.to}
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${destinationColors[i]}`}>
                        <Train size={18} color="white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-slate-50 rounded-xl p-2">
                        <div className="text-xs text-slate-400 mb-0.5">Trains</div>
                        <div className="font-bold text-slate-700">{dest.trains}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2">
                        <div className="text-xs text-slate-400 mb-0.5">Duration</div>
                        <div className="font-bold text-slate-700 text-xs">{dest.duration}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2">
                        <div className="text-xs text-slate-400 mb-0.5">From</div>
                        <div className="font-bold text-blue-600">₹{dest.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Badge variant="blue">Popular</Badge>
                      <span className="text-xs font-semibold text-blue-500 group-hover:gap-2 flex items-center gap-1 transition-all">
                        Book Now <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP OFFERS ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="purple" className="mb-3">Special Offers</Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-3">Exclusive Deals</h2>
              <p className="text-slate-500">Save big on your next journey with our curated offers.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {offers.map((offer, i) => (
              <ScrollReveal key={offer.id} delay={i * 0.1} direction="up">
                <motion.div
                  className="glass rounded-3xl overflow-hidden shadow-soft cursor-pointer group"
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                >
                  <div className={`h-24 bg-gradient-to-br ${offer.gradient} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-white text-3xl font-black">
                        {offer.type === 'flat' ? `₹${offer.discount}` : `${offer.discount}%`}
                      </div>
                      <div className="text-white/80 text-xs font-medium">OFF</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${offer.tagColor}`}>{offer.tag}</span>
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{offer.code}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{offer.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{offer.description}</p>
                    <p className="text-xs text-slate-400 mt-2">Valid till {offer.validTill}</p>
                    <button className="mt-3 w-full text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition-colors">
                      Apply Coupon
                    </button>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="green" className="mb-3">Why RailwayMS</Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-3">Built for Travelers</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Every feature designed to make your train booking experience smoother, faster, and more rewarding.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08} direction="up">
                <motion.div
                  className="glass p-6 rounded-3xl shadow-soft group"
                  whileHover={{ y: -4 }}
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon size={22} className={item.color} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-12 shadow-medium">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <ScrollReveal key={i} delay={i * 0.1} direction="scale">
                  <div>
                    <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="orange" className="mb-3">Testimonials</Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-3">Loved by Millions</h2>
              <p className="text-slate-500">Real experiences from our community of travelers.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.07}>
                <motion.div className="glass p-6 rounded-3xl shadow-soft" whileHover={{ y: -3 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: `hsl(${i * 60}, 60%, 55%)` }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.role} · {t.city}</div>
                    </div>
                    <div className="ml-auto flex">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">"{t.text}"</p>
                  <div className="mt-4 flex items-center gap-1.5">
                    <Train size={12} className="text-blue-400" />
                    <span className="text-xs text-slate-400">{t.trips} trips booked</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge variant="slate" className="mb-3">FAQ</Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-3">Frequently Asked</h2>
              <p className="text-slate-500">Everything you need to know about RailwayMS.</p>
            </div>
          </ScrollReveal>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <FAQItem q={faq.q} a={faq.a} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="glass rounded-3xl p-10 text-center shadow-medium">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                <Mail size={28} color="white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-3">Stay Updated</h2>
              <p className="text-slate-500 mb-8">
                Get exclusive deals, travel tips, and booking alerts delivered straight to your inbox.
              </p>
              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-green-600 font-semibold"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">✓</div>
                  You're subscribed! Welcome aboard 🎉
                </motion.div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="input-glass flex-1"
                  />
                  <button type="submit" className="btn-primary px-6 whitespace-nowrap">
                    Subscribe
                  </button>
                </form>
              )}
              <p className="text-xs text-slate-400 mt-4">No spam, ever. Unsubscribe anytime.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
