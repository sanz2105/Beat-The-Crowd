import React from 'react';
import { X, Trash2, Navigation, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../services/alerts';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onClear: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose, alerts, onClear }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-bg-dark border-l border-white/5 z-[301] transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-card-dark/50">
            <div>
              <h2 className="text-xl font-bold">Notifications</h2>
              <p className="text-xs text-text-secondary">{alerts.length} updates for this session</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-6 py-3 border-b border-white/5 flex justify-end">
            <button 
              onClick={onClear}
              className="text-xs font-bold text-danger hover:opacity-80 flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                <Clock className="w-12 h-12 mb-4" />
                <p>No alerts in history</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="bg-card-dark p-4 rounded-2xl border border-white/5 space-y-3 group hover:border-white/20 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      alert.type === 'critical' ? 'bg-danger/20 text-danger' : 
                      alert.type === 'warning' ? 'bg-warning/20 text-warning' : 
                      'bg-primary/20 text-primary'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-text-secondary font-mono">{alert.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                  {alert.suggestion && <p className="text-xs text-text-secondary italic">{alert.suggestion}</p>}
                  
                  <button 
                    onClick={() => { navigate(`/navigate?zone=${alert.zoneId}`); onClose(); }}
                    className="w-full py-2 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Navigation className="w-3 h-3" />
                    Navigate
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsDrawer;
