import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Globe,
  Users,
  Brain,
  Calendar,
  Building2,
  Stethoscope,
  Smartphone,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompetitorDetails {
  name: string;
  logo?: string;
  country: string;
  founded: string;
  funding: string;
  type: string;
  description: string;
  website: string;
  users: string;
  pricing: string;
  threat: "none" | "low" | "medium" | "high" | "critical";
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  features: {
    aiSymptomChecker: boolean | "partial";
    onlineBooking: boolean | "partial";
    telemedicine: boolean | "partial";
    medicalRecords: boolean | "partial";
    greekMarket: boolean | "partial";
    providerNetwork: boolean | "partial";
    mobileApp: boolean | "partial";
    b2bServices: boolean | "partial";
  };
  competitivePosition: string;
  medithosDifferentiator: string;
}

const competitors: CompetitorDetails[] = [
  {
    name: "DoctorAnytime",
    country: "🇬🇷 Ελλάδα / Ευρώπη",
    founded: "2012",
    funding: "€15M+",
    type: "Online Booking Platform",
    description: "Η μεγαλύτερη πλατφόρμα κράτησης ραντεβού στην Ελλάδα με πάνω από 5,000 επαληθευμένους γιατρούς. Προσφέρει online booking, τηλεϊατρική και reviews γιατρών. Market leader στην ελληνική αγορά.",
    website: "doctoranytime.gr",
    users: "2M+ χρήστες",
    pricing: "Commission-based (γιατροί πληρώνουν €3-8/ραντεβού)",
    threat: "high",
    swot: {
      strengths: [
        "Κυρίαρχη θέση στην ελληνική αγορά",
        "Μεγάλο δίκτυο επαληθευμένων γιατρών",
        "Strong brand awareness & trust",
        "Τηλεϊατρική υπηρεσία COVID-era",
        "Mobile apps για iOS/Android",
        "SEO dominance στην Ελλάδα"
      ],
      weaknesses: [
        "Καμία AI triage/navigation",
        "Δεν υπάρχει ενοποιημένο ιατρικό ιστορικό",
        "Passive platform - ο χρήστης πρέπει να ξέρει ποια ειδικότητα θέλει",
        "Δεν προετοιμάζει τον ασθενή για την επίσκεψη",
        "Καμία κοινότητα/social features για γιατρούς"
      ],
      opportunities: [
        "Partnership για referrals",
        "API integration για booking",
        "Complementary positioning"
      ],
      threats: [
        "Μπορεί να αναπτύξει AI features",
        "Strong defense position",
        "Marketing budget πολύ μεγαλύτερο"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: false,
      greekMarket: true,
      providerNetwork: true,
      mobileApp: true,
      b2bServices: "partial"
    },
    competitivePosition: "Direct competitor in booking, but lacks health navigation. Medithos can position as 'before DoctorAnytime' - helping users know which specialist to book.",
    medithosDifferentiator: "AI Navigator που οδηγεί στη σωστή ειδικότητα + Living Medical Record = Pre-visit intelligence που το DoctorAnytime δεν έχει"
  },
  {
    name: "Doctolib",
    country: "🇫🇷 Γαλλία / 🇩🇪 Γερμανία",
    founded: "2013",
    funding: "€500M+ (Unicorn)",
    type: "Healthcare Booking Giant",
    description: "Ευρωπαϊκός γίγαντας υγείας με 80M+ χρήστες. Πλήρες οικοσύστημα booking, practice management, και telemedicine. Δυνητικός εισβολέας στην ελληνική αγορά.",
    website: "doctolib.fr",
    users: "80M+ χρήστες",
    pricing: "Subscription €129/μήνα/γιατρό",
    threat: "medium",
    swot: {
      strengths: [
        "Τεράστιο funding και resources",
        "Ολοκληρωμένο B2B ecosystem",
        "EHR integrations με νοσοκομεία",
        "Strong operational excellence",
        "Government partnerships",
        "Proven scalability model"
      ],
      weaknesses: [
        "Δεν διαθέτει AI symptom checker",
        "Complex onboarding για μικρούς γιατρούς",
        "Enterprise-focused, όχι patient-centric",
        "Ακόμα δεν είναι στην Ελλάδα",
        "High pricing για ελληνική αγορά"
      ],
      opportunities: [
        "First-mover advantage στο AI navigation",
        "Μπορούμε να χτίσουμε base πριν μπουν",
        "Localization barrier για Ελλάδα"
      ],
      threats: [
        "Αν μπουν Ελλάδα, θα είναι aggressive",
        "Μπορεί να αγοράσουν τοπικό player",
        "Deep pockets for marketing"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: "partial",
      greekMarket: false,
      providerNetwork: true,
      mobileApp: true,
      b2bServices: true
    },
    competitivePosition: "Not yet in Greece. Medithos has 12-18 months window to establish AI-first positioning before potential entry.",
    medithosDifferentiator: "Patient-centric approach vs Doctolib's provider-centric model. AI navigation layer που δεν έχουν."
  },
  {
    name: "Ada Health",
    country: "🇩🇪 Γερμανία",
    founded: "2011",
    funding: "€200M+",
    type: "AI Symptom Checker",
    description: "Best-in-class AI symptom assessment με CE marking ως medical device. 13M+ downloads, strong B2B με ασφαλιστικές. Gold standard για AI health assessment.",
    website: "ada.com",
    users: "13M+ downloads",
    pricing: "Freemium + B2B licensing",
    threat: "medium",
    swot: {
      strengths: [
        "Κορυφαία AI accuracy (clinical validation)",
        "CE-marked medical device (Class IIa)",
        "Strong B2B partnerships (Bayer, Sutter)",
        "Multi-language support",
        "Robust clinical advisory board",
        "First-mover in AI symptom space"
      ],
      weaknesses: [
        "Δεν κάνει booking - stop at assessment",
        "Δεν υπάρχουν ελληνικά",
        "Δεν συνδέει με τοπικούς γιατρούς",
        "Μόνο symptom check, όχι ecosystem",
        "No medical record management"
      ],
      opportunities: [
        "Potential integration partner",
        "License their AI engine",
        "Complementary positioning"
      ],
      threats: [
        "Μπορεί να προσθέσουν booking",
        "B2B competition για ασφαλιστικές",
        "Set the bar for AI quality"
      ]
    },
    features: {
      aiSymptomChecker: true,
      onlineBooking: false,
      telemedicine: false,
      medicalRecords: false,
      greekMarket: false,
      providerNetwork: false,
      mobileApp: true,
      b2bServices: true
    },
    competitivePosition: "Excellent at AI assessment but stops there. Medithos continues the journey from assessment to action.",
    medithosDifferentiator: "Full journey: AI Assessment → Specialty Recommendation → Provider Booking → Medical Record. Ada stops at step 1."
  },
  {
    name: "Babylon Health",
    country: "🇬🇧 UK",
    founded: "2013",
    funding: "€500M+ (IPO, now struggling)",
    type: "Digital Health Platform",
    description: "AI-first telehealth με ιδίους γιατρούς. Pioneer του 'virtual GP' model. Μετά από financial troubles (2023), περιορίστηκε στο UK market.",
    website: "babylonhealth.com",
    users: "6M+ χρήστες",
    pricing: "Subscription £10/μήνα",
    threat: "low",
    swot: {
      strengths: [
        "Integrated AI + human doctors",
        "24/7 availability model",
        "NHS partnership experience",
        "Video consultation technology",
        "Strong AI IP portfolio"
      ],
      weaknesses: [
        "Financial instability (2023 restructure)",
        "UK-only operations now",
        "High cost structure (employed doctors)",
        "Regulatory challenges in new markets",
        "Damaged brand from financial issues"
      ],
      opportunities: [
        "Learn from their mistakes",
        "Their model validates AI+Doctor combo",
        "Talent pool from layoffs"
      ],
      threats: [
        "Low - focused on survival",
        "Unlikely to expand to Greece"
      ]
    },
    features: {
      aiSymptomChecker: true,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: "partial",
      greekMarket: false,
      providerNetwork: false,
      mobileApp: true,
      b2bServices: true
    },
    competitivePosition: "Cautionary tale - proves AI+Doctor model works but unsustainable cost structure. Medithos uses marketplace model instead.",
    medithosDifferentiator: "Asset-light marketplace model vs Babylon's employed-doctor model. Lower costs, higher scalability."
  },
  {
    name: "K Health",
    country: "🇺🇸 USA",
    founded: "2016",
    funding: "$300M+",
    type: "AI Primary Care",
    description: "AI-powered primary care με chat-first approach. Χρησιμοποιεί billions of clinical data points για διάγνωση. Leading US AI health platform.",
    website: "khealth.com",
    users: "4M+ χρήστες",
    pricing: "$12-49/visit",
    threat: "low",
    swot: {
      strengths: [
        "Sophisticated AI με real clinical data",
        "Low-cost care model ($12/visit)",
        "Strong data moat (Maccabi partnership)",
        "Prescription capability",
        "Proven unit economics"
      ],
      weaknesses: [
        "US-only (regulatory)",
        "Cannot expand to EU easily",
        "Requires US medical license",
        "No preventive care focus",
        "Limited to primary care"
      ],
      opportunities: [
        "Study their AI/UX approach",
        "Their model proves patient demand",
        "No European competition"
      ],
      threats: [
        "Very low - US regulatory constraints",
        "Different healthcare systems"
      ]
    },
    features: {
      aiSymptomChecker: true,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: true,
      greekMarket: false,
      providerNetwork: false,
      mobileApp: true,
      b2bServices: true
    },
    competitivePosition: "US benchmark for AI health. Regulatory barriers prevent EU entry. Medithos can be 'K Health of Europe'.",
    medithosDifferentiator: "European-first, GDPR-compliant, works with existing healthcare system vs disrupting it."
  },
  {
    name: "Medidate",
    country: "🇬🇷 Ελλάδα",
    founded: "2008",
    funding: "Bootstrapped",
    type: "Medical Directory",
    description: "Παλαιός ελληνικός κατάλογος γιατρών με reviews και βασικές πληροφορίες. Legacy platform με καλό SEO αλλά outdated technology.",
    website: "medidate.gr",
    users: "~500K visits/μήνα",
    pricing: "Freemium listings",
    threat: "low",
    swot: {
      strengths: [
        "Καλό SEO στην Ελλάδα",
        "Απλή χρήση",
        "Χαμηλό κόστος λειτουργίας",
        "Established presence years"
      ],
      weaknesses: [
        "Outdated technology stack",
        "Δεν έχει online booking",
        "Δεν έχει verification γιατρών",
        "Passive directory only",
        "No mobile app",
        "No innovation"
      ],
      opportunities: [
        "Acquisition target",
        "Their SEO traffic",
        "User base migration"
      ],
      threats: [
        "Minimal - declining relevance",
        "No resources to compete"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: false,
      telemedicine: false,
      medicalRecords: false,
      greekMarket: true,
      providerNetwork: "partial",
      mobileApp: false,
      b2bServices: false
    },
    competitivePosition: "Legacy player, not competitive. Easy to outperform on all dimensions.",
    medithosDifferentiator: "Everything. Modern platform vs static directory."
  },
  {
    name: "iAtros",
    country: "🇬🇷 Ελλάδα",
    founded: "2020",
    funding: "Unknown (small)",
    type: "Telehealth Platform",
    description: "Ελληνική τηλεϊατρική πλατφόρμα που εστιάζει σε B2B συνεργασίες με εταιρείες για υπηρεσίες υγείας εργαζομένων.",
    website: "iatros.gr",
    users: "~50K χρήστες",
    pricing: "Per-visit pricing (€25-50)",
    threat: "low",
    swot: {
      strengths: [
        "Greek market focus",
        "Telemedicine technology",
        "B2B employer contracts",
        "Local team"
      ],
      weaknesses: [
        "Μικρό δίκτυο γιατρών",
        "Δεν έχει AI capabilities",
        "Limited features",
        "No patient records",
        "Narrow focus (only telemedicine)"
      ],
      opportunities: [
        "Partnership opportunity",
        "Their B2B contacts",
        "Telemedicine integration"
      ],
      threats: [
        "Low - limited scope",
        "No resources to expand"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: "partial",
      telemedicine: true,
      medicalRecords: false,
      greekMarket: true,
      providerNetwork: "partial",
      mobileApp: false,
      b2bServices: true
    },
    competitivePosition: "Niche player in telemedicine. Potential partnership for video consultation feature.",
    medithosDifferentiator: "Full ecosystem vs single feature. AI navigation they don't have."
  },
  {
    name: "Zocdoc",
    country: "🇺🇸 USA",
    founded: "2007",
    funding: "$400M+",
    type: "Healthcare Marketplace",
    description: "Η μεγαλύτερη πλατφόρμα booking υγείας στις ΗΠΑ. Industry benchmark για marketplace model. US-only λόγω insurance complexity.",
    website: "zocdoc.com",
    users: "6M+ monthly users",
    pricing: "Pay-per-booking ($35-110/ραντεβού)",
    threat: "none",
    swot: {
      strengths: [
        "US market leader",
        "Strong insurance integrations",
        "Real-time availability checking",
        "Excellent reviews system",
        "Strong brand in US"
      ],
      weaknesses: [
        "US-only (insurance-dependent)",
        "No AI triage features",
        "High commission model",
        "No health records",
        "Cannot expand internationally"
      ],
      opportunities: [
        "Study their marketplace model",
        "UX/UI inspiration",
        "Proves market demand"
      ],
      threats: [
        "None - US-only business"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: false,
      greekMarket: false,
      providerNetwork: true,
      mobileApp: true,
      b2bServices: "partial"
    },
    competitivePosition: "US benchmark only - no international threat. Proves marketplace + booking model works at scale.",
    medithosDifferentiator: "AI-first approach + medical records. Zocdoc is booking-only, we're health navigation."
  }
];

const getThreatColor = (threat: string) => {
  switch (threat) {
    case "critical": return "bg-red-600 text-white";
    case "high": return "bg-red-500 text-white";
    case "medium": return "bg-yellow-500 text-black";
    case "low": return "bg-green-500 text-white";
    case "none": return "bg-gray-400 text-white";
    default: return "bg-gray-400 text-white";
  }
};

const getThreatLabel = (threat: string) => {
  switch (threat) {
    case "critical": return "Κρίσιμη Απειλή";
    case "high": return "Υψηλή Απειλή";
    case "medium": return "Μεσαία Απειλή";
    case "low": return "Χαμηλή Απειλή";
    case "none": return "Χωρίς Απειλή";
    default: return threat;
  }
};

const FeatureIcon = ({ value }: { value: boolean | "partial" }) => {
  if (value === true) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (value === "partial") return <Minus className="h-4 w-4 text-yellow-500" />;
  return <XCircle className="h-4 w-4 text-red-400" />;
};

export const CompetitorAnalysisSection = () => {
  return (
    <div className="space-y-8">
      {/* Summary Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Πίνακας Σύγκρισης Ανταγωνιστών
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Ανταγωνιστής</th>
                <th className="text-center py-3 px-2">AI Triage</th>
                <th className="text-center py-3 px-2">Booking</th>
                <th className="text-center py-3 px-2">Telemedicine</th>
                <th className="text-center py-3 px-2">Medical Records</th>
                <th className="text-center py-3 px-2">🇬🇷 Ελλάδα</th>
                <th className="text-center py-3 px-2">Απειλή</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((comp) => (
                <tr key={comp.name} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2">
                    <div className="font-medium">{comp.name}</div>
                    <div className="text-xs text-muted-foreground">{comp.country}</div>
                  </td>
                  <td className="text-center py-3 px-2"><FeatureIcon value={comp.features.aiSymptomChecker} /></td>
                  <td className="text-center py-3 px-2"><FeatureIcon value={comp.features.onlineBooking} /></td>
                  <td className="text-center py-3 px-2"><FeatureIcon value={comp.features.telemedicine} /></td>
                  <td className="text-center py-3 px-2"><FeatureIcon value={comp.features.medicalRecords} /></td>
                  <td className="text-center py-3 px-2"><FeatureIcon value={comp.features.greekMarket} /></td>
                  <td className="text-center py-3 px-2">
                    <Badge className={cn("text-xs", getThreatColor(comp.threat))}>
                      {getThreatLabel(comp.threat)}
                    </Badge>
                  </td>
                </tr>
              ))}
              {/* Medithos Row */}
              <tr className="bg-primary/10 font-medium">
                <td className="py-3 px-2">
                  <div className="font-bold text-primary">Medithos</div>
                  <div className="text-xs text-muted-foreground">🇬🇷 Ελλάδα (εμείς)</div>
                </td>
                <td className="text-center py-3 px-2"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                <td className="text-center py-3 px-2"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                <td className="text-center py-3 px-2"><Minus className="h-4 w-4 text-yellow-500 mx-auto" /></td>
                <td className="text-center py-3 px-2"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                <td className="text-center py-3 px-2"><CheckCircle2 className="h-4 w-4 text-primary mx-auto" /></td>
                <td className="text-center py-3 px-2">
                  <Badge className="bg-primary text-primary-foreground text-xs">Εμείς</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detailed Competitor Cards */}
      <div className="grid gap-6">
        {competitors.map((comp) => (
          <Card key={comp.name} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {comp.name}
                    <Badge className={cn("ml-2", getThreatColor(comp.threat))}>
                      {getThreatLabel(comp.threat)}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {comp.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {comp.founded}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> {comp.funding}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {comp.users}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{comp.description}</p>
            </CardHeader>
            <CardContent className="pt-6">
              {/* SWOT Analysis */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Strengths */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Δυνατά Σημεία
                  </h4>
                  <ul className="space-y-1">
                    {comp.swot.strengths.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 mt-1 text-green-500 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Αδύνατα Σημεία
                  </h4>
                  <ul className="space-y-1">
                    {comp.swot.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 mt-1 text-red-500 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Ευκαιρίες για Medithos
                  </h4>
                  <ul className="space-y-1">
                    {comp.swot.opportunities.map((o, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 mt-1 text-blue-500 shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Απειλές
                  </h4>
                  <ul className="space-y-1">
                    {comp.swot.threats.map((t, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 mt-1 text-orange-500 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Competitive Position & Differentiator */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" /> Ανταγωνιστική Θέση
                  </h4>
                  <p className="text-sm text-muted-foreground">{comp.competitivePosition}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                    <Shield className="h-4 w-4" /> Medithos Differentiator
                  </h4>
                  <p className="text-sm">{comp.medithosDifferentiator}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                <span className="text-sm font-medium">Τιμολόγηση:</span>
                <span className="text-sm ml-2 text-muted-foreground">{comp.pricing}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategic Takeaways */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Στρατηγικά Συμπεράσματα
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">🎯 Competitive Gaps (Medithos Opportunity)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>AI Health Navigation:</strong> Κανείς δεν συνδυάζει AI triage + booking + records στην Ελλάδα</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Unified Medical Record:</strong> Κανείς δεν προσφέρει ενοποιημένο ιατρικό αρχείο ελεγχόμενο από τον ασθενή</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Pre-visit Intelligence:</strong> Examary reports = unique feature globally</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Doctor Community:</strong> LinkedIn-style network για γιατρούς δεν υπάρχει</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">⚔️ Defense Strategy</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>vs DoctorAnytime:</strong> Position as "before DoctorAnytime" - help users decide specialty</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>vs Doctolib:</strong> Build local network + AI moat before potential entry</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>vs Ada Health:</strong> Full journey vs single assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Long-term:</strong> Data moat + doctor relationships + user habits</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
