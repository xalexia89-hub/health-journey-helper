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
  AlertCircle,
  Building2,
  Globe,
  Smartphone,
  Brain,
  Heart,
  Shield,
  DollarSign,
  Megaphone,
  BarChart3,
  Calendar,
  Download
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

const getThreatColor = (threat: string) => {
  switch (threat) {
    case "high": return "bg-red-500/10 text-red-600 border-red-500/30";
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
          <Badge variant="outline" className="mb-4">Strategic Analysis</Badge>
          <h1 className="text-3xl font-bold mb-2">Ανταγωνιστική Ανάλυση & Marketing Plan</h1>
          <p className="text-muted-foreground">Medithos — Health Navigation Ecosystem</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="competitors">
              <Target className="h-4 w-4 mr-2" />
              Ανταγωνισμός
            </TabsTrigger>
            <TabsTrigger value="marketing">
              <Megaphone className="h-4 w-4 mr-2" />
              Marketing Plan
            </TabsTrigger>
            <TabsTrigger value="positioning">
              <Zap className="h-4 w-4 mr-2" />
              Positioning
            </TabsTrigger>
          </TabsList>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-6">
            {/* Competitive Landscape Overview */}
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
                <p className="text-sm text-muted-foreground">
                  Η αγορά ψηφιακής υγείας στην Ελλάδα βρίσκεται σε πρώιμο στάδιο ωρίμανσης. 
                  Οι κύριοι παίκτες εστιάζουν σε booking (DoctorAnytime) ή directories (Medidate), 
                  αφήνοντας κενό για AI-powered navigation και unified health records.
                </p>
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
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
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
                          <XCircle className="h-4 w-4 text-red-500" />
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
                      { feature: "Medical Records", medithos: true, doctoranytime: false, ada: false, doctolib: "partial" },
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

          {/* Marketing Plan Tab */}
          <TabsContent value="marketing" className="space-y-6">
            {/* Go-to-Market Phases */}
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
                              <BarChart3 className="h-3 w-3 text-green-500" />
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

            {/* Budget Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Συνολικό Marketing Budget (18 μήνες)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">€185K</div>
                    <div className="text-sm text-muted-foreground">Total Investment</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">€5K</div>
                    <div className="text-sm text-muted-foreground">Phase 1 (Pilot)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">€30K</div>
                    <div className="text-sm text-muted-foreground">Phase 2 (Entry)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">€150K</div>
                    <div className="text-sm text-muted-foreground">Phase 3 (Growth)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Positioning Tab */}
          <TabsContent value="positioning" className="space-y-6">
            {/* Value Proposition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Value Proposition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    "{marketingPlan.messaging.tagline}"
                  </h2>
                  <p className="text-muted-foreground">
                    Medithos δεν διαγιγνώσκει — καθοδηγεί. Η AI σου δείχνει τον δρόμο, εσύ αποφασίζεις.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {marketingPlan.messaging.valueProps.map((prop, i) => (
                    <div key={i} className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{prop.headline}</h3>
                      <p className="text-sm text-muted-foreground">{prop.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Differentiators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Competitive Moat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { 
                      icon: Brain, 
                      title: "AI Navigation (όχι Diagnosis)", 
                      description: "Αποφεύγουμε MDR regulation, μένουμε στην καθοδήγηση" 
                    },
                    { 
                      icon: Heart, 
                      title: "Unified Medical Record", 
                      description: "Μοναδικό στην Ελλάδα: όλο το ιστορικό σε ένα μέρος" 
                    },
                    { 
                      icon: Users, 
                      title: "Professional Community", 
                      description: "LinkedIn for Healthcare: γιατροί, νοσηλευτές, κλινικές" 
                    },
                    { 
                      icon: TrendingUp, 
                      title: "Examary Reports", 
                      description: "AI-generated pre-visit summaries για γιατρούς" 
                    }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex gap-3 p-4 border rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Positioning Map */}
            <Card>
              <CardHeader>
                <CardTitle>Strategic Positioning Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted/30 rounded-lg p-8 min-h-[300px]">
                  {/* Axes */}
                  <div className="absolute left-1/2 top-4 bottom-4 w-px bg-border" />
                  <div className="absolute left-4 right-4 top-1/2 h-px bg-border" />
                  
                  {/* Labels */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">
                    AI-Powered
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">
                    Directory/Booking
                  </div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground writing-mode-vertical">
                    Fragmented
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    Ecosystem
                  </div>

                  {/* Competitors positioned */}
                  <div className="absolute top-[30%] right-[25%] transform">
                    <Badge className="bg-primary text-primary-foreground font-bold shadow-lg">
                      MEDITHOS
                    </Badge>
                  </div>
                  <div className="absolute top-[35%] left-[20%]">
                    <Badge variant="outline" className="text-xs">Ada Health</Badge>
                  </div>
                  <div className="absolute bottom-[30%] right-[30%]">
                    <Badge variant="outline" className="text-xs">Doctolib</Badge>
                  </div>
                  <div className="absolute bottom-[25%] left-[35%]">
                    <Badge variant="outline" className="text-xs">DoctorAnytime</Badge>
                  </div>
                  <div className="absolute bottom-[40%] left-[25%]">
                    <Badge variant="outline" className="text-xs">Medidate</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Το Medithos τοποθετείται μοναδικά στο AI + Ecosystem quadrant
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Print-only content */}
        <div className="hidden print:block space-y-8">
          <h2 className="text-xl font-bold border-b pb-2">1. Ανταγωνιστική Ανάλυση</h2>
          {competitors.slice(0, 4).map(comp => (
            <div key={comp.name} className="mb-4">
              <h3 className="font-semibold">{comp.name} ({comp.country})</h3>
              <p className="text-sm">{comp.description}</p>
            </div>
          ))}
          
          <h2 className="text-xl font-bold border-b pb-2 mt-8">2. Marketing Plan</h2>
          {marketingPlan.phases.map(phase => (
            <div key={phase.name} className="mb-4">
              <h3 className="font-semibold">{phase.name} — {phase.budget}</h3>
              <ul className="text-sm">
                {phase.goals.map((g, i) => <li key={i}>• {g}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
