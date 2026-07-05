import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Train, Download, RotateCcw, X, CheckCircle, Clock, XCircle,
  ChevronRight, MapPin, Calendar, ArrowRight
} from 'lucide-react';
import { bookings } from '@/data/bookings';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/animations/ScrollReveal';

const statusConfig = {
  Confirmed: { color: 'green', icon: CheckCircle, label: 'Confirmed' },
  Completed: { color: 'blue', icon: CheckCircle, label: 'Completed' },
  Cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' },
};

function BookingCard({ booking, index }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass rounded-3xl shadow-soft overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Train size={16} className="text-blue-500" />
              <span className="font-bold text-slate-800">{booking.train.name}</span>
              <span className="text-xs text-slate-400 font-mono">#{booking.train.number}</span>
            </div>
            <div className="text-xs text-slate-400">PNR: <span className="font-mono text-slate-600 font-semibold">{booking.pnr}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={status.color}>
              <StatusIcon size={11} className="mr-1" />
              {status.label}
            </Badge>
            <Badge variant="slate">{booking.class}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-left">
            <div className="text-xl font-black text-slate-800">{booking.from.time}</div>
            <div className="text-sm font-semibold text-slate-600">{booking.from.code}</div>
            <div className="text-xs text-slate-400">{booking.from.date}</div>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="text-center">
              <div className="text-xs text-slate-400">{booking.duration}</div>
              <div className="text-xs text-slate-300 mt-0.5">→</div>
            </div>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-slate-800">{booking.to.time}</div>
            <div className="text-sm font-semibold text-slate-600">{booking.to.code}</div>
            <div className="text-xs text-slate-400">{booking.to.date}</div>
          </div>
        </div>

        {/* Passengers */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {booking.passengers.map((p, i) => (
            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
              {p.name} · {p.seatNo}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="font-bold text-lg gradient-text">₹{booking.fare.toLocaleString()}</div>
          <div className="flex items-center gap-2">
            {booking.status === 'Confirmed' && (
              <>
                <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-blue-50 rounded-lg transition-colors">
                  <Download size={12} /> Download
                </button>
                <button className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-800 px-3 py-1.5 bg-orange-50 rounded-lg transition-colors">
                  <RotateCcw size={12} /> Reschedule
                </button>
                <button className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 bg-red-50 rounded-lg transition-colors">
                  <X size={12} /> Cancel
                </button>
              </>
            )}
            {booking.status === 'Completed' && (
              <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 px-3 py-1.5 bg-blue-50 rounded-lg transition-colors">
                <Download size={12} /> Download
              </button>
            )}
            {booking.status === 'Cancelled' && (
              <div className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-lg">
                Refund: ₹{booking.refundAmount} — {booking.refundStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyBookings() {
  const { pastBookings } = useSelector(s => s.booking);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const tabs = ['upcoming', 'completed', 'cancelled'];

  // Fallback to static bookings if no past bookings yet
  const allBookings = pastBookings.length > 0 ? pastBookings : bookings;

  const filtered = allBookings.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'Confirmed';
    if (activeTab === 'completed') return b.status === 'Completed';
    if (activeTab === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <AnimatedBackground />
      <div className="relative z-10 max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-1">My Bookings</h1>
            <p className="text-slate-500">Track and manage all your train journeys</p>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal>
          <div className="glass rounded-2xl p-1.5 flex mb-6 shadow-soft">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white shadow-soft text-blue-600'
                    : 'text-slate-500 hover:text-blue-500'
                }`}
              >
                {tab}
                <span className="ml-1.5 text-xs">
                  ({bookings.filter(b =>
                    tab === 'upcoming' ? b.status === 'Confirmed' :
                    tab === 'completed' ? b.status === 'Completed' :
                    b.status === 'Cancelled'
                  ).length})
                </span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filtered.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="text-5xl mb-4">🎫</div>
                <h3 className="text-lg font-bold text-slate-600 mb-2">No {activeTab} bookings</h3>
                <p className="text-slate-400 text-sm mb-6">Your {activeTab} journeys will appear here</p>
                <Link to="/search">
                  <button className="btn-primary">Book a Train</button>
                </Link>
              </div>
            ) : (
              filtered.map((booking, i) => (
                <BookingCard key={booking.id} booking={booking} index={i} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
