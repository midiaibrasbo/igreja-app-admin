export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Total de Membros</p>
          <p className="text-3xl font-bold text-red-900">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Versículos Publicados</p>
          <p className="text-3xl font-bold text-red-900">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Cultos Agendados</p>
          <p className="text-3xl font-bold text-red-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Pedidos de Oração</p>
          <p className="text-3xl font-bold text-red-900">28</p>
        </div>
      </div>
    </div>
  );
}
