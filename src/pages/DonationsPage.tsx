import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Donation {
  id: number;
  memberId?: number;
  amount: string;
  donationType?: string;
  description?: string;
  donationDate: string;
}

export default function DonationsPage() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    donationType: 'dinheiro',
    description: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDonations();
  }, [navigate]);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/donations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar doações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        recordedBy: user.id,
      };

      if (editingId) {
        await axios.put(`${API_URL}/donations/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/donations`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({
        amount: '',
        donationType: 'dinheiro',
        description: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchDonations();
    } catch (error) {
      console.error('Erro ao salvar doação:', error);
    }
  };

  const handleEdit = (donation: Donation) => {
    setFormData({
      amount: donation.amount,
      donationType: donation.donationType || 'dinheiro',
      description: donation.description || '',
    });
    setEditingId(donation.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta doação?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`${API_URL}/donations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchDonations();
      } catch (error) {
        console.error('Erro ao deletar doação:', error);
      }
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
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
            <h1 className="text-3xl font-bold text-green-900">Doações</h1>
            <p className="text-gray-600">
              Total: {donations.length} | Valor: R$ {totalDonations.toFixed(2)}
            </p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  amount: '',
                  donationType: 'dinheiro',
                  description: '',
                });
              }}
              className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800 transition-all"
            >
              {showForm ? 'Cancelar' : 'Nova Doação'}
            </button>
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
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Editar Doação' : 'Nova Doação'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.donationType}
                    onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="alimento">Alimento</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
                    rows={3}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-900 text-white px-6 py-2 rounded hover:bg-green-800 transition-all"
              >
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
            </form>
          </div>
        )}

        {/* Donations List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Valor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(donation.donationDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {donation.donationType === 'dinheiro'
                      ? 'Dinheiro'
                      : donation.donationType === 'alimento'
                      ? 'Alimento'
                      : 'Outros'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-900">
                    R$ {parseFloat(donation.amount || '0').toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{donation.description || '-'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(donation)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(donation.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {donations.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              Nenhuma doação registrada
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
