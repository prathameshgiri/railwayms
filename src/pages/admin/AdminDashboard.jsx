import { motion } from 'framer-motion';
import { Users, Ticket, CreditCard, TrendingUp, ArrowUp, BarChart3, Train } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Badge from '@/components/ui/Badge';
import { bookings } from '@/data/bookings';
import { trains } from '@/data/trains';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

const revenueData = [
  { month: 'Jan', revenue: 125000 }, { month: 'Feb', revenue: 198000 },
  { month: 'Mar', revenue: 162000 }, { month: 'Apr', revenue: 245000 },
  { month: 'May', revenue: 189000 }, { month: 'Jun', revenue: 312000 },
  { month: 'Jul', revenue: 267000 },
];

const bookingsData = [
  { day: 'Mon', bookings: 124 }, { day: 'Tue', bookings: 198 },
  { day: 'Wed', bookings: 156 }, { day: 'Thu', bookings: 245 },
  { day: 'Fri', bookings: 312 }, { day: 'Sat', bookings: 387 },
  { day: 'Sun', bookings: 289 },
];

const kpiCards = [
  { label: 'Total Users', value: '8,42,156', change: '+12.4%', icon: Users, color: 'blue' },
  { label: 'Bookings Today', value: '3,847', change: '+8.2%', icon: Ticket, color: 'purple' },
  { label: 'Revenue This Month', value: '₹26.7L', change: '+15.6%', icon: CreditCard, color: 'green' },
  { label: 'Avg Booking Value', value: '₹2,340', change: '+3.1%', icon: TrendingUp, color: 'orange' },
];

const recentUsers = [
  { name: 'Prathamesh Giri', email: 'prathamesh@example.com', joined: '2026-07-04', bookings: 8, status: 'Active' },
  { name: 'Rahul Sharma', email: 'rahul@example.com', joined: '2026-07-03', bookings: 3, status: 'Active' },
  { name: 'Kavita Reddy', email: 'kavita@example.com', joined: '2026-07-02', bookings: 12, status: 'Active' },
  { name: 'Arjun Mehta', email: 'arjun@example.com', joined: '2026-07-01', bookings: 5, status: 'Suspended' },
];

export default function AdminDashboard() {
  return (
    <AdminSidebar>
      <div className="p-6 relative">
        <AnimatedBackground />
        <div className="relative z-10">
          <ScrollReveal>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm">Welcome back, Admin. Here's what's happening today.</p>
            </div>
          </ScrollReveal>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {kpiCards.map((kpi, i) => (
              <ScrollReveal key={kpi.label} delay={i * 0.07}>
                <motion.div
                  className="glass rounded-2xl p-5 shadow-soft"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${kpi.color}-50`}>
                      <kpi.icon size={20} className={`text-${kpi.color}-500`} />
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <ArrowUp size={10} />{kpi.change}
                    </span>
                  </div>
                  <div className="text-xl font-black text-slate-800">{kpi.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{kpi.label}</div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <ScrollReveal>
              <div className="glass rounded-3xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800">Monthly Revenue</h2>
                  <Badge variant="green">2026</Badge>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      formatter={v => [`₹${(v/1000).toFixed(1)}k`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            {/* Bookings Chart */}
            <ScrollReveal delay={0.1}>
              <div className="glass rounded-3xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800">Daily Bookings</h2>
                  <Badge variant="blue">This Week</Badge>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="bookings" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>
          </div>

          {/* Recent Users Table */}
          <ScrollReveal>
            <div className="glass rounded-3xl p-6 shadow-soft mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800">Recent Users</h2>
                <button className="text-sm text-blue-500 font-semibold hover:text-blue-700">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Joined</th>
                      <th className="pb-3">Bookings</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: `hsl(${i * 80}, 60%, 55%)` }}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                              <div className="text-xs text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-slate-600">{user.joined}</td>
                        <td className="py-3 text-sm font-semibold text-slate-700">{user.bookings}</td>
                        <td className="py-3">
                          <Badge variant={user.status === 'Active' ? 'green' : 'red'}>{user.status}</Badge>
                        </td>
                        <td className="py-3">
                          <button className="text-xs text-blue-500 hover:text-blue-700 font-semibold">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>

          {/* Recent Bookings */}
          <ScrollReveal>
            <div className="glass rounded-3xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800">Recent Bookings</h2>
                <button className="text-sm text-blue-500 font-semibold hover:text-blue-700">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                      <th className="pb-3">Booking ID</th>
                      <th className="pb-3">Train</th>
                      <th className="pb-3">Route</th>
                      <th className="pb-3">Fare</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 text-sm font-mono text-slate-600">{b.id}</td>
                        <td className="py-3 text-sm font-semibold text-slate-800">{b.train.name}</td>
                        <td className="py-3 text-sm text-slate-600">{b.from.code} → {b.to.code}</td>
                        <td className="py-3 text-sm font-bold gradient-text">₹{b.fare.toLocaleString()}</td>
                        <td className="py-3">
                          <Badge variant={b.status === 'Confirmed' ? 'green' : b.status === 'Completed' ? 'blue' : 'red'}>
                            {b.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </AdminSidebar>
  );
}
