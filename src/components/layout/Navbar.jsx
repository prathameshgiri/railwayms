import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  Train, Search, Bell, User, Menu, X, Moon, Sun,
  ChevronDown, LogOut, LayoutDashboard, Ticket, Settings,
  Wallet, Star, Home, ChevronRight
} from 'lucide-react';
import { toggleDarkMode } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';

const navLinks = [
  { label: 'Search', href: '/search', icon: Search },
  { label: 'My Bookings', href: '/bookings', icon: Ticket },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const { isDarkMode } = useSelector(s => s.ui);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#user-menu-btn')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'py-1 shadow-medium' : 'py-2 md:py-2'}`}
        style={{
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid transparent',
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 md:h-11">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <motion.div
                className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Train size={18} color="white" />
              </motion.div>
              <div className="flex items-baseline">
                <span className="text-base md:text-lg font-bold gradient-text">Railway</span>
                <span className="text-base md:text-lg font-bold text-slate-800">MS</span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
                  }`}
                >
                  <link.icon size={14} />
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* ── Right Side ── */}
            <div className="flex items-center gap-1 md:gap-2">

              {/* Dark mode — hidden on xs */}
              <motion.button
                onClick={() => dispatch(toggleDarkMode())}
                className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              >
                {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
              </motion.button>

              {/* Notifications */}
              {isAuthenticated && (
                <motion.button
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                >
                  <Bell size={17} />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                </motion.button>
              )}

              {/* User Menu (desktop) */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" id="user-menu-btn">
                  <motion.button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                      {user?.avatar || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-semibold text-slate-700 max-w-[80px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-52 glass shadow-large overflow-hidden z-50"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="p-3 border-b border-white/60">
                          <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs font-semibold text-amber-600">{user?.tier} Member</span>
                          </div>
                        </div>
                        <div className="p-1.5">
                          {[
                            { icon: User, label: 'Profile', href: '/profile' },
                            { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
                            { icon: Ticket, label: 'My Bookings', href: '/bookings' },
                            { icon: Wallet, label: `Wallet ₹${user?.walletBalance?.toLocaleString()}`, href: '/profile' },
                            { icon: Settings, label: 'Settings', href: '/profile' },
                          ].map(item => (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <item.icon size={14} />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                          >
                            <LogOut size={14} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/auth/login">
                    <button className="btn-ghost text-sm px-3 py-1.5 min-h-0 h-[34px] flex items-center justify-center rounded-xl">Sign In</button>
                  </Link>
                  <Link to="/auth/signup">
                    <button className="btn-primary text-sm px-3 py-1.5 min-h-0 h-[34px] flex items-center justify-center rounded-xl">Get Started</button>
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <motion.button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={22} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={22} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Full-Screen Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col"
            style={{ background: 'rgba(248,250,252,0.98)', backdropFilter: 'blur(24px)', paddingTop: '64px' }}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
              {/* User info card */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="glass rounded-2xl p-4 mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                      {user?.avatar || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 truncate">{user?.name}</div>
                      <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-semibold text-amber-600">{user?.tier} Member</span>
                        <span className="text-xs text-slate-400 ml-1">· ₹{user?.walletBalance?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Nav links */}
              {[
                { label: 'Home', href: '/', icon: Home },
                ...navLinks,
                ...(isAuthenticated ? [
                  { label: 'Profile', href: '/profile', icon: User },
                  { label: 'Wallet', href: '/profile', icon: Wallet },
                  { label: 'Settings', href: '/profile', icon: Settings },
                ] : []),
              ].map((link, i) => (
                <motion.div
                  key={link.href + link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all ${
                      location.pathname === link.href
                        ? 'bg-blue-500 text-white shadow-soft'
                        : 'glass text-slate-700 hover:bg-blue-50'
                    }`}
                  >
                    <link.icon size={20} className={location.pathname === link.href ? 'text-white' : 'text-blue-500'} />
                    <span>{link.label}</span>
                    <ChevronRight size={16} className="ml-auto opacity-40" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t border-white/60 space-y-2 safe-bottom">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/auth/login" className="flex-1">
                    <button className="btn-ghost w-full justify-center py-3">Sign In</button>
                  </Link>
                  <Link to="/auth/signup" className="flex-1">
                    <button className="btn-primary w-full justify-center py-3">Get Started</button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
