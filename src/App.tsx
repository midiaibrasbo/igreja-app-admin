import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import EventsPage from './pages/EventsPage';
import DonationsPage from './pages/DonationsPage';
import VersiculosPage from './pages/VersiculosPage';
import CultosPage from './pages/CultosPage';
import MensagensPage from './pages/MensagensPage';
import AreasPage from './pages/AreasPage';
import TestemunhosPage from './pages/TestemunhosPage';
import PedidosOracaoPage from './pages/PedidosOracaoPage';
import GaleriaPage from './pages/GaleriaPage';
import NotificacoesPage from './pages/NotificacoesPage';
import EquipePage from './pages/EquipePage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import './index.css';

const queryClient = new QueryClient();

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {isAuthenticated ? (
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/donations" element={<DonationsPage />} />
              <Route path="/versiculos" element={<VersiculosPage />} />
              <Route path="/cultos" element={<CultosPage />} />
              <Route path="/mensagens" element={<MensagensPage />} />
              <Route path="/areas" element={<AreasPage />} />
              <Route path="/testemunhos" element={<TestemunhosPage />} />
              <Route path="/pedidos-oracao" element={<PedidosOracaoPage />} />
              <Route path="/galeria" element={<GaleriaPage />} />
              <Route path="/notificacoes" element={<NotificacoesPage />} />
              <Route path="/equipe" element={<EquipePage />} />
              <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
