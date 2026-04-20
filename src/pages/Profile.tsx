import React, { useState, useEffect } from 'react';
import { Settings, CreditCard, Ticket, LogOut, Shield, ChevronRight, Volume2, Accessibility, Zap, Fingerprint, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  // LocalState for preferences (initialized from localStorage)
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('btc_prefs');
    return saved ? JSON.parse(saved) : {
      foodType: 'Non-Veg',
      budgetRange: 2,
      accessibilityMode: false,
      voiceNav: false,
      autoSuggest: true,
      hapticFeedback: true,
      seatNumber: 'B12',
      entryGate: 'Gate A',
      team: 'Home Fan'
    };
  });

  useEffect(() => {
    localStorage.setItem('btc_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const togglePref = (key: string) => {
    setPrefs((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-24 px-2">
      {/* HEADER SECTION */}
      <header className="flex flex-col items-center text-center py-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-primary to-blue-400 rounded-full flex items-center justify-center border-4 border-card-dark shadow-2xl">
            <span className="text-3xl font-black text-white">FN</span>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border-4 border-card-dark text-white">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight">Stadium Fan</h1>
        <div className="flex gap-2 mt-2">
          <span className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">
            Champions League Final
          </span>
          <span className="bg-card-dark border border-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            Seat {prefs.seatNumber}
          </span>
        </div>
      </header>

      {/* QUICK STATS */}
      <div className="grid grid-cols-3 gap-2">
        <StatItem value="3" label="Alerts Avoided" />
        <StatItem value="12m" label="Time Saved" />
        <StatItem value="2" label="Optimized" />
      </div>

      {/* PREFERENCES SECTION */}
      <section className="bg-card-dark rounded-3xl p-6 border border-white/5 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> My Preferences
        </h2>

        <div className="space-y-6">
          {/* Food Type */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">🥦 Food Preference</p>
            <div className="flex p-1 bg-bg-dark rounded-xl border border-white/5">
              {['Veg', 'Non-Veg', 'Vegan'].map(type => (
                <button 
                  key={type}
                  onClick={() => setPrefs({...prefs, foodType: type})}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    prefs.foodType === type ? 'bg-primary text-white shadow-lg' : 'text-text-secondary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">💰 Budget Range</p>
              <span className="text-[10px] font-mono text-primary font-bold">
                {'$'.repeat(prefs.budgetRange)}
              </span>
            </div>
            <input 
              type="range" min="1" max="4" step="1"
              value={prefs.budgetRange}
              onChange={(e) => setPrefs({...prefs, budgetRange: parseInt(e.target.value)})}
              className="w-full h-2 bg-bg-dark rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[8px] font-bold text-text-secondary uppercase">
              <span>Budget</span>
              <span>Premium</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <ToggleItem 
              icon={Accessibility} 
              label="Accessibility Mode" 
              active={prefs.accessibilityMode} 
              onClick={() => togglePref('accessibilityMode')} 
            />
            <ToggleItem 
              icon={Volume2} 
              label="Voice Navigation" 
              active={prefs.voiceNav} 
              onClick={() => togglePref('voiceNav')} 
            />
            <ToggleItem 
              icon={Zap} 
              label="Auto-suggest Routes" 
              active={prefs.autoSuggest} 
              onClick={() => togglePref('autoSuggest')} 
            />
            <ToggleItem 
              icon={Fingerprint} 
              label="Haptic Feedback" 
              active={prefs.hapticFeedback} 
              onClick={() => togglePref('hapticFeedback')} 
            />
          </div>
        </div>
      </section>

      {/* MY EXPERIENCE SECTION */}
      <section className="bg-card-dark rounded-3xl p-6 border border-white/5 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Ticket className="w-5 h-5 text-success" /> My Matchday
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-text-secondary uppercase">Seat Number</p>
            <input 
              type="text" 
              value={prefs.seatNumber}
              onChange={(e) => setPrefs({...prefs, seatNumber: e.target.value})}
              className="w-full bg-bg-dark border border-white/5 rounded-xl px-4 py-2 text-sm font-bold focus:border-primary focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-text-secondary uppercase">Entry Gate</p>
            <select 
              value={prefs.entryGate}
              onChange={(e) => setPrefs({...prefs, entryGate: e.target.value})}
              className="w-full bg-bg-dark border border-white/5 rounded-xl px-4 py-2 text-sm font-bold focus:border-primary focus:outline-none appearance-none"
            >
              {['Gate A', 'Gate B', 'Gate C', 'Gate D'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-bg-dark rounded-2xl border border-white/5">
           <span className="text-xs font-bold text-text-secondary uppercase">Team Support</span>
           <button 
             onClick={() => setPrefs({...prefs, team: prefs.team === 'Home Fan' ? 'Away Fan' : 'Home Fan'})}
             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
               prefs.team === 'Home Fan' ? 'bg-primary text-white' : 'bg-danger text-white'
             }`}
           >
             {prefs.team}
           </button>
        </div>
      </section>

      {/* SETTINGS LIST */}
      <div className="space-y-2">
        <SettingsLink icon={Shield} label="Staff Ops Center" onClick={() => navigate('/admin')} color="text-warning" />
        <SettingsLink icon={Ticket} label="Notification Settings" />
        <SettingsLink icon={Heart} label="Accessibility Options" />
        <SettingsLink icon={CreditCard} label="Privacy & Data" />
        <div className="py-4 text-center">
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">BeatTheCrowd Version 1.0.0</p>
          <button className="mt-4 text-danger font-bold text-sm flex items-center gap-2 mx-auto">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ value, label }: any) => (
  <div className="bg-card-dark p-3 rounded-2xl border border-white/5 text-center">
    <p className="text-lg font-mono font-black text-white">{value}</p>
    <p className="text-[8px] text-text-secondary font-bold uppercase tracking-tighter">{label}</p>
  </div>
);

const ToggleItem = ({ icon: Icon, label, active, onClick }: any) => (
  <div className="flex justify-between items-center group cursor-pointer" onClick={onClick}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-bg-dark border border-white/5 ${active ? 'text-primary' : 'text-text-secondary'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{label}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${active ? 'bg-primary' : 'bg-white/10'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

const SettingsLink = ({ icon: Icon, label, onClick, color = "text-text-secondary" }: any) => (
  <button 
    onClick={onClick}
    className="w-full bg-card-dark p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all group"
  >
    <div className="flex items-center gap-4">
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="text-sm font-bold">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
  </button>
);

export default Profile;
