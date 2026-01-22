import { Header } from "@/components/layout/Header";
import { UnifiedSymptomAssistant } from "@/components/symptoms/UnifiedSymptomAssistant";

export default function SymptomAssistant() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header showBack title="Βοηθός Συμπτωμάτων" />
      
      <main className="container mx-auto px-4 py-6">
        <UnifiedSymptomAssistant />
      </main>
    </div>
  );
}
