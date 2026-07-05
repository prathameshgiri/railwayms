import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, Train, GitBranch, Globe } from 'lucide-react';
import { login } from '@/store/slices/authSlice';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match", path: ['confirmPassword'],
});

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Symbol', pass: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score - 1] : 'bg-slate-200'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {checks.map(c => (
            <span key={c.label} className={`text-xs font-medium ${c.pass ? 'text-green-600' : 'text-slate-400'}`}>
              {c.pass ? '✓' : '·'} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-bold ${score >= 3 ? 'text-green-600' : score === 2 ? 'text-yellow-600' : 'text-red-500'}`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [watchedPassword, setWatchedPassword] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    dispatch(login({
      id: 'usr_001', name: data.name, email: data.email,
      phone: data.phone, avatar: data.name.substring(0, 2).toUpperCase(),
      walletBalance: 500, rewardPoints: 100, tier: 'Silver',
      memberSince: new Date().toISOString().split('T')[0],
      profileCompletion: 50, savedPassengers: [],
    }));
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-12">
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="glass rounded-3xl shadow-large p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
              <Train size={28} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">Join millions of smart travelers</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[{ icon: Globe, label: 'Google' }, { icon: GitBranch, label: 'GitHub' }].map(p => (
              <motion.button key={p.label}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-sm font-semibold text-slate-700 hover:bg-white transition-all"
                whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                <p.icon size={16} />{p.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('name')} placeholder="Prathamesh Giri"
                  className={`input-glass pl-10 ${errors.name ? 'border-red-400' : ''}`} />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('email')} type="email" placeholder="you@example.com"
                  className={`input-glass pl-10 ${errors.email ? 'border-red-400' : ''}`} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('phone')} type="tel" placeholder="+91 98765 43210"
                  className={`input-glass pl-10 ${errors.phone ? 'border-red-400' : ''}`} />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('password')} type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  onChange={e => setWatchedPassword(e.target.value)}
                  className={`input-glass pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={watchedPassword} />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('confirmPassword')} type="password" placeholder="••••••••"
                  className={`input-glass pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`} />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <motion.button type="submit" disabled={loading}
              className="btn-secondary w-full justify-center py-3 rounded-xl mt-2"
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : 'Create Free Account'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-600 font-semibold hover:text-blue-800">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
