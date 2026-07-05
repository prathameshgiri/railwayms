import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Train, Sparkles, GitBranch, Globe } from 'lucide-react';
import { login } from '@/store/slices/authSlice';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    if (data.email === 'admin@prathameshgiri.in' && data.password === 'Pass@123') {
      dispatch(login({
        id: 'adm_001', name: 'Prathamesh Giri (Admin)', email: data.email, role: 'admin',
        avatar: 'A', walletBalance: 0, rewardPoints: 0,
        tier: 'Admin', memberSince: '2024-01-01', profileCompletion: 100,
        savedPassengers: [],
      }));
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } else if (data.email === 'p@prathameshgiri.in' && data.password === 'Pass@123') {
      dispatch(login({
        id: 'usr_001', name: 'Prathamesh Giri', email: data.email, role: 'user',
        avatar: 'PG', walletBalance: 2850, rewardPoints: 1240,
        tier: 'Gold', memberSince: '2024-01-15', profileCompletion: 80,
        savedPassengers: [],
      }));
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="glass rounded-3xl shadow-large p-8"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Train size={28} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your RailwayMS account</p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Globe, label: 'Google' },
              { icon: GitBranch, label: 'GitHub' },
            ].map(provider => (
              <motion.button key={provider.label}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white/60 text-sm font-semibold text-slate-700 hover:bg-white hover:border-slate-300 transition-all"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <provider.icon size={16} />
                {provider.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('email')} type="email" placeholder="you@example.com"
                  className={`input-glass pl-10 ${errors.email ? 'border-red-400' : ''}`} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/auth/forgot-password" className="text-xs text-blue-500 hover:text-blue-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className={`input-glass pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <motion.button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 rounded-xl mt-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <><Sparkles size={16} /> Sign In</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-blue-600 font-semibold hover:text-blue-800">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
