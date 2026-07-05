import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchParams: {
    from: '',
    to: '',
    date: '',
    classType: 'All',
    passengers: 1,
  },
  selectedTrain: null,
  selectedClass: null,
  selectedSeats: [],
  passengers: [],
  contactDetails: {
    email: '',
    phone: '',
  },
  paymentMethod: 'upi',
  couponCode: '',
  couponDiscount: 0,
  bookingReference: null,
  currentStep: 1, // 1=search, 2=seats, 3=passengers, 4=payment, 5=confirm
  pastBookings: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSearchParams(state, action) {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    setSelectedTrain(state, action) {
      state.selectedTrain = action.payload;
    },
    setSelectedClass(state, action) {
      state.selectedClass = action.payload;
    },
    toggleSeatSelection(state, action) {
      const seat = action.payload;
      const idx = state.selectedSeats.findIndex(s => s.id === seat.id);
      if (idx >= 0) {
        state.selectedSeats.splice(idx, 1);
      } else if (state.selectedSeats.length < state.searchParams.passengers) {
        state.selectedSeats.push(seat);
      }
    },
    clearSeats(state) {
      state.selectedSeats = [];
    },
    setPassengers(state, action) {
      state.passengers = action.payload;
    },
    setContactDetails(state, action) {
      state.contactDetails = action.payload;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    applyCoupon(state, action) {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon(state) {
      state.couponCode = '';
      state.couponDiscount = 0;
    },
    setBookingReference(state, action) {
      state.bookingReference = action.payload;
    },
    setStep(state, action) {
      state.currentStep = action.payload;
    },
    resetBooking(state) {
      // Keep pastBookings intact when resetting flow
      const past = state.pastBookings;
      return { ...initialState, pastBookings: past };
    },
    addPastBooking(state, action) {
      state.pastBookings.unshift(action.payload);
    },
  },
});

export const {
  setSearchParams, setSelectedTrain, setSelectedClass,
  toggleSeatSelection, clearSeats, setPassengers,
  setContactDetails, setPaymentMethod, applyCoupon,
  removeCoupon, setBookingReference, setStep, resetBooking,
  addPastBooking
} = bookingSlice.actions;
export default bookingSlice.reducer;
