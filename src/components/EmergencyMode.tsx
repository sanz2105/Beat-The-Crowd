import React from 'react';
import { ShieldAlert, Navigation, ShieldCheck, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Zone } from '../services/venueData';

interface EmergencyModeProps {
  congestedZone: Zone & { id: string };
  safestExits: (Zone & { id: string })[];
  onDismiss: () => void;
}

const EmergencyMode: React.FC<EmergencyModeProps> = ({ congestedZone, safestExits, onDismiss }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="fixed inset-0 z-[300] bg-danger flex flex-col items-center justify-center p-6 text-white"
      role="alert"
      aria-live="assertive"
    >
      {/* WCAG: Full-screen overlay with pulsing border */}
      <div className="absolute inset-0 border-[12px] border-white/20 animate-pulse pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 py-10 z-10 animate-count-up">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-bounce-stagger">
            <ShieldAlert className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter leading-none">⚠️ OVERCROWDING DETECTED</h1>
            <p className="text-lg font-bold opacity-90 uppercase mt-2">{congestedZone.name}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-success" />
               Safest Exit Routes
            </h3>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Extreme density detected. For your safety, proceed to these recommended gates:
            </p>
          </div>

          <div className="space-y-3">
            {safestExits.map((alt) => (
              <button 
                key={alt.id}
                onClick={() => navigate(`/navigate?zone=${alt.id}`)}
                className="w-full bg-white text-danger p-4 rounded-3xl flex items-center justify-between group hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="text-left">
                  <p className="text-sm font-black">{alt.name}</p>
                  <p className="text-[10px] font-bold opacity-60">Estimated walk: {Math.round(alt.capacity / 10) + 2} min</p>
                </div>
                <div className="w-10 h-10 bg-danger/10 rounded-2xl flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-danger" />
                </div>
              </button>
            ))}
          </div>

          <button 
            onClick={onDismiss}
            className="w-full py-4 border-2 border-white/30 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Heart className="w-4 h-4 fill-white" />
            I'm Safe (Acknowledged)
          </button>
        </div>

        <div className="text-center space-y-2 opacity-60">
           <p className="text-xs font-bold px-6">
             Please remain calm and follow instructions from stadium stewards.
           </p>
           <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.2em]">
             <span>Security Protocol 85-A Active</span>
             <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMode;
