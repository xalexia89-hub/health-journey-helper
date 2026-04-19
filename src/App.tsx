import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DemoProvider } from "@/contexts/DemoContext";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { DoctorLayout } from "@/components/layout/DoctorLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";

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
import SymptomAssistant from "./pages/SymptomAssistant";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Feed from "./pages/Feed";
import Community from "./pages/Community";
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
import GDPRCompliance from "./pages/GDPRCompliance";
import ProjectEvaluation from "./pages/ProjectEvaluation";
import CompetitiveAnalysis from "./pages/CompetitiveAnalysis";
import StandaloneAnalysis from "./pages/StandaloneAnalysis";
import ExecutiveSummary from "./pages/ExecutiveSummary";
import TechnicalStudy from "./pages/TechnicalStudy";
import LegalReport from "./pages/LegalReport";
import ComingSoon from "./pages/ComingSoon";

// Pilot Pages
import PilotLanding from "./pages/PilotLanding";
import PilotEnroll from "./pages/PilotEnroll";
import PilotWaitlist from "./pages/PilotWaitlist";
import DoctorSignup from "./pages/DoctorSignup";
import AdvisorProfile from "./pages/AdvisorProfile";
import ProviderSignup from "./pages/ProviderSignup";
import Install from "./pages/Install";
import SystemGovernance from "./pages/SystemGovernance";
import ResetPassword from "./pages/ResetPassword";
import MetricsDashboard from "./pages/MetricsDashboard";
import About from "./pages/About";
import Unsubscribe from "./pages/Unsubscribe";

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

// Insurance Pages
import { InsuranceLayout } from "./components/layout/InsuranceLayout";
import InsuranceDashboard from "./pages/insurance/InsuranceDashboard";
import InsuranceMembers from "./pages/insurance/InsuranceMembers";
import InsuranceRisk from "./pages/insurance/InsuranceRisk";
import InsuranceClaims from "./pages/insurance/InsuranceClaims";
import InsuranceBehavioral from "./pages/insurance/InsuranceBehavioral";
import InsuranceCost from "./pages/insurance/InsuranceCost";
import InsuranceSettings from "./pages/insurance/InsuranceSettings";

const queryClient = new QueryClient();

const UNLOCK_CODE = "medithos2024";

const AppContent = () => {
  const [searchParams] = useSearchParams();
  // DEVELOPMENT MODE: Coming Soon gate disabled
  // To re-enable, uncomment the unlock logic below
  const [isUnlocked] = useState(true);

  // useEffect(() => {
  //   const unlockParam = searchParams.get("unlock");
  //   if (unlockParam === UNLOCK_CODE) {
  //     localStorage.setItem("medithos_unlocked", "true");
  //     setIsUnlocked(true);
  //   } else {
  //     const stored = localStorage.getItem("medithos_unlocked");
  //     setIsUnlocked(stored === "true");
  //   }
  // }, [searchParams]);

  // Full app when unlocked
  return (
    <LanguageProvider>
      <DemoProvider>
      <AuthProvider>
        <Routes>
          {/* Public routes - PilotLanding is the main entry point */}
          <Route path="/" element={<PilotLanding />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/intro" element={<Intro />} />
          
          {/* Pilot routes */}
          <Route path="/pilot" element={<PilotLanding />} />
          <Route path="/pilot/landing" element={<PilotLanding />} />
          <Route path="/medithos" element={<PilotLanding />} />
          <Route path="/pilot/enroll" element={<PilotEnroll />} />
          <Route path="/pilot/waitlist" element={<PilotWaitlist />} />
          <Route path="/doctor-signup" element={<DoctorSignup />} />
          <Route path="/pilot/doctor-signup" element={<DoctorSignup />} />
          <Route path="/provider-signup" element={<ProviderSignup />} />
          <Route path="/signup/provider" element={<ProviderSignup />} />
          
          {/* Legacy routes */}
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/pitch-deck" element={<PitchDeck />} />
          <Route path="/mesh-architecture" element={<MeshArchitecture />} />
          <Route path="/interest" element={<InterestForm />} />
          <Route path="/interest/print" element={<InterestFormPrint />} />
          <Route path="/documentation" element={<SystemDocumentation />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
          <Route path="/evaluation" element={<ProjectEvaluation />} />
          <Route path="/competitive-analysis" element={<CompetitiveAnalysis />} />
          <Route path="/analysis" element={<StandaloneAnalysis />} />
          <Route path="/executive-summary" element={<ExecutiveSummary />} />
          <Route path="/technical-study" element={<TechnicalStudy />} />
          <Route path="/legal-report" element={<LegalReport />} />
          <Route path="/advisor" element={<AdvisorProfile />} />
          <Route path="/symptoms" element={<SymptomAssistant />} />
          <Route path="/install" element={<Install />} />
          <Route path="/system" element={<SystemGovernance />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/metrics" element={<MetricsDashboard />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected patient routes */}
          <Route element={<PatientLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
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
            <Route path="/community" element={<Community />} />
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

          {/* Insurance Governance routes */}
          <Route element={<InsuranceLayout />}>
            <Route path="/insurance" element={<InsuranceDashboard />} />
            <Route path="/insurance/members" element={<InsuranceMembers />} />
            <Route path="/insurance/risk" element={<InsuranceRisk />} />
            <Route path="/insurance/claims" element={<InsuranceClaims />} />
            <Route path="/insurance/behavioral" element={<InsuranceBehavioral />} />
            <Route path="/insurance/cost" element={<InsuranceCost />} />
            <Route path="/insurance/settings" element={<InsuranceSettings />} />
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
      </AuthProvider>
      </DemoProvider>
    </LanguageProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
