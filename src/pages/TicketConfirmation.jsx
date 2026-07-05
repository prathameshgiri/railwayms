import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle, Download, Share2, Mail, Printer, Train,
  ArrowRight, Clock, MapPin, User, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { trains } from '@/data/trains';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function TicketConfirmation() {
  const { selectedTrain, selectedClass, selectedSeats, passengers, bookingReference, searchParams, couponDiscount } = useSelector(s => s.booking);
  const { user } = useSelector(s => s.auth);
  const [copied, setCopied] = useState(false);
  const hasConfetti = useRef(false);

  const train = selectedTrain || trains[0];
  const cls = selectedClass || train.classes[0];
  const pnr = bookingReference?.replace('RMS', '') || '4512367890';
  const totalFare = ((selectedSeats.length || 1) * cls.fare) + 30 + Math.round((selectedSeats.length || 1) * cls.fare * 0.05) - couponDiscount;
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (hasConfetti.current) return;
    hasConfetti.current = true;

    const fire = (particleRatio, opts) => {
      confetti({
        origin: { y: 0.6 },
        particleCount: Math.floor(200 * particleRatio),
        ...opts,
      });
    };

    setTimeout(() => {
      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#2563EB', '#7C3AED'] });
      fire(0.2, { spread: 60, colors: ['#60A5FA', '#A855F7'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#C084FC', '#3B82F6'] });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#EDE9FE', '#DBEAFE'] });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }, 400);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(pnr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('ticket-card');
    window.print();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <AnimatedBackground />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 15 }}
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
          >
            <CheckCircle size={40} color="white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black text-slate-800 mb-2"
          >
            Booking Confirmed! 🎉
          </motion.h1>
          <p className="text-slate-500">Your tickets have been booked successfully. Check your email for details.</p>
        </motion.div>

        {/* Ticket Card */}
        <motion.div
          id="ticket-card"
          className="glass rounded-3xl shadow-large overflow-hidden mb-6"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Ticket Top */}
          <div className="p-6" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563EB, #7C3AED)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Train size={22} color="white" />
                <div>
                  <div className="text-white font-bold text-lg">{train.name}</div>
                  <div className="text-blue-200 text-xs">#{train.number} · {cls.code}</div>
                </div>
              </div>
              <Badge variant="green">Confirmed</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-white text-3xl font-black">{train.from.time}</div>
                <div className="text-blue-200 text-sm font-semibold">{train.from.code}</div>
                <div className="text-blue-200 text-xs">{train.from.name}</div>
              </div>
              <div className="flex-1 flex flex-col items-center px-4">
                <div className="text-blue-200 text-xs mb-1">{train.duration}</div>
                <div className="w-full flex items-center gap-1">
                  <div className="flex-1 h-px bg-white/30" />
                  <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <ArrowRight size={16} className="text-blue-200" />
                  </motion.div>
                  <div className="flex-1 h-px bg-white/30" />
                </div>
                <div className="text-blue-200 text-xs mt-1">{train.distance}</div>
              </div>
              <div className="text-center">
                <div className="text-white text-3xl font-black">{train.to.time}</div>
                <div className="text-blue-200 text-sm font-semibold">{train.to.code}</div>
                <div className="text-blue-200 text-xs">{train.to.name}</div>
              </div>
            </div>
          </div>

          {/* Ticket perforation */}
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full -ml-3 bg-gradient-to-br from-blue-50 to-indigo-50" style={{ background: 'linear-gradient(135deg, #F8FAFC, #EEF2FF)' }} />
            <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
            <div className="w-6 h-6 rounded-full -mr-3 bg-gradient-to-br from-blue-50 to-indigo-50" style={{ background: 'linear-gradient(135deg, #F8FAFC, #EEF2FF)' }} />
          </div>

          {/* Ticket Bottom */}
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Calendar size={11} /> Date</div>
                <div className="text-sm font-bold text-slate-800">{searchParams.date || today}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">PNR Number</div>
                <button onClick={handleCopy}
                  className="text-sm font-bold font-mono text-blue-600 hover:text-blue-800">
                  {pnr}{copied ? ' ✓' : ''}
                </button>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Class</div>
                <div className="text-sm font-bold text-slate-800">{cls.code} — {cls.name}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Total Fare</div>
                <div className="text-sm font-bold gradient-text">₹{totalFare.toLocaleString()}</div>
              </div>
            </div>

            {/* Passengers */}
            {(passengers?.length > 0 ? passengers : [{ name: user?.name || 'Passenger 1', gender: 'Male', age: '25' }]).map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                  {(p.name || 'P').charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.gender} · Age {p.age || '–'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">
                    Seat {selectedSeats[i]?.number || (i + 1)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {selectedSeats[i]?.berth || 'Auto'}
                  </div>
                </div>
              </div>
            ))}

            {/* QR */}
            <div className="flex items-center justify-center mt-4">
              <div className="text-center">
                <div className="bg-white p-3 rounded-2xl inline-block shadow-soft">
                  <QRCodeSVG
                    value={`RAILWAYMS|PNR:${pnr}|TRAIN:${train.number}|${train.from.code}-${train.to.code}`}
                    size={100}
                    level="H"
                    fgColor="#1e293b"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Scan at station gate</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { icon: Download, label: 'Download PDF', onClick: handleDownloadPDF, variant: 'primary' },
            { icon: Share2, label: 'Share Ticket', onClick: () => {}, variant: 'ghost' },
            { icon: Mail, label: 'Email Ticket', onClick: () => {}, variant: 'ghost' },
            { icon: Printer, label: 'Print', onClick: () => window.print(), variant: 'ghost' },
          ].map(action => (
            <motion.button
              key={action.label}
              onClick={action.onClick}
              className={`${action.variant === 'primary' ? 'btn-primary' : 'btn-ghost'} flex items-center gap-2 px-5 py-2.5 text-sm`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <action.icon size={15} />
              {action.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Navigate */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/bookings">
            <Button variant="ghost">View My Bookings</Button>
          </Link>
          <Link to="/">
            <Button variant="primary">Book Another Ticket</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
