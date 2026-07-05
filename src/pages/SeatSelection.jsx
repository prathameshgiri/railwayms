import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Train, ArrowRight, Info } from 'lucide-react';
import { toggleSeatSelection, setStep } from '@/store/slices/bookingSlice';
import { trains } from '@/data/trains';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/animations/ScrollReveal';

// Generate mock seat map for a coach
function generateSeats(coachNumber, coachType) {
  const seats = [];
  const total = coachType === '1A' ? 18 : coachType === '2A' ? 48 : coachType === '3A' ? 64 : 72;
  const berths = coachType.includes('A') ? ['L', 'M', 'U', 'SL', 'SM', 'SU'] : ['W', 'M', 'A'];

  for (let i = 1; i <= total; i++) {
    const rand = Math.random();
    let type = 'available';
    if (rand < 0.3) type = 'booked';
    else if (i <= 6) type = 'ladies';
    else if (i <= 10) type = 'senior';
    seats.push({
      id: `${coachNumber}-${i}`,
      number: i,
      berth: berths[(i - 1) % berths.length],
      type,
    });
  }
  return seats;
}

function SeatGrid({ seats, selectedSeats, onToggle, maxPassengers }) {
  const legend = [
    { type: 'available', label: 'Available', class: 'seat-available' },
    { type: 'selected', label: 'Selected', class: 'seat-selected' },
    { type: 'booked', label: 'Booked', class: 'seat-booked' },
    { type: 'ladies', label: 'Ladies', class: 'seat-ladies' },
    { type: 'senior', label: 'Senior Citizen', class: 'seat-senior' },
  ];

  const isSelected = (seatId) => selectedSeats.some(s => s.id === seatId);
  const canSelect = (seat) => !['booked'].includes(seat.type) && (isSelected(seat.id) || selectedSeats.length < maxPassengers);

  // Group into bays of 6
  const bays = [];
  for (let i = 0; i < seats.length; i += 6) bays.push(seats.slice(i, i + 6));

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {legend.map(l => (
          <div key={l.type} className="flex items-center gap-1.5">
            <div className={`seat ${l.class}`} style={{ width: 24, height: 24, fontSize: 10 }}>·</div>
            <span className="text-xs text-slate-600">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Coach */}
      <div className="glass rounded-3xl p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Train size={18} className="text-blue-500" />
            <span className="font-bold text-slate-800">Coach B1</span>
          </div>
          <Badge variant="green">{seats.filter(s => s.type === 'available').length} Available</Badge>
        </div>

        <div className="space-y-2 min-w-[320px]">
          {bays.map((bay, bayIdx) => (
            <div key={bayIdx} className="flex gap-1 items-center">
              <span className="text-xs text-slate-400 w-6 shrink-0">{bayIdx * 6 + 1}</span>
              <div className="flex gap-1 flex-1">
                {bay.slice(0, 3).map(seat => (
                  <motion.button
                    key={seat.id}
                    onClick={() => canSelect(seat) && onToggle(seat)}
                    className={`seat ${
                      isSelected(seat.id) ? 'seat-selected' :
                      seat.type === 'booked' ? 'seat-booked' :
                      seat.type === 'ladies' ? 'seat-ladies' :
                      seat.type === 'senior' ? 'seat-senior' :
                      'seat-available'
                    } ${!canSelect(seat) && !isSelected(seat.id) ? 'opacity-50' : ''}`}
                    whileHover={seat.type !== 'booked' ? { scale: 1.15 } : {}}
                    whileTap={seat.type !== 'booked' ? { scale: 0.9 } : {}}
                  >
                    {seat.number}
                  </motion.button>
                ))}
              </div>
              <div className="w-6 shrink-0 flex items-center justify-center">
                <div className="w-px h-6 bg-slate-200" />
              </div>
              <div className="flex gap-1">
                {bay.slice(3, 6).map(seat => (
                  <motion.button
                    key={seat.id}
                    onClick={() => canSelect(seat) && onToggle(seat)}
                    className={`seat ${
                      isSelected(seat.id) ? 'seat-selected' :
                      seat.type === 'booked' ? 'seat-booked' :
                      seat.type === 'ladies' ? 'seat-ladies' :
                      seat.type === 'senior' ? 'seat-senior' :
                      'seat-available'
                    } ${!canSelect(seat) && !isSelected(seat.id) ? 'opacity-50' : ''}`}
                    whileHover={seat.type !== 'booked' ? { scale: 1.15 } : {}}
                    whileTap={seat.type !== 'booked' ? { scale: 0.9 } : {}}
                  >
                    {seat.number}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SeatSelection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTrain, selectedClass, selectedSeats, searchParams } = useSelector(s => s.booking);
  const train = selectedTrain || trains[0];
  const cls = selectedClass || train.classes[0];

  const [seats] = useState(() => generateSeats('B1', cls.code));

  const handleToggle = (seat) => {
    dispatch(toggleSeatSelection(seat));
  };

  const handleContinue = () => {
    dispatch(setStep(3));
    navigate('/passengers');
  };

  const totalFare = selectedSeats.length * cls.fare;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <AnimatedBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="glass rounded-3xl p-6 mb-6 shadow-soft">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                <Train size={20} color="white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">{train.name}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>#{train.number}</span>
                  <span>·</span>
                  <span>{train.from.name}</span>
                  <ArrowRight size={12} />
                  <span>{train.to.name}</span>
                  <span>·</span>
                  <span className="font-semibold text-blue-600">{cls.code} — ₹{cls.fare.toLocaleString()}/seat</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="glass rounded-3xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Select Your Seats</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <Info size={12} className="text-blue-500" />
                    Select {searchParams.passengers} seat{searchParams.passengers > 1 ? 's' : ''}
                  </div>
                </div>
                <SeatGrid
                  seats={seats}
                  selectedSeats={selectedSeats}
                  onToggle={handleToggle}
                  maxPassengers={searchParams.passengers}
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="left">
              <div className="glass rounded-3xl p-6 shadow-soft sticky top-24">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Selection Summary</h3>

                {selectedSeats.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <div className="text-4xl mb-2">💺</div>
                    <p className="text-sm">Select seats to continue</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedSeats.map((seat, i) => (
                      <motion.div key={seat.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                        <div>
                          <div className="text-sm font-bold text-blue-700">Seat {seat.number}</div>
                          <div className="text-xs text-blue-500">Berth: {seat.berth}</div>
                        </div>
                        <div className="text-sm font-bold text-blue-700">₹{cls.fare.toLocaleString()}</div>
                      </motion.div>
                    ))}

                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Seats × {selectedSeats.length}</span>
                        <span className="font-semibold">₹{totalFare.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Convenience Fee</span>
                        <span className="font-semibold">₹30</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">GST (5%)</span>
                        <span className="font-semibold">₹{Math.round(totalFare * 0.05).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-800 text-base border-t pt-2">
                        <span>Total</span>
                        <span>₹{(totalFare + 30 + Math.round(totalFare * 0.05)).toLocaleString()}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleContinue}
                      fullWidth
                      disabled={selectedSeats.length < searchParams.passengers}
                    >
                      Continue to Passengers
                    </Button>
                    {selectedSeats.length < searchParams.passengers && (
                      <p className="text-xs text-center text-orange-500">
                        Please select {searchParams.passengers - selectedSeats.length} more seat(s)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
