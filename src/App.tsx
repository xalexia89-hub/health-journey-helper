import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { DoctorLayout } from "@/components/layout/DoctorLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Pages
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Intro from "./pages/Intro";
import Dashboard from "./pages/Dashboard";
import Symptoms from "./pages/Symptoms";
import Providers from "./pages/Providers";
import Nurses from "./pages/Nurses";
import ProviderDetail from "./pages/ProviderDetail";
import Payment from "./pages/Payment";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import MedicationReminders from "./pages/MedicationReminders";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Feed from "./pages/Feed";
import Academy from "./pages/Academy";
import NotFound from "./pages/NotFound";
import DoctorRegistration from "./pages/DoctorRegistration";
import PitchDeck from "./pages/PitchDeck";
import MeshArchitecture from "./pages/MeshArchitecture";
import InterestForm from "./pages/InterestForm";
import InterestFormPrint from "./pages/InterestFormPrint";
import SystemDocumentation from "./pages/SystemDocumentation";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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
import AdminInterestExpressions from "./pages/admin/AdminInterestExpressions";
import AdminContentModeration from "./pages/admin/AdminContentModeration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/doctor-registration" element={<DoctorRegistration />} />
              <Route path="/pitch-deck" element={<PitchDeck />} />
              <Route path="/mesh-architecture" element={<MeshArchitecture />} />
              <Route path="/interest" element={<InterestForm />} />
              <Route path="/interest/print" element={<InterestFormPrint />} />
              <Route path="/documentation" element={<SystemDocumentation />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              
              {/* Protected patient routes */}
              <Route element={<PatientLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/symptoms" element={<Symptoms />} />
                <Route path="/providers" element={<Providers />} />
                <Route path="/nurses" element={<Nurses />} />
                <Route path="/providers/:id" element={<ProviderDetail />} />
                <Route path="/payment/:appointmentId" element={<Payment />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/records" element={<MedicalRecords />} />
                <Route path="/medications" element={<MedicationReminders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/academy" element={<Academy />} />
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
                <Route path="/admin/interest" element={<AdminInterestExpressions />} />
                <Route path="/admin/moderation" element={<AdminContentModeration />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
