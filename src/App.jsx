import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/animations/PageTransition';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import TrainSearch from '@/pages/TrainSearch';
import SeatSelection from '@/pages/SeatSelection';
import PassengerDetails from '@/pages/PassengerDetails';
import Payment from '@/pages/Payment';
import TicketConfirmation from '@/pages/TicketConfirmation';
import MyBookings from '@/pages/MyBookings';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/admin/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

// Layout wrapper that shows Navbar + Footer for non-admin routes
function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </>
  );
}

// Admin layout hides footer, has its own sidebar
function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(226,232,240,0.8)',
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
            }}
          />
          <Routes>
            {/* Public / Main Routes */}
            <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
            <Route path="/auth/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/auth/signup" element={<MainLayout><Signup /></MainLayout>} />
            <Route path="/auth/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />

            {/* Booking Flow (Protected) */}
            <Route path="/search" element={<ProtectedRoute><MainLayout><TrainSearch /></MainLayout></ProtectedRoute>} />
            <Route path="/seat-selection" element={<ProtectedRoute><MainLayout><SeatSelection /></MainLayout></ProtectedRoute>} />
            <Route path="/passengers" element={<ProtectedRoute><MainLayout><PassengerDetails /></MainLayout></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><MainLayout><Payment /></MainLayout></ProtectedRoute>} />
            <Route path="/confirmation" element={<ProtectedRoute><MainLayout><TicketConfirmation /></MainLayout></ProtectedRoute>} />

            {/* User Pages (Protected) */}
            <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MainLayout><MyBookings /></MainLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />

            {/* Admin (Protected) */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
