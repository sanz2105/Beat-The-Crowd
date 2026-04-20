import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Zap, Users, Accessibility, MapPin, Clock, ArrowRight, Loader2, Navigation as NavIcon } from 'lucide-react';
import { useVenueData } from '../hooks/useVenueData';

type RouteType = 'fastest' | 'leastCrowded' | 'accessible';

const Navigate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || '';
  
  const { zones, loading } = useVenueData();
  const [destination, setDestination] = useState('');
  const [routeType, setRouteType] = useState<RouteType>('fastest');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Set initial destination/filter if coming from Home Quick Actions
  useEffect(() => {
    if (filter) {
      setDestination(filter.charAt(0).toUpperCase() + filter.slice(1));
    }
  }, [filter]);

  const zoneOptions = useMemo(() => {
    if (!zones) return [];
    const list = Object.entries(zones).map(([id, z]) => ({ id, ...z }));
    
    // Filter by search/quick action
    const filtered = list.filter(z => 
      z.name.toLowerCase().includes(destination.toLowerCase()) || 
      z.type.toLowerCase().includes(destination.toLowerCase())
    );

    // Sort based on route type
    if (routeType === 'fastest') {
      return filtered.sort((a, b) => a.waitTime - b.waitTime);
    } else if (routeType === 'leastCrowded') {
      const rank = { low: 1, medium: 2, high: 3 };
      return filtered.sort((a, b) => rank[a.crowdLevel] - rank[b.crowdLevel]);
    }
    return filtered;
  }, [zones, destination, routeType]);

  useEffect(() => {
    if (zoneOptions.length > 0 && !selectedZoneId) {
      setSelectedZoneId(zoneOptions[0].id);
    }
  }, [zoneOptions]);

  const selectedZone = useMemo(() => 
    zoneOptions.find(z => z.id === selectedZoneId) || zoneOptions[0], 
  [zoneOptions, selectedZoneId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const routeColors = {
    fastest: '#2563EB',
    leastCrowded: '#22C55E',
    accessible: '#8B5CF6'
  };

  return (
    <div className="space-y-6 pb-32">
      {/* TOP BAR */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Where do you want to go?"
          className="w-full bg-card-dark border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-xl"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* ROUTE TYPE SELECTOR */}
      <div className="flex p-1 bg-card-dark rounded-2xl border border-white/5">
        <RouteTab active={routeType === 'fastest'} onClick={() => setRouteType('fastest')} icon={<Zap className="w-4 h-4" />} label="Fastest" />
        <RouteTab active={routeType === 'leastCrowded'} onClick={() => setRouteType('leastCrowded')} icon={<Users className="w-4 h-4" />} label="Crowd" />
        <RouteTab active={routeType === 'accessible'} onClick={() => setRouteType('accessible')} icon={<Accessibility className="w-4 h-4" />} label="Access" />
      </div>

      {/* MAP SECTION */}
      <div className="bg-card-dark rounded-3xl border border-white/5 relative overflow-hidden aspect-[4/3] flex items-center justify-center">
         <svg viewBox="0 0 400 300" className="w-full h-full p-4 opacity-40">
            <ellipse cx="200" cy="150" rx="180" ry="120" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.1" />
            <ellipse cx="200" cy="150" rx="140" ry="80" fill="white" fillOpacity="0.02" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
            <rect x="140" y="110" width="120" height="80" rx="10" fill="white" fillOpacity="0.05" />
         </svg>

         {/* Routing Overlay */}
         <div className="absolute inset-0">
            <svg viewBox="0 0 400 300" className="w-full h-full">
               {/* Animated Route Line */}
               {selectedZone && (
                 <path 
                   d={`M 200 150 L ${getZoneCoords(selectedZoneId).x} ${getZoneCoords(selectedZoneId).y}`}
                   stroke={routeColors[routeType]}
                   strokeWidth="3"
                   strokeDasharray="8 4"
                   fill="none"
                   className="animate-dash"
                 />
               )}
               
               {/* You are here marker */}
               <g>
                 <circle cx="200" cy="150" r="10" fill="#2563EB" opacity="0.3">
                   <animate attributeName="r" from="6" to="14" dur="2s" repeatCount="indefinite" />
                   <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                 </circle>
                 <circle cx="200" cy="150" r="5" fill="#2563EB" />
               </g>

               {/* Destination Marker */}
               {selectedZone && (
                 <g transform={`translate(${getZoneCoords(selectedZoneId).x - 12}, ${getZoneCoords(selectedZoneId).y - 24})`}>
                   <MapPin className="w-6 h-6 text-danger" fill="#EF4444" />
                 </g>
               )}
            </svg>
         </div>
         
         <div className="absolute top-4 left-4 bg-bg-dark/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            Live Tracking Active
         </div>
      </div>

      {/* ROUTE INFO PANEL */}
      <div className="bg-card-dark rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">{selectedZone?.name || 'Select a destination'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <NavIcon className="w-3 h-3" /> ~5 min walk
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                selectedZone?.crowdLevel === 'high' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
              }`}>
                ⚠️ {selectedZone?.crowdLevel} crowd ahead
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono font-bold text-primary">05:12</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase">ETA</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-white/5">
          <Step index={1} text="Head north through Section B" />
          <Step index={2} text="Turn left at Concourse Level 2" />
          <Step index={3} text="Destination on your right" />
        </div>
      </div>

      {/* ROUTE OPTIONS CARDS */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest pl-1">Available Destinations</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {zoneOptions.map((opt) => (
            <button 
              key={opt.id}
              onClick={() => setSelectedZoneId(opt.id)}
              className={`min-w-[200px] p-4 rounded-2xl border transition-all text-left ${
                selectedZoneId === opt.id 
                  ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(37,99,235,0.1)]' 
                  : 'bg-card-dark border-white/5 opacity-70'
              }`}
            >
              <h4 className="font-bold text-sm mb-1">{opt.name}</h4>
              <p className="text-xs text-text-secondary mb-3">240m • Section 102</p>
              <div className="flex justify-between items-end">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                  opt.crowdLevel === 'high' ? 'bg-danger/20 text-danger' : 
                  opt.crowdLevel === 'medium' ? 'bg-warning/20 text-warning' : 
                  'bg-success/20 text-success'
                }`}>
                  {opt.crowdLevel}
                </span>
                <span className="text-xl font-mono font-bold text-text-primary">{opt.waitTime}m</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* START NAVIGATION BUTTON */}
      <button className="fixed bottom-24 left-4 right-4 bg-primary text-white py-4 rounded-2xl font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all z-40 flex items-center justify-center gap-3">
        <NavIcon className="w-5 h-5" />
        START NAVIGATION
      </button>
    </div>
  );
};

const RouteTab = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
      active ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

const Step = ({ index, text }: { index: number; text: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-text-secondary mt-0.5">
      {index}
    </div>
    <p className="text-sm text-text-secondary">{text}</p>
  </div>
);

// Helper for zone coordinates in the SVG viewbox
const getZoneCoords = (id: string | null) => {
  const coords: Record<string, {x: number, y: number}> = {
    gate_a: {x: 40, y: 150},
    gate_b: {x: 360, y: 150},
    gate_c: {x: 80, y: 70},
    gate_d: {x: 320, y: 70},
    food_north: {x: 200, y: 40},
    food_south: {x: 200, y: 260},
    burger_zone: {x: 100, y: 230},
    pizza_hub: {x: 300, y: 230},
    rest_east: {x: 340, y: 110},
    rest_west: {x: 60, y: 110},
    main_arena: {x: 200, y: 150},
    vip_lounge: {x: 140, y: 60}
  };
  return id ? coords[id] || {x: 200, y: 150} : {x: 200, y: 150};
};

export default Navigate;
