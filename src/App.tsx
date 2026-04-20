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

export default function App() {
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
