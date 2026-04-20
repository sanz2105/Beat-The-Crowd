import React from 'react';
import { DoorOpen, Star, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Zone } from '../services/venueData';

interface SmartGateAllocationProps {
  gates: (Zone & { id: string })[];
}

const SmartGateAllocation: React.FC<SmartGateAllocationProps> = ({ gates }) => {
  const navigate = useNavigate();
  const bestGate = [...gates].sort((a, b) => a.waitTime - b.waitTime)[0];

  if (!bestGate) return null;

  return (
    <div className="bg-card-dark rounded-3xl p-6 border border-white/5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-xl">
          <DoorOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-white tracking-tight">Smart Entry Recommendation</h3>
          <p className="text-xs text-text-secondary">Based on current crowd flow</p>
        </div>
      </div>

      <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 relative group">
        <div className="absolute top-0 right-0 p-3">
          <Star className="w-5 h-5 text-primary fill-primary animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase text-primary mb-1">Recommended Entry</p>
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-2xl font-black text-white">{bestGate.name}</h4>
            <p className="text-xs text-success font-bold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> {bestGate.waitTime}m wait • Shortest Line
            </p>
          </div>
          <button 
            onClick={() => navigate(`/navigate?zone=${bestGate.id}`)}
            className="bg-primary px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            Go Now <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {gates.filter(g => g.id !== bestGate.id).map((gate) => (
          <div key={gate.id} className="p-3 bg-bg-dark rounded-xl border border-white/5 flex justify-between items-center opacity-60">
            <div>
              <p className="text-[10px] font-bold text-white uppercase">{gate.name}</p>
              <p className={`text-[10px] font-bold ${
                gate.crowdLevel === 'high' ? 'text-danger' : 
                gate.crowdLevel === 'medium' ? 'text-warning' : 'text-success'
              }`}>{gate.waitTime}m wait</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
               gate.crowdLevel === 'high' ? 'bg-danger' : 
               gate.crowdLevel === 'medium' ? 'bg-warning' : 'bg-success'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartGateAllocation;
