import React from 'react';
import { Utensils, MapPin, DoorOpen, Users } from 'lucide-react';

interface QuickActionProps {
  type: 'food' | 'restroom' | 'gate' | 'seat';
  onClick: () => void;
}

export const QuickAction: React.FC<QuickActionProps> = ({ type, onClick }) => {
  const config = {
    food: { icon: <Utensils aria-hidden="true" />, label: 'Find Food' },
    restroom: { icon: <MapPin aria-hidden="true" />, label: 'Find Restroom' },
    gate: { icon: <DoorOpen aria-hidden="true" />, label: 'Find Gate' },
    seat: { icon: <Users aria-hidden="true" />, label: 'Go to Seat' }
  };

  const { icon, label } = config[type];

  return (
    <button 
      onClick={onClick} 
      aria-label={label}
      className="bg-card-dark p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-md active:scale-95 w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="text-primary">{icon}</div>
      <span className="text-xs font-bold text-text-primary whitespace-nowrap">{label}</span>
    </button>
  );
};
