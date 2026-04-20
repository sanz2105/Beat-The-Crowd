import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Clock, Utensils, ArrowLeft, Check, Plus, Minus, Sparkles, Navigation } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'drink' | 'snack';
  tags: string[];
}

const MENU_DATA: MenuItem[] = [
  { id: '1', name: 'Champions Burger', price: 12.50, category: 'food', tags: ['Popular', 'Non-Veg'] },
  { id: '2', name: 'Stadium Pizza Slice', price: 6.50, category: 'food', tags: ['Veg'] },
  { id: '3', name: 'Giant Pretzel', price: 8.00, category: 'snack', tags: ['Vegan'] },
  { id: '4', name: 'Cold Brew Beer', price: 9.00, category: 'drink', tags: ['Popular'] },
  { id: '5', name: 'Mineral Water', price: 3.50, category: 'drink', tags: ['Essentials'] },
  { id: '6', name: 'Nachos Supreme', price: 10.50, category: 'snack', tags: ['Cheesy'] },
];

const OrderFood: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stallName = searchParams.get('stall') || 'Food Stall';
  const waitTime = searchParams.get('wait') || '15';

  const [cart, setCart] = useState<Record<string, number>>({});
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'preparing' | 'ready'>('preparing');

  // Simulation: Order becomes ready after 5 seconds
  useEffect(() => {
    if (isOrdered) {
      const timer = setTimeout(() => setOrderStatus('ready'), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOrdered]);

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const newVal = (prev[id] || 0) + delta;
      if (newVal <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: newVal };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = MENU_DATA.find(m => m.id === id);
    return acc + (item?.price || 0) * qty;
  }, 0);

  if (isOrdered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 space-y-8 animate-count-up">
        <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center relative">
          {orderStatus === 'preparing' ? (
            <Clock className="w-12 h-12 text-success animate-pulse" />
          ) : (
            <Check className="w-12 h-12 text-success" />
          )}
          <div className="absolute inset-0 rounded-full border-4 border-success/30 border-t-success animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Order {orderStatus === 'ready' ? 'Ready!' : 'Received'}</h2>
          <p className="text-text-secondary mt-2">Order #BTC-2847 • {stallName}</p>
        </div>

        <div className="w-full max-w-sm bg-card-dark rounded-3xl border border-white/5 p-6 space-y-6">
           <div className="flex justify-between items-center text-left">
              <div>
                 <p className="text-[10px] uppercase font-bold text-text-secondary">Current Status</p>
                 <p className="text-lg font-bold text-white capitalize">{orderStatus}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] uppercase font-bold text-text-secondary">Pickup in</p>
                 <p className="text-lg font-mono font-bold text-primary">{orderStatus === 'ready' ? 'Now' : '04:59'}</p>
              </div>
           </div>

           <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full bg-success transition-all duration-[5000ms] ease-linear ${orderStatus === 'ready' ? 'w-full' : 'w-1/3'}`} />
           </div>

           {orderStatus === 'ready' ? (
              <button 
                onClick={() => navigate('/navigate?filter=food')}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
              >
                <Navigation className="w-5 h-5" />
                Navigate to Pickup
              </button>
           ) : (
              <p className="text-xs text-text-secondary">You'll receive a notification when your order is ready for pickup at the counter.</p>
           )}
        </div>

        <button onClick={() => navigate('/')} className="text-sm font-bold text-text-secondary hover:text-white transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-count-up">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-3 bg-card-dark rounded-2xl border border-white/5 text-text-secondary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">{stallName}</h1>
          <p className="text-xs text-text-secondary">⏱️ {waitTime} min wait time</p>
        </div>
        <div className="w-12" />
      </header>

      {/* MENU CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MENU_DATA.map(item => (
          <div key={item.id} className="bg-card-dark p-4 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all card-hover">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <div className="flex gap-2 mt-1">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-white/5 rounded-md text-text-secondary border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-primary font-mono font-bold mt-1 text-xs">${item.price.toFixed(2)}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-3 bg-bg-dark rounded-xl p-1 border border-white/5">
               <button 
                 onClick={() => updateCart(item.id, -1)}
                 className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-text-secondary"
               >
                 <Minus className="w-3 h-3" />
               </button>
               <span className="text-sm font-bold w-4 text-center">{cart[item.id] || 0}</span>
               <button 
                 onClick={() => updateCart(item.id, 1)}
                 className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
               >
                 <Plus className="w-3 h-3" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER CART PANEL */}
      {totalItems > 0 && (
        <div className="fixed bottom-24 left-4 right-4 bg-card-dark p-6 rounded-3xl border border-primary/30 shadow-2xl shadow-primary/20 animate-count-up z-[60]">
          <div className="flex justify-between items-center mb-4">
             <div>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">Your Order</p>
                <p className="text-lg font-bold">{totalItems} Items • ${totalPrice.toFixed(2)}</p>
             </div>
             <ShoppingCart className="text-primary w-6 h-6" />
          </div>
          <button 
            onClick={() => setIsOrdered(true)}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-5 h-5" />
            PLACE PRE-ORDER
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderFood;
