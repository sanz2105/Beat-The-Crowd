import React, { useMemo } from 'react';
import { useVenueData } from '../hooks/useVenueData';
import { Activity, Users, Clock, AlertCircle, DoorOpen, Star, LayoutDashboard, Search, Bell, Shield, ArrowRight } from 'lucide-react';

const Admin: React.FC = () => {
  const { zones, loading } = useVenueData();

  const stats = useMemo(() => {
    if (!zones) return null;
    const list = Object.values(zones);
    const avgWait = Math.round(list.reduce((acc, z) => acc + z.waitTime, 0) / list.length);
    const congested = list.filter(z => z.crowdLevel === 'high').length;
    const openGates = list.filter(z => z.type === 'gate' && z.isOpen).length;
    return { avgWait, congested, openGates };
  }, [zones]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Activity className="animate-spin text-primary w-12 h-12" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-text-primary p-6 lg:p-10 space-y-8 no-scrollbar">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary rounded-xl">
               <Shield className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-3xl font-black tracking-tighter">Venue Operations Center</h1>
          </div>
          <p className="text-text-secondary font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Champions League Final | Total Capacity: 80,000 | <span className="text-success">● LIVE</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-card-dark px-4 py-2 rounded-xl border border-white/5 font-mono font-bold text-sm">
             {new Date().toLocaleTimeString()}
          </div>
          <button className="bg-primary p-3 rounded-xl text-white shadow-xl shadow-primary/20">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* TOP KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard label="Total Guests" value="58,432" icon={Users} color="text-primary" />
        <KPICard label="Avg Wait" value={`${stats?.avgWait}m`} icon={Clock} color="text-warning" />
        <KPICard label="Active Alerts" value="3" icon={AlertCircle} color="text-danger" />
        <KPICard label="Congested" value={stats?.congested} icon={Activity} color="text-danger" />
        <KPICard label="Open Gates" value={`${stats?.openGates}/4`} icon={DoorOpen} color="text-success" />
        <KPICard label="Sat Score" value="4.2/5" icon={Star} color="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN HEATMAP (Large Center) */}
        <div className="lg:col-span-8 bg-card-dark rounded-[40px] p-8 border border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Stadium Load Distribution</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold">2D VIEW</span>
              <span className="px-3 py-1 bg-primary rounded-lg text-[10px] font-bold">REAL-TIME</span>
            </div>
          </div>
          
          <div className="relative aspect-video w-full bg-bg-dark rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 800 450" className="w-full h-full p-8 opacity-60">
              <ellipse cx="400" cy="225" rx="350" ry="180" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.1" />
              <ellipse cx="400" cy="225" rx="280" ry="120" fill="white" fillOpacity="0.02" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
              
              {zones && Object.entries(zones).map(([id, z], i) => {
                const angle = (i / Object.keys(zones).length) * 2 * Math.PI;
                const rx = 300, ry = 150;
                const cx = 400 + rx * Math.cos(angle);
                const cy = 225 + ry * Math.sin(angle);
                
                return (
                  <g key={id}>
                    <circle 
                      cx={cx} cy={cy} r="30" 
                      fill={z.crowdLevel === 'high' ? '#EF4444' : z.crowdLevel === 'medium' ? '#F59E0B' : '#22C55E'} 
                      fillOpacity="0.2" 
                    />
                    <circle 
                      cx={cx} cy={cy} r="12" 
                      fill={z.crowdLevel === 'high' ? '#EF4444' : z.crowdLevel === 'medium' ? '#F59E0B' : '#22C55E'} 
                    >
                       <animate attributeName="opacity" from="1" to="0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x={cx} y={cy - 40} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" className="uppercase tracking-tighter">
                      {z.name}
                    </text>
                    <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="10" fontWeight="black">
                      {z.crowdLevel === 'high' ? '92%' : z.crowdLevel === 'medium' ? '54%' : '18%'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ANALYTICS MINI-CHARTS */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-text-secondary uppercase">Load Over Time (60m)</h4>
              <div className="h-20 flex items-end gap-1 px-2">
                {[40, 60, 55, 80, 95, 70, 85, 90, 60, 45].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-all group relative" style={{height: `${h}%`}}>
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-card-dark text-[8px] p-1 rounded opacity-0 group-hover:opacity-100">{h}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-text-secondary uppercase">Gate Distribution</h4>
              <div className="space-y-2">
                {[
                  { name: 'Gate A', val: 35 },
                  { name: 'Gate B', val: 92 },
                  { name: 'Gate C', val: 18 }
                ].map(g => (
                  <div key={g.name} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold w-12">{g.name}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${g.val > 80 ? 'bg-danger' : 'bg-primary'}`} style={{width: `${g.val}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR OPS (Quick Actions) */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-card-dark rounded-[40px] p-8 border border-white/5 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Operations
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <AdminAction label="Open Emergency Gate D" color="bg-danger/10 text-danger border-danger/30" />
                <AdminAction label="Broadcast Safety Alert" color="bg-warning/10 text-warning border-warning/30" />
                <AdminAction label="Deploy Staff to Sector B" color="bg-primary/10 text-primary border-primary/30" />
                <AdminAction label="Override Logic AI" color="bg-white/5 text-text-secondary border-white/5" />
              </div>
           </div>

           <div className="bg-card-dark rounded-[40px] p-8 border border-white/5 space-y-6">
              <h2 className="text-xl font-bold">Busiest Sectors</h2>
              <div className="space-y-4">
                 {zones && Object.entries(zones).filter(([_, z]) => z.crowdLevel === 'high').map(([id, z]) => (
                   <div key={id} className="flex justify-between items-center p-4 bg-danger/5 border border-danger/20 rounded-2xl">
                      <div>
                        <p className="font-bold text-sm text-white">{z.name}</p>
                        <p className="text-[10px] text-danger font-bold uppercase tracking-widest">{z.waitTime}m wait time</p>
                      </div>
                      <button className="bg-danger text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">ALERT STAFF</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* ZONES TABLE */}
      <section className="bg-card-dark rounded-[40px] p-8 border border-white/5 overflow-x-auto no-scrollbar">
        <h2 className="text-xl font-bold mb-6">Zone Metrics Detail</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase font-bold text-text-secondary border-b border-white/5">
              <th className="pb-4">Zone Name</th>
              <th className="pb-4">Crowd Level</th>
              <th className="pb-4">Wait Time</th>
              <th className="pb-4">Capacity %</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {zones && Object.entries(zones).map(([id, z]) => (
              <tr key={id} className="group hover:bg-white/5 transition-colors">
                <td className="py-4 text-sm font-bold">{z.name}</td>
                <td className="py-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                    z.crowdLevel === 'high' ? 'bg-danger/20 text-danger' : 
                    z.crowdLevel === 'medium' ? 'bg-warning/20 text-warning' : 
                    'bg-success/20 text-success'
                  }`}>
                    {z.crowdLevel}
                  </span>
                </td>
                <td className="py-4 font-mono font-bold text-sm">{z.waitTime}m</td>
                <td className="py-4 font-mono text-sm">{z.crowdLevel === 'high' ? '92%' : z.crowdLevel === 'medium' ? '54%' : '18%'}</td>
                <td className="py-4">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${z.isOpen ? 'bg-success animate-pulse' : 'bg-danger'}`} />
                     <span className="text-[10px] font-bold uppercase opacity-50">{z.isOpen ? 'Operational' : 'Closed'}</span>
                   </div>
                </td>
                <td className="py-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                    <ArrowRight className="w-4 h-4 text-text-secondary" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const KPICard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-card-dark p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
    <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-2xl font-mono font-black text-white tracking-tighter">{value}</h4>
      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

const AdminAction = ({ label, color }: any) => (
  <button className={`w-full py-4 px-6 rounded-2xl border font-bold text-xs uppercase tracking-widest text-left hover:scale-[1.02] active:scale-[0.98] transition-all ${color}`}>
    {label}
  </button>
);

export default Admin;
