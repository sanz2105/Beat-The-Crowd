import React from 'react';
import { ChevronLeft, ChevronRight, X, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Alert } from '../services/alerts';

interface AlertBannerProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismiss }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex];

  const next = () => setCurrentIndex((prev) => (prev + 1) % alerts.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length);

  return (
    <div className={`fixed top-4 left-4 right-4 z-[90] animate-count-up`}>
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center justify-between gap-4 transition-all duration-500 ${
        currentAlert.type === 'critical' ? 'bg-danger/10 border-danger/30 text-danger' : 
        currentAlert.type === 'warning' ? 'bg-warning/10 border-warning/30 text-warning' : 
        'bg-primary/10 border-primary/30 text-primary'
      }`}>
        <div className="flex-1 flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 animate-pulse">🚨</div>
          <div className="min-w-0">
             <p className="text-xs font-bold truncate">{currentAlert.message}</p>
             {currentAlert.suggestion && (
               <p className="text-[10px] opacity-80 italic truncate">{currentAlert.suggestion}</p>
             )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentAlert.zoneId && (
            <button 
              onClick={() => navigate(`/navigate?zone=${currentAlert.zoneId}`)}
              className="px-3 py-1.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-white/20 transition-all flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              Route
            </button>
          )}
          
          {alerts.length > 1 && (
            <div className="flex items-center bg-white/5 rounded-lg border border-white/5 px-1">
              <button onClick={prev} className="p-1 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-[9px] font-mono w-4 text-center">{currentIndex + 1}</span>
              <button onClick={next} className="p-1 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}

          <button 
            onClick={() => onDismiss(currentAlert.id)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
