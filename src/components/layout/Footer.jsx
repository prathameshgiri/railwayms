import { Link } from 'react-router-dom';
import { Train, Mail, Phone, MapPin, Globe, MessageSquare, BookOpen, Code } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Services: [
    { label: 'Book Ticket', href: '/search' },
    { label: 'PNR Status', href: '#' },
    { label: 'Live Train', href: '#' },
    { label: 'Fare Calculator', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Refund Policy', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/60"
      style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                <Train size={22} color="white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">Railway</span>
                <span className="text-xl font-bold text-slate-800">MS</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
              India's most premium railway ticket booking platform. Travel smarter, travel better.
            </p>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2"><Mail size={14} className="text-blue-500" /><span>support@railwayms.in</span></div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-blue-500" /><span>1800-123-4567 (Toll Free)</span></div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /><span>New Delhi, India 110001</span></div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Globe, MessageSquare, BookOpen, Code].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors shadow-soft">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-slate-800 mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">© 2026 RailwayMS. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
