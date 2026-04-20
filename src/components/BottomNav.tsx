import { NavLink } from 'react-router-dom';

const tabs = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Navigate', path: '/navigate', icon: '🧭' },
  { name: 'Assistant', path: '/assistant', icon: '🤖' },
  { name: 'Queues', path: '/queues', icon: '⏱️' },
  { name: 'Profile', path: '/profile', icon: '👤' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 sm:h-20 bg-[#1E293B] border-t border-white/5 flex justify-around items-center px-2 z-50 md:hidden">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all duration-300 relative group ${
              isActive ? 'text-primary' : 'text-[#94A3B8]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.name}</span>
              
              {/* Active Indicator (Dot) */}
              <div className={`absolute -bottom-1 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
                  isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              />

              {/* Active Order Indicator (Orange Dot) */}
              {tab.name === 'Queues' && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#1E293B]"></div>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
