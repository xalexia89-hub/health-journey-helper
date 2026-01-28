import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Download,
  FileSearch,
  Euro,
  TrendingUp,
  BarChart3,
  Globe,
  Users,
  CheckCircle2,
  XCircle,
  Shield,
  Brain,
  ChevronRight,
  Minus,
  Calendar,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

// Competitor Data with full SWOT
interface CompetitorDetails {
  name: string;
  country: string;
  founded: string;
  funding: string;
  type: string;
  description: string;
  users: string;
  pricing: string;
  threat: "none" | "low" | "medium" | "high";
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
  };
  medithosDifferentiator: string;
}

const competitors: CompetitorDetails[] = [
  {
    name: "DoctorAnytime",
    country: "🇬🇷 Ελλάδα / Ευρώπη",
    founded: "2012",
    funding: "€15M+",
    type: "Online Booking Platform",
    description: "Η μεγαλύτερη πλατφόρμα κράτησης ραντεβού στην Ελλάδα με πάνω από 5,000 επαληθευμένους γιατρούς.",
    users: "2M+ χρήστες",
    pricing: "Commission-based (€3-8/ραντεβού)",
    threat: "high",
    swot: {
      strengths: [
        "Κυρίαρχη θέση στην ελληνική αγορά",
        "Μεγάλο δίκτυο επαληθευμένων γιατρών",
        "Strong brand awareness & trust",
        "Mobile apps για iOS/Android"
      ],
      weaknesses: [
        "Καμία AI triage/navigation",
        "Δεν υπάρχει ενοποιημένο ιατρικό ιστορικό",
        "Passive platform - ο χρήστης πρέπει να ξέρει ποια ειδικότητα θέλει"
      ],
      opportunities: [
        "Partnership για referrals",
        "Complementary positioning"
      ],
      threats: [
        "Μπορεί να αναπτύξει AI features",
        "Marketing budget πολύ μεγαλύτερο"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: false,
      greekMarket: true
    },
    medithosDifferentiator: "AI Navigator που οδηγεί στη σωστή ειδικότητα + Living Medical Record"
  },
  {
    name: "Doctolib",
    country: "🇫🇷 Γαλλία / 🇩🇪 Γερμανία",
    founded: "2013",
    funding: "€500M+ (Unicorn)",
    type: "Healthcare Booking Giant",
    description: "Ευρωπαϊκός γίγαντας υγείας με 80M+ χρήστες. Δυνητικός εισβολέας στην ελληνική αγορά.",
    users: "80M+ χρήστες",
    pricing: "€129/μήνα/γιατρό",
    threat: "medium",
    swot: {
      strengths: [
        "Τεράστιο funding και resources",
        "Ολοκληρωμένο B2B ecosystem",
        "EHR integrations με νοσοκομεία"
      ],
      weaknesses: [
        "Δεν διαθέτει AI symptom checker",
        "Enterprise-focused, όχι patient-centric",
        "Δεν είναι στην Ελλάδα"
      ],
      opportunities: [
        "First-mover advantage στο AI navigation",
        "Localization barrier για Ελλάδα"
      ],
      threats: [
        "Αν μπουν Ελλάδα, θα είναι aggressive"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: "partial",
      greekMarket: false
    },
    medithosDifferentiator: "Patient-centric approach vs provider-centric model"
  },
  {
    name: "Ada Health",
    country: "🇩🇪 Γερμανία",
    founded: "2011",
    funding: "€200M+",
    type: "AI Symptom Checker",
    description: "Best-in-class AI symptom assessment με CE marking ως medical device. 13M+ downloads.",
    users: "13M+ downloads",
    pricing: "Freemium + B2B licensing",
    threat: "medium",
    swot: {
      strengths: [
        "Κορυφαία AI accuracy (clinical validation)",
        "CE-marked medical device (Class IIa)",
        "Strong B2B partnerships"
      ],
      weaknesses: [
        "Δεν κάνει booking - stop at assessment",
        "Δεν υπάρχουν ελληνικά",
        "Δεν συνδέει με τοπικούς γιατρούς"
      ],
      opportunities: [
        "Potential integration partner",
        "Complementary positioning"
      ],
      threats: [
        "Set the bar for AI quality"
      ]
    },
    features: {
      aiSymptomChecker: true,
      onlineBooking: false,
      telemedicine: false,
      medicalRecords: false,
      greekMarket: false
    },
    medithosDifferentiator: "Full journey: AI → Specialty → Booking → Record. Ada stops at step 1."
  },
  {
    name: "Babylon Health",
    country: "🇬🇧 UK",
    founded: "2013",
    funding: "€500M+ (struggling)",
    type: "Digital Health Platform",
    description: "AI-first telehealth με ιδίους γιατρούς. Financial troubles (2023).",
    users: "6M+ χρήστες",
    pricing: "£10/μήνα",
    threat: "low",
    swot: {
      strengths: [
        "Integrated AI + human doctors",
        "24/7 availability model"
      ],
      weaknesses: [
        "Financial instability (2023)",
        "UK-only operations now",
        "High cost structure"
      ],
      opportunities: [
        "Learn from their mistakes"
      ],
      threats: [
        "Low - focused on survival"
      ]
    },
    features: {
      aiSymptomChecker: true,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: "partial",
      greekMarket: false
    },
    medithosDifferentiator: "Asset-light marketplace model vs employed-doctor model"
  },
  {
    name: "K Health",
    country: "🇺🇸 USA",
    founded: "2016",
    funding: "$300M+",
    type: "AI Primary Care",
    description: "AI-powered primary care με chat-first approach. Leading US AI health platform.",
    users: "4M+ χρήστες",
    pricing: "$12-49/visit",
    threat: "low",
    swot: {
      strengths: [
        "Sophisticated AI με real clinical data",
        "Low-cost care model",
        "Proven unit economics"
      ],
      weaknesses: [
        "US-only (regulatory)",
        "Cannot expand to EU easily"
      ],
      opportunities: [
        "No European competition",
        "Medithos = 'K Health of Europe'"
      ],
      threats: [
        "Very low - US regulatory constraints"
      ]
    },
    features: {
      aiSymptomChecker: true,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: true,
      greekMarket: false
    },
    medithosDifferentiator: "European-first, GDPR-compliant, works with existing healthcare system"
  },
  {
    name: "Medidate",
    country: "🇬🇷 Ελλάδα",
    founded: "2008",
    funding: "Bootstrapped",
    type: "Medical Directory",
    description: "Παλαιός ελληνικός κατάλογος γιατρών με reviews. Legacy platform.",
    users: "~500K visits/μήνα",
    pricing: "Freemium listings",
    threat: "low",
    swot: {
      strengths: [
        "Καλό SEO στην Ελλάδα",
        "Απλή χρήση"
      ],
      weaknesses: [
        "Outdated technology",
        "Δεν έχει online booking",
        "No innovation"
      ],
      opportunities: [
        "Acquisition target"
      ],
      threats: [
        "Minimal - declining relevance"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: false,
      telemedicine: false,
      medicalRecords: false,
      greekMarket: true
    },
    medithosDifferentiator: "Everything. Modern platform vs static directory."
  },
  {
    name: "iAtros",
    country: "🇬🇷 Ελλάδα",
    founded: "2020",
    funding: "Unknown (small)",
    type: "Telehealth Platform",
    description: "Ελληνική τηλεϊατρική πλατφόρμα για B2B συνεργασίες.",
    users: "~50K χρήστες",
    pricing: "€25-50/visit",
    threat: "low",
    swot: {
      strengths: [
        "Greek market focus",
        "B2B employer contracts"
      ],
      weaknesses: [
        "Μικρό δίκτυο γιατρών",
        "Δεν έχει AI capabilities"
      ],
      opportunities: [
        "Partnership opportunity"
      ],
      threats: [
        "Low - limited scope"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: "partial",
      telemedicine: true,
      medicalRecords: false,
      greekMarket: true
    },
    medithosDifferentiator: "Full ecosystem vs single feature"
  },
  {
    name: "Zocdoc",
    country: "🇺🇸 USA",
    founded: "2007",
    funding: "$400M+",
    type: "Healthcare Marketplace",
    description: "Η μεγαλύτερη πλατφόρμα booking υγείας στις ΗΠΑ. Industry benchmark.",
    users: "6M+ monthly users",
    pricing: "$35-110/ραντεβού",
    threat: "none",
    swot: {
      strengths: [
        "US market leader",
        "Strong insurance integrations"
      ],
      weaknesses: [
        "US-only",
        "No AI triage features"
      ],
      opportunities: [
        "Study their marketplace model"
      ],
      threats: [
        "None - US-only"
      ]
    },
    features: {
      aiSymptomChecker: false,
      onlineBooking: true,
      telemedicine: true,
      medicalRecords: false,
      greekMarket: false
    },
    medithosDifferentiator: "AI-first approach + medical records"
  }
];

const getThreatColor = (threat: string) => {
  switch (threat) {
    case "high": return "bg-red-500 text-white";
    case "medium": return "bg-yellow-500 text-black";
    case "low": return "bg-green-500 text-white";
    case "none": return "bg-gray-400 text-white";
    default: return "bg-gray-400 text-white";
  }
};

const getThreatLabel = (threat: string) => {
  switch (threat) {
    case "high": return "Υψηλή";
    case "medium": return "Μεσαία";
    case "low": return "Χαμηλή";
    case "none": return "Καμία";
    default: return threat;
  }
};

const FeatureIcon = ({ value }: { value: boolean | "partial" }) => {
  if (value === true) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (value === "partial") return <Minus className="h-4 w-4 text-yellow-500" />;
  return <XCircle className="h-4 w-4 text-red-400" />;
};

export default function StandaloneAnalysis() {
  const [activeTab, setActiveTab] = useState("overview");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="font-semibold text-lg">Competitive Analysis</h1>
              <p className="text-xs text-muted-foreground">Business Intelligence Report</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">Confidential Business Document</Badge>
          <h1 className="text-4xl font-bold mb-3">Medithos Competitive Analysis</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Αναλυτική επισκόπηση του ανταγωνιστικού τοπίου στην αγορά digital health
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">8</div>
              <div className="text-sm text-muted-foreground">Ανταγωνιστές</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">€2.5B</div>
              <div className="text-sm text-muted-foreground">EU Market</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1</div>
              <div className="text-sm text-muted-foreground">High Threat</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="text-sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Επισκόπηση
            </TabsTrigger>
            <TabsTrigger value="swot" className="text-sm">
              <FileSearch className="h-4 w-4 mr-2" />
              SWOT Analysis
            </TabsTrigger>
            <TabsTrigger value="strategy" className="text-sm">
              <Target className="h-4 w-4 mr-2" />
              Στρατηγική
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Comparison Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Πίνακας Σύγκρισης
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
                          <div className="text-xs text-muted-foreground">{comp.funding}</div>
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
                        <div className="text-xs text-muted-foreground">Pre-seed</div>
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

            {/* Market Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">€2.5B</div>
                  <div className="text-muted-foreground">EU Digital Health Market (2024)</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">15%</div>
                  <div className="text-muted-foreground">Annual Growth Rate</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">€150M</div>
                  <div className="text-muted-foreground">Greek Market Size</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SWOT Tab */}
          <TabsContent value="swot" className="space-y-6">
            {competitors.map((comp) => (
              <Card key={comp.name} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {comp.name}
                        <Badge className={cn("ml-2", getThreatColor(comp.threat))}>
                          {getThreatLabel(comp.threat)} Απειλή
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{comp.country}</span>
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
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
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

                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                      <Shield className="h-4 w-4" /> Medithos Differentiator
                    </h4>
                    <p className="text-sm">{comp.medithosDifferentiator}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
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
                    <ul className="space-y-3 text-sm">
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
                    <ul className="space-y-3 text-sm">
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

            {/* Pricing Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  Σύγκριση Τιμολόγησης
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Platform</th>
                      <th className="text-left py-2">Model</th>
                      <th className="text-left py-2">Pricing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((comp) => (
                      <tr key={comp.name} className="border-b">
                        <td className="py-2 font-medium">{comp.name}</td>
                        <td className="py-2 text-muted-foreground">{comp.type}</td>
                        <td className="py-2">{comp.pricing}</td>
                      </tr>
                    ))}
                    <tr className="bg-primary/10">
                      <td className="py-2 font-bold text-primary">Medithos</td>
                      <td className="py-2">AI Health Navigation Platform</td>
                      <td className="py-2 font-medium">Free / €9.99 Premium / €19.99 Family</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground print:hidden">
        <p>© {new Date().getFullYear()} Medithos • Confidential Business Document</p>
        <p className="mt-1">Prepared {new Date().toLocaleDateString('el-GR')}</p>
      </footer>
    </div>
  );
}
