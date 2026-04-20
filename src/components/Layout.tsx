import { useState, useEffect, useMemo, type ReactNode } from 'react';
import BottomNav from './BottomNav';
import { Play, Pause, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { startSimulation, stopSimulation } from '../utils/mockSimulator';
import { useVenueData } from '../hooks/useVenueData';
import { alertsEngine, type Alert } from '../services/alerts';
import AlertBanner from './AlertBanner';
import NotificationsDrawer from './NotificationsDrawer';
import EmergencyMode from './EmergencyMode';
import SmartGateAllocation from './SmartGateAllocation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { zones } = useVenueData();
  const [isSimulating, setIsSimulating] = useState(false);
  const isSidebarOpen = true; // Fixed sidebar for admin preview
  
  // Alert System State
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Emergency State Detection
  const emergencyInfo = useMemo(() => {
    if (!zones) return null;
    const list = Object.entries(zones).map(([id, z]) => ({ id, ...z }));
    const criticalZone = list.find(z => z.crowdLevel === 'high' && (z.waitTime > 25 || z.capacity > 90));
    
    if (criticalZone) {
      const alternatives = list
        .filter(z => z.type === criticalZone.type && z.id !== criticalZone.id && z.isOpen && z.crowdLevel !== 'high')
        .sort((a, b) => a.waitTime - b.waitTime)
        .slice(0, 2);
      return { criticalZone, alternatives };
    }
    return null;
  }, [zones]);

  // Monitor zones and generate alerts
  useEffect(() => {
    if (!zones) return;
    const newAlerts = alertsEngine(zones);
    
    if (newAlerts.length > 0) {
      const freshAlerts = newAlerts.filter(na => !alertHistory.some(ah => ah.message === na.message));
      if (freshAlerts.length > 0) {
        setActiveAlerts(prev => [...prev, ...freshAlerts]);
        setAlertHistory(prev => [...freshAlerts, ...prev].slice(0, 50));
      }
    }
  }, [zones, alertHistory]);

  const toggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
    setIsSimulating(!isSimulating);
  };

  const dismissAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-bg-dark text-text-primary font-sans selection:bg-primary/30 overflow-x-hidden">
      
      {/* EMERGENCY OVERLAY */}
      {emergencyInfo && (
        <EmergencyMode 
          congestedZone={emergencyInfo.criticalZone} 
          alternatives={emergencyInfo.alternatives} 
        />
      )}

      {/* REAL-TIME ALERT BANNER */}
      {!emergencyInfo && <AlertBanner alerts={activeAlerts} onDismiss={dismissAlert} />}

      {/* NOTIFICATIONS DRAWER */}
      <NotificationsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        alerts={alertHistory}
        onClear={() => setAlertHistory([])}
      />

      {/* Desktop Sidebar Preview */}
      <aside className={`hidden md:flex flex-col w-64 bg-card-dark border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : '-ml-64'}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">BTC Admin</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          <div className="p-3 rounded-xl bg-primary/10 text-primary font-bold text-sm">Dashboard Overview</div>
          <div className="p-3 rounded-xl hover:bg-white/5 text-text-secondary text-sm transition-colors cursor-pointer" onClick={() => setIsDrawerOpen(true)}>
             View Active Alerts ({alertHistory.length})
          </div>
          <div className="p-3 rounded-xl hover:bg-white/5 text-text-secondary text-sm transition-colors cursor-pointer">Zone Management</div>
          <div className="p-3 rounded-xl hover:bg-white/5 text-text-secondary text-sm transition-colors cursor-pointer">AI Logic Engine</div>
        </div>

        <div className="p-4 border-t border-white/5">
           <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
              <p className="text-[10px] uppercase font-bold text-primary mb-1">Judge Note</p>
              <p className="text-xs text-text-secondary leading-tight">This sidebar represents the administrative back-office for stadium operators.</p>
           </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Header/Top Bar (Mobile) */}
        <div className="md:hidden flex justify-between items-center p-4 h-16 safe-top">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                 <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tighter">BTC</span>
           </div>
           <div 
             className="relative cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-colors"
             onClick={() => setIsDrawerOpen(true)}
           >
              <span className="text-xl">🔔</span>
              {alertHistory.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full border-2 border-bg-dark text-[8px] flex items-center justify-center font-bold">
                  {alertHistory.length}
                </span>
              )}
           </div>
        </div>

        {/* Floating Smart Gate Suggestion (Mobile only, Home only) */}
        {zones && window.location.pathname === '/' && (
           <div className="md:hidden px-4 mb-4">
              <SmartGateAllocation gates={Object.entries(zones).filter(([_, z]) => z.type === 'gate').map(([id, z]) => ({id, ...z}))} />
           </div>
        )}

        {/* Controls (Dev Only) */}
        <div className="fixed top-20 right-4 z-[100] md:top-4 flex flex-col gap-2">
          <button 
            onClick={toggleSimulation}
            className={`p-3 rounded-full shadow-2xl border transition-all flex items-center gap-2 group ${
              isSimulating ? 'bg-success/20 border-success text-success' : 'bg-card-dark border-white/10 text-text-secondary'
            }`}
          >
            {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span className="text-xs font-bold uppercase tracking-wider overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
              {isSimulating ? "Simulating Live" : "Start Simulation"}
            </span>
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
          {children}
        </main>
        
        {/* Bottom Nav Spacer */}
        <div className="h-16 md:hidden pb-safe" />
        
        <BottomNav />
      </div>
    </div>
  );
}
