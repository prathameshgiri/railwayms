import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Ticket, CreditCard, RotateCcw,
  Tag, Train, MapPin, BarChart3, Bell, FileText, Shield,
  ChevronRight, Menu, X
} from 'lucide-react';

const adminLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Bookings', icon: Ticket, href: '/admin/bookings' },
  { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
  { label: 'Refunds', icon: RotateCcw, href: '/admin/refunds' },
  { label: 'Coupons', icon: Tag, href: '/admin/coupons' },
  { label: 'Trains', icon: Train, href: '/admin/trains' },
  { label: 'Stations', icon: MapPin, href: '/admin/stations' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { label: 'CMS', icon: FileText, href: '/admin/cms' },
  { label: 'Roles & Permissions', icon: Shield, href: '/admin/roles' },
];

export default function AdminSidebar({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen pt-20">
      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25 }}
        className="fixed left-0 top-20 h-[calc(100vh-5rem)] z-30 flex flex-col shadow-medium"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(226,232,240,0.8)' }}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Panel</span>
          )}
          <button onClick={() => setCollapsed(v => !v)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 ml-auto">
            {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-2 overflow-y-auto">
          {adminLinks.map(link => (
            <Link key={link.href} to={link.href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors ${
                  location.pathname === link.href
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                whileHover={{ x: 2 }}
                title={collapsed ? link.label : ''}
              >
                <link.icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{link.label}</span>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: collapsed ? 72 : 240 }}
      >
        {children}
      </main>
    </div>
  );
}
