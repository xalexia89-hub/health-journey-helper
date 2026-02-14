import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, Activity, Moon, Brain, Shield, MessageCircle } from 'lucide-react';
import { HealthBalanceWheel } from './HealthBalanceWheel';
import { NutritionModule } from './NutritionModule';
import { ActivityModule } from './ActivityModule';
import { SleepModule } from './SleepModule';
import { StressModule } from './StressModule';
import { PreventiveTimeline } from './PreventiveTimeline';
import { PreventiveAdvisorChat } from './PreventiveAdvisorChat';

export const PreventiveHealthTab = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Health Balance Overview */}
      <HealthBalanceWheel />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-6 h-auto p-1 bg-secondary/50">
          <TabsTrigger value="nutrition" className="flex flex-col items-center gap-1 py-2 text-xs">
            <Apple className="h-4 w-4" />
            <span className="hidden sm:inline">Διατροφή</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex flex-col items-center gap-1 py-2 text-xs">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Κίνηση</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex flex-col items-center gap-1 py-2 text-xs">
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Ύπνος</span>
          </TabsTrigger>
          <TabsTrigger value="stress" className="flex flex-col items-center gap-1 py-2 text-xs">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Στρες</span>
          </TabsTrigger>
          <TabsTrigger value="screenings" className="flex flex-col items-center gap-1 py-2 text-xs">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Πρόληψη</span>
          </TabsTrigger>
          <TabsTrigger value="advisor" className="flex flex-col items-center gap-1 py-2 text-xs">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Σύμβουλος</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nutrition"><NutritionModule /></TabsContent>
        <TabsContent value="activity"><ActivityModule /></TabsContent>
        <TabsContent value="sleep"><SleepModule /></TabsContent>
        <TabsContent value="stress"><StressModule /></TabsContent>
        <TabsContent value="screenings"><PreventiveTimeline /></TabsContent>
        <TabsContent value="advisor"><PreventiveAdvisorChat /></TabsContent>
      </Tabs>
    </div>
  );
};
