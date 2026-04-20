import React, { useState, useMemo, useEffect } from 'react';
import { useVenueData } from '../hooks/useVenueData';
import { Clock, Navigation, Bot, Loader2, ArrowUpDown, Sparkles, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Queues: React.FC = () => {
  const navigate = useNavigate();
  const { zones, loading } = useVenueData();
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState<'nearest' | 'wait' | 'alpha'>('wait');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (zones) setLastUpdated(new Date().toLocaleTimeString());
  }, [zones]);

  const sortedZones = useMemo(() => {
    if (!zones) return [];
    let list = Object.entries(zones).map(([id, z]) => ({ id, ...z }));

    // Filter
    if (activeTab !== 'All') {
      const typeMap: Record<string, string> = { 'Food': 'food', 'Gates': 'gate', 'Restrooms': 'restroom' };
      list = list.filter(z => z.type === typeMap[activeTab]);
    }

    // Sort
    if (sortBy === 'wait') {
      list.sort((a, b) => a.waitTime - b.waitTime);
    } else if (sortBy === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [zones, activeTab, sortBy]);

  const summary = useMemo(() => {
    if (!zones) return null;
    const list = Object.values(zones);
    const bestFood = list.filter(z => z.type === 'food').sort((a, b) => a.waitTime - b.waitTime)[0];
    const busiestGate = list.filter(z => z.type === 'gate').sort((a, b) => b.waitTime - a.waitTime)[0];
    return { bestFood, busiestGate };
  }, [zones]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-text-secondary font-bold uppercase tracking-widest text-xs">Analyzing live queue data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* HEADER */}
      <header className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Queue Intelligence</h1>
          <p className="text-text-secondary text-sm flex items-center gap-2">
             Live wait times • Updated {lastUpdated}
          </p>
        </div>
        <div className="relative">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-card-dark border border-white/5 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none appearance-none pr-8 cursor-pointer"
          >
            <option value="wait">Lowest Wait</option>
            <option value="alpha">Alphabetical</option>
            <option value="nearest">Nearest</option>
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
        </div>
      </header>

      {/* FILTER TABS */}
      <div className="sticky top-0 z-10 bg-bg-dark/80 backdrop-blur-md border-b border-white/5 flex gap-6 px-2">
        {['All', 'Food', 'Gates', 'Restrooms'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-sm font-bold transition-all relative ${
              activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in zoom-in duration-300"></div>}
          </button>
        ))}
      </div>

      {/* AI TIP CARD */}
      <div className="bg-gradient-to-br from-card-dark to-primary/5 p-5 rounded-3xl border-l-4 border-primary border-t border-r border-b border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Sparkles className="w-16 h-16" />
        </div>
        <div className="flex gap-3 items-start relative z-10">
          <div className="p-2 bg-primary/20 rounded-xl">
             <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1">AI Smart Tip</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Best time to grab food is in <span className="text-white font-bold">8 minutes</span> when halftime crowds peak. Head to <span className="text-white font-bold">{summary?.bestFood?.name}</span> now — only {summary?.bestFood?.waitTime} min wait!
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card-dark/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                 <TrendingDown className="w-4 h-4 text-success" />
              </div>
              <span className="text-xs text-text-secondary font-bold">Best Food Spot</span>
           </div>
           <span className="text-xs font-bold text-success uppercase tracking-widest">{summary?.bestFood?.name} ({summary?.bestFood?.waitTime}m)</span>
        </div>
        <div className="bg-card-dark/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">
                 <Clock className="w-4 h-4 text-danger" />
              </div>
              <span className="text-xs text-text-secondary font-bold">Busiest Gate</span>
           </div>
           <span className="text-xs font-bold text-danger uppercase tracking-widest">{summary?.busiestGate?.name} ({summary?.busiestGate?.waitTime}m)</span>
        </div>
      </div>

      {/* QUEUE CARDS LIST */}
      <div className="space-y-4 animate-count-up">
        {sortedZones.map((zone) => (
          <div 
            key={zone.id} 
            className={`bg-card-dark p-6 rounded-3xl border transition-all relative overflow-hidden group card-hover ${
              zone.crowdLevel === 'high' ? 'border-danger/30 animate-pulse-subtle' : 'border-white/5'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{zone.type === 'food' ? '🍔' : zone.type === 'gate' ? '🚪' : '🚻'}</span>
                <div>
                  <h3 className="font-bold text-white tracking-tight">{zone.name}</h3>
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">240m away • Level 2</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                zone.crowdLevel === 'high' ? 'bg-danger text-white' : 
                zone.crowdLevel === 'medium' ? 'bg-warning text-white' : 
                'bg-success text-white'
              }`}>
                {zone.crowdLevel}
              </span>
            </div>

            <div className="flex items-end gap-6 mb-6">
              <div className="text-center">
                <p className={`text-5xl font-mono font-black tracking-tighter ${
                  zone.crowdLevel === 'high' ? 'text-danger' : 
                  zone.crowdLevel === 'medium' ? 'text-warning' : 
                  'text-success'
                }`}>{zone.waitTime}</p>
                <p className="text-[10px] font-bold uppercase text-text-secondary -mt-1">Minutes</p>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex justify-between items-end mb-2">
                   <p className="text-[10px] font-bold text-text-secondary uppercase">Live Capacity</p>
                   <p className="text-[10px] font-bold text-white uppercase">{zone.crowdLevel === 'high' ? '92%' : zone.crowdLevel === 'medium' ? '54%' : '18%'}</p>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      zone.crowdLevel === 'high' ? 'bg-danger w-[92%]' : 
                      zone.crowdLevel === 'medium' ? 'bg-warning w-[54%]' : 
                      'bg-success w-[18%]'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button 
                onClick={() => navigate(`/navigate?zone=${zone.id}`)}
                className="py-3 bg-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/80 transition-all shadow-lg shadow-primary/10"
              >
                <Navigation className="w-3 h-3" />
                Navigate
              </button>
              <button 
                onClick={() => navigate(`/assistant?q=Tell me about ${zone.name}`)}
                className="py-3 bg-white/5 text-text-primary rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/5"
              >
                <Bot className="w-3 h-3" />
                Ask AI
              </button>
              {zone.type === 'food' && (
                <button 
                  onClick={() => navigate(`/order-food?stall=${zone.name}&wait=${zone.waitTime}`)}
                  className="py-3 bg-success/10 text-success rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-success transition-all border border-success/20 group-hover:border-success/50 col-span-2 md:col-span-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Order Ahead
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queues;
