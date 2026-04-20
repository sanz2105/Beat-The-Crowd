import React from 'react';
import { ShieldAlert, Navigation, ChevronRight, XOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Zone } from '../services/venueData';

interface EmergencyModeProps {
  congestedZone: Zone & { id: string };
  alternatives: (Zone & { id: string })[];
}

const EmergencyMode: React.FC<EmergencyModeProps> = ({ congestedZone, alternatives }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[500] bg-[#0F172A]/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-card-dark border-2 border-danger rounded-[40px] p-8 shadow-[0_0_100px_rgba(239,68,68,0.4)] relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Pulsing Border Effect */}
        <div className="absolute inset-0 border-4 border-danger animate-pulse opacity-20 pointer-events-none"></div>

        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="w-20 h-20 bg-danger/20 rounded-3xl flex items-center justify-center animate-bounce">
            <ShieldAlert className="w-10 h-10 text-danger" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Overcrowding Alert</h2>
            <p className="text-text-secondary mt-2 leading-relaxed">
              <span className="text-white font-bold">{congestedZone.name}</span> has reached critical capacity. Please follow stadium staff directions.
            </p>
          </div>

          <div className="w-full bg-danger/10 p-5 rounded-3xl border border-danger/30 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-danger">Nearest Safe Exits</p>
            
            {alternatives.map((alt) => (
              <div key={alt.id} className="flex justify-between items-center group">
                <div className="text-left">
                  <p className="text-sm font-bold text-white">{alt.name}</p>
                  <p className="text-[10px] text-success font-bold uppercase">{alt.waitTime}m wait • Low Crowd</p>
                </div>
                <button 
                  onClick={() => navigate(`/navigate?zone=${alt.id}`)}
                  className="p-2 bg-white/5 rounded-xl text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="w-full space-y-3">
            <button 
              onClick={() => navigate(`/navigate?zone=${alternatives[0]?.id}`)}
              className="w-full py-5 bg-primary text-white rounded-3xl font-black text-sm tracking-widest shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase"
            >
              <Navigation className="w-5 h-5" />
              Navigate to {alternatives[0]?.name}
            </button>
            <button className="w-full py-4 bg-white/5 text-text-secondary rounded-3xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <XOctagon className="w-4 h-4" />
              Show All Stadium Exits
            </button>
          </div>

          <p className="text-[10px] text-text-secondary font-bold uppercase italic">Stay calm. Follow stadium staff protocols.</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMode;
