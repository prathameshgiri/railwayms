import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  User, Mail, Phone, Edit3, Save, Shield, Wallet,
  Star, Train, Award, Bell, ChevronRight, Plus, Trash2
} from 'lucide-react';
import { updateProfile } from '@/store/slices/authSlice';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Button from '@/components/ui/Button';

const walletTransactions = [
  { id: 1, type: 'credit', label: 'Refund — Karnataka Express', amount: 545, date: '2026-06-10' },
  { id: 2, type: 'debit', label: 'Booking #RMS2024002', amount: -5520, date: '2026-07-03' },
  { id: 3, type: 'credit', label: 'Cashback — UPI10 Offer', amount: 200, date: '2026-06-20' },
  { id: 4, type: 'credit', label: 'Reward Points Redemption', amount: 300, date: '2026-05-15' },
];

const rewardHistory = [
  { label: 'Rajdhani Express Booking', points: 268, date: '2026-07-01', type: 'earn' },
  { label: 'Karnataka Express Booking', points: 68, date: '2026-06-05', type: 'earn' },
  { label: 'Redeemed for Discount', points: -300, date: '2026-05-15', type: 'redeem' },
  { label: 'Shatabdi Express Booking', points: 112, date: '2026-06-15', type: 'earn' },
];

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    dispatch(updateProfile(form));
    setEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'rewards', label: 'Rewards', icon: Star },
    { id: 'passengers', label: 'Saved Passengers', icon: Train },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const profileCompletion = user?.profileCompletion || 80;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <AnimatedBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Profile Header */}
        <ScrollReveal>
          <div className="glass rounded-3xl p-6 mb-6 shadow-soft">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-medium"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                  {user?.avatar || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-800">{user?.name}</h1>
                  <Badge variant="gold">
                    <Star size={10} className="mr-0.5 fill-amber-500" />
                    {user?.tier} Member
                  </Badge>
                </div>
                <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
                <p className="text-slate-400 text-xs mt-0.5">Member since {user?.memberSince}</p>

                {/* Profile Completion */}
                <div className="mt-3 max-w-xs">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Profile Completion</span>
                    <span className="font-bold text-blue-600">{profileCompletion}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-blue-50 rounded-2xl p-3">
                  <div className="text-xl font-black gradient-text">{user?.rewardPoints?.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Reward Points</div>
                </div>
                <div className="bg-green-50 rounded-2xl p-3">
                  <div className="text-xl font-black text-green-600">₹{user?.walletBalance?.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Wallet Balance</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="glass rounded-3xl p-3 shadow-soft">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all mb-1 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── Profile Tab ── */}
              {activeTab === 'profile' && (
                <div className="glass rounded-3xl p-6 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-slate-800 text-xl">Personal Information</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800">
                        <Edit3 size={14} /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(false)} className="text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                        <button onClick={handleSave} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800">
                          <Save size={14} /> Save
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Full Name', key: 'name', icon: User, type: 'text' },
                      { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
                      { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
                        <div className="relative">
                          <field.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type={field.type}
                            value={form[field.key]}
                            onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))}
                            disabled={!editing}
                            className={`input-glass pl-10 ${!editing ? 'bg-slate-50 cursor-default' : ''}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Wallet Tab ── */}
              {activeTab === 'wallet' && (
                <div className="space-y-4">
                  <div className="glass rounded-3xl p-6 shadow-soft"
                    style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Current Balance</div>
                        <div className="text-4xl font-black gradient-text">₹{user?.walletBalance?.toLocaleString()}</div>
                      </div>
                      <button className="btn-primary text-sm px-4 py-2">Add Money</button>
                    </div>
                  </div>
                  <div className="glass rounded-3xl p-6 shadow-soft">
                    <h3 className="font-bold text-slate-800 mb-4">Transaction History</h3>
                    <div className="space-y-3">
                      {walletTransactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{t.label}</div>
                            <div className="text-xs text-slate-400">{t.date}</div>
                          </div>
                          <div className={`font-bold text-sm ${t.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Rewards Tab ── */}
              {activeTab === 'rewards' && (
                <div className="space-y-4">
                  <div className="glass rounded-3xl p-6 shadow-soft"
                    style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <Award size={28} className="text-amber-500" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Total Points</div>
                        <div className="text-4xl font-black text-amber-600">{user?.rewardPoints?.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">≈ ₹{Math.floor((user?.rewardPoints || 0) / 10)} redeemable</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Platinum: 2,000 pts needed</span>
                        <span>{user?.rewardPoints}/2000</span>
                      </div>
                      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-amber-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(((user?.rewardPoints || 0) / 2000) * 100, 100)}%` }}
                          transition={{ duration: 1.2, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="glass rounded-3xl p-6 shadow-soft">
                    <h3 className="font-bold text-slate-800 mb-4">Points History</h3>
                    <div className="space-y-3">
                      {rewardHistory.map((r, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{r.label}</div>
                            <div className="text-xs text-slate-400">{r.date}</div>
                          </div>
                          <div className={`font-bold text-sm ${r.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {r.points > 0 ? '+' : ''}{r.points} pts
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Saved Passengers ── */}
              {activeTab === 'passengers' && (
                <div className="glass rounded-3xl p-6 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-slate-800 text-xl">Saved Passengers</h2>
                    <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800">
                      <Plus size={14} /> Add Passenger
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(user?.savedPassengers || []).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: `hsl(${i * 80}, 60%, 55%)` }}>
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{p.name}</div>
                          <div className="text-xs text-slate-400">Age {p.age} · {p.gender} · Berth: {p.berth}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors">
                            <Edit3 size={14} className="text-blue-500" />
                          </button>
                          <button className="p-1.5 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Security ── */}
              {activeTab === 'security' && (
                <div className="glass rounded-3xl p-6 shadow-soft space-y-5">
                  <h2 className="font-bold text-slate-800 text-xl mb-6">Security Settings</h2>
                  {[
                    { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security via OTP', enabled: false },
                    { label: 'Login Notifications', desc: 'Get alerted when someone signs into your account', enabled: true },
                    { label: 'Booking Alerts via SMS', desc: 'Receive SMS alerts for all booking activities', enabled: true },
                    { label: 'Email Notifications', desc: 'Receive email updates for offers and bookings', enabled: true },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{setting.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{setting.desc}</div>
                      </div>
                      <button
                        className={`relative w-11 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-blue-500' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${setting.enabled ? 'left-5.5' : 'left-0.5'}`}
                          style={{ left: setting.enabled ? '22px' : '2px' }}
                        />
                      </button>
                    </div>
                  ))}
                  <div className="pt-2">
                    <button className="btn-ghost text-sm w-full justify-center py-2.5">
                      Change Password
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
