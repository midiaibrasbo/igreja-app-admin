import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface BirthdayMember {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birthdayDate: string;
  messageSent?: boolean;
}

export default function BirthdayPage() {
  const navigate = useNavigate();
  const [birthdays, setBirthdays] = useState<BirthdayMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageTemplate, setMessageTemplate] = useState(
    'Feliz aniversário! 🎉 Que Deus abençoe sua vida com muita saúde, alegria e paz. Que este seja um ano repleto de bênçãos! 🙏'
  );
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBirthdays();
  }, [navigate]);

  const fetchBirthdays = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/birthdays`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBirthdays(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendBirthdayMessage = async (memberId: number) => {
    setSending(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_URL}/birthdays/send-message`,
        {
          memberId,
          message: messageTemplate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBirthdays();
      alert('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const sendAllBirthdayMessages = async () => {
    if (!confirm('Enviar mensagens para todos os aniversariantes de hoje?')) {
      return;
    }

    setSending(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_URL}/birthdays/send-all-messages`,
        {
          message: messageTemplate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBirthdays();
      alert('Mensagens enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar mensagens:', error);
      alert('Erro ao enviar mensagens');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando aniversariantes...</p>
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
            <h1 className="text-3xl font-bold text-purple-900">Aniversariantes</h1>
            <p className="text-gray-600">
              {birthdays.length} aniversariante(s) hoje
            </p>
          </div>
          <div className="space-x-4">
            {birthdays.length > 0 && (
              <button
                onClick={sendAllBirthdayMessages}
                disabled={sending}
                className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-800 transition-all disabled:opacity-50"
              >
                {sending ? 'Enviando...' : 'Enviar Mensagens'}
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
            >
              Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Message Template */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Modelo de Mensagem
          </h2>
          <textarea
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-900"
            rows={4}
          />
          <p className="text-sm text-gray-600 mt-2">
            Esta mensagem será enviada via WhatsApp para os aniversariantes
          </p>
        </div>

        {/* Birthdays List */}
        {birthdays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {birthdays.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    🎂 {member.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(member.birthdayDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {member.phone && (
                    <p>
                      <strong>WhatsApp:</strong> {member.phone}
                    </p>
                  )}
                  {member.email && (
                    <p>
                      <strong>Email:</strong> {member.email}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => sendBirthdayMessage(member.id)}
                    disabled={sending || member.messageSent}
                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
                      member.messageSent
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
                    }`}
                  >
                    {member.messageSent ? '✓ Enviada' : 'Enviar'}
                  </button>
                </div>
              </div>
            ))}
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
                d="M14 10h-2m0 0H8m4 0v2m0-2v-2m7 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhum aniversariante hoje
            </h2>
            <p className="text-gray-600">
              Fique atento! Quando houver aniversariantes, você poderá enviar
              mensagens personalizadas via WhatsApp.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
