import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface Versiculo {
  id: string;
  texto: string;
  referencia: string;
  data: string;
  categoria: string;
}

export default function VersiculosPage() {
  const [novo, setNovo] = useState({
    texto: '',
    referencia: '',
    data: new Date().toISOString().split('T')[0],
    categoria: 'inspiracao',
  });

  const { data: versiculos = [], isLoading, refetch } = useQuery({
    queryKey: ['versiculos'],
    queryFn: async () => {
      // TODO: Chamar endpoint real
      return [];
    },
  });

  const { mutate: criar, isPending } = useMutation({
    mutationFn: async (data: typeof novo) => {
      // TODO: Chamar endpoint real
      return data;
    },
    onSuccess: () => {
      setNovo({
        texto: '',
        referencia: '',
        data: new Date().toISOString().split('T')[0],
        categoria: 'inspiracao',
      });
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novo.texto && novo.referencia) {
      criar(novo);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Versículos do Dia</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Novo Versículo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Texto do Versículo</label>
            <textarea
              value={novo.texto}
              onChange={(e) => setNovo({ ...novo, texto: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-900"
              rows={3}
              placeholder="Digite o texto do versículo..."
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Referência</label>
              <input
                type="text"
                value={novo.referencia}
                onChange={(e) => setNovo({ ...novo, referencia: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-900"
                placeholder="Ex: João 3:16"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Data</label>
              <input
                type="date"
                value={novo.data}
                onChange={(e) => setNovo({ ...novo, data: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-900"
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Categoria</label>
            <select
              value={novo.categoria}
              onChange={(e) => setNovo({ ...novo, categoria: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-900"
              disabled={isPending}
            >
              <option value="inspiracao">Inspiração</option>
              <option value="conforto">Conforto</option>
              <option value="sabedoria">Sabedoria</option>
              <option value="promessa">Promessa</option>
              <option value="encorajamento">Encorajamento</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-red-900 text-white font-bold py-2 rounded hover:bg-red-800 transition-all disabled:opacity-50"
          >
            {isPending ? 'Salvando...' : 'Adicionar Versículo'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Referência</th>
              <th className="px-6 py-3 text-left">Categoria</th>
              <th className="px-6 py-3 text-left">Data</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-3 text-center">Carregando...</td>
              </tr>
            ) : versiculos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-3 text-center text-gray-500">Nenhum versículo adicionado</td>
              </tr>
            ) : (
              versiculos.map((v: Versiculo) => (
                <tr key={v.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{v.referencia}</td>
                  <td className="px-6 py-3">{v.categoria}</td>
                  <td className="px-6 py-3">{new Date(v.data).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-3">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                    <button className="text-red-600 hover:text-red-800">Deletar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
