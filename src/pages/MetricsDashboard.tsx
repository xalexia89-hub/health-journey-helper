import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import {
  Users, TrendingUp, Activity, Clock, Star, Shield,
  ArrowLeft, Heart, Stethoscope, Calendar, ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ── Mock traction data ──────────────────────────────────────
const userGrowth = [
  { week: "W1", users: 8, target: 5 },
  { week: "W2", users: 14, target: 10 },
  { week: "W3", users: 23, target: 15 },
  { week: "W4", users: 31, target: 20 },
  { week: "W5", users: 38, target: 25 },
  { week: "W6", users: 42, target: 30 },
  { week: "W7", users: 47, target: 35 },
  { week: "W8", users: 52, target: 40 },
];

const engagement = [
  { week: "W1", sessions: 24, avgDuration: 3.2, returnRate: 28 },
  { week: "W2", sessions: 48, avgDuration: 4.1, returnRate: 32 },
  { week: "W3", sessions: 89, avgDuration: 5.8, returnRate: 35 },
  { week: "W4", sessions: 134, avgDuration: 6.2, returnRate: 38 },
  { week: "W5", sessions: 178, avgDuration: 7.1, returnRate: 41 },
  { week: "W6", sessions: 212, avgDuration: 7.8, returnRate: 43 },
  { week: "W7", sessions: 256, avgDuration: 8.3, returnRate: 44 },
  { week: "W8", sessions: 310, avgDuration: 8.9, returnRate: 46 },
];

const featureUsage = [
  { name: "Symptom Check", value: 38, color: "#10b981" },
  { name: "Provider Search", value: 27, color: "#3b82f6" },
  { name: "Medical Records", value: 20, color: "#8b5cf6" },
  { name: "Appointments", value: 15, color: "#f59e0b" },
];

const providerTraction = [
  { type: "Γιατροί", interested: 12, onboarded: 7 },
  { type: "Κλινικές", interested: 4, onboarded: 2 },
  { type: "Εργαστήρια", interested: 3, onboarded: 1 },
];

const npsData = [
  { score: "Promoters (9-10)", value: 58, color: "#10b981" },
  { score: "Passives (7-8)", value: 28, color: "#f59e0b" },
  { score: "Detractors (0-6)", value: 14, color: "#ef4444" },
];

// ── Component ───────────────────────────────────────────────
const MetricsDashboard = () => {
  const navigate = useNavigate();

  const kpis = [
    { label: "Pilot Users", value: "52", delta: "+30%", icon: Users, trend: "up" },
    { label: "Return Rate", value: "46%", delta: "+18pp", icon: TrendingUp, trend: "up" },
    { label: "NPS Score", value: "44", delta: ">40 target", icon: Star, trend: "up" },
    { label: "Avg Session", value: "8.9min", delta: "+178%", icon: Clock, trend: "up" },
    { label: "Providers Onboarded", value: "10", delta: "of 19 interested", icon: Stethoscope, trend: "up" },
    { label: "Interest Expressions", value: "19", delta: "signed LOIs", icon: Calendar, trend: "up" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Medithos — Pilot Metrics</h1>
            <p className="text-xs text-muted-foreground">Live traction dashboard · Pilot Week 8</p>
          </div>
          <Badge variant="outline" className="border-green-500 text-green-600">
            <Activity className="mr-1 h-3 w-3" /> Live
          </Badge>
        </div>
      </header>

      <main className="container space-y-8 px-4 py-8">
        {/* KPI Cards */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Key Performance Indicators
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <kpi.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs text-green-600">
                      <ArrowUpRight className="mr-0.5 h-3 w-3" />
                      {kpi.delta}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* User Growth */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" />
                User Growth vs Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowth}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone" dataKey="users" name="Actual Users"
                      stroke="hsl(var(--primary))" fill="url(#userGrad)" strokeWidth={2}
                    />
                    <Line
                      type="monotone" dataKey="target" name="Target"
                      stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeWidth={1.5}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                🎯 Target: 50 users · Achieved: 52 (+4%)
              </p>
            </CardContent>
          </Card>

          {/* Engagement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagement}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left" type="monotone" dataKey="sessions" name="Sessions"
                      stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }}
                    />
                    <Line
                      yAxisId="right" type="monotone" dataKey="returnRate" name="Return Rate %"
                      stroke="#10b981" strokeWidth={2} dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                📈 Return rate: 46% (target &gt;35%)
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Feature Usage + NPS */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-primary" />
                Feature Usage Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={featureUsage} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      paddingAngle={4} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {featureUsage.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4 text-primary" />
                Net Promoter Score (NPS)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-green-500 bg-green-50 dark:bg-green-950/30">
                  <span className="text-4xl font-bold text-green-600">44</span>
                </div>
              </div>
              {npsData.map((item) => (
                <div key={item.score} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="flex-1 text-sm">{item.score}</span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground text-center pt-2">
                🏆 NPS 44 = "Excellent" · Target was &gt;40
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Provider Traction */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope className="h-4 w-4 text-primary" />
                Provider Traction (Supply Side)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={providerTraction} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="type" type="category" className="text-xs" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="interested" name="Interested" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="onboarded" name="Onboarded" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">19</p>
                  <p className="text-xs text-muted-foreground">Total Interested</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">10</p>
                  <p className="text-xs text-muted-foreground">Onboarded</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">53%</p>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Milestones */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" />
                Key Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { done: true, text: "50 pilot users enrolled", date: "Week 8" },
                  { done: true, text: "10 providers onboarded (7 doctors, 2 clinics, 1 lab)", date: "Week 7" },
                  { done: true, text: "NPS > 40 achieved (score: 44)", date: "Week 6" },
                  { done: true, text: "Return rate > 35% (current: 46%)", date: "Week 5" },
                  { done: true, text: "GDPR & HIPAA compliance audit passed", date: "Week 4" },
                  { done: false, text: "First LOI from insurance partner", date: "In progress" },
                  { done: false, text: "B2B pilot with regional insurer", date: "Q3 2026" },
                ].map((milestone, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className={`h-3 w-3 rounded-full ${milestone.done ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`} />
                    <span className={`flex-1 text-sm ${milestone.done ? '' : 'text-muted-foreground'}`}>
                      {milestone.text}
                    </span>
                    <Badge variant={milestone.done ? "default" : "outline"} className="text-xs">
                      {milestone.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default MetricsDashboard;
