import React from 'react';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

interface SampleCollectionListProps {
  filters: {
    startDate: string;
    endDate: string;
    clientId: string;
    mealName: string;
  };
  onViewDetails: (sample: any) => void;
  refresh: number;
}

export default function SampleCollectionList({ filters, onViewDetails, refresh }: SampleCollectionListProps) {
  const [samples, setSamples] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const session = useAuthStore((state) => state.session);

  const fetchSamples = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      let query = supabase
        .from('sample_collections')
        .select(`
          *,
          client:clients (
            name
          )
        `)
        .eq('user_id', session.user.id)
        .order('collection_date', { ascending: false });

      if (filters.startDate) {
        query = query.gte('collection_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('collection_date', filters.endDate);
      }
      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId);
      }
      if (filters.mealName) {
        query = query.ilike('meal_name', `%${filters.mealName}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSamples(data || []);
    } catch (error) {
      console.error('Error fetching samples:', error);
      toast.error('Erro ao carregar amostras');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSamples();
  }, [session?.user?.id, filters, refresh]);

  const handleDelete = async (id: string, photoUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir esta amostra?')) return;
    if (!session?.user?.id) return;

    try {
      // Extract the filename from the URL
      const filePath = `${session.user.id}/${photoUrl.split('/').pop()}`;

      // Delete the image from storage
      const { error: storageError } = await supabase.storage
        .from('sample-photos')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting photo:', storageError);
      }

      // Delete the sample record
      const { error: dbError } = await supabase
        .from('sample_collections')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (dbError) throw dbError;

      toast.success('Amostra excluída com sucesso');
      fetchSamples();
    } catch (error) {
      console.error('Error deleting sample:', error);
      toast.error('Erro ao excluir amostra');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refeição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {samples.map((sample) => (
              <tr key={sample.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(sample.collection_date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sample.client?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sample.meal_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sample.responsible}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(sample)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sample.id, sample.photo_url)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}