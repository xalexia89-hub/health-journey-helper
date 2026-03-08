import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { TrendingUp, Activity, Heart, FlaskConical } from 'lucide-react';
import { 
  BLOOD_TEST_HISTORY, 
  LIPID_PROFILE_HISTORY, 
  CBC_HISTORY 
} from './demoMedicalData';

export function BloodTestCharts() {
  const [activeChart, setActiveChart] = useState('metabolic');

  // Radar data for overall health score
  const radarData = [
    { subject: 'Αιματολογικά', value: 95, fullMark: 100 },
    { subject: 'Λιπιδαιμικό', value: 92, fullMark: 100 },
    { subject: 'Θυρεοειδής', value: 98, fullMark: 100 },
    { subject: 'Ηπατικά', value: 96, fullMark: 100 },
    { subject: 'Νεφρικά', value: 97, fullMark: 100 },
    { subject: 'Φλεγμονή', value: 94, fullMark: 100 },
    { subject: 'Γλυκαιμία', value: 96, fullMark: 100 },
    { subject: 'Βιταμίνες', value: 90, fullMark: 100 },
  ];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Διαγράμματα & Συγκρίσεις Εξετάσεων
          </CardTitle>
          <Badge variant="outline" className="gap-1 text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <Heart className="h-3 w-3" />
            Υγιής Κατάσταση
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeChart} onValueChange={setActiveChart}>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="metabolic" className="text-xs gap-1">
              <Activity className="h-3 w-3" />
              Μεταβολικά
            </TabsTrigger>
            <TabsTrigger value="lipids" className="text-xs gap-1">
              <Heart className="h-3 w-3" />
              Λιπίδια
            </TabsTrigger>
            <TabsTrigger value="cbc" className="text-xs gap-1">
              <FlaskConical className="h-3 w-3" />
              Γεν. Αίματος
            </TabsTrigger>
            <TabsTrigger value="radar" className="text-xs gap-1">
              <TrendingUp className="h-3 w-3" />
              Σκορ Υγείας
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metabolic" className="space-y-4">
            <div className="rounded-lg border border-border/50 p-4">
              <h4 className="text-sm font-medium mb-3 text-foreground">Γλυκόζη & HbA1c - Τελευταίοι 6 μήνες</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={BLOOD_TEST_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[70, 110]} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[4, 7]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <ReferenceLine yAxisId="left" y={100} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: 'Όριο', fontSize: 10 }} />
                  <Line yAxisId="left" type="monotone" dataKey="glucose" name="Γλυκόζη (mg/dL)" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="hba1c" name="HbA1c (%)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border border-border/50 p-4">
              <h4 className="text-sm font-medium mb-3 text-foreground">CRP & Βιταμίνη D - Τάσεις</h4>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={BLOOD_TEST_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="vitD" name="Βιτ. D (ng/mL)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="crp" name="CRP (mg/L)" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="lipids">
            <div className="rounded-lg border border-border/50 p-4 mb-4">
              <h4 className="text-sm font-medium mb-3 text-foreground">Λιπιδαιμικό Προφίλ - Εξέλιξη 6 μηνών</h4>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={LIPID_PROFILE_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 250]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <ReferenceLine y={200} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: 'Όριο Χολ.', fontSize: 10 }} />
                  <Area type="monotone" dataKey="total" name="Ολική Χολ." stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="ldl" name="LDL" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="hdl" name="HDL" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="triglycerides" name="Τριγλ." stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border border-border/50 p-4">
              <h4 className="text-sm font-medium mb-3 text-foreground">Σύγκριση Τελευταίας Μέτρησης vs Φυσιολογικά Όρια</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Χολ.', value: 185, max: 200, color: '#8b5cf6' },
                  { name: 'HDL', value: 58, max: 60, color: '#10b981' },
                  { name: 'LDL', value: 105, max: 130, color: '#ef4444' },
                  { name: 'Τριγλ.', value: 110, max: 150, color: '#f59e0b' },
                ]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 220]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={50} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="value" name="Τιμή σας" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="max" name="Ανώτ. Όριο" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="cbc">
            <div className="rounded-lg border border-border/50 p-4 mb-4">
              <h4 className="text-sm font-medium mb-3 text-foreground">Γενική Αίματος - WBC & Αιμοπετάλια</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={CBC_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[4, 10]} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[200, 300]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="wbc" name="WBC (x10³/μL)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="plt" name="PLT (x10³/μL)" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border border-border/50 p-4">
              <h4 className="text-sm font-medium mb-3 text-foreground">Αιμοσφαιρίνη & Ερυθρά - Πορεία</h4>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={CBC_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 20]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <ReferenceLine y={13.5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Κατ. Hb', fontSize: 10 }} />
                  <Area type="monotone" dataKey="hb" name="Hb (g/dL)" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="rbc" name="RBC (x10⁶/μL)" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="radar">
            <div className="rounded-lg border border-border/50 p-4">
              <h4 className="text-sm font-medium mb-3 text-foreground text-center">Συνολικό Σκορ Υγείας ανά Κατηγορία</h4>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid className="opacity-30" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Σκορ Υγείας" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 text-sm px-4 py-1">
                  Μέσο Σκορ Υγείας: 94.8 / 100
                </Badge>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-3 text-center">
                <p className="text-xs text-muted-foreground">Εντός Ορίων</p>
                <p className="text-2xl font-bold text-emerald-600">100%</p>
                <p className="text-xs text-muted-foreground">34/34 δείκτες</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 p-3 text-center">
                <p className="text-xs text-muted-foreground">Τάση</p>
                <p className="text-2xl font-bold text-blue-600">↗ Βελτίωση</p>
                <p className="text-xs text-muted-foreground">vs 6 μήνες πριν</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
