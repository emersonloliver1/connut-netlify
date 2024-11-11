import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { checklistHygiene } from '../data/checklistHygiene';
import ChecklistSection from '../components/checklist/ChecklistSection';
import PerformanceEvaluation from '../components/checklist/PerformanceEvaluation';
import { toast } from 'react-toastify';

interface FormData {
  clientId: string;
  inspectionDate: string;
  observedArea: string;
  crnNumber: string;
}

export default function HygieneChecklistPage() {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [observations, setObservations] = React.useState<Record<string, string>>({});
  const [images, setImages] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    clientId: '',
    inspectionDate: '',
    observedArea: '',
    crnNumber: ''
  });
  const [clients, setClients] = React.useState<Array<{ id: string; name: string }>>([]);

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
      toast.error('Erro ao carregar clientes');
    }
  };

  const handleValueChange = (id: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleObservationChange = (id: string, value: string) => {
    setObservations(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageChange = (id: string, imageUrl: string | null) => {
    setImages(prev => ({
      ...prev,
      [id]: imageUrl || ''
    }));
  };

  const calculatePerformance = () => {
    const validValues = Object.values(values).filter(value => value !== '' && value !== 'NA');
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, value) => acc + Number(value), 0);
    return (sum / (validValues.length * 100)) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error('Você precisa estar logado para salvar o checklist');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('checklists')
        .insert([{
          type: 'hygiene',
          client_id: formData.clientId,
          inspection_date: formData.inspectionDate,
          observed_area: formData.observedArea,
          crn_number: formData.crnNumber,
          values,
          observations,
          images,
          performance: calculatePerformance(),
          user_id: session.user.id
        }]);

      if (error) throw error;

      toast.success('Checklist salvo com sucesso!');
      navigate('/dashboard/reports');
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast.error('Erro ao salvar checklist. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center text-white bg-blue-600 py-4 rounded-lg mb-8">
        CHECKLIST HIGIÊNICO SANITÁRIO
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Checklist para verificação das Condições Higiênico-Sanitárias
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Inspeção
            </label>
            <input
              type="date"
              value={formData.inspectionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área Observada
            </label>
            <input
              type="text"
              placeholder="Ex: Cozinha, Estoque, etc."
              value={formData.observedArea}
              onChange={(e) => setFormData(prev => ({ ...prev, observedArea: e.target.value }))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CRN do Responsável Técnico
            </label>
            <input
              type="text"
              value={formData.crnNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, crnNumber: e.target.value }))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {checklistHygiene.map((section) => (
          <ChecklistSection
            key={section.titulo}
            section={section}
            values={values}
            observations={observations}
            images={images}
            onChangeValue={handleValueChange}
            onChangeObservation={handleObservationChange}
            onChangeImage={handleImageChange}
          />
        ))}

        <PerformanceEvaluation 
          values={values}
          totalItems={checklistHygiene.reduce((acc, section) => acc + section.itens.length, 0)}
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/checklists')}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Checklist'}
          </button>
        </div>
      </form>
    </div>
  );
}