import React, { useMemo } from 'react';
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Zone } from '../services/venueData';

interface SmartGateAllocationProps {
  gates: (Zone & { id: string })[];
}

const SmartGateAllocation: React.FC<SmartGateAllocationProps> = ({ gates }) => {
  const navigate = useNavigate();

  const recommendation = useMemo(() => {
    const openGates = [...gates]
      .filter(g => g.isOpen)
      .sort((a, b) => a.capacity - b.capacity);

    if (openGates.length === 0) return null;

    const top = openGates[0];
    const second = openGates[1];

    // Feature 2 Logic: If top 2 are within 10% of each other, show both
    if (second && (second.capacity - top.capacity) <= 10) {
      return {
        type: 'dual',
        names: `${top.name} or ${second.name}`,
        subtitle: 'both clear',
        waitTime: Math.min(top.waitTime, second.waitTime),
        diff: 0, // Not applicable for dual
        id: top.id // Navigate to the first one by default
      };
    }

    // Single recommendation
    const othersAvg = (openGates.slice(1).reduce((acc, g) => acc + g.capacity, 0) / (openGates.length - 1)) || top.capacity;
    const diffPercent = Math.round(othersAvg - top.capacity);

    return {
      type: 'single',
      names: top.name,
      subtitle: `${diffPercent}% less crowded than others`,
      waitTime: top.waitTime,
      diff: diffPercent,
      id: top.id
    };
  }, [gates]);

  if (!recommendation) return null;

  return (
    <div 
      onClick={() => navigate(`/navigate?zone=${recommendation.id}`)}
      className="relative group cursor-pointer"
      role="link"
      aria-label={`Smart entry recommendation: ${recommendation.names}. ${recommendation.subtitle}.`}
    >
      {/* WCAG: Subtle green glow animation on recommendation */}
      <div className="absolute -inset-1 bg-success/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative bg-card-dark border border-white/5 p-5 rounded-3xl flex items-center justify-between shadow-xl card-hover overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Star className="w-12 h-12 text-primary fill-primary" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-success/20 rounded-2xl flex items-center justify-center text-success shadow-inner relative">
             <div className="absolute inset-0 bg-success rounded-2xl animate-pulse opacity-10" />
             <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">🎯 RECOMMENDED ENTRY</p>
              {recommendation.diff > 20 && (
                <span className="bg-success text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold animate-bounce-stagger">BEST VALUE</span>
              )}
            </div>
            <h4 className="text-xl font-black text-white tracking-tighter">
              {recommendation.names}
            </h4>
            <p className="text-xs font-bold text-text-secondary mt-0.5">
              Est. wait: <span className="text-primary">{recommendation.waitTime} min</span> — {recommendation.subtitle}
            </p>
          </div>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default SmartGateAllocation;
