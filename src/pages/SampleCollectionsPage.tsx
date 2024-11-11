import React from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import SampleCollectionForm from '../components/samples/SampleCollectionForm';
import SampleCollectionList from '../components/samples/SampleCollectionList';
import SampleCollectionDetails from '../components/samples/SampleCollectionDetails';

export default function SampleCollectionsPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [selectedSample, setSelectedSample] = React.useState<any>(null);
  const [clients, setClients] = React.useState<Array<{ id: string; name: string }>>([]);
  const [filters, setFilters] = React.useState({
    startDate: '',
    endDate: '',
    clientId: '',
    mealName: ''
  });
  const [refresh, setRefresh] = React.useState(0);
  const session = useAuthStore((state) => state.session);

  React.useEffect(() => {
    fetchClients();
  }, [session?.user?.id]);

  const fetchClients = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('user_id', session.user.id)
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center text-white bg-green-600 py-4 rounded-lg mb-8">
        Coleta de Amostras
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <select
              value={filters.clientId}
              onChange={(e) => setFilters(prev => ({ ...prev, clientId: e.target.value }))}
              className="w-full rounded-lg border-gray-300"
            >
              <option value="">Todos os clientes</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refeição
            </label>
            <input
              type="text"
              value={filters.mealName}
              onChange={(e) => setFilters(prev => ({ ...prev, mealName: e.target.value }))}
              placeholder="Buscar por refeição..."
              className="w-full rounded-lg border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nova Coleta
        </button>
      </div>

      {/* Sample List */}
      <SampleCollectionList
        filters={filters}
        onViewDetails={setSelectedSample}
        refresh={refresh}
      />

      {/* Modals */}
      {showForm && (
        <SampleCollectionForm
          clients={clients}
          onClose={() => setShowForm(false)}
          onSubmit={() => {
            setShowForm(false);
            setRefresh(prev => prev + 1);
          }}
        />
      )}

      {selectedSample && (
        <SampleCollectionDetails
          sample={selectedSample}
          onClose={() => setSelectedSample(null)}
        />
      )}
    </div>
  );
}