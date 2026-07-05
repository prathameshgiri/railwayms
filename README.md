# RailwayMS — Modern Railway Booking System

RailwayMS is a premium, fully responsive, and highly interactive railway ticket booking application. Built with a focus on modern UI/UX principles (glassmorphism, soft gradients, and smooth micro-animations), this project offers a seamless experience from searching trains and selecting seats to managing passenger details and simulating a payment gateway.

## ✨ Features
- **Modern UI/UX**: Soft pastel colors, primary/secondary gradients, glassmorphism, and smooth Framer Motion animations.
- **Dynamic Search Flow**: Search trains, swap stations, and get real-time-like feedback.
- **Interactive Seat Selection**: Visual seat maps with berth choices.
- **Protected Routing & Authentication**: Role-based access (User vs Admin) with secure routing.
- **User Dashboard & Bookings**: View past and upcoming trips, manage wallet, and receive notifications.
- **Admin Panel**: Full CMS, user management, and analytics dashboard.
- **Mobile Responsive**: Fully optimized for mobile with touch-friendly interactions and a dedicated mobile drawer.

## 🛠️ Technology Stack
- **Frontend Framework**: React (via Vite)
- **Routing**: React Router
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Tailwind CSS v4 (with `@theme` block integration)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Notifications**: React Hot Toast

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/prathameshgiri/railwayms.git
   cd railwayms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Login Credentials (Demo)

You can use the following mock credentials to explore the protected routes and dashboards:

**User Login (Redirects to User Dashboard)**
- **Email**: `p@prathameshgiri.in`
- **Password**: `Pass@123`

**Admin Login (Redirects to Admin Panel)**
- **Email**: `admin@prathameshgiri.in`
- **Password**: `Pass@123`

## 📂 Project Structure
- `src/components/`: Reusable UI components (Navbar, Footer, Buttons, Modals, Animations).
- `src/pages/`: Main application pages (Landing, Auth, Booking Flow, Dashboard, Admin).
- `src/store/`: Redux store configuration and slices (`authSlice`, `bookingSlice`, `uiSlice`).
- `src/data/`: Mock data for stations, trains, offers, and bookings.
- `src/index.css`: Global styles containing custom utility classes and design tokens.

---

**Developed by Prathamesh Giri**  
*This project is developed for open source.*
