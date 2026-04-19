import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield, Code2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import genesisLogo from "@/assets/genesis-logo.png";
import { Logo } from "@/components/ui/logo";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-8 text-white/70 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Πίσω
        </Button>

        {/* Hero - Genesis Logo */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-cyan-400/30 blur-2xl rounded-full" />
            <img
              src={genesisLogo}
              alt="Genesis"
              className="relative h-40 w-40 object-contain mx-auto"
            />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            Genesis
          </h1>
          <p className="text-cyan-400/80 text-sm uppercase tracking-[0.3em]">
            Where Innovation Begins
          </p>
        </div>

        {/* Statement */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-400/40" />
            <Logo size="md" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-400/40" />
          </div>
          <p className="text-center text-lg text-white/80 leading-relaxed">
            Η εφαρμογή{" "}
            <span className="font-semibold text-white">Medithos</span> σχεδιάστηκε,
            αναπτύχθηκε και υλοποιήθηκε από την εταιρεία{" "}
            <span className="font-semibold text-cyan-300">Genesis</span>.
          </p>
          <p className="text-center text-sm text-white/50 mt-3">
            © {new Date().getFullYear()} Genesis. All rights reserved.
          </p>
        </Card>

        {/* Pillars */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered",
              desc: "Έξυπνη πλοήγηση υγείας με προηγμένα μοντέλα AI",
            },
            {
              icon: Shield,
              title: "GDPR & Security",
              desc: "Κρυπτογράφηση AES-256, RBAC, πλήρης συμμόρφωση",
            },
            {
              icon: Code2,
              title: "Engineering Excellence",
              desc: "Production-grade αρχιτεκτονική, σχεδιασμένη να κλιμακώνει",
            },
            {
              icon: Heart,
              title: "Patient-First",
              desc: "Κάθε σχεδιαστική απόφαση εξυπηρετεί τον ασθενή",
            },
          ].map((p) => (
            <Card
              key={p.title}
              className="bg-white/5 border-white/10 backdrop-blur-md p-5 hover:border-cyan-400/30 transition-all"
            >
              <p.icon className="h-6 w-6 text-cyan-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">{p.title}</h3>
              <p className="text-sm text-white/60">{p.desc}</p>
            </Card>
          ))}
        </div>

        {/* Footer credit */}
        <div className="text-center">
          <p className="text-xs text-white/40 uppercase tracking-[0.25em]">
            Designed & Developed by Genesis
          </p>
        </div>
      </div>
    </div>
  );
}
