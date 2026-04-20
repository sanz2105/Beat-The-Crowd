import React from 'react';
import { X, Bell, Trash2, Navigation, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import type { Alert } from '../services/alerts';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onClear: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose, alerts, onClear }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-bg-dark border-l border-white/5 z-[101] transform transition-transform duration-500 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-card-dark/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-primary" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full border-2 border-bg-dark"></span>
                )}
              </div>
              <h2 className="text-xl font-bold">Alert History</h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClear}
                className="p-2 hover:bg-white/5 rounded-xl text-text-secondary transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl text-text-secondary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest">No notifications yet</p>
                <p className="text-xs mt-2">Real-time alerts will appear here as stadium conditions change.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="bg-card-dark p-4 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                  <div className="flex gap-4">
                    <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      alert.type === 'critical' ? 'bg-danger/20 text-danger' : 
                      alert.type === 'warning' ? 'bg-warning/20 text-warning' : 
                      'bg-primary/20 text-primary'
                    }`}>
                      {alert.type === 'critical' ? <ShieldAlert className="w-5 h-5" /> : 
                       alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                       <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${
                          alert.type === 'critical' ? 'text-danger' : 
                          alert.type === 'warning' ? 'text-warning' : 
                          'text-primary'
                        }`}>
                          {alert.type} Alert
                        </span>
                        <span className="text-[10px] text-text-secondary font-mono">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm font-bold text-white leading-snug mb-2">{alert.message}</p>
                      {alert.suggestion && (
                        <p className="text-xs text-text-secondary leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5 mb-3 italic">
                          💡 {alert.suggestion}
                        </p>
                      )}
                      {alert.zoneId && (
                        <button className="w-full py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2">
                          <Navigation className="w-3 h-3" />
                          View Sector
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-card-dark/30 border-t border-white/5">
            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-[0.2em] text-center">
              Powered by BeatTheCrowd AI
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NotificationsDrawer;
