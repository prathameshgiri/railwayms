import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  CreditCard, Smartphone, Building2, Wallet, Clock,
  Tag, Shield, ChevronRight, Check, Loader2, ArrowRight
} from 'lucide-react';
import { setStep, setPaymentMethod, applyCoupon, setBookingReference, addPastBooking } from '@/store/slices/bookingSlice';
import { trains } from '@/data/trains';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Button from '@/components/ui/Button';

const paymentMethods = [
  { id: 'upi', icon: Smartphone, label: 'UPI', desc: 'Google Pay, PhonePe, Paytm & more' },
  { id: 'card', icon: CreditCard, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay' },
  { id: 'netbanking', icon: Building2, label: 'Net Banking', desc: '50+ supported banks' },
  { id: 'wallet', icon: Wallet, label: 'RailwayMS Wallet', desc: 'Balance: ₹2,850' },
  { id: 'paylater', icon: Clock, label: 'Pay Later', desc: 'Book now, pay in 14 days' },
];

const VALID_COUPONS = {
  RAIL20: { discount: 500, label: '20% off — max ₹500' },
  FIRST100: { discount: 100, label: '₹100 flat off' },
  UPI10: { discount: 200, label: '10% cashback via UPI' },
};

export default function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTrain, selectedClass, selectedSeats, paymentMethod, couponDiscount, passengers, searchParams } = useSelector(s => s.booking);
  const { user } = useSelector(s => s.auth);

  const train = selectedTrain || trains[0];
  const cls = selectedClass || train.classes[0];

  const [activeMethod, setActiveMethod] = useState('upi');
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // null | 'valid' | 'invalid'
  const [couponMsg, setCouponMsg] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');

  const baseFare = (selectedSeats.length || 1) * cls.fare;
  const convenience = 30;
  const gst = Math.round(baseFare * 0.05);
  const discount = couponDiscount;
  const total = baseFare + convenience + gst - discount;

  const applyCouponCode = () => {
    const c = VALID_COUPONS[couponInput.toUpperCase()];
    if (c) {
      dispatch(applyCoupon({ code: couponInput.toUpperCase(), discount: c.discount }));
      setCouponStatus('valid');
      setCouponMsg(`✓ ${c.label} applied!`);
    } else {
      setCouponStatus('invalid');
      setCouponMsg('Invalid coupon code. Try RAIL20 or FIRST100');
    }
  };

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    const ref = `RMS${Date.now()}`;
    dispatch(setBookingReference(ref));
    dispatch(addPastBooking({
      id: ref,
      pnr: ref.replace('RMS', ''),
      train: { name: train.name, number: train.number },
      from: { code: searchParams.from?.substring(0,4).toUpperCase() || 'SRC', name: searchParams.from || train.from, date: searchParams.date || new Date().toISOString().split('T')[0], time: train.departureTime || '10:00' },
      to: { code: searchParams.to?.substring(0,4).toUpperCase() || 'DST', name: searchParams.to || train.to, date: searchParams.date || new Date().toISOString().split('T')[0], time: train.arrivalTime || '18:00' },
      duration: train.duration || '8h 00m',
      class: cls.name,
      passengers: selectedSeats.length || 1,
      status: 'Confirmed',
      amount: total,
    }));
    dispatch(setStep(5));
    setProcessing(false);
    navigate('/confirmation');
  };

  const methodHandles = {
    upi: (
      <div className="mt-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">UPI ID</label>
        <input value={upiId} onChange={e => setUpiId(e.target.value)}
          placeholder="yourname@upi" className="input-glass" />
        <div className="flex flex-wrap gap-2 mt-3">
          {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
            <button key={app} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors text-slate-600">
              {app}
            </button>
          ))}
        </div>
      </div>
    ),
    card: (
      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Card Number</label>
          <input value={cardDetails.number} onChange={e => setCardDetails(p => ({...p, number: e.target.value}))}
            placeholder="1234 5678 9012 3456" maxLength={19} className="input-glass font-mono" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expiry</label>
            <input value={cardDetails.expiry} onChange={e => setCardDetails(p => ({...p, expiry: e.target.value}))}
              placeholder="MM/YY" maxLength={5} className="input-glass" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">CVV</label>
            <input value={cardDetails.cvv} onChange={e => setCardDetails(p => ({...p, cvv: e.target.value}))}
              placeholder="•••" maxLength={4} type="password" className="input-glass" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name on Card</label>
          <input value={cardDetails.name} onChange={e => setCardDetails(p => ({...p, name: e.target.value}))}
            placeholder="PRATHAMESH GIRI" className="input-glass uppercase" />
        </div>
      </div>
    ),
    netbanking: (
      <div className="mt-4">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Select Your Bank</label>
        <div className="grid grid-cols-3 gap-2">
          {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(bank => (
            <button key={bank}
              className="p-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all">
              {bank}
            </button>
          ))}
        </div>
      </div>
    ),
    wallet: (
      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-700">RailwayMS Wallet Balance</span>
          <span className="font-bold text-blue-700 text-lg">₹{user?.walletBalance?.toLocaleString()}</span>
        </div>
        {user?.walletBalance < total && (
          <p className="text-xs text-orange-500 mt-2">Insufficient balance. ₹{(total - (user?.walletBalance || 0)).toLocaleString()} more needed.</p>
        )}
      </div>
    ),
    paylater: (
      <div className="mt-4 p-4 bg-purple-50 rounded-xl">
        <p className="text-sm text-slate-700">
          Book now and pay ₹{total.toLocaleString()} within 14 days. 0% interest if paid on time.
        </p>
      </div>
    ),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <AnimatedBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Complete Payment</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment Panel */}
          <div className="lg:col-span-3 space-y-4">
            <ScrollReveal>
              <div className="glass rounded-3xl p-6 shadow-soft">
                <h3 className="font-bold text-slate-800 mb-4">Payment Method</h3>
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <motion.button
                      key={method.id}
                      onClick={() => { setActiveMethod(method.id); dispatch(setPaymentMethod(method.id)); }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        activeMethod === method.id
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-slate-200 bg-white/50 hover:border-blue-200'
                      }`}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activeMethod === method.id ? 'bg-blue-500' : 'bg-slate-100'
                      }`}>
                        <method.icon size={18} className={activeMethod === method.id ? 'text-white' : 'text-slate-600'} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 text-sm">{method.label}</div>
                        <div className="text-xs text-slate-400">{method.desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        activeMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                      }`}>
                        {activeMethod === method.id && <Check size={10} className="text-white" />}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Dynamic method detail */}
                <AnimatePresence mode="wait">
                  <motion.div key={activeMethod}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}>
                    {methodHandles[activeMethod]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollReveal>

            {/* Coupon */}
            <ScrollReveal>
              <div className="glass rounded-3xl p-6 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={18} className="text-blue-500" />
                  <h3 className="font-bold text-slate-800">Coupon Code</h3>
                </div>
                <div className="flex gap-3">
                  <input
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponStatus(null); }}
                    placeholder="Enter coupon code (e.g. RAIL20)"
                    className="input-glass flex-1 font-mono tracking-wider"
                    disabled={couponStatus === 'valid'}
                  />
                  <button onClick={applyCouponCode} disabled={couponStatus === 'valid' || !couponInput}
                    className="btn-primary px-4 whitespace-nowrap disabled:opacity-50">
                    Apply
                  </button>
                </div>
                {couponStatus && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className={`text-sm font-medium mt-2 ${couponStatus === 'valid' ? 'text-green-600' : 'text-red-500'}`}>
                    {couponMsg}
                  </motion.p>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="left">
              <div className="glass rounded-3xl p-6 shadow-soft sticky top-24">
                <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>

                {/* Journey */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                      <span className="text-white text-xs">🚂</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{train.name}</div>
                      <div className="text-xs text-slate-400">#{train.number} · {cls.code}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div>
                      <div className="font-bold text-slate-800">{train.from.time}</div>
                      <div className="text-xs text-slate-400">{train.from.code}</div>
                    </div>
                    <div className="text-xs text-slate-400">{train.duration}</div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">{train.to.time}</div>
                      <div className="text-xs text-slate-400">{train.to.code}</div>
                    </div>
                  </div>
                </div>

                {/* Passengers */}
                <div className="text-xs text-slate-500 mb-4">
                  {(selectedSeats.length || 1)} Passenger{selectedSeats.length > 1 ? 's' : ''} · Seats:{' '}
                  {selectedSeats.map(s => s.number).join(', ') || 'Auto-assigned'}
                </div>

                {/* Fare Breakdown */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Fare ({selectedSeats.length || 1}×)</span>
                    <span className="font-semibold">₹{baseFare.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Convenience Fee</span>
                    <span className="font-semibold">₹{convenience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GST (5%)</span>
                    <span className="font-semibold">₹{gst.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span className="font-semibold">−₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-800 text-base border-t pt-2">
                    <span>Total Amount</span>
                    <span className="gradient-text text-lg">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Pay Button */}
                <motion.button
                  onClick={handlePay}
                  disabled={processing}
                  className="btn-primary w-full justify-center py-4 rounded-2xl mt-6 text-base animate-pulse-glow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    <><Shield size={18} /> Pay ₹{total.toLocaleString()} Securely</>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <Shield size={12} className="text-green-500" />
                  <span className="text-xs text-slate-400">256-bit SSL encrypted · PCI DSS compliant</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
