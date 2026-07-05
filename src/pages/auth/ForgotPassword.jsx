import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Train, Send } from 'lucide-react';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
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
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              {sent ? <Send size={28} color="white" /> : <Train size={28} color="white" />}
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">
              {sent ? 'Check your inbox' : 'Reset Password'}
            </h1>
            <p className="text-slate-500 text-sm">
              {sent
                ? `We sent a reset link to ${email}`
                : 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-glass pl-10"
                  />
                </div>
              </div>
              <motion.button type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 rounded-xl"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : 'Send Reset Link'}
              </motion.button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-3xl">✉️</span>
              </div>
              <p className="text-sm text-slate-500">
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-blue-600 font-semibold">
                  try again
                </button>
              </p>
            </div>
          )}

          <Link to="/auth/login"
            className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
