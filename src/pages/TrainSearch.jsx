import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search, SlidersHorizontal, Train, Clock, ArrowRight,
  Star, Wifi, Coffee, Zap, Filter, ChevronDown, X, ArrowLeftRight
} from 'lucide-react';
import { trains } from '@/data/trains';
import { setSelectedTrain, setSelectedClass, setSearchParams } from '@/store/slices/bookingSlice';
import { stations } from '@/data/stations';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import { TrainCardSkeleton } from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/animations/ScrollReveal';

const trainTypeColors = {
  Rajdhani: 'blue',
  Shatabdi: 'purple',
  Superfast: 'green',
  Express: 'orange',
};

const amenityIcons = {
  'WiFi': Wifi,
  'Pantry': Coffee,
  'Charging Points': Zap,
};

function TrainCard({ train, onSelect, index }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass rounded-3xl shadow-soft overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={trainTypeColors[train.type] || 'slate'}>{train.type}</Badge>
              <span className="text-xs text-slate-400 font-mono"># {train.number}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{train.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-slate-600">{train.rating}</span>
              <span className="text-xs text-slate-400">({train.reviews.toLocaleString()} reviews)</span>
              <span className="text-xs text-slate-400 ml-2">• {train.onTime}% on time</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 mb-1">Runs on</div>
            <div className="flex gap-0.5">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <span key={d}
                  className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-semibold ${
                    train.daysOfRun.includes(d) ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                  {d[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Journey */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-left">
            <div className="text-2xl font-black text-slate-800">{train.from.time}</div>
            <div className="text-sm font-semibold text-slate-600">{train.from.code}</div>
            <div className="text-xs text-slate-400">{train.from.name}</div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="text-xs text-slate-400 font-medium">{train.duration}</div>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-slate-200" />
              <Train size={14} className="text-blue-500" />
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="text-xs text-slate-400">{train.distance}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-800">{train.to.time}</div>
            <div className="text-sm font-semibold text-slate-600">{train.to.code}</div>
            <div className="text-xs text-slate-400">{train.to.name}</div>
          </div>
        </div>

        {/* Amenities */}
        {train.amenities.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {train.amenities.slice(0, 4).map(a => {
              const Icon = amenityIcons[a];
              return (
                <div key={a} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                  {Icon && <Icon size={11} className="text-blue-400" />}
                  {a}
                </div>
              );
            })}
          </div>
        )}

        {/* Classes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {train.classes.map(cls => (
            <motion.button
              key={cls.code}
              onClick={() => { onSelect(train, cls); navigate('/seat-selection'); }}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                cls.available < 5
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-slate-200 bg-white/50 hover:border-blue-300 hover:bg-blue-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-xs font-bold text-slate-500 mb-1">{cls.code}</div>
              <div className="text-sm font-bold text-slate-800">₹{cls.fare.toLocaleString()}</div>
              <div className={`text-xs font-semibold mt-0.5 ${cls.available < 5 ? 'text-orange-500' : 'text-green-500'}`}>
                {cls.available < 5 ? `${cls.available} left!` : `${cls.available} avail.`}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
        >
          {expanded ? 'Hide' : 'View'} stops
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}><ChevronDown size={14} /></motion.div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="mt-4 pt-4 border-t border-white/60 space-y-3">
                {train.stops.map((stop, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${i === 0 || i === train.stops.length-1 ? 'bg-blue-500' : 'bg-slate-300'}`} />
                      {i < train.stops.length - 1 && <div className="w-px h-8 bg-slate-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold text-slate-800">{stop.station}</span>
                          <span className="text-xs text-slate-400 ml-2">({stop.code})</span>
                        </div>
                        <div className="text-xs text-slate-400">Day {stop.day}</div>
                      </div>
                      <div className="flex gap-3 mt-0.5">
                        <span className="text-xs text-slate-500">Arr: {stop.arrival}</span>
                        <span className="text-xs text-slate-500">Dep: {stop.departure}</span>
                        {stop.distance > 0 && <span className="text-xs text-slate-400">{stop.distance} km</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function TrainSearch() {
  const dispatch = useDispatch();
  const searchParams = useSelector(s => s.booking.searchParams);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState('departure');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    classes: [],
    types: [],
    priceMax: 10000,
    departureRange: 'all',
  });
  const [localSearch, setLocalSearch] = useState({
    from: searchParams.from || 'New Delhi',
    to: searchParams.to || 'Bangalore',
    date: searchParams.date || new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setResults(trains);
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleSelect = (train, cls) => {
    dispatch(setSelectedTrain(train));
    dispatch(setSelectedClass(cls));
  };

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'departure') return a.from.time.localeCompare(b.from.time);
    if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return (a.classes[0]?.fare || 0) - (b.classes[0]?.fare || 0);
    return 0;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <AnimatedBackground />

      {/* Search Bar */}
      <div className="relative z-10 py-6 px-4 border-b border-white/60"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-3 flex-1 glass rounded-2xl p-3">
              <div className="flex-1">
                <div className="text-xs text-slate-400 mb-0.5">FROM</div>
                <input value={localSearch.from} onChange={e => setLocalSearch(f => ({...f, from: e.target.value}))}
                  className="text-sm font-bold text-slate-800 bg-transparent outline-none w-full" />
              </div>
              <button onClick={() => setLocalSearch(f => ({...f, from: f.to, to: f.from}))}
                className="p-1.5 rounded-full hover:bg-blue-50 transition-colors">
                <ArrowLeftRight size={14} className="text-blue-500" />
              </button>
              <div className="flex-1">
                <div className="text-xs text-slate-400 mb-0.5">TO</div>
                <input value={localSearch.to} onChange={e => setLocalSearch(f => ({...f, to: e.target.value}))}
                  className="text-sm font-bold text-slate-800 bg-transparent outline-none w-full" />
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <div className="text-xs text-slate-400 mb-0.5">DATE</div>
                <input type="date" value={localSearch.date}
                  onChange={e => setLocalSearch(f => ({...f, date: e.target.value}))}
                  className="text-sm font-bold text-slate-800 bg-transparent outline-none" />
              </div>
            </div>
            <button onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 1800); }}
              className="btn-primary px-6 py-3 rounded-2xl whitespace-nowrap">
              <Search size={16} /> Search Trains
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {localSearch.from} → {localSearch.to}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isLoading ? 'Searching...' : `${results.length} trains found`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(v => !v)}
              className="btn-ghost px-4 py-2 text-sm flex items-center gap-2">
              <Filter size={14} />
              Filters
            </button>
            <div className="flex items-center gap-2 glass rounded-xl p-1">
              {[
                { key: 'departure', label: 'Departure' },
                { key: 'duration', label: 'Duration' },
                { key: 'rating', label: 'Rating' },
                { key: 'price', label: 'Price' },
              ].map(s => (
                <button key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sortBy === s.key ? 'bg-blue-500 text-white' : 'text-slate-600 hover:text-blue-600'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1 glass rounded-3xl p-5 shadow-soft h-fit"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Train Type</h4>
                    {['Rajdhani', 'Shatabdi', 'Superfast', 'Express'].map(t => (
                      <label key={t} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input type="checkbox" className="rounded accent-blue-500" />
                        <span className="text-sm text-slate-700">{t}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Departure Time</h4>
                    {['00:00–06:00', '06:00–12:00', '12:00–18:00', '18:00–24:00'].map(t => (
                      <label key={t} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input type="checkbox" className="rounded accent-blue-500" />
                        <span className="text-sm text-slate-700">{t}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Max Price: ₹{filters.priceMax.toLocaleString()}</h4>
                    <input type="range" min={100} max={10000} step={100}
                      value={filters.priceMax}
                      onChange={e => setFilters(f => ({...f, priceMax: Number(e.target.value)}))}
                      className="w-full accent-blue-500" />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>₹100</span><span>₹10,000</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Amenities</h4>
                    {['WiFi', 'Pantry', 'Charging Points', 'Meals Included'].map(a => (
                      <label key={a} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input type="checkbox" className="rounded accent-blue-500" />
                        <span className="text-sm text-slate-700">{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4`}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                  <TrainCardSkeleton />
                </motion.div>
              ))
            ) : sorted.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <Train size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-600 mb-2">No trains found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your search filters</p>
              </div>
            ) : (
              sorted.map((train, i) => (
                <TrainCard key={train.id} train={train} index={i} onSelect={handleSelect} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
