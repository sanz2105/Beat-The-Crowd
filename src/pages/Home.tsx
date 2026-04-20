import React, { useState, useEffect, useMemo } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVenueData } from '../hooks/useVenueData';
import { ref, update } from 'firebase/database';
import { db } from '../services/firebase';
import StadiumHeatmap from '../components/StadiumHeatmap';
import ZoneCard from '../components/ZoneCard';
import { QuickAction } from '../components/QuickAction';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { zones, loading } = useVenueData();
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerEmergency = async () => {
    if (!zones) return;
    const updates = {
      'zones/gate_south/crowdLevel': 'high',
      'zones/gate_south/waitTime': 35,
      'zones/gate_south/capacity': 95,
      'zones/section_b/capacity': 98,
      'zones/food_north/capacity': 92
    };
    await update(ref(db), updates);
  };

  const stats = useMemo(() => {
    if (!zones) return null;
    const zoneList = Object.entries(zones).map(([id, z]) => ({ id, ...z }));
    const highCrowdZones = zoneList.filter(z => z.capacity > 75);
    const openGates = zoneList.filter(z => z.type === 'gate' && z.isOpen).length;
    const avgWait = Math.round(zoneList.reduce((acc, z) => acc + z.waitTime, 0) / zoneList.length);
    const avgCapacity = Math.round(zoneList.reduce((acc, z) => acc + z.capacity, 0) / zoneList.length);

    let status = { label: 'Smooth', color: 'bg-success', text: 'text-success' };
    if (highCrowdZones.length > 4) {
      status = { label: 'Congested', color: 'bg-danger', text: 'text-danger' };
    } else if (highCrowdZones.length >= 1) {
      // WCAG: amber-300 for contrast
      status = { label: 'Moderate', color: 'bg-warning', text: 'text-amber-300' };
    }

    return { highCrowdZones, openGates, avgWait, avgCapacity, status, zoneList };
  }, [zones]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6" role="status" aria-label="Loading dashboard data">
        <div className="flex justify-between">
          <div className="h-10 w-40 bg-white/5 rounded-xl" />
          <div className="h-10 w-24 bg-white/5 rounded-xl" />
        </div>
        <div className="h-48 w-full bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-64 w-full bg-white/5 rounded-3xl" />
      </div>
    );
  }

  const sortedZones = [...(stats?.zoneList || [])].sort((a, b) => b.capacity - a.capacity);

  return (
    <div className="space-y-8 pb-24">
      {/* SECTION 1: TOP HEADER */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter">BeatTheCrowd</h1>
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Status overview">
            <span className="bg-card-dark px-3 py-1 rounded-full text-[10px] font-bold text-text-primary border border-white/5 flex items-center gap-1 shrink-0">
              🏟️ Champions League Final • <span className="text-danger animate-pulse">LIVE</span>
            </span>
            <span 
              className={`${stats?.status.color}/10 border ${stats?.status.color}/30 ${stats?.status.text} px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0`}
              aria-live="polite"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${stats?.status.color} animate-pulse`} aria-hidden="true"></div>
              {stats?.status.label}
              <span className="sr-only">Status updated to {stats?.status.label}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="hidden sm:flex bg-card-dark px-3 py-2 rounded-xl border border-white/5 items-center gap-2 text-xs font-mono font-bold whitespace-nowrap"
            aria-label={`Current local time: ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          >
            <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button 
            onClick={triggerEmergency} 
            aria-label="Simulate emergency overcrowding"
            className="bg-danger/20 p-2 rounded-xl border border-danger/30 text-danger hover:bg-danger/30 transition-colors"
          >
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* SECTION 2: STAT CARDS ROW */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2" role="region" aria-label="Quick metrics">
        <StatCard icon="🏟️" label="Avg Occupancy" value={`${stats?.avgCapacity}%`} color="text-primary" />
        <StatCard icon="⏱️" label="Avg Wait" value={`${stats?.avgWait}m`} color="text-amber-300" />
        <StatCard icon="🚪" label="Open Gates" value={stats?.openGates} color="text-success" />
        <StatCard icon="🚨" label="Hot Zones" value={stats?.highCrowdZones.length} color="text-danger" />
      </div>

      {/* SECTION 3: STADIUM HEATMAP */}
      <StadiumHeatmap />

      {/* SECTION 4: QUICK ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="navigation" aria-label="Quick links">
        <QuickAction type="food" onClick={() => navigate('/navigate?filter=food')} />
        <QuickAction type="restroom" onClick={() => navigate('/navigate?filter=restroom')} />
        <QuickAction type="gate" onClick={() => navigate('/navigate?filter=gate')} />
        <QuickAction type="seat" onClick={() => navigate('/navigate?filter=seat')} />
      </div>

      {/* SECTION 5: ZONE STATUS LIST */}
      <section className="space-y-4 animate-count-up">
        <h3 className="font-bold text-lg">Zone Live Feeds</h3>
        <div className="space-y-3" role="feed" aria-busy={loading} aria-label="Zone status updates">
          {sortedZones.map((zone) => (
            <ZoneCard 
              key={zone.id}
              {...zone}
              onNavigate={(id) => navigate(`/navigate?zone=${id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div 
    className="bg-card-dark p-4 rounded-2xl border border-white/5 min-w-[140px] flex-1 card-hover shadow-lg"
    tabIndex={0}
  >
    <span className="text-2xl mb-2 block" aria-hidden="true">{icon}</span>
    <h4 className={`text-2xl font-mono font-bold ${color}`}>{value}</h4>
    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-1">{label}</p>
  </div>
);

export default Home;
