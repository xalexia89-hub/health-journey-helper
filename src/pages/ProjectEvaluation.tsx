import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, TrendingUp, AlertTriangle, Target, User, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectEvaluation = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print-break { page-break-before: always; }
          .print-avoid-break { page-break-inside: avoid; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      {/* Navigation Bar - Hidden on Print */}
      <div className="no-print sticky top-0 z-50 bg-white border-b p-4 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Πίσω
        </Button>
        <Button onClick={handlePrint} className="bg-primary text-white">
          <Printer className="h-4 w-4 mr-2" />
          Εκτύπωση PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-8">
        
        {/* Cover Page */}
        <section className="text-center py-16 border-b-4 border-primary print-avoid-break">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-4xl font-bold text-primary mb-4">MEDITHOS</h1>
          <h2 className="text-2xl text-gray-600 mb-2">Strategic Evaluation Report</h2>
          <p className="text-lg text-gray-500">VC-Style Assessment & Founder Analysis</p>
          <div className="mt-8 inline-block bg-primary/10 px-6 py-3 rounded-full">
            <span className="text-3xl font-bold text-primary">7.0 / 10</span>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Confidential Document • {new Date().toLocaleDateString('el-GR')}
          </p>
        </section>

        {/* Executive Summary */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Executive Summary
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Medithos</strong> είναι μια πλατφόρμα "health navigation co-pilot" που στοχεύει στην 
              απλοποίηση της πρόσβασης στο σύστημα υγείας μέσω AI-powered triage, provider matching 
              και system navigation.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded border">
                <p className="text-sm text-gray-500">Market Position</p>
                <p className="font-bold text-primary">Top 25% Health-Tech Ideas</p>
              </div>
              <div className="bg-white p-4 rounded border">
                <p className="text-sm text-gray-500">Primary Differentiator</p>
                <p className="font-bold text-primary">Full Navigator vs Pure Symptom Checker</p>
              </div>
            </div>
          </div>
        </section>

        {/* Score Breakdown */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Score Breakdown</h2>
          
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-3 text-left">Dimension</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3 text-left">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-medium">Concept & Differentiation</td>
                    <td className="p-3 text-center font-bold text-green-600">8.5/10</td>
                    <td className="p-3 text-sm text-gray-600">Genuine gap in market, full navigator approach</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">Market Size (Greece)</td>
                    <td className="p-3 text-center font-bold text-yellow-600">5.5/10</td>
                    <td className="p-3 text-sm text-gray-600">Small domestic market, EU expansion needed</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Regulatory Clarity</td>
                    <td className="p-3 text-center font-bold text-yellow-600">5.0/10</td>
                    <td className="p-3 text-sm text-gray-600">MDR Class IIa uncertainty, needs legal opinion</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">Product Execution</td>
                    <td className="p-3 text-center font-bold text-green-600">7.5/10</td>
                    <td className="p-3 text-sm text-gray-600">Strong MVP, pilot-ready architecture</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Team & Founder</td>
                    <td className="p-3 text-center font-bold text-green-600">8.0/10</td>
                    <td className="p-3 text-sm text-gray-600">Vision clarity, systems thinking, adaptability</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium">Revenue Model</td>
                    <td className="p-3 text-center font-bold text-yellow-600">6.0/10</td>
                    <td className="p-3 text-sm text-gray-600">B2B path clear but unproven</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Risk Analysis */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Risk Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r">
              <h3 className="font-bold text-red-700">Structural Risks</h3>
              <ul className="mt-2 space-y-1 text-sm text-red-600">
                <li>• Small domestic market (10M population)</li>
                <li>• EU regulatory complexity (MDR/AI Act)</li>
                <li>• Greek healthcare system fragmentation</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r">
              <h3 className="font-bold text-yellow-700">Temporary Risks</h3>
              <ul className="mt-2 space-y-1 text-sm text-yellow-600">
                <li>• No clinical advisor (fixable in 30 days)</li>
                <li>• Pre-revenue status</li>
                <li>• Features incomplete for full launch</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-gray-700 mb-2">Primary Blocker Analysis</h3>
            <p className="text-gray-600">
              <strong>Regulatory uncertainty</strong> is the primary blocker, but it's <em>perceived, not structural</em>. 
              A legal opinion confirming "guidance tool, not diagnostic device" would likely place Medithos 
              outside MDR Class IIa requirements, reducing this risk significantly.
            </p>
          </div>
        </section>

        {/* Competitive Benchmarking */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Competitive Benchmarking</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left border">Competitor</th>
                  <th className="p-2 text-center border">Funding</th>
                  <th className="p-2 text-left border">Strength vs Medithos</th>
                  <th className="p-2 text-left border">Weakness vs Medithos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border font-medium">Ada Health</td>
                  <td className="p-2 border text-center">$100M+</td>
                  <td className="p-2 border text-green-600">Clinical validation, scale</td>
                  <td className="p-2 border text-red-600">No provider matching, global generic</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 border font-medium">Babylon Health</td>
                  <td className="p-2 border text-center">$600M+</td>
                  <td className="p-2 border text-green-600">Full service, NHS integration</td>
                  <td className="p-2 border text-red-600">Financial collapse, over-expansion</td>
                </tr>
                <tr>
                  <td className="p-2 border font-medium">K Health</td>
                  <td className="p-2 border text-center">$270M+</td>
                  <td className="p-2 border text-green-600">AI + human doctors</td>
                  <td className="p-2 border text-red-600">US-only, subscription model</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 border font-medium">Your.MD</td>
                  <td className="p-2 border text-center">$25M</td>
                  <td className="p-2 border text-green-600">CE marked, NHS approved</td>
                  <td className="p-2 border text-red-600">Symptom-only, no booking</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-primary/10 p-4 rounded-lg">
            <h3 className="font-bold text-primary">Medithos Unique Position</h3>
            <p className="text-gray-700 mt-2">
              Κανένας competitor δεν συνδυάζει: <strong>Triage + Navigation + Provider Matching + 
              Greek Localization</strong>. Αυτό είναι το "health navigator" positioning που οι μεγάλοι 
              players δεν έχουν επιτύχει πλήρως.
            </p>
          </div>
        </section>

        {/* 90-Day Milestones */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Target className="h-6 w-6" />
            90-Day Milestones → Score 8.0+
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold">Milestone 1: Clinical Advisor Signed</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ένας Greek-licensed γιατρός που υποστηρίζει δημόσια το project. 
                  Impact: +0.5 στο score, regulatory credibility.
                </p>
                <p className="text-xs text-primary mt-2">Deadline: Day 30</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold">Milestone 2: 100 Pilot Users, NPS &gt; 40</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Controlled pilot με real feedback. Impact: +0.3 στο score, product-market fit signal.
                </p>
                <p className="text-xs text-primary mt-2">Deadline: Day 60</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold">Milestone 3: B2B Letter of Intent</h3>
                <p className="text-sm text-gray-600 mt-1">
                  LOI από ασφαλιστική ή εργοδότη για pilot. Impact: +0.5 στο score, revenue path validation.
                </p>
                <p className="text-xs text-primary mt-2">Deadline: Day 90</p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Assessment */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <User className="h-6 w-6" />
            Founder Assessment
          </h2>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary">8.0 / 10</div>
              <p className="text-gray-600">Founder Score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Vision Clarity</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <span className="text-sm font-bold">9/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Clear "co-pilot" positioning, not generic health app</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Systems Thinking</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-sm font-bold">8.5/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Architecture shows understanding of complexity</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Long-term Commitment</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-sm font-bold">8/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Cautious approach indicates sustainability mindset</p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-bold text-gray-700">Adaptability</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-sm font-bold">8.5/10</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Willing to narrow scope, pivot as needed</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded border-l-4 border-primary">
              <h3 className="font-bold text-primary">Impact on Project Score</h3>
              <p className="text-gray-700 mt-2">
                Το founder profile <strong>αυξάνει την πιθανότητα επιτυχίας κατά 20-30%</strong> 
                σε σύγκριση με την ιδέα μόνη της. Η συνδυασμένη προσέγγιση vision + caution 
                είναι σπάνια και πολύτιμη στο health-tech.
              </p>
            </div>
          </div>
        </section>

        {/* Non-Clinical Metrics */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Non-Clinical Validation Metrics</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-left">Metric</th>
                  <th className="p-3 text-center">Target</th>
                  <th className="p-3 text-left">Why It Matters</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3">Time to Provider Booking</td>
                  <td className="p-3 text-center font-bold">&lt; 3 min</td>
                  <td className="p-3 text-sm text-gray-600">Proves system navigation value</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3">Return Rate (7-day)</td>
                  <td className="p-3 text-center font-bold">&gt; 35%</td>
                  <td className="p-3 text-sm text-gray-600">Ongoing health companion, not one-time use</td>
                </tr>
                <tr>
                  <td className="p-3">Report → Doctor Visit</td>
                  <td className="p-3 text-center font-bold">&gt; 20%</td>
                  <td className="p-3 text-sm text-gray-600">Real-world utility of Examary reports</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3">Net Promoter Score</td>
                  <td className="p-3 text-center font-bold">&gt; 40</td>
                  <td className="p-3 text-sm text-gray-600">Word-of-mouth growth potential</td>
                </tr>
                <tr>
                  <td className="p-3">Support Tickets</td>
                  <td className="p-3 text-center font-bold">&lt; 2%</td>
                  <td className="p-3 text-sm text-gray-600">Product is intuitive enough</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* B2B Scenario */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">B2B Partner Scenario Analysis</h2>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-green-800">If: B2B Partner with 50K+ Users</h3>
              <div className="text-2xl font-bold text-green-600">Score: 8.5/10</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded">
                <h4 className="font-bold text-green-700">Distribution Solved</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Instant access to large user base without CAC
                </p>
              </div>
              <div className="bg-white p-4 rounded">
                <h4 className="font-bold text-green-700">Revenue Validated</h4>
                <p className="text-sm text-gray-600 mt-1">
                  B2B model proven with real contract
                </p>
              </div>
              <div className="bg-white p-4 rounded">
                <h4 className="font-bold text-green-700">Regulatory Cover</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Insurer/employer shares liability burden
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Recommendation */}
        <section className="print-break print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            30-Day Strategic Recommendation
          </h2>
          
          <div className="bg-primary text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Priority #1: Legal Opinion on MDR/GDPR Scope</h3>
            <p className="opacity-90 mb-4">
              Με περιορισμένο capital, η πιο υψηλή ROI κίνηση είναι να λάβετε νομική γνωμοδότηση 
              που επιβεβαιώνει ότι το Medithos ως "guidance tool" δεν εμπίπτει στο MDR Class IIa.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/10 p-3 rounded">
                <p className="text-sm opacity-75">Estimated Cost</p>
                <p className="font-bold">€500-1,500</p>
              </div>
              <div className="bg-white/10 p-3 rounded">
                <p className="text-sm opacity-75">Time to Complete</p>
                <p className="font-bold">2-3 weeks</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white/10 rounded">
              <p className="text-sm">
                <strong>Why this first:</strong> Αν η απάντηση είναι θετική, ξεκλειδώνει 
                investor conversations, B2B partnerships, και clinical advisor recruitment.
              </p>
            </div>
          </div>
        </section>

        {/* Final Verdict */}
        <section className="print-avoid-break">
          <h2 className="text-2xl font-bold text-primary mb-4">Final Verdict</h2>
          
          <div className="border-4 border-primary rounded-lg p-8 text-center">
            <div className="text-6xl font-bold text-primary mb-4">7.0 / 10</div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Το concept είναι genuinely differentiated και ο founder δείχνει strong awareness 
              και caution, αλλά η μικρή αγορά, η έλλειψη pre-clinical validation, και η 
              EU regulatory complexity εμποδίζουν υψηλότερο score σε αυτό το στάδιο.
            </p>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">With Clinical Advisor</p>
                <p className="font-bold text-xl text-green-600">7.5/10</p>
              </div>
              <div>
                <p className="text-gray-500">With Regulatory Clarity</p>
                <p className="font-bold text-xl text-green-600">8.0/10</p>
              </div>
              <div>
                <p className="text-gray-500">With B2B Partner</p>
                <p className="font-bold text-xl text-green-600">8.5/10</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t text-sm text-gray-500 print-avoid-break">
          <p>MEDITHOS Strategic Evaluation Report</p>
          <p>Generated: {new Date().toLocaleDateString('el-GR')} • Confidential</p>
          <p className="mt-2 text-xs">
            This assessment is based on VC-style evaluation criteria and does not constitute investment advice.
          </p>
        </footer>

      </div>
    </main>
  );
};

export default ProjectEvaluation;
