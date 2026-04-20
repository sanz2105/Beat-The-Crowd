import { useState, useEffect, type ReactNode } from 'react';
import BottomNav from './BottomNav';
import { Play, Pause, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { startSimulation, stopSimulation } from '../utils/mockSimulator';
import { useVenueData } from '../hooks/useVenueData';
import { useEmergencyMode } from '../hooks/useEmergencyMode';
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
  const { isActive, congestedZone, safestExits, dismissEmergency } = useEmergencyMode();
  const [isSimulating, setIsSimulating] = useState(false);
  const isSidebarOpen = true; 
  
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* FEATURE 1: Emergency Mode Overlay */}
      {isActive && congestedZone && (
        <EmergencyMode 
          congestedZone={congestedZone} 
          safestExits={safestExits} 
          onDismiss={dismissEmergency}
        />
      )}

      {/* Alert Banners */}
      <div aria-live="polite">
        {!isActive && <AlertBanner alerts={activeAlerts} onDismiss={dismissAlert} />}
      </div>

      <NotificationsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        alerts={alertHistory}
        onClear={() => setAlertHistory([])}
      />

      <aside className={`hidden md:flex flex-col w-64 bg-card-dark border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : '-ml-64'}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">BTC Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full text-left p-3 rounded-xl bg-primary/10 text-primary font-bold text-sm">Dashboard Overview</button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-text-secondary text-sm transition-colors" onClick={() => setIsDrawerOpen(true)}>
             View Active Alerts ({alertHistory.length})
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-text-secondary text-sm transition-colors">Zone Management</button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-text-secondary text-sm transition-colors">AI Logic Engine</button>
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
              <p className="text-[10px] uppercase font-bold text-primary mb-1">Judge Note</p>
              <p className="text-xs text-text-secondary leading-tight">Emergency protocol kicks in at 85% capacity.</p>
           </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative min-w-0">
        <header className="md:hidden flex justify-between items-center p-4 h-16 safe-top">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                 <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tighter">BTC</span>
           </div>
           <button className="relative p-2 hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsDrawerOpen(true)}>
              <span className="text-xl">🔔</span>
              {alertHistory.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full border-2 border-bg-dark text-[8px] flex items-center justify-center font-bold">
                  {alertHistory.length}
                </span>
              )}
           </button>
        </header>

        {/* FEATURE 2: Smart Gate Suggestion (Mobile) */}
        {zones && !isActive && window.location.pathname === '/' && (
           <div className="md:hidden px-4 mb-4">
              <SmartGateAllocation gates={Object.entries(zones).filter(([, z]) => z.type === 'gate').map(([id, z]) => ({id, ...z}))} />
           </div>
        )}

        {/* Controls */}
        <div className="fixed top-20 right-4 z-[100] md:top-4 flex flex-col gap-2">
          <button 
            onClick={toggleSimulation}
            aria-pressed={isSimulating}
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

        <main id="main-content" role="main" className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
          {children}
        </main>
        
        <div className="h-16 md:hidden pb-safe" />
        <BottomNav />
      </div>
    </div>
  );
}
