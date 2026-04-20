import React from 'react';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Zone } from '../services/venueData';

interface SmartGateAllocationProps {
  gates: (Zone & { id: string })[];
}

const SmartGateAllocation: React.FC<SmartGateAllocationProps> = ({ gates }) => {
  const navigate = useNavigate();

  const recommendedGate = [...gates]
    .filter(g => g.isOpen)
    .sort((a, b) => a.waitTime - b.waitTime)[0];

  if (!recommendedGate) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center justify-between group hover:bg-primary/20 transition-all cursor-pointer" onClick={() => navigate(`/navigate?zone=${recommendedGate.id}`)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Recommended Entry</p>
          <h4 className="text-white font-bold">{recommendedGate.name} <span className="text-primary ml-1">— {recommendedGate.waitTime}m wait</span></h4>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
    </div>
  );
};

export default SmartGateAllocation;
