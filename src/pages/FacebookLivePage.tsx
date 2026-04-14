import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const FACEBOOK_PAGE_ID = '1AxmZ58yqo';

export default function FacebookLivePage() {
  const navigate = useNavigate();
  const [liveStream, setLiveStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchLiveStream();
    const interval = setInterval(fetchLiveStream, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchLiveStream = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/facebook/live-stream`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data) {
        setLiveStream(response.data);
        setIsLive(response.data.status === 'live');
      }
    } catch (error) {
      console.error('Erro ao buscar transmissão ao vivo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando transmissão ao vivo...</p>
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
            <h1 className="text-3xl font-bold text-red-900">Transmissão ao Vivo</h1>
            <p className="text-gray-600">
              {isLive ? (
                <span className="text-green-600 font-bold">🔴 AO VIVO AGORA</span>
              ) : (
                <span className="text-gray-600">Nenhuma transmissão no momento</span>
              )}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
          >
            Voltar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLive && liveStream ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Video Player */}
            <div className="relative bg-black w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/${liveStream.id}&show_text=false&width=500`}
                width="500"
                height="281"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>

            {/* Stream Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {liveStream.title}
              </h2>
              <p className="text-gray-600 mb-4">{liveStream.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-gray-600 text-sm">Visualizações</p>
                  <p className="text-2xl font-bold text-red-900">
                    {liveStream.views || 0}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-gray-600 text-sm">Comentários</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {liveStream.comments || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-gray-600 text-sm">Compartilhamentos</p>
                  <p className="text-2xl font-bold text-green-900">
                    {liveStream.shares || 0}
                  </p>
                </div>
              </div>

              <a
                href={`https://www.facebook.com/${liveStream.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all"
              >
                Assistir no Facebook
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhuma transmissão ao vivo no momento
            </h2>
            <p className="text-gray-600 mb-6">
              Fique atento! Quando houver uma transmissão ao vivo no Facebook da Igreja,
              ela aparecerá aqui automaticamente.
            </p>
            <button
              onClick={fetchLiveStream}
              className="bg-red-900 text-white px-6 py-2 rounded hover:bg-red-800 transition-all"
            >
              Atualizar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
