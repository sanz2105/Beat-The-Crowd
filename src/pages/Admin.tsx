import React, { useState } from 'react';
import { useVenueData } from '../hooks/useVenueData';
import { Users, Clock, AlertTriangle, Shield, CheckCircle, ArrowRight, Menu, Bell } from 'lucide-react';
import { ref, update } from 'firebase/database';
import { db } from '../services/firebase';

const Admin: React.FC = () => {
  const { zones, loading } = useVenueData();
  const [activeTab, setActiveTab] = useState<'overview' | 'zones' | 'alerts'>('overview');

  const stats = [
    { label: 'Total Guests', value: '48,291', change: '+12%', icon: <Users /> },
    { label: 'Avg Wait Time', value: '14m', change: '-2m', icon: <Clock /> },
    { label: 'Alerts Active', value: '3', change: 'High', icon: <AlertTriangle /> },
    { label: 'Security Status', value: 'Level 1', change: 'Normal', icon: <Shield /> },
    { label: 'Gate Efficiency', value: '92%', change: '+5%', icon: <CheckCircle /> },
    { label: 'Fan Satisfaction', value: '4.8', change: 'Excellent', icon: <Bell /> },
  ];

  const updateZoneStatus = async (id: string, updates: any) => {
    await update(ref(db, `zones/${id}`), updates);
  };

  if (loading) return <div className="p-10 text-center">Loading Operations Center...</div>;

  return (
    <div className="space-y-8 pb-32 max-w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Venue Operations Center</h1>
          <p className="text-text-secondary text-sm">Real-time stadium intelligence & command hub</p>
        </div>
        <div className="flex bg-card-dark p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('zones')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'zones' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
          >
            Zones
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'alerts' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
          >
            Alerts
          </button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-card-dark p-5 rounded-3xl border border-white/5 space-y-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">{s.label}</p>
              <h4 className="text-2xl font-mono font-bold text-white">{s.value}</h4>
            </div>
            <p className={`text-[10px] font-bold ${s.change.startsWith('+') || s.change === 'Normal' ? 'text-success' : 'text-danger'}`}>
              {s.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN COMMAND VIEW */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card-dark rounded-[2.5rem] p-8 border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                Live Heatmap Analysis
                <span className="bg-success/20 text-success text-[10px] px-2 py-0.5 rounded-full animate-pulse">Live Feed</span>
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary">
                  <div className="w-2 h-2 rounded-full bg-success"></div> Low
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary">
                  <div className="w-2 h-2 rounded-full bg-warning"></div> Med
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary">
                  <div className="w-2 h-2 rounded-full bg-danger"></div> High
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-bg-dark/50 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
               {/* Oversized Heatmap for Admin */}
               <svg viewBox="0 0 400 300" className="w-full h-full p-8 opacity-60">
                 <ellipse cx="200" cy="150" rx="180" ry="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                 <ellipse cx="200" cy="150" rx="140" ry="80" fill="rgba(37,99,235,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                 
                 {zones && Object.entries(zones).map(([id, z]) => {
                   const coords = getZoneCoords(id);
                   const color = z.crowdLevel === 'high' ? '#EF4444' : z.crowdLevel === 'medium' ? '#F59E0B' : '#22C55E';
                   return (
                     <g key={id}>
                        <circle cx={coords.x} cy={coords.y} r="15" fill={color} opacity="0.2" className="animate-pulse" />
                        <circle cx={coords.x} cy={coords.y} r="6" fill={color} />
                        <text x={coords.x} y={coords.y + 20} fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" className="opacity-60">{z.waitTime}m</text>
                     </g>
                   );
                 })}
               </svg>
            </div>
          </section>

          <section className="bg-card-dark rounded-3xl p-6 border border-white/5">
            <h3 className="font-bold mb-4">Operational Status List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-white/5">
                  <tr>
                    <th className="pb-4 px-2">Zone Name</th>
                    <th className="pb-4 px-2">Status</th>
                    <th className="pb-4 px-2">Capacity</th>
                    <th className="pb-4 px-2">Wait Time</th>
                    <th className="pb-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {zones && Object.entries(zones).map(([id, z]) => (
                    <tr key={id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-2 font-bold">{z.name}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          z.crowdLevel === 'high' ? 'bg-danger/20 text-danger' : 
                          z.crowdLevel === 'medium' ? 'bg-warning/20 text-warning' : 
                          'bg-success/20 text-success'
                        }`}>
                          {z.crowdLevel}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-mono">{z.capacity}%</td>
                      <td className="py-4 px-2 font-mono font-bold text-primary">{z.waitTime}m</td>
                      <td className="py-4 px-2 text-right">
                        <button 
                          onClick={() => updateZoneStatus(id, { isOpen: !z.isOpen })}
                          className={`p-2 rounded-lg transition-all ${z.isOpen ? 'bg-danger/10 text-danger hover:bg-danger hover:text-white' : 'bg-success/10 text-success hover:bg-success hover:text-white'}`}
                        >
                          {z.isOpen ? 'Close' : 'Open'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* SIDEBAR OPS */}
        <div className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                   <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-bold">Staff Command</h4>
             </div>
             <p className="text-xs text-text-secondary leading-relaxed">Broadcast emergency directives or stadium-wide alerts instantly.</p>
             <div className="space-y-2">
                <button className="w-full py-3 bg-danger text-white rounded-xl font-bold text-xs shadow-lg shadow-danger/20 hover:scale-[1.02] active:scale-95 transition-all">
                   BROADCAST EVACUATION
                </button>
                <button className="w-full py-3 bg-card-dark text-white border border-white/10 rounded-xl font-bold text-xs hover:bg-white/5 transition-all">
                   Deploy Security to Sector B
                </button>
             </div>
          </div>

          <div className="bg-card-dark rounded-3xl p-6 border border-white/5 space-y-4">
             <div className="flex justify-between items-center">
                <h4 className="font-bold">Crowd Surge Alerts</h4>
                <Menu className="w-4 h-4 text-text-secondary" />
             </div>
             <div className="space-y-4">
                <AdminAlert type="critical" msg="Sector D capacity reached 98%" time="2m ago" />
                <AdminAlert type="warning" msg="Food North queue exceeds 25m" time="5m ago" />
                <AdminAlert type="info" msg="Staff shift change in progress" time="12m ago" />
             </div>
             <button className="w-full py-3 bg-white/5 rounded-xl text-xs font-bold text-text-secondary hover:text-white transition-all flex items-center justify-center gap-2">
                View All Logs <ArrowRight className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAlert = ({ type, msg, time }: any) => (
  <div className="flex gap-3 items-start p-3 bg-bg-dark rounded-2xl border border-white/5">
    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${type === 'critical' ? 'bg-danger' : type === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
    <div>
      <p className="text-xs font-bold text-white leading-tight">{msg}</p>
      <p className="text-[10px] text-text-secondary mt-1">{time}</p>
    </div>
  </div>
);

const getZoneCoords = (id: string) => {
  const coords: Record<string, {x: number, y: number}> = {
    gate_a: {x: 40, y: 150}, gate_b: {x: 360, y: 150}, gate_c: {x: 80, y: 70}, gate_d: {x: 320, y: 70},
    food_north: {x: 200, y: 40}, food_south: {x: 200, y: 260}, burger_zone: {x: 100, y: 230},
    pizza_hub: {x: 300, y: 230}, rest_east: {x: 340, y: 110}, rest_west: {x: 60, y: 110},
    main_arena: {x: 200, y: 150}, vip_lounge: {x: 140, y: 60}
  };
  return coords[id] || {x: 200, y: 150};
};

export default Admin;
