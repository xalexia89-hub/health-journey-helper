import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Target, 
  Users, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  XCircle,
  Building2,
  Globe,
  Brain,
  Heart,
  Shield,
  DollarSign,
  Megaphone,
  BarChart3,
  Calendar,
  Download,
  Server,
  Code,
  Cpu,
  Database,
  UserPlus,
  Briefcase,
  TrendingDown,
  Percent,
  Clock,
  Euro
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/logo";

// Competitor Data
const competitors = [
  {
    name: "DoctorAnytime",
    country: "Ελλάδα / Ευρώπη",
    type: "Online Booking Platform",
    description: "Η μεγαλύτερη πλατφόρμα κράτησης ραντεβού στην Ελλάδα με 5000+ γιατρούς",
    strengths: [
      "Ισχυρό brand awareness στην Ελλάδα",
      "Μεγάλο δίκτυο επαλημένων γιατρών",
      "Απλή διαδικασία κράτησης",
      "Τηλεϊατρική υπηρεσία"
    ],
    weaknesses: [
      "Δεν διαθέτει AI triage",
      "Καμία ενοποίηση ιατρικού ιστορικού",
      "Δεν προτείνει ειδικότητα",
      "Passive platform - ο χρήστης πρέπει να ξέρει τι θέλει"
    ],
    pricing: "Commission-based (γιατροί πληρώνουν)",
    users: "2M+ χρήστες",
    threat: "high"
  },
  {
    name: "Doctolib",
    country: "Γαλλία / Γερμανία",
    type: "Healthcare Booking Giant",
    description: "Ευρωπαϊκός γίγαντας με 80M+ χρήστες, πιθανή επέκταση στην Ελλάδα",
    strengths: [
      "Τεράστιο funding (€500M+)",
      "Ολοκληρωμένο οικοσύστημα",
      "EHR integrations",
      "Ισχυρό B2B model"
    ],
    weaknesses: [
      "Δεν έχει AI symptom checker",
      "Complex onboarding για γιατρούς",
      "Δεν είναι ακόμα στην Ελλάδα",
      "Enterprise-focused, όχι patient-centric"
    ],
    pricing: "Subscription (€129/μήνα/γιατρό)",
    users: "80M+ χρήστες",
    threat: "medium"
  },
  {
    name: "Ada Health",
    country: "Γερμανία",
    type: "AI Symptom Checker",
    description: "Κορυφαίο AI symptom assessment με 13M+ downloads",
    strengths: [
      "Best-in-class AI accuracy",
      "CE-marked medical device",
      "Strong clinical validation",
      "B2B partnerships με ασφαλιστικές"
    ],
    weaknesses: [
      "Δεν κάνει booking",
      "Δεν έχει ελληνικά",
      "Δεν συνδέει με τοπικούς γιατρούς",
      "Μόνο symptom check, όχι ecosystem"
    ],
    pricing: "Freemium + B2B licensing",
    users: "13M+ downloads",
    threat: "medium"
  },
  {
    name: "Babylon Health",
    country: "UK",
    type: "Digital Health Platform",
    description: "AI-first telehealth με ιδίους γιατρούς (financial troubles 2023)",
    strengths: [
      "Πλήρες AI + Doctor ecosystem",
      "24/7 availability",
      "Strong NHS partnerships",
      "Video consultations"
    ],
    weaknesses: [
      "Financial instability",
      "Δεν υπάρχει στην Ευρώπη εκτός UK",
      "High cost structure",
      "Regulatory challenges"
    ],
    pricing: "Subscription £10/μήνα",
    users: "6M+ χρήστες",
    threat: "low"
  },
  {
    name: "K Health",
    country: "USA",
    type: "AI Primary Care",
    description: "AI-powered primary care με chat-first approach",
    strengths: [
      "Sophisticated AI diagnosis",
      "Low-cost care ($12/visit)",
      "Strong data moat",
      "Prescription capability"
    ],
    weaknesses: [
      "US-only",
      "Regulatory barriers για Ευρώπη",
      "Requires medical license",
      "No preventive care focus"
    ],
    pricing: "$12-49/visit",
    users: "4M+ χρήστες",
    threat: "low"
  },
  {
    name: "Medidate",
    country: "Ελλάδα",
    type: "Medical Directory",
    description: "Ελληνικός κατάλογος γιατρών με reviews",
    strengths: [
      "SEO presence στην Ελλάδα",
      "Απλή χρήση",
      "Χαμηλό κόστος"
    ],
    weaknesses: [
      "Outdated technology",
      "Δεν έχει booking",
      "Δεν έχει verification",
      "Passive directory only"
    ],
    pricing: "Freemium listings",
    users: "~500K visits/μήνα",
    threat: "low"
  },
  {
    name: "iAtros",
    country: "Ελλάδα",
    type: "Telehealth Platform",
    description: "Ελληνική τηλεϊατρική πλατφόρμα",
    strengths: [
      "Focused on telemedicine",
      "Greek market presence",
      "B2B with companies"
    ],
    weaknesses: [
      "Μικρό δίκτυο γιατρών",
      "Δεν έχει AI",
      "Limited features",
      "No patient records"
    ],
    pricing: "Per-visit pricing",
    users: "~50K χρήστες",
    threat: "low"
  },
  {
    name: "Zocdoc",
    country: "USA",
    type: "Healthcare Marketplace",
    description: "Η μεγαλύτερη πλατφόρμα booking στις ΗΠΑ - benchmark",
    strengths: [
      "Market leader in US",
      "Insurance integration",
      "Real-time availability",
      "Strong reviews system"
    ],
    weaknesses: [
      "US-only",
      "No AI triage",
      "High commission fees",
      "No health records"
    ],
    pricing: "Pay-per-booking ($35-110)",
    users: "6M+ monthly users",
    threat: "none"
  }
];

const marketingPlan = {
  phases: [
    {
      name: "Phase 1: Pilot Launch",
      duration: "Μήνας 1-3",
      budget: "€5,000",
      goals: [
        "50-100 pilot users",
        "5-10 advisor doctors",
        "Validate core AI flow",
        "Collect NPS feedback"
      ],
      channels: [
        { name: "Personal Network", allocation: "40%", tactics: "Founders' network, medical contacts" },
        { name: "LinkedIn", allocation: "30%", tactics: "Thought leadership, doctor outreach" },
        { name: "Medical Events", allocation: "20%", tactics: "Conferences, hospital presentations" },
        { name: "PR/Media", allocation: "10%", tactics: "Health tech press, local news" }
      ],
      kpis: ["50 active users", "NPS > 40", "35% return rate", "5 doctor advisors"]
    },
    {
      name: "Phase 2: Market Entry",
      duration: "Μήνας 4-9",
      budget: "€30,000",
      goals: [
        "1,000+ registered users",
        "50+ verified providers",
        "B2B pilot with insurance",
        "Community launch"
      ],
      channels: [
        { name: "Digital Ads", allocation: "35%", tactics: "Google Ads, Meta, health keywords" },
        { name: "Content Marketing", allocation: "25%", tactics: "SEO blog, health guides, video content" },
        { name: "Partnerships", allocation: "25%", tactics: "Clinics, labs, pharmacies" },
        { name: "Referral Program", allocation: "15%", tactics: "Patient + Doctor referrals" }
      ],
      kpis: ["1,000 MAU", "50 providers", "€10 CAC", "1 B2B contract"]
    },
    {
      name: "Phase 3: Growth",
      duration: "Μήνας 10-18",
      budget: "€150,000",
      goals: [
        "10,000+ active users",
        "200+ providers",
        "Multiple B2B contracts",
        "Revenue generation"
      ],
      channels: [
        { name: "Performance Marketing", allocation: "40%", tactics: "Scaled Google/Meta, retargeting" },
        { name: "B2B Sales", allocation: "30%", tactics: "Insurance, employers, hospitals" },
        { name: "Brand Building", allocation: "20%", tactics: "TV spots, influencer health partners" },
        { name: "Product-Led Growth", allocation: "10%", tactics: "Viral features, sharing tools" }
      ],
      kpis: ["10,000 MAU", "€100K ARR", "200 providers", "3+ B2B contracts"]
    }
  ],
  segments: [
    {
      name: "Ασθενείς / Χρήστες",
      icon: Users,
      personas: [
        { title: "Ο Ανήσυχος Γονέας", age: "30-45", pain: "Δεν ξέρει αν πρέπει να πάει το παιδί σε γιατρό", value: "High LTV" },
        { title: "Ο Χρόνιος Ασθενής", age: "45-65", pain: "Πολλοί γιατροί, κανένα ενοποιημένο αρχείο", value: "High retention" },
        { title: "Ο Digital Native", age: "25-35", pain: "Θέλει instant answers, όχι αναμονή", value: "High referral" },
        { title: "Ο Φροντιστής", age: "40-60", pain: "Διαχειρίζεται υγεία ηλικιωμένων γονέων", value: "Multi-user" }
      ]
    },
    {
      name: "Επαγγελματίες Υγείας",
      icon: Building2,
      personas: [
        { title: "Ο Ιδιώτης Γιατρός", pain: "Θέλει νέους ασθενείς, digital presence", value: "€50/μήνα" },
        { title: "Η Κλινική", pain: "Visibility, διαχείριση ραντεβού", value: "€200/μήνα" },
        { title: "Το Εργαστήριο", pain: "Online παραπομπές, αποτελέσματα", value: "€100/μήνα" },
        { title: "Ο Νοσηλευτής", pain: "Πελατολόγιο για κατ' οίκον φροντίδα", value: "€30/μήνα" }
      ]
    },
    {
      name: "B2B Partners",
      icon: Building2,
      personas: [
        { title: "Ασφαλιστικές", pain: "Cost reduction, prevention", value: "€50K+/year" },
        { title: "Εργοδότες", pain: "Employee health benefits", value: "€10K+/year" },
        { title: "Νοσοκομεία", pain: "Patient flow, triage", value: "€100K+/year" }
      ]
    }
  ],
  messaging: {
    tagline: "Ο Προσωπικός σου Σύμβουλος Υγείας",
    valueProps: [
      { headline: "Μην ψάχνεις, ρώτα", description: "Η AI σου προτείνει τη σωστή ειδικότητα" },
      { headline: "Όλα σε ένα μέρος", description: "Το ιατρικό σου ιστορικό, πάντα μαζί σου" },
      { headline: "Χωρίς διάγνωση, μόνο καθοδήγηση", description: "Σε βοηθάμε να πάρεις την καλύτερη απόφαση" }
    ],
    differentiators: [
      "AI Navigation (όχι diagnosis)",
      "Unified Medical Record",
      "Doctor Community Network",
      "Examary Pre-visit Reports"
    ]
  }
};

// Pricing Strategy Data
const pricingStrategy = {
  b2c: {
    tiers: [
      {
        name: "Free",
        price: "€0",
        period: "για πάντα",
        description: "Βασική πρόσβαση για όλους",
        features: [
          "AI Symptom Navigator (3 sessions/μήνα)",
          "Basic Medical Record",
          "Provider Directory",
          "Appointment Booking"
        ],
        limitations: [
          "Limited AI sessions",
          "No Examary reports",
          "No family profiles",
          "Basic support"
        ],
        target: "Mass adoption, lead generation"
      },
      {
        name: "Premium",
        price: "€9.99",
        period: "/μήνα",
        description: "Πλήρης πρόσβαση για ενεργούς χρήστες",
        features: [
          "Unlimited AI sessions",
          "Examary Pre-visit Reports",
          "Family Health Profiles (5 μέλη)",
          "Priority booking",
          "Health reminders & tracking",
          "Document OCR & organization"
        ],
        limitations: [],
        target: "Power users, families, chronic patients",
        highlight: true
      },
      {
        name: "Family",
        price: "€19.99",
        period: "/μήνα",
        description: "Για οικογένειες με πολλαπλά μέλη",
        features: [
          "Όλα τα Premium features",
          "Unlimited family members",
          "Family health tree",
          "Shared medical history",
          "Caregiver access controls",
          "Priority support"
        ],
        limitations: [],
        target: "Extended families, caregivers"
      }
    ]
  },
  b2b: {
    providers: [
      {
        type: "Γιατρός",
        icon: "🩺",
        tiers: [
          { name: "Basic", price: "€0", features: ["Profile listing", "Basic booking", "5 reviews"] },
          { name: "Professional", price: "€49/μήνα", features: ["Enhanced profile", "Unlimited bookings", "Analytics", "Priority placement"] },
          { name: "Premium", price: "€99/μήνα", features: ["All Pro features", "Telemedicine", "AI patient summaries", "Featured placement"] }
        ]
      },
      {
        type: "Κλινική/Νοσοκομείο",
        icon: "🏥",
        tiers: [
          { name: "Starter", price: "€199/μήνα", features: ["Up to 5 doctors", "Booking system", "Basic analytics"] },
          { name: "Business", price: "€499/μήνα", features: ["Up to 20 doctors", "Multi-location", "Advanced analytics", "API access"] },
          { name: "Enterprise", price: "Custom", features: ["Unlimited", "EHR integration", "Dedicated support", "White-label option"] }
        ]
      },
      {
        type: "Εργαστήριο",
        icon: "🔬",
        tiers: [
          { name: "Basic", price: "€79/μήνα", features: ["Listing", "Online results", "Basic booking"] },
          { name: "Pro", price: "€149/μήνα", features: ["API integration", "Auto-upload results", "Analytics"] }
        ]
      },
      {
        type: "Νοσηλευτής",
        icon: "💉",
        tiers: [
          { name: "Free", price: "€0", features: ["Basic profile", "3 bookings/μήνα"] },
          { name: "Professional", price: "€29/μήνα", features: ["Full profile", "Unlimited bookings", "Schedule management"] }
        ]
      }
    ],
    enterprise: [
      {
        name: "Ασφαλιστικές Εταιρείες",
        pricing: "€2-5 PMPM (per member per month)",
        minContract: "€50,000/year",
        value: "Reduced claims, preventive care, member satisfaction"
      },
      {
        name: "Εργοδότες (Employee Benefits)",
        pricing: "€3-8 per employee/month",
        minContract: "€10,000/year",
        value: "Reduced absenteeism, employee wellness"
      },
      {
        name: "Νοσοκομεία (Triage Integration)",
        pricing: "Custom licensing",
        minContract: "€100,000/year",
        value: "Pre-arrival triage, reduced ER visits"
      }
    ]
  },
  transactions: {
    bookingFee: { patient: "€0", provider: "€2-5/booking" },
    telemedicine: { commission: "10-15%", minFee: "€3" },
    labReferrals: { commission: "5-10%" },
    premiumPlacement: { cpm: "€15-30", featured: "€100-500/μήνα" }
  }
};

// Technical Specs Data
const technicalSpecs = {
  architecture: {
    frontend: [
      { tech: "React 18", purpose: "UI Framework", status: "Production" },
      { tech: "TypeScript", purpose: "Type Safety", status: "Production" },
      { tech: "Vite", purpose: "Build Tool", status: "Production" },
      { tech: "TailwindCSS", purpose: "Styling", status: "Production" },
      { tech: "React Query", purpose: "Data Fetching", status: "Production" },
      { tech: "React Router", purpose: "Navigation", status: "Production" }
    ],
    backend: [
      { tech: "Supabase", purpose: "BaaS (Auth, DB, Storage)", status: "Production" },
      { tech: "PostgreSQL", purpose: "Primary Database", status: "Production" },
      { tech: "Edge Functions (Deno)", purpose: "Serverless Logic", status: "Production" },
      { tech: "Row Level Security", purpose: "Data Protection", status: "Production" }
    ],
    ai: [
      { tech: "Lovable AI Gateway", purpose: "LLM Access", status: "Production" },
      { tech: "Gemini 2.5 Pro", purpose: "Primary Model", status: "Production" },
      { tech: "Gemini Flash", purpose: "Fast Responses", status: "Production" },
      { tech: "Custom Prompts", purpose: "Medical Navigation", status: "Production" }
    ],
    future: [
      { tech: "HL7 FHIR", purpose: "EHR Integration", status: "Phase 3" },
      { tech: "DICOM", purpose: "Medical Imaging", status: "Phase 3" },
      { tech: "WebRTC", purpose: "Telemedicine", status: "Phase 2" },
      { tech: "Push Notifications", purpose: "Mobile Alerts", status: "Phase 2" }
    ]
  },
  apis: [
    {
      endpoint: "/api/symptom-chat",
      method: "POST",
      purpose: "AI Symptom Navigation",
      rateLimit: "50 req/session, 10K chars/message",
      auth: "Required (JWT)"
    },
    {
      endpoint: "/api/providers",
      method: "GET",
      purpose: "Provider Search & Listing",
      rateLimit: "100 req/min",
      auth: "Optional"
    },
    {
      endpoint: "/api/appointments",
      method: "POST/GET",
      purpose: "Booking Management",
      rateLimit: "30 req/min",
      auth: "Required"
    },
    {
      endpoint: "/api/medical-records",
      method: "GET/POST/PUT",
      purpose: "Health Record CRUD",
      rateLimit: "60 req/min",
      auth: "Required + RLS"
    },
    {
      endpoint: "/api/examary",
      method: "POST",
      purpose: "Generate Pre-visit Report",
      rateLimit: "5 req/hour",
      auth: "Required (Premium)"
    }
  ],
  performance: {
    targets: [
      { metric: "Time to First Byte (TTFB)", target: "< 200ms", current: "~180ms" },
      { metric: "First Contentful Paint (FCP)", target: "< 1.5s", current: "~1.2s" },
      { metric: "Largest Contentful Paint (LCP)", target: "< 2.5s", current: "~2.1s" },
      { metric: "Cumulative Layout Shift (CLS)", target: "< 0.1", current: "~0.05" },
      { metric: "API Response Time (P95)", target: "< 500ms", current: "~350ms" },
      { metric: "AI Response Time", target: "< 3s", current: "~2.5s" },
      { metric: "Uptime SLA", target: "99.9%", current: "99.5%" }
    ],
    scalability: [
      { tier: "Current (Pilot)", users: "100", infra: "Supabase Free/Pro", cost: "€25/μήνα" },
      { tier: "Phase 2", users: "1,000", infra: "Supabase Pro", cost: "€200/μήνα" },
      { tier: "Phase 3", users: "10,000", infra: "Supabase Team + CDN", cost: "€500/μήνα" },
      { tier: "Scale", users: "100,000+", infra: "Enterprise + Multi-region", cost: "€2,000+/μήνα" }
    ]
  },
  security: [
    { area: "Authentication", implementation: "Supabase Auth (JWT)", compliance: "OAuth 2.0" },
    { area: "Data Encryption", implementation: "AES-256 at rest, TLS 1.3 in transit", compliance: "GDPR" },
    { area: "Access Control", implementation: "Row Level Security (RLS)", compliance: "HIPAA-style" },
    { area: "Audit Logging", implementation: "Full audit trail on medical data", compliance: "GDPR Art. 30" },
    { area: "Data Residency", implementation: "EU-based servers", compliance: "GDPR" },
    { area: "Consent Management", implementation: "Granular consent tracking", compliance: "GDPR Art. 7" }
  ]
};

// Unit Economics Data
const unitEconomics = {
  assumptions: {
    period: "18 months projection",
    currency: "EUR",
    market: "Greece (primary), EU (expansion)"
  },
  metrics: {
    cac: [
      { channel: "Organic/SEO", cac: "€5", ltv_cac: "12:1", quality: "High" },
      { channel: "Referral", cac: "€8", ltv_cac: "8:1", quality: "Very High" },
      { channel: "Google Ads", cac: "€25", ltv_cac: "3:1", quality: "Medium" },
      { channel: "Meta Ads", cac: "€18", ltv_cac: "4:1", quality: "Medium" },
      { channel: "Partnerships", cac: "€12", ltv_cac: "5:1", quality: "High" },
      { channel: "Blended Average", cac: "€15", ltv_cac: "5:1", quality: "-" }
    ],
    ltv: [
      { segment: "Free User", ltv: "€0", payback: "N/A", arpu: "€0", retention: "20%" },
      { segment: "Premium User", ltv: "€60", payback: "2 months", arpu: "€9.99", retention: "65%" },
      { segment: "Family User", ltv: "€120", payback: "3 months", arpu: "€19.99", retention: "75%" },
      { segment: "Provider (Basic)", ltv: "€0", payback: "N/A", arpu: "€0", retention: "40%" },
      { segment: "Provider (Pro)", ltv: "€350", payback: "4 months", arpu: "€49", retention: "80%" },
      { segment: "B2B Contract", ltv: "€25,000", payback: "6 months", arpu: "€4,167", retention: "90%" }
    ],
    churn: [
      { segment: "Free → Churned", rate: "80%", period: "Month 1", reason: "No activation" },
      { segment: "Free → Premium", rate: "5%", period: "Month 1-3", reason: "Value recognition" },
      { segment: "Premium Monthly", rate: "8%", period: "Monthly", reason: "Cost, alternatives" },
      { segment: "Premium Annual", rate: "15%", period: "Yearly", reason: "Life changes" },
      { segment: "Provider Pro", rate: "3%", period: "Monthly", reason: "ROI not proven" },
      { segment: "B2B Enterprise", rate: "10%", period: "Yearly", reason: "Contract renewal" }
    ]
  },
  projections: {
    revenue: [
      { month: 3, users: 100, premium: 5, providers: 2, mrr: 150, arr: 1800 },
      { month: 6, users: 500, premium: 40, providers: 15, mrr: 1200, arr: 14400 },
      { month: 12, users: 3000, premium: 250, providers: 80, mrr: 8500, arr: 102000 },
      { month: 18, users: 10000, premium: 800, providers: 200, mrr: 25000, arr: 300000 }
    ],
    costs: [
      { category: "Infrastructure", month3: 25, month6: 100, month12: 300, month18: 800 },
      { category: "AI/LLM Costs", month3: 50, month6: 200, month12: 600, month18: 1500 },
      { category: "Marketing", month3: 1500, month6: 5000, month12: 10000, month18: 15000 },
      { category: "Team (Salaries)", month3: 0, month6: 5000, month12: 15000, month18: 30000 },
      { category: "Operations", month3: 200, month6: 500, month12: 1000, month18: 2000 }
    ]
  },
  breakeven: {
    scenario: "Conservative",
    month: 14,
    requiredUsers: 5000,
    requiredPremium: 400,
    requiredProviders: 100,
    requiredB2B: 1
  }
};

// Team Structure Data
const teamStructure = {
  currentPhase: "Pilot (Pre-funding)",
  phases: [
    {
      name: "Pilot Phase",
      period: "Now - Month 3",
      headcount: 2,
      budget: "€0 (Sweat Equity)",
      roles: [
        { title: "Founder/CEO", type: "Co-founder", status: "Active", responsibilities: "Vision, strategy, fundraising, product" },
        { title: "CTO/Developer", type: "Co-founder", status: "Active", responsibilities: "Technical architecture, development" }
      ],
      outsourced: ["Legal (contract)", "Design (freelance)", "Medical Advisor (advisor)"]
    },
    {
      name: "Seed Phase",
      period: "Month 4-9",
      headcount: 5,
      budget: "€15,000/μήνα",
      roles: [
        { title: "CEO", type: "Full-time", status: "Existing", responsibilities: "Strategy, fundraising, partnerships" },
        { title: "CTO", type: "Full-time", status: "Existing", responsibilities: "Tech leadership, architecture" },
        { title: "Full-Stack Developer", type: "Full-time", status: "To Hire", responsibilities: "Frontend/backend development", salary: "€2,500-3,500" },
        { title: "Product Designer", type: "Full-time", status: "To Hire", responsibilities: "UX/UI, user research", salary: "€2,000-2,800" },
        { title: "Growth Marketer", type: "Full-time", status: "To Hire", responsibilities: "User acquisition, content", salary: "€2,000-2,500" }
      ],
      outsourced: ["Legal (retainer)", "Medical Advisors (2)", "Accounting"]
    },
    {
      name: "Series A Phase",
      period: "Month 10-18",
      headcount: 12,
      budget: "€50,000/μήνα",
      roles: [
        { title: "CEO", type: "Full-time", status: "Existing", responsibilities: "Leadership, fundraising" },
        { title: "CTO", type: "Full-time", status: "Existing", responsibilities: "Tech strategy" },
        { title: "VP Engineering", type: "Full-time", status: "To Hire", responsibilities: "Engineering team lead", salary: "€4,000-5,000" },
        { title: "Senior Developer (x2)", type: "Full-time", status: "To Hire", responsibilities: "Core platform", salary: "€3,000-4,000" },
        { title: "Mobile Developer", type: "Full-time", status: "To Hire", responsibilities: "Native apps", salary: "€3,000-3,500" },
        { title: "Data Engineer", type: "Full-time", status: "To Hire", responsibilities: "Analytics, ML pipeline", salary: "€3,500-4,500" },
        { title: "Head of Product", type: "Full-time", status: "To Hire", responsibilities: "Product strategy", salary: "€3,500-4,500" },
        { title: "Product Designer", type: "Full-time", status: "Existing", responsibilities: "Design system" },
        { title: "Head of Growth", type: "Full-time", status: "To Hire", responsibilities: "Marketing leadership", salary: "€3,500-4,500" },
        { title: "B2B Sales", type: "Full-time", status: "To Hire", responsibilities: "Enterprise sales", salary: "€2,500+commission" },
        { title: "Customer Success", type: "Full-time", status: "To Hire", responsibilities: "Support, retention", salary: "€2,000-2,500" },
        { title: "Medical Affairs", type: "Part-time", status: "To Hire", responsibilities: "Clinical oversight", salary: "€2,000" }
      ],
      outsourced: ["Legal (dedicated)", "PR Agency", "Compliance Consultant"]
    }
  ],
  advisors: [
    { role: "Medical Advisor", expertise: "Clinical oversight, medical content review", commitment: "2-4 hrs/week", compensation: "0.5% equity" },
    { role: "Legal Advisor", expertise: "Healthcare regulations, GDPR, MDR", commitment: "As needed", compensation: "Retainer" },
    { role: "Industry Advisor", expertise: "Health insurance, B2B sales", commitment: "2 hrs/week", compensation: "0.25% equity" },
    { role: "Technical Advisor", expertise: "AI/ML, scalability", commitment: "2 hrs/week", compensation: "0.25% equity" }
  ],
  hiringPriorities: [
    { priority: 1, role: "Full-Stack Developer", timing: "Month 4", reason: "Accelerate development" },
    { priority: 2, role: "Product Designer", timing: "Month 4", reason: "User experience" },
    { priority: 3, role: "Growth Marketer", timing: "Month 5", reason: "User acquisition" },
    { priority: 4, role: "Customer Success", timing: "Month 8", reason: "Retention, support" },
    { priority: 5, role: "B2B Sales", timing: "Month 10", reason: "Enterprise revenue" }
  ]
};

const getThreatColor = (threat: string) => {
  switch (threat) {
    case "high": return "bg-destructive/10 text-destructive border-destructive/30";
    case "medium": return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "low": return "bg-green-500/10 text-green-600 border-green-500/30";
    default: return "bg-muted text-muted-foreground";
  }
};

const getThreatLabel = (threat: string) => {
  switch (threat) {
    case "high": return "Υψηλή Απειλή";
    case "medium": return "Μέτρια Απειλή";
    case "low": return "Χαμηλή Απειλή";
    default: return "Εκτός Αγοράς";
  }
};

export default function CompetitiveAnalysis() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("competitors");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 print:bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 print:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω
          </Button>
          <Logo size="sm" />
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-8 print:mb-4">
          <Badge variant="outline" className="mb-4">Complete Business Analysis</Badge>
          <h1 className="text-3xl font-bold mb-2">Medithos Business Plan</h1>
          <p className="text-muted-foreground">Ανταγωνισμός • Τιμολόγηση • Unit Economics • Τεχνικά • Ομάδα</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
            <TabsTrigger value="competitors" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Ανταγωνισμός
            </TabsTrigger>
            <TabsTrigger value="marketing" className="text-xs">
              <Megaphone className="h-3 w-3 mr-1" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">
              <Euro className="h-3 w-3 mr-1" />
              Τιμολόγηση
            </TabsTrigger>
            <TabsTrigger value="economics" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Unit Economics
            </TabsTrigger>
            <TabsTrigger value="technical" className="text-xs">
              <Server className="h-3 w-3 mr-1" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Ομάδα
            </TabsTrigger>
          </TabsList>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Επισκόπηση Αγοράς
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">€2.5B</div>
                    <div className="text-sm text-muted-foreground">EU Digital Health Market (2024)</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">15%</div>
                    <div className="text-sm text-muted-foreground">Annual Growth Rate</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">€150M</div>
                    <div className="text-sm text-muted-foreground">Greek Market Size</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitor Cards */}
            <div className="grid gap-4">
              {competitors.map((competitor) => (
                <Card key={competitor.name} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {competitor.name}
                          <Badge variant="outline" className={getThreatColor(competitor.threat)}>
                            {getThreatLabel(competitor.threat)}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {competitor.country} • {competitor.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{competitor.users}</div>
                        <div className="text-xs text-muted-foreground">{competitor.pricing}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{competitor.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Δυνατά Σημεία
                        </h4>
                        <ul className="text-sm space-y-1">
                          {competitor.strengths.map((s, i) => (
                            <li key={i} className="text-muted-foreground">• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          Αδυναμίες
                        </h4>
                        <ul className="text-sm space-y-1">
                          {competitor.weaknesses.map((w, i) => (
                            <li key={i} className="text-muted-foreground">• {w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Competitive Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Συγκριτικός Πίνακας</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Feature</th>
                      <th className="text-center py-2 font-medium">Medithos</th>
                      <th className="text-center py-2 font-medium">DoctorAnytime</th>
                      <th className="text-center py-2 font-medium">Ada Health</th>
                      <th className="text-center py-2 font-medium">Doctolib</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "AI Symptom Triage", medithos: true, doctoranytime: false, ada: true, doctolib: false },
                      { feature: "Doctor Booking", medithos: true, doctoranytime: true, ada: false, doctolib: true },
                      { feature: "Medical Records", medithos: true, doctoranytime: false, ada: false, doctolib: false },
                      { feature: "Ελληνικά", medithos: true, doctoranytime: true, ada: false, doctolib: false },
                      { feature: "Professional Network", medithos: true, doctoranytime: false, ada: false, doctolib: false },
                      { feature: "Family Health Tree", medithos: true, doctoranytime: false, ada: false, doctolib: false },
                      { feature: "Telemedicine", medithos: true, doctoranytime: true, ada: false, doctolib: true },
                      { feature: "B2B Model", medithos: true, doctoranytime: true, ada: true, doctolib: true },
                    ].map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2">{row.feature}</td>
                        <td className="text-center py-2">
                          {row.medithos ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive/60 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-2">
                          {row.doctoranytime ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive/60 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-2">
                          {row.ada ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive/60 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-2">
                          {row.doctolib ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive/60 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Go-to-Market Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {marketingPlan.phases.map((phase, index) => (
                  <div key={phase.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          {phase.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{phase.duration}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{phase.budget}</div>
                        <div className="text-xs text-muted-foreground">Budget</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Στόχοι</h4>
                        <ul className="text-sm space-y-1">
                          {phase.goals.map((goal, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Target className="h-3 w-3 text-primary" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">KPIs</h4>
                        <ul className="text-sm space-y-1">
                          {phase.kpis.map((kpi, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <BarChart3 className="h-3 w-3 text-green-600" />
                              {kpi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Κανάλια & Budget Allocation</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {phase.channels.map((channel) => (
                          <div key={channel.name} className="bg-muted/50 rounded p-2 text-center">
                            <div className="font-medium text-sm">{channel.allocation}</div>
                            <div className="text-xs text-muted-foreground">{channel.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Target Segments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Target Segments & Personas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {marketingPlan.segments.map((segment) => {
                  const Icon = segment.icon;
                  return (
                    <div key={segment.name} className="border rounded-lg p-4">
                      <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <Icon className="h-5 w-5 text-primary" />
                        {segment.name}
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {segment.personas.map((persona, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3">
                            <div className="font-medium text-sm">{persona.title}</div>
                            {persona.age && (
                              <div className="text-xs text-muted-foreground">Ηλικία: {persona.age}</div>
                            )}
                            <div className="text-xs mt-2 text-muted-foreground">
                              <span className="font-medium">Pain:</span> {persona.pain}
                            </div>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {persona.value}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            {/* B2C Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  B2C Τιμολόγηση (Ασθενείς)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {pricingStrategy.b2c.tiers.map((tier) => (
                    <div 
                      key={tier.name} 
                      className={`border rounded-lg p-4 ${tier.highlight ? 'border-primary ring-2 ring-primary/20' : ''}`}
                    >
                      {tier.highlight && (
                        <Badge className="mb-2">Recommended</Badge>
                      )}
                      <h3 className="font-bold text-xl">{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold text-primary">{tier.price}</span>
                        <span className="text-muted-foreground">{tier.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                      
                      <div className="mt-4 space-y-2">
                        {tier.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            {f}
                          </div>
                        ))}
                        {tier.limitations.map((l, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <XCircle className="h-4 w-4 text-destructive/50 shrink-0" />
                            {l}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <span className="text-xs text-muted-foreground">Target: {tier.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* B2B Provider Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  B2B Τιμολόγηση (Επαγγελματίες Υγείας)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pricingStrategy.b2b.providers.map((provider) => (
                  <div key={provider.type} className="border rounded-lg p-4">
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <span className="text-2xl">{provider.icon}</span>
                      {provider.type}
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {provider.tiers.map((tier) => (
                        <div key={tier.name} className="bg-muted/30 rounded p-3">
                          <div className="font-medium">{tier.name}</div>
                          <div className="text-lg font-bold text-primary">{tier.price}</div>
                          <ul className="mt-2 text-xs space-y-1">
                            {tier.features.map((f, i) => (
                              <li key={i} className="text-muted-foreground">• {f}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enterprise Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Enterprise Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {pricingStrategy.b2b.enterprise.map((ent) => (
                    <div key={ent.name} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{ent.name}</h4>
                      <div className="text-lg font-bold text-primary mt-2">{ent.pricing}</div>
                      <div className="text-sm text-muted-foreground mt-1">Min: {ent.minContract}</div>
                      <div className="mt-3 text-xs bg-muted/50 rounded p-2">
                        <span className="font-medium">Value:</span> {ent.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transaction Fees */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Transaction Fees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium">Booking Fee</div>
                    <div className="text-lg font-bold text-primary mt-1">{pricingStrategy.transactions.bookingFee.provider}</div>
                    <div className="text-xs text-muted-foreground">per booking (provider pays)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium">Telemedicine</div>
                    <div className="text-lg font-bold text-primary mt-1">{pricingStrategy.transactions.telemedicine.commission}</div>
                    <div className="text-xs text-muted-foreground">commission (min €3)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium">Lab Referrals</div>
                    <div className="text-lg font-bold text-primary mt-1">{pricingStrategy.transactions.labReferrals.commission}</div>
                    <div className="text-xs text-muted-foreground">commission</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium">Featured Listing</div>
                    <div className="text-lg font-bold text-primary mt-1">{pricingStrategy.transactions.premiumPlacement.featured}</div>
                    <div className="text-xs text-muted-foreground">per month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unit Economics Tab */}
          <TabsContent value="economics" className="space-y-6">
            {/* CAC by Channel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Customer Acquisition Cost (CAC)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Channel</th>
                        <th className="text-center py-2">CAC</th>
                        <th className="text-center py-2">LTV:CAC</th>
                        <th className="text-center py-2">Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitEconomics.metrics.cac.map((row, i) => (
                        <tr key={i} className={`border-b ${row.channel === 'Blended Average' ? 'bg-primary/5 font-medium' : ''}`}>
                          <td className="py-2">{row.channel}</td>
                          <td className="text-center py-2 font-medium text-primary">{row.cac}</td>
                          <td className="text-center py-2">{row.ltv_cac}</td>
                          <td className="text-center py-2">
                            <Badge variant="outline" className={
                              row.quality === 'Very High' ? 'bg-green-500/10 text-green-600' :
                              row.quality === 'High' ? 'bg-green-500/10 text-green-600' :
                              row.quality === 'Medium' ? 'bg-amber-500/10 text-amber-600' : ''
                            }>
                              {row.quality}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* LTV by Segment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lifetime Value (LTV)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Segment</th>
                        <th className="text-center py-2">LTV</th>
                        <th className="text-center py-2">ARPU</th>
                        <th className="text-center py-2">Payback</th>
                        <th className="text-center py-2">Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitEconomics.metrics.ltv.map((row, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{row.segment}</td>
                          <td className="text-center py-2 font-medium text-primary">{row.ltv}</td>
                          <td className="text-center py-2">{row.arpu}</td>
                          <td className="text-center py-2">{row.payback}</td>
                          <td className="text-center py-2">{row.retention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Churn Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Churn Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unitEconomics.metrics.churn.map((row, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{row.segment}</span>
                        <Badge variant="outline" className={
                          parseFloat(row.rate) > 50 ? 'bg-destructive/10 text-destructive' :
                          parseFloat(row.rate) > 10 ? 'bg-amber-500/10 text-amber-600' :
                          'bg-green-500/10 text-green-600'
                        }>
                          {row.rate}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        <span className="font-medium">Period:</span> {row.period}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Reason:</span> {row.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Projections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Projections (18 months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-center py-2">Users</th>
                        <th className="text-center py-2">Premium</th>
                        <th className="text-center py-2">Providers</th>
                        <th className="text-center py-2">MRR</th>
                        <th className="text-center py-2">ARR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitEconomics.projections.revenue.map((row, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2 font-medium">Month {row.month}</td>
                          <td className="text-center py-2">{row.users.toLocaleString()}</td>
                          <td className="text-center py-2">{row.premium}</td>
                          <td className="text-center py-2">{row.providers}</td>
                          <td className="text-center py-2 font-medium text-primary">€{row.mrr.toLocaleString()}</td>
                          <td className="text-center py-2 font-bold text-primary">€{row.arr.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Breakeven */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Breakeven Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">Month {unitEconomics.breakeven.month}</div>
                    <div className="text-sm text-muted-foreground">Breakeven Point</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold">{unitEconomics.breakeven.requiredUsers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Required Users</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold">{unitEconomics.breakeven.requiredPremium}</div>
                    <div className="text-sm text-muted-foreground">Premium Users</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold">{unitEconomics.breakeven.requiredProviders}</div>
                    <div className="text-sm text-muted-foreground">Pro Providers</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold">{unitEconomics.breakeven.requiredB2B}</div>
                    <div className="text-sm text-muted-foreground">B2B Contract</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-6">
            {/* Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Technical Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(technicalSpecs.architecture).map(([category, techs]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <h4 className="font-semibold capitalize mb-3 flex items-center gap-2">
                        {category === 'frontend' && <Code className="h-4 w-4" />}
                        {category === 'backend' && <Server className="h-4 w-4" />}
                        {category === 'ai' && <Brain className="h-4 w-4" />}
                        {category === 'future' && <Clock className="h-4 w-4" />}
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {techs.map((tech, i) => (
                          <div key={i} className="text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">{tech.tech}</span>
                              <Badge variant="outline" className={
                                tech.status === 'Production' ? 'bg-green-500/10 text-green-600 text-xs' :
                                'bg-muted text-muted-foreground text-xs'
                              }>
                                {tech.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">{tech.purpose}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Specs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Endpoint</th>
                        <th className="text-center py-2">Method</th>
                        <th className="text-left py-2">Purpose</th>
                        <th className="text-center py-2">Rate Limit</th>
                        <th className="text-center py-2">Auth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {technicalSpecs.apis.map((api, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2 font-mono text-xs">{api.endpoint}</td>
                          <td className="text-center py-2">
                            <Badge variant="outline">{api.method}</Badge>
                          </td>
                          <td className="py-2 text-muted-foreground">{api.purpose}</td>
                          <td className="text-center py-2 text-xs">{api.rateLimit}</td>
                          <td className="text-center py-2 text-xs">{api.auth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Performance Targets</h4>
                    <div className="space-y-3">
                      {technicalSpecs.performance.targets.map((perf, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm">{perf.metric}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-muted">{perf.target}</Badge>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600">{perf.current}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Scalability Plan</h4>
                    <div className="space-y-3">
                      {technicalSpecs.performance.scalability.map((scale, i) => (
                        <div key={i} className="border rounded p-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{scale.tier}</span>
                            <span className="text-primary font-medium">{scale.cost}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {scale.users} users • {scale.infra}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {technicalSpecs.security.map((sec, i) => (
                    <div key={i} className="border rounded p-3">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{sec.area}</span>
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600">
                          {sec.compliance}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{sec.implementation}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            {/* Phase-based Team Structure */}
            {teamStructure.phases.map((phase, index) => (
              <Card key={phase.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      {phase.name}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">{phase.period}</span>
                  </CardTitle>
                  <div className="flex gap-4 text-sm">
                    <span><strong>Headcount:</strong> {phase.headcount}</span>
                    <span><strong>Budget:</strong> {phase.budget}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Role</th>
                          <th className="text-center py-2">Type</th>
                          <th className="text-center py-2">Status</th>
                          <th className="text-left py-2">Responsibilities</th>
                          {phase.roles.some(r => r.salary) && <th className="text-right py-2">Salary</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {phase.roles.map((role, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-2 font-medium">{role.title}</td>
                            <td className="text-center py-2">
                              <Badge variant="outline">{role.type}</Badge>
                            </td>
                            <td className="text-center py-2">
                              <Badge variant={role.status === 'Active' || role.status === 'Existing' ? 'default' : 'secondary'}>
                                {role.status}
                              </Badge>
                            </td>
                            <td className="py-2 text-muted-foreground text-xs">{role.responsibilities}</td>
                            {phase.roles.some(r => r.salary) && (
                              <td className="text-right py-2 font-medium">{role.salary || '-'}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {phase.outsourced && (
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-xs font-medium">Outsourced: </span>
                      <span className="text-xs text-muted-foreground">{phase.outsourced.join(', ')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Advisors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Advisory Board
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {teamStructure.advisors.map((advisor, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{advisor.role}</h4>
                      <div className="text-sm text-muted-foreground mt-1">{advisor.expertise}</div>
                      <div className="flex justify-between mt-3 text-xs">
                        <span><strong>Commitment:</strong> {advisor.commitment}</span>
                        <Badge variant="outline">{advisor.compensation}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hiring Priorities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Hiring Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamStructure.hiringPriorities.map((hire) => (
                    <div key={hire.priority} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {hire.priority}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{hire.role}</div>
                        <div className="text-xs text-muted-foreground">{hire.reason}</div>
                      </div>
                      <Badge variant="outline">{hire.timing}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Org Chart Visual */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Chart (Phase 3)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-primary text-primary-foreground rounded-lg font-semibold">
                    CEO / Founder
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="grid grid-cols-4 gap-4 w-full">
                    {['CTO', 'VP Engineering', 'Head of Product', 'Head of Growth'].map((role) => (
                      <div key={role} className="p-2 bg-muted rounded text-center text-sm font-medium">
                        {role}
                      </div>
                    ))}
                  </div>
                  <div className="w-full border-t pt-4 mt-2">
                    <div className="grid grid-cols-6 gap-2">
                      {['Dev x2', 'Mobile', 'Data', 'Designer', 'Sales', 'CS'].map((role) => (
                        <div key={role} className="p-2 bg-muted/50 rounded text-center text-xs">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
