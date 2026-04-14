import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Stats {
  totalMembers: number;
  totalEvents: number;
  totalDonations: number;
  recentEvents: any[];
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    totalEvents: 0,
    totalDonations: 0,
    recentEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [membersRes, eventsRes, donationsRes] = await Promise.all([
        axios.get(`${API_URL}/members`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/events`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/donations`, { headers }).catch(() => ({ data: [] })),
      ]);

      setStats({
        totalMembers: membersRes.data?.length || 0,
        totalEvents: eventsRes.data?.length || 0,
        totalDonations: donationsRes.data?.length || 0,
        recentEvents: (eventsRes.data || []).slice(0, 5),
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-red-900">Igreja Admin</h1>
            <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Members */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Membros</p>
                <p className="text-3xl font-bold text-red-900">{stats.totalMembers}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Eventos</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalEvents}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Donations */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Doações</p>
                <p className="text-3xl font-bold text-green-900">{stats.totalDonations}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a
            href="/members"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all cursor-pointer"
          >
            <h3 className="text-lg font-bold text-red-900 mb-2">Membros</h3>
            <p className="text-gray-600 text-sm">Gerenciar membros da igreja</p>
          </a>

          <a
            href="/events"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all cursor-pointer"
          >
            <h3 className="text-lg font-bold text-blue-900 mb-2">Eventos</h3>
            <p className="text-gray-600 text-sm">Gerenciar eventos e cultos</p>
          </a>

          <a
            href="/donations"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all cursor-pointer"
          >
            <h3 className="text-lg font-bold text-green-900 mb-2">Doações</h3>
            <p className="text-gray-600 text-sm">Registrar e acompanhar doações</p>
          </a>
        </div>

        {/* Recent Events */}
        {stats.recentEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Próximos Eventos</h2>
            <div className="space-y-4">
              {stats.recentEvents.map((event: any) => (
                <div key={event.id} className="border-l-4 border-blue-900 pl-4 py-2">
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.eventDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
