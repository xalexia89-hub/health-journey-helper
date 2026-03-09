import { useState, useCallback } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  FileBarChart,
  Activity,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import medithosLogo from '@/assets/medithos-new-logo.png';

const navItems = [
  { path: '/insurance', icon: LayoutDashboard, label: 'Executive Dashboard' },
  { path: '/insurance/members', icon: Users, label: 'Members' },
  { path: '/insurance/risk', icon: AlertTriangle, label: 'Risk Stratification' },
  { path: '/insurance/claims', icon: FileBarChart, label: 'Claims Analytics' },
  { path: '/insurance/behavioral', icon: Activity, label: 'Behavioral Compliance' },
  { path: '/insurance/cost', icon: TrendingDown, label: 'Cost Optimization' },
  { path: '/insurance/settings', icon: Settings, label: 'Settings' },
];

export const InsuranceLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f1629] border-b border-[#1e2a4a] z-50 flex items-center justify-between px-4">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-slate-300 hover:text-white">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          <span className="font-semibold text-white text-sm">Medithos Insurance</span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-sm">IG</AvatarFallback>
        </Avatar>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-[#0f1629] border-r border-[#1e2a4a] z-50 transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#1e2a4a]">
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={medithosLogo} alt="Medithos" className="h-8 w-auto" />
              <div>
                <span className="font-bold text-sm text-white block leading-tight">MEDITHOS</span>
                <span className="text-[10px] text-cyan-400 tracking-widest uppercase">Insurance Governance</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Org Info */}
          <div className="px-5 py-4 border-b border-[#1e2a4a]">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500/30 to-blue-600/30 text-cyan-300 font-semibold">
                  IG
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">Insurance Gov</p>
                <p className="text-xs text-slate-500">Risk Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 h-10 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-[#1e2a4a]">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-10 text-sm"
              onClick={() => navigate('/')}
            >
              <LogOut className="h-4 w-4" />
              Exit to Medithos
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
