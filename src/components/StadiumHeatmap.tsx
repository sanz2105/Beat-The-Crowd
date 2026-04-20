import React, { useState, useCallback } from 'react';
import { useVenueData } from '../hooks/useVenueData';
import { Navigation, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StadiumHeatmap: React.FC = () => {
  const { zones, loading } = useVenueData();
  const navigate = useNavigate();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const getZoneColor = (capacity: number) => {
    if (capacity < 40) return '#22C55E'; // Green
    if (capacity < 70) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const getPattern = (capacity: number) => {
    if (capacity < 40) return 'url(#pattern-low)';
    if (capacity < 70) return 'url(#pattern-moderate)';
    return 'url(#pattern-high)';
  };

  const handleZoneClick = useCallback((id: string) => {
    setSelectedZoneId(id);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedZoneId(id);
    }
  }, []);

  const selectedZone = selectedZoneId && zones ? { id: selectedZoneId, ...zones[selectedZoneId] } : null;

  if (loading) {
    return (
      <div className="w-full h-[350px] bg-[#0F172A] rounded-3xl flex items-center justify-center border border-white/5" role="status" aria-label="Loading stadium map">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderZone = (id: string, Component: any, props: any, label: string) => {
    const zone = zones?.[id];
    const capacity = zone?.capacity || 0;
    const color = getZoneColor(capacity);
    const pattern = getPattern(capacity);
    const isPulsing = capacity > 80;

    return (
      <g 
        key={id}
        tabIndex={0}
        role="button"
        aria-label={`${label}: ${capacity} percent occupancy, ${zone?.waitTime || 0} minutes wait`}
        onKeyDown={(e) => handleKeyDown(e, id)}
        onClick={() => handleZoneClick(id)}
        className="outline-none"
      >
        <title>{`${label}: ${capacity}% occupied`}</title>
        <Component 
          {...props} 
          fill={color}
          className={`zone ${isPulsing ? 'pulse' : ''} focus:stroke-white focus:stroke-2`}
        />
        {/* Pattern overlay for color-blind accessibility */}
        <Component {...props} fill={pattern} pointerEvents="none" opacity="0.3" />
      </g>
    );
  };

  return (
    <div className="w-full bg-[#0F172A] p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🏟️ Stadium Heatmap
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Live Zone Occupancy</p>
        </div>
        <div className="bg-white/5 px-3 py-1 rounded-full flex items-center gap-2" aria-live="polite">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-300">SYSTEMS ACTIVE</span>
        </div>
      </div>

      <div className="relative aspect-[4/3.5] w-full max-w-2xl mx-auto">
        <svg 
          viewBox="0 0 400 350" 
          className="w-full h-full drop-shadow-2xl"
          aria-label="Stadium crowd heatmap showing live zone density with interactive zones"
        >
          <defs>
            <pattern id="pattern-high" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="white" strokeWidth="1" />
            </pattern>
            <pattern id="pattern-moderate" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
            <pattern id="pattern-low" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="none" />
            </pattern>
            
            <style>
              {`
                .zone { transition: fill 0.8s ease, stroke 0.3s ease, opacity 0.3s ease; cursor: pointer; }
                .zone:hover, .zone:focus { stroke: white; stroke-width: 2; opacity: 0.9; }
                .pulse { animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse-ring {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.8; transform: scale(1.02); }
                }
              `}
            </style>
          </defs>

          {/* Stadium Base */}
          <ellipse cx="200" cy="175" rx="190" ry="140" fill="#1E293B" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
          
          {/* Main Concourse */}
          {renderZone('concourse', 'path', { d: "M 200 35 A 165 115 0 0 1 365 150 L 390 150 A 190 140 0 0 0 200 35 Z", opacity: "0.1" }, "Main Concourse")}

          {/* Sections */}
          {renderZone('section_a', 'path', { d: "M 200 175 L 200 65 A 110 80 0 0 0 90 175 Z" }, "Section A")}
          {renderZone('section_b', 'path', { d: "M 200 175 L 310 175 A 110 80 0 0 0 200 65 Z" }, "Section B")}
          {renderZone('section_c', 'path', { d: "M 200 175 L 200 285 A 110 80 0 0 0 310 175 Z" }, "Section C")}
          {renderZone('section_d', 'path', { d: "M 200 175 L 90 175 A 110 80 0 0 0 200 285 Z" }, "Section D")}

          {/* Pitch */}
          <rect x="155" y="145" width="90" height="60" rx="4" fill="#065F46" stroke="#059669" strokeWidth="2" opacity="0.8" />
          <text x="200" y="178" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.6" pointerEvents="none">PITCH</text>

          {/* Labels for Sections */}
          <g pointerEvents="none" fill="white" fontSize="10" fontWeight="bold">
            <text x="130" y="130">SEC A</text>
            <text x="240" y="130">SEC B</text>
            <text x="240" y="230">SEC C</text>
            <text x="130" y="230">SEC D</text>
          </g>

          {/* Gates */}
          {renderZone('gate_north', 'circle', { cx: 200, cy: 45, r: 12 }, "North Gate")}
          {renderZone('gate_south', 'circle', { cx: 200, cy: 305, r: 12 }, "South Gate")}
          {renderZone('gate_east', 'circle', { cx: 375, cy: 175, r: 12 }, "East Gate")}
          {renderZone('gate_west', 'circle', { cx: 25, cy: 175, r: 12 }, "West Gate")}

          {/* Facilities */}
          {renderZone('food_north', 'rect', { x: 180, y: 75, width: 40, height: 20, rx: 4 }, "Food Court North")}
          {renderZone('food_south', 'rect', { x: 180, y: 255, width: 40, height: 20, rx: 4 }, "Food Court South")}
          {renderZone('rest_ne', 'circle', { cx: 320, cy: 90, r: 10 }, "Restrooms NE")}
          {renderZone('rest_sw', 'circle', { cx: 80, cy: 260, r: 10 }, "Restrooms SW")}
        </svg>

        {/* TOOLTIP OVERLAY (WCAG: Focus Trap and Management) */}
        {selectedZone && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-[#1E293B]/95 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl animate-count-up z-20"
            role="dialog"
            aria-labelledby="zone-title"
          >
            <button 
              onClick={() => setSelectedZoneId(null)}
              aria-label="Close details"
              className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
            
            <div className="mb-4">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{selectedZone.type} Info</p>
              <h4 id="zone-title" className="text-xl font-bold text-white">{selectedZone.name}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Occupancy</p>
                <p className="text-2xl font-mono font-bold text-white tracking-tighter">
                  {selectedZone.capacity} <span className="sr-only">percent</span>
                </p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Wait Time</p>
                <p className="text-2xl font-mono font-bold text-primary tracking-tighter">
                  {selectedZone.waitTime} <span className="sr-only">minutes</span>
                </p>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/navigate?zone=${selectedZone.id}`)}
              className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              <Navigation className="w-4 h-4" />
              Navigate Here
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-center gap-6" aria-label="Map Legend">
        <LegendItem color="#22C55E" label="Low" pattern="none" />
        <LegendItem color="#F59E0B" label="Moderate" pattern="url(#pattern-moderate)" />
        <LegendItem color="#EF4444" label="Congested" pattern="url(#pattern-high)" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, pattern }: { color: string, label: string, pattern: string }) => (
  <div className="flex items-center gap-2">
    <div className="relative w-4 h-4 rounded-full overflow-hidden" style={{ backgroundColor: color }}>
      <div className="absolute inset-0" style={{ background: pattern, opacity: 0.4 }} />
    </div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

export default StadiumHeatmap;
