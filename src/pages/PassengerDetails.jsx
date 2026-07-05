import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Plus, Trash2, Phone, Mail, Shield, ChevronDown, ArrowRight } from 'lucide-react';
import { setPassengers, setContactDetails, setStep } from '@/store/slices/bookingSlice';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Button from '@/components/ui/Button';

const passengerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.string().min(1).refine(v => Number(v) >= 1 && Number(v) <= 120, 'Age must be 1–120'),
  gender: z.enum(['Male', 'Female', 'Other']),
  berth: z.enum(['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'No Preference']),
  meal: z.enum(['Veg', 'Non-Veg', 'Jain', 'No Preference']),
});

const formSchema = z.object({
  passengers: z.array(passengerSchema).min(1),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  emergencyName: z.string().min(2),
  emergencyPhone: z.string().min(10),
  insurance: z.boolean(),
});

export default function PassengerDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchParams, selectedSeats, selectedTrain, selectedClass } = useSelector(s => s.booking);
  const { user } = useSelector(s => s.auth);
  const [loading, setLoading] = useState(false);

  const count = searchParams.passengers || 1;

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengers: Array.from({ length: count }, () => ({
        name: '', age: '', gender: 'Male', berth: 'No Preference', meal: 'No Preference',
      })),
      email: user?.email || '',
      phone: user?.phone || '',
      emergencyName: '',
      emergencyPhone: '',
      insurance: false,
    },
  });

  const { fields } = useFieldArray({ control, name: 'passengers' });

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    dispatch(setPassengers(data.passengers));
    dispatch(setContactDetails({ email: data.email, phone: data.phone }));
    dispatch(setStep(4));
    setLoading(false);
    navigate('/payment');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <AnimatedBackground />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Progress Steps */}
        <ScrollReveal>
          <div className="glass rounded-3xl p-5 mb-6 shadow-soft">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {['Search', 'Seat Selection', 'Passenger Details', 'Payment', 'Confirmation'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    i < 2 ? 'bg-green-100 text-green-700' :
                    i === 2 ? 'bg-blue-500 text-white' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {i < 2 ? '✓' : i + 1}. {step}
                  </div>
                  {i < 4 && <ArrowRight size={12} className="text-slate-300" />}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Passenger Forms */}
          {fields.map((field, i) => (
            <ScrollReveal key={field.id} delay={i * 0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-6 mb-4 shadow-soft"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Passenger {i + 1}</h3>
                    {selectedSeats[i] && (
                      <p className="text-xs text-slate-400">Seat {selectedSeats[i].number} · Berth {selectedSeats[i].berth}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input {...register(`passengers.${i}.name`)} placeholder="Enter full name"
                        className={`input-glass pl-10 ${errors.passengers?.[i]?.name ? 'border-red-400' : ''}`} />
                    </div>
                    {errors.passengers?.[i]?.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.passengers[i].name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                    <input {...register(`passengers.${i}.age`)} type="number" min="1" max="120"
                      placeholder="Age"
                      className={`input-glass ${errors.passengers?.[i]?.age ? 'border-red-400' : ''}`} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                    <select {...register(`passengers.${i}.gender`)} className="input-glass">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Berth Preference</label>
                    <select {...register(`passengers.${i}.berth`)} className="input-glass">
                      {['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'No Preference'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Meal Preference</label>
                    <select {...register(`passengers.${i}.meal`)} className="input-glass">
                      {['Veg', 'Non-Veg', 'Jain', 'No Preference'].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}

          {/* Contact Details */}
          <ScrollReveal>
            <div className="glass rounded-3xl p-6 mb-4 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Phone size={18} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800">Contact Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input {...register('email')} type="email" className={`input-glass pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input {...register('phone')} type="tel" className={`input-glass pl-10 ${errors.phone ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Emergency Contact */}
          <ScrollReveal>
            <div className="glass rounded-3xl p-6 mb-4 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                  <Shield size={18} className="text-red-500" />
                </div>
                <h3 className="font-bold text-slate-800">Emergency Contact</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Name</label>
                  <input {...register('emergencyName')} placeholder="Family member name"
                    className={`input-glass ${errors.emergencyName ? 'border-red-400' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Phone</label>
                  <input {...register('emergencyPhone')} type="tel" placeholder="+91 XXXXX XXXXX"
                    className={`input-glass ${errors.emergencyPhone ? 'border-red-400' : ''}`} />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Insurance */}
          <ScrollReveal>
            <div className="glass rounded-3xl p-6 mb-6 shadow-soft">
              <label className="flex items-center gap-4 cursor-pointer">
                <input {...register('insurance')} type="checkbox"
                  className="w-5 h-5 rounded accent-blue-500" />
                <div>
                  <div className="font-semibold text-slate-800">Travel Insurance — ₹35 per passenger</div>
                  <div className="text-sm text-slate-500">Coverage up to ₹10 lakhs for accidents, baggage loss, and delays</div>
                </div>
              </label>
            </div>
          </ScrollReveal>

          <Button type="submit" fullWidth loading={loading} size="lg" className="rounded-2xl">
            Continue to Payment
          </Button>
        </form>
      </div>
    </div>
  );
}
