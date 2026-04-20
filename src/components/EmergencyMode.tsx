import React from 'react';
import { ShieldAlert, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Zone } from '../services/venueData';

interface EmergencyModeProps {
  congestedZone: Zone;
  alternatives: (Zone & { id: string })[];
}

const EmergencyMode: React.FC<EmergencyModeProps> = ({ congestedZone, alternatives }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[200] bg-danger flex flex-col items-center justify-center p-6 text-white overflow-y-auto pt- safe-top">
      <div className="w-full max-w-md space-y-8 py-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter leading-none">SAFETY ALERT</h1>
            <p className="text-lg font-bold opacity-90">{congestedZone.name} OVER CAPACITY</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
               <ShieldCheck className="w-5 h-5" />
               Safe Exit Routing
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              To ensure fan safety, we have redirected all traffic from {congestedZone.name}. Please proceed to the following low-density sectors immediately:
            </p>
          </div>

          <div className="space-y-3">
            {alternatives.map((alt) => (
              <button 
                key={alt.id}
                onClick={() => navigate(`/navigate?zone=${alt.id}`)}
                className="w-full bg-white text-danger p-5 rounded-3xl flex items-center justify-between group hover:scale-[1.02] transition-all"
              >
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Proceed to</p>
                  <p className="text-xl font-black">{alt.name}</p>
                </div>
                <div className="w-12 h-12 bg-danger/10 rounded-2xl flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-danger" />
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
            <span>Live Security Monitoring Active</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <p className="text-center text-xs font-bold opacity-60 px-6">
          Please remain calm and follow instructions from stadium stewards nearby.
        </p>
      </div>
    </div>
  );
};

export default EmergencyMode;
