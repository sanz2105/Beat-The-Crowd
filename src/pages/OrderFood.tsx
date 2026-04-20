import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, Plus, Minus, ChevronLeft, CreditCard, Loader2, CheckCircle, Navigation } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'm1', name: 'Classic Burger', price: 8.50, diet: 'Non-Veg' },
  { id: 'm2', name: 'Cheese Burger', price: 9.50, diet: 'Non-Veg' },
  { id: 'm3', name: 'Crispy Fries', price: 4.00, diet: 'Veg' },
  { id: 'm4', name: 'Iced Cola', price: 3.00, diet: 'Veg' },
  { id: 'm5', name: 'Veggie Wrap', price: 7.50, diet: 'Vegan' },
  { id: 'm6', name: 'Hot Dog', price: 6.00, diet: 'Non-Veg' },
];

const OrderFood: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stallName = searchParams.get('stall') || 'Burger Zone';
  const waitTime = searchParams.get('wait') || '8';

  const [cart, setCart] = useState<Record<string, number>>({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const updateQty = (id: string, delta: number) => {
    setCart(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handlePlaceOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderConfirmed(true);
    }, 2000);
  };

  if (orderConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center border-4 border-success animate-bounce">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
        
        <div className="space-y-2">
          <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">Order Confirmed</p>
          <h2 className="text-4xl font-black text-white tracking-tighter">#BTC-2847</h2>
          <p className="text-lg text-text-primary">Your order is being prepared 🍔</p>
        </div>

        <div className="w-full bg-card-dark p-6 rounded-3xl border border-white/5 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-4">
            <span className="text-text-secondary uppercase">Pickup Location</span>
            <span className="text-white">Counter 3, {stallName}</span>
          </div>
          
          <div className="flex justify-between items-center py-4">
             <div className="text-left">
                <p className="text-xs text-text-secondary uppercase font-bold">Status</p>
                <p className="text-lg font-bold text-primary">Preparing...</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-text-secondary uppercase font-bold">Ready In</p>
                <p className="text-2xl font-mono font-black text-white tracking-tighter">~05:42</p>
             </div>
          </div>

          <div className="flex gap-2">
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="h-1 flex-1 bg-primary/20 rounded-full"></div>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={() => navigate('/navigate')}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
          >
            <Navigation className="w-5 h-5" />
            Navigate to Pickup
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-white/5 text-text-secondary rounded-2xl font-bold text-xs uppercase"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      {/* HEADER */}
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tighter">Order Ahead</h1>
          <p className="text-xs text-text-secondary font-bold uppercase tracking-widest flex items-center gap-2">
            {stallName} • <span className="text-success">{waitTime}m wait</span>
          </p>
        </div>
      </header>

      {/* MENU ITEMS */}
      <div className="grid gap-4">
        {MENU_ITEMS.map((item) => (
          <div key={item.id} className="bg-card-dark p-4 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-white/10 transition-all">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                 {item.name.includes('Burger') ? '🍔' : item.name.includes('Fries') ? '🍟' : item.name.includes('Cola') ? '🥤' : '🌭'}
              </div>
              <div>
                <h3 className="font-bold text-white">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary font-mono font-bold">${item.price.toFixed(2)}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                    item.diet === 'Veg' ? 'bg-success/20 text-success' : 
                    item.diet === 'Vegan' ? 'bg-primary/20 text-primary' : 
                    'bg-danger/20 text-danger'
                  }`}>
                    {item.diet}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-bg-dark rounded-2xl p-1 border border-white/5">
              <button 
                onClick={() => updateQty(item.id, -1)}
                className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-mono font-bold text-sm">{cart[item.id] || 0}</span>
              <button 
                onClick={() => updateQty(item.id, 1)}
                className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/80 active:scale-90 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ORDER SUMMARY (Sticky Bottom) */}
      {totalItems > 0 && (
        <div className="fixed bottom-24 left-4 right-4 bg-[#1E293B] border border-white/10 rounded-[32px] p-6 shadow-2xl shadow-primary/20 animate-in slide-in-from-bottom-10 duration-500 z-50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary px-3 py-1 rounded-full text-[10px] font-black text-white">
                {totalItems} ITEMS
              </div>
              <div className="flex items-center gap-1 text-xs text-text-secondary font-bold">
                 <Clock className="w-3 h-3" /> Ready in ~12 min
              </div>
            </div>
            <p className="text-2xl font-mono font-black text-white">${totalPrice.toFixed(2)}</p>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={isOrdering}
            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {isOrdering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                PLACING ORDER...
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                PLACE ORDER NOW
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderFood;
