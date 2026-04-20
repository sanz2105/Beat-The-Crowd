import React, { useState, useEffect } from 'react';
import { X, AlertCircle, AlertTriangle, Info, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../services/alerts';

interface AlertBannerProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismiss }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through alerts if multiple
  useEffect(() => {
    if (alerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  if (alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex] || alerts[0];

  const bgColor = {
    critical: 'bg-[#EF4444]',
    warning: 'bg-[#F59E0B]',
    info: 'bg-[#2563EB]'
  };

  return (
    <div className={`fixed top-4 left-4 right-4 z-[200] ${bgColor[currentAlert.type]} text-white p-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-full duration-500 flex items-center justify-between gap-4 group`}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="shrink-0 p-2 bg-white/20 rounded-xl">
          {currentAlert.type === 'critical' ? <AlertCircle className="w-5 h-5" /> : 
           currentAlert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
           <Info className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{currentAlert.message}</p>
          {currentAlert.suggestion && <p className="text-[10px] opacity-90 truncate">{currentAlert.suggestion}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={() => navigate(`/navigate?zone=${currentAlert.zoneId}`)}
          className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          title="Navigate"
        >
          <Navigation className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDismiss(currentAlert.id)}
          className="p-2 hover:bg-white/20 rounded-xl transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-full transition-all duration-[6000ms] w-0 group-hover:w-full"></div>
    </div>
  );
};

export default AlertBanner;
