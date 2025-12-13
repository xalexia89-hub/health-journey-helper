import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { DoctorLayout } from "@/components/layout/DoctorLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Pages
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Symptoms from "./pages/Symptoms";
import Providers from "./pages/Providers";
import ProviderDetail from "./pages/ProviderDetail";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorSettings from "./pages/doctor/DoctorSettings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected patient routes */}
            <Route element={<PatientLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/symptoms" element={<Symptoms />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/providers/:id" element={<ProviderDetail />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/records" element={<MedicalRecords />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Doctor routes */}
            <Route element={<DoctorLayout />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/schedule" element={<DoctorSchedule />} />
              <Route path="/doctor/settings" element={<DoctorSettings />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/providers" element={<AdminProviders />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
