import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Clock, Users, ArrowRight, Utensils, MapPin, DoorOpen, Loader2, ShieldAlert, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVenueData } from '../hooks/useVenueData';
import { ref, update } from 'firebase/database';
import { db } from '../services/firebase';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { zones, loading } = useVenueData();
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Emergency Demo Toggle
  const triggerEmergency = async () => {
    if (!zones) return;
    const updates = {
      'zones/gate_b/crowdLevel': 'high',
      'zones/gate_b/waitTime': 35,
      'zones/gate_b/capacity': 95
    };
    await update(ref(db), updates);
  };

  const stats = useMemo(() => {
    if (!zones) return null;
    const zoneList = Object.values(zones);
    const highCrowdZones = zoneList.filter(z => z.crowdLevel === 'high');
    const openGates = zoneList.filter(z => z.type === 'gate' && z.isOpen).length;
    const avgWait = Math.round(zoneList.reduce((acc, z) => acc + z.waitTime, 0) / zoneList.length);
    const avgCapacity = Math.round(zoneList.reduce((acc, z) => acc + (z.crowdLevel === 'high' ? 90 : z.crowdLevel === 'medium' ? 55 : 20), 0) / zoneList.length);

    let status = { label: 'Smooth', color: 'bg-success', text: 'text-success' };
    if (highCrowdZones.length > 3) {
      status = { label: 'Congested', color: 'bg-danger', text: 'text-danger' };
    } else if (highCrowdZones.length >= 1) {
      status = { label: 'Moderate', color: 'bg-warning', text: 'text-warning' };
    }

    return { highCrowdZones, openGates, avgWait, avgCapacity, status, zoneList };
  }, [zones]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
          <div className="h-10 w-40 skeleton" />
          <div className="h-10 w-24 skeleton" />
        </div>
        <div className="h-48 w-full skeleton" />
        <div className="grid grid-cols-4 gap-4">
           {[1,2,3,4].map(i => <div key={i} className="h-24 skeleton" />)}
        </div>
        <div className="h-64 w-full skeleton" />
      </div>
    );
  }

  const sortedZones = [...(stats?.zoneList || [])].sort((a, b) => {
    const rank = { high: 3, medium: 2, low: 1 };
    return rank[b.crowdLevel] - rank[a.crowdLevel];
  });

  return (
    <div className="space-y-8 pb-24">
      {/* SECTION 1: TOP HEADER */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter">BeatTheCrowd</h1>
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="bg-card-dark px-3 py-1 rounded-full text-[10px] font-bold text-text-primary border border-white/5 flex items-center gap-1 shrink-0">
              🏟️ Champions League Final • <span className="text-danger animate-pulse">LIVE</span>
            </span>
            <span className={`${stats?.status.color}/10 border ${stats?.status.color}/30 ${stats?.status.text} px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0`}>
              <div className={`w-1.5 h-1.5 rounded-full ${stats?.status.color} animate-pulse`}></div>
              {stats?.status.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-card-dark px-3 py-2 rounded-xl border border-white/5 items-center gap-2 text-xs font-mono font-bold whitespace-nowrap">
            <Clock className="w-4 h-4 text-primary" />
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button onClick={triggerEmergency} className="bg-danger/20 p-2 rounded-xl border border-danger/30 text-danger" title="Simulate Overcrowding">
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* SECTION 2: STAT CARDS ROW */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        <StatCard icon="🏟️" label="Capacity" value={`${stats?.avgCapacity}%`} color="text-primary" />
        <StatCard icon="⏱️" label="Avg Wait" value={`${stats?.avgWait}m`} color="text-warning" />
        <StatCard icon="🚪" label="Open Gates" value={stats?.openGates} color="text-success" />
        <StatCard icon="🚨" label="Alerts" value={stats?.highCrowdZones.length} color="text-danger" />
      </div>

      {/* SECTION 3: STADIUM HEATMAP */}
      <section className="bg-card-dark rounded-3xl p-6 border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Stadium Heatmap</h3>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Top-down View</span>
        </div>

        <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
            <ellipse cx="200" cy="150" rx="180" ry="130" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <ellipse cx="200" cy="150" rx="140" ry="90" fill="rgba(37, 99, 235, 0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <rect x="140" y="110" width="120" height="80" rx="10" fill="rgba(34, 197, 94, 0.1)" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" />
            
            {zones && Object.entries(zones).map(([id, z], i) => (
               <ZoneMarker key={id} cx={getCoords(id).x} cy={getCoords(id).y} zone={z} />
            ))}
          </svg>
        </div>
      </section>

      {/* SECTION 4: QUICK ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <QuickAction icon={<Utensils />} label="Find Food" onClick={() => navigate('/navigate?filter=food')} />
        <QuickAction icon={<MapPin />} label="Find Restroom" onClick={() => navigate('/navigate?filter=restroom')} />
        <QuickAction icon={<DoorOpen />} label="Find Gate" onClick={() => navigate('/navigate?filter=gate')} />
        <QuickAction icon={<Users />} label="Go to Seat" onClick={() => navigate('/navigate?filter=seat')} />
      </div>

      {/* SECTION 5: ZONE STATUS LIST */}
      <section className="space-y-4 animate-count-up">
        <h3 className="font-bold text-lg">Zone Live Feeds</h3>
        <div className="space-y-3">
          {sortedZones.map((zone) => (
            <div key={zone.name} className="bg-card-dark p-4 rounded-2xl border border-white/5 flex items-center justify-between group card-hover transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">
                  {zone.type === 'food' ? '🍔' : zone.type === 'gate' ? '🚪' : zone.type === 'restroom' ? '🚻' : '🏟️'}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{zone.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                      zone.crowdLevel === 'high' ? 'bg-danger/20 text-danger' : 
                      zone.crowdLevel === 'medium' ? 'bg-warning/20 text-warning' : 
                      'bg-success/20 text-success'
                    }`}>
                      {zone.crowdLevel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono font-bold text-text-primary">{zone.waitTime}m</p>
                  <p className="text-[9px] text-text-secondary uppercase font-bold tracking-tighter">Wait</p>
                </div>
                <button 
                  onClick={() => navigate(`/navigate?zone=${zone.id}`)}
                  className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary text-white transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-card-dark p-4 rounded-2xl border border-white/5 min-w-[140px] flex-1 card-hover">
    <span className="text-2xl mb-2 block">{icon}</span>
    <h4 className={`text-2xl font-mono font-bold ${color}`}>{value}</h4>
    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-1">{label}</p>
  </div>
);

const QuickAction = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="bg-card-dark p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all">
    <div className="text-primary">{icon}</div>
    <span className="text-xs font-bold text-text-primary whitespace-nowrap">{label}</span>
  </button>
);

const ZoneMarker = ({ cx, cy, zone }: any) => {
  if (!zone) return null;
  const color = zone.crowdLevel === 'high' ? '#EF4444' : zone.crowdLevel === 'medium' ? '#F59E0B' : '#22C55E';
  const speed = zone.crowdLevel === 'high' ? '1s' : zone.crowdLevel === 'medium' ? '2s' : '3s';

  return (
    <g className="group cursor-pointer">
      <circle cx={cx} cy={cy} r="6" fill={color}>
        <animate attributeName="r" from="4" to="10" dur={speed} repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur={speed} repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r="4" fill={color} />
      <title>{`${zone.name}: ${zone.crowdLevel} crowd, ${zone.waitTime}m wait`}</title>
    </g>
  );
};

const getCoords = (id: string) => {
  const coords: Record<string, {x: number, y: number}> = {
    gate_a: {x: 40, y: 150}, gate_b: {x: 360, y: 150}, gate_c: {x: 80, y: 70}, gate_d: {x: 320, y: 70},
    food_north: {x: 200, y: 40}, food_south: {x: 200, y: 260}, burger_zone: {x: 100, y: 230},
    pizza_hub: {x: 300, y: 230}, rest_east: {x: 340, y: 110}, rest_west: {x: 60, y: 110},
    main_arena: {x: 200, y: 150}, vip_lounge: {x: 140, y: 60}
  };
  return coords[id] || {x: 200, y: 150};
};

export default Home;
