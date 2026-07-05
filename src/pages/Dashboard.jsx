import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  Train, Wallet, Star, Bell, TrendingUp, Calendar,
  ArrowRight, Plus, Search, ChevronRight, Clock, MapPin,
  BarChart3, PieChart
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { bookings } from '@/data/bookings';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Badge from '@/components/ui/Badge';

const spendData = [
  { month: 'Jan', amount: 1200 }, { month: 'Feb', amount: 2800 }, { month: 'Mar', amount: 1600 },
  { month: 'Apr', amount: 3400 }, { month: 'May', amount: 2100 }, { month: 'Jun', amount: 4200 },
  { month: 'Jul', amount: 2680 },
];

const classData = [
  { name: '2A', value: 40, color: '#2563EB' },
  { name: '3A', value: 35, color: '#7C3AED' },
  { name: 'SL', value: 15, color: '#10B981' },
  { name: 'CC', value: 10, color: '#F59E0B' },
];


const notifications = [
  { id: 1, type: 'train', msg: 'Your Rajdhani Express departs in 3 days', time: '2h ago', unread: true },
  { id: 2, type: 'offer', msg: 'New offer: WEEKEND15 — 15% off weekend travel', time: '1d ago', unread: true },
  { id: 3, type: 'refund', msg: 'Refund of ₹545 processed to your wallet', time: '3d ago', unread: false },
  { id: 4, type: 'reward', msg: 'You earned 268 reward points on your last booking', time: '5d ago', unread: false },
];

function StatCard({ icon: Icon, label, value, sub, gradient, delay }) {
  return (
    <ScrollReveal delay={delay} direction="up">
      <motion.div
        className="glass rounded-3xl p-5 shadow-soft relative overflow-hidden"
        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-slate-500 mb-1">{label}</div>
            <div className={`text-2xl font-black`} style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {value}
            </div>
            {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: gradient.replace('linear-gradient', 'linear-gradient') + '22', opacity: 0.8 }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(37,99,235,0.1)' }}>
              <Icon size={22} className="text-blue-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export default function Dashboard() {
  const { user } = useSelector(s => s.auth);
  const { pastBookings } = useSelector(s => s.booking);
  const [pnr, setPnr] = useState('');
  
  const upcomingTrips = pastBookings.length > 0 ? pastBookings : bookings.filter(b => b.status === 'Confirmed');

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Welcome Banner */}
        <ScrollReveal>
          <div className="glass rounded-3xl p-6 mb-6 shadow-soft overflow-hidden relative">
            <div className="absolute right-0 top-0 w-48 h-full opacity-10"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} />
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Welcome back 👋</div>
                <h1 className="text-2xl font-bold text-slate-800">{user?.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="gold"><Star size={10} className="mr-0.5 fill-amber-500" /> {user?.tier} Member</Badge>
                  <span className="text-xs text-slate-400">{user?.rewardPoints?.toLocaleString()} pts</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/search">
                  <button className="btn-primary text-sm px-4 py-2.5"><Search size={15} /> Search Trains</button>
                </Link>
                <Link to="/bookings">
                  <button className="btn-ghost text-sm px-4 py-2.5"><Train size={15} /> My Trips</button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Train} label="Total Journeys" value="8" sub="↑ 2 this month"
            gradient="linear-gradient(135deg, #2563EB, #3B82F6)" delay={0} />
          <StatCard icon={Wallet} label="Wallet Balance" value={`₹${user?.walletBalance?.toLocaleString()}`}
            sub="Add money anytime" gradient="linear-gradient(135deg, #10B981, #059669)" delay={0.08} />
          <StatCard icon={Star} label="Reward Points" value={user?.rewardPoints?.toLocaleString()}
            sub="Redeem for discounts" gradient="linear-gradient(135deg, #F59E0B, #D97706)" delay={0.16} />
          <StatCard icon={TrendingUp} label="Total Spent" value="₹9,980"
            sub="Across all bookings" gradient="linear-gradient(135deg, #7C3AED, #A855F7)" delay={0.24} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Trips */}
            <ScrollReveal>
              <div className="glass rounded-3xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Upcoming Trips</h2>
                  <Link to="/bookings" className="text-sm text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1">
                    View all <ChevronRight size={14} />
                  </Link>
                </div>
                {upcomingTrips.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🚂</div>
                    <p className="text-slate-400 text-sm">No upcoming trips</p>
                    <Link to="/search"><button className="btn-primary mt-3 text-sm">Book Now</button></Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingTrips.map((trip, i) => (
                      <motion.div key={trip.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs"
                          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                          🚂
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 text-sm">{trip.train.name}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span>{trip.from.station}</span>
                            <ArrowRight size={10} />
                            <span>{trip.to.station}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-700">{trip.from.date}</div>
                          <div className="text-xs text-slate-400">{trip.from.time}</div>
                          <Badge variant="green" className="mt-1">Confirmed</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Spending Chart */}
            <ScrollReveal>
              <div className="glass rounded-3xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Spending Analytics</h2>
                  <Badge variant="blue">2026</Badge>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={spendData}>
                    <defs>
                      <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      formatter={v => [`₹${v}`, 'Spent']}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2.5} fill="url(#spendGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            {/* Class Distribution */}
            <ScrollReveal>
              <div className="glass rounded-3xl p-6 shadow-soft">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Travel Class Distribution</h2>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={150} height={150}>
                    <RPieChart>
                      <Pie data={classData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                        {classData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    </RPieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {classData.map(c => (
                      <div key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                          <span className="text-sm text-slate-700 font-medium">{c.name}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-600">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* PNR Check */}
            <ScrollReveal direction="left">
              <div className="glass rounded-3xl p-5 shadow-soft">
                <h3 className="font-bold text-slate-800 mb-3">Check PNR Status</h3>
                <div className="space-y-3">
                  <input value={pnr} onChange={e => setPnr(e.target.value)}
                    placeholder="Enter 10-digit PNR"
                    className="input-glass font-mono tracking-wider" />
                  <button className="btn-primary w-full justify-center text-sm py-2.5 rounded-xl">
                    <Search size={14} /> Check Status
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Notifications */}
            <ScrollReveal direction="left" delay={0.1}>
              <div className="glass rounded-3xl p-5 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {notifications.filter(n => n.unread).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${n.unread ? 'bg-blue-50' : 'bg-slate-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.unread ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        <Bell size={14} className={n.unread ? 'text-blue-500' : 'text-slate-400'} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs leading-relaxed ${n.unread ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.msg}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Quick Links */}
            <ScrollReveal direction="left" delay={0.2}>
              <div className="glass rounded-3xl p-5 shadow-soft">
                <h3 className="font-bold text-slate-800 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Book Train Ticket', href: '/search', icon: Train },
                    { label: 'Live Train Status', href: '#', icon: Clock },
                    { label: 'Nearby Stations', href: '#', icon: MapPin },
                    { label: 'Add Money to Wallet', href: '/profile', icon: Wallet },
                  ].map(a => (
                    <Link key={a.label} to={a.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <a.icon size={15} className="text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{a.label}</span>
                      <ChevronRight size={14} className="text-slate-300 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
