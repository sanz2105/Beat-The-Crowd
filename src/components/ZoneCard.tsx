import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatWaitTime, getCrowdStatus } from '../utils/statusUtils';

interface ZoneCardProps {
  id: string;
  name: string;
  type: string;
  capacity: number;
  waitTime: number;
  onNavigate: (id: string) => void;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ id, name, type, capacity, waitTime, onNavigate }) => {
  const status = getCrowdStatus(capacity);
  
  const statusColors = {
    low: 'bg-success/20 text-success',
    moderate: 'bg-warning/20 text-amber-300', // WCAG: higher contrast
    high: 'bg-danger/20 text-danger'
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'food': return '🍔';
      case 'gate': return '🚪';
      case 'restroom': return '🚻';
      default: return '🏟️';
    }
  };

  return (
    <article 
      className="bg-card-dark p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all"
      aria-labelledby={`zone-name-${id}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg shadow-inner" aria-hidden="true">
          {getIcon(type)}
        </div>
        <div>
          <h4 id={`zone-name-${id}`} className="font-bold text-sm text-white">{name}</h4>
          <div className="flex items-center gap-2">
            <span 
              data-testid="crowd-status-badge"
              className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${statusColors[status]}`}
            >
              {status}
              <span className="sr-only"> crowd level</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p data-testid="wait-time" className="font-mono font-bold text-text-primary">
            {formatWaitTime(waitTime)}
          </p>
          <p className="text-[9px] text-text-secondary uppercase font-bold tracking-tighter">Est. Wait</p>
          <span className="sr-only">Wait time approximately {formatWaitTime(waitTime)}</span>
        </div>
        <button 
          onClick={() => onNavigate(id)}
          aria-label={`Navigate to ${name}`}
          className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary hover:text-white transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};

export default ZoneCard;
