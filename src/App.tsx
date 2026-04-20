import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Navigate from './pages/Navigate';
import Assistant from './pages/Assistant';
import Queues from './pages/Queues';
import Profile from './pages/Profile';
import OrderFood from './pages/OrderFood';
import Admin from './pages/Admin';
import ErrorBoundary from './components/ErrorBoundary';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  const isApiKeyMissing = !import.meta.env.VITE_GEMINI_API_KEY;

  if (isApiKeyMissing) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-danger/20 rounded-3xl flex items-center justify-center text-danger animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="max-w-md">
          <h1 className="text-3xl font-black text-white tracking-tighter mb-4">Security Warning</h1>
          <p className="text-text-secondary leading-relaxed">
            BeatTheCrowd requires a valid Gemini API key to operate. Please add <code className="bg-white/5 px-2 py-1 rounded text-primary">VITE_GEMINI_API_KEY</code> to your <code className="bg-white/5 px-2 py-1 rounded text-primary">.env</code> file.
          </p>
        </div>
        <div className="bg-card-dark p-6 rounded-2xl border border-white/5 text-left w-full max-w-sm">
          <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-3">Setup Guide</p>
          <ol className="text-xs text-text-primary space-y-2 list-decimal list-inside">
            <li>Open <code className="text-primary">.env.example</code></li>
            <li>Copy its content to a new <code className="text-primary">.env</code></li>
            <li>Add your API keys</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/navigate" element={<Navigate />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/queues" element={<Queues />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-food" element={<OrderFood />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
