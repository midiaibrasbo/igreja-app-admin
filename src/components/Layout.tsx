import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Versículos', path: '/versiculos', icon: '📖' },
    { label: 'Cultos', path: '/cultos', icon: '⛪' },
    { label: 'Mensagens', path: '/mensagens', icon: '💬' },
    { label: 'Áreas', path: '/areas', icon: '👥' },
    { label: 'Testemunhos', path: '/testemunhos', icon: '✝️' },
    { label: 'Pedidos de Oração', path: '/pedidos-oracao', icon: '🙏' },
    { label: 'Galeria', path: '/galeria', icon: '🖼️' },
    { label: 'Notificações', path: '/notificacoes', icon: '🔔' },
    { label: 'Equipe', path: '/equipe', icon: '👨‍💼' },
    { label: 'Configurações', path: '/configuracoes', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-red-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-red-800">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-center'}`}>
            {sidebarOpen ? '🔥 IBRA Admin' : '🔥'}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded mb-2 transition-all ${
                location.pathname === item.path
                  ? 'bg-red-700'
                  : 'hover:bg-red-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-red-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition-all"
          >
            {sidebarOpen ? 'Sair' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl"
          >
            ☰
          </button>
          <h2 className="text-2xl font-bold text-red-900">
            Igreja Batista da Redenção - SBO
          </h2>
          <div className="text-sm text-gray-600">
            Admin Panel
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
