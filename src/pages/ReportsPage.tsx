import React from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generatePDF } from '../utils/generatePDF';
import PrintableReport from '../components/checklist/PrintableReport';
import { checklistRDC216 } from '../data/checklistRDC216';
import { checklistHygiene } from '../data/checklistHygiene';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

interface Report {
  id: string;
  created_at: string;
  client: {
    id: string;
    name: string;
  };
  type: 'rdc216' | 'hygiene';
  inspection_date: string;
  observed_area: string;
  crn_number: string;
  values: Record<string, string>;
  observations: Record<string, string>;
  images: Record<string, string>;
  performance: number;
}

export default function ReportsPage() {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [checklistType, setChecklistType] = React.useState('all');
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);
  const reportRef = React.useRef<HTMLDivElement>(null);
  const session = useAuthStore((state) => state.session);

  const fetchReports = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('checklists')
        .select(`
          *,
          client:clients (
            id,
            name
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('inspection_date', startDate);
      }
      if (endDate) {
        query = query.lte('inspection_date', endDate);
      }
      if (checklistType !== 'all') {
        query = query.eq('type', checklistType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, [session?.user?.id]);

  const handleFilter = () => {
    fetchReports();
  };

  const handleDelete = async (report: Report) => {
    if (!session?.user?.id) return;
    
    if (!confirm('Tem certeza que deseja excluir este relatório?')) {
      return;
    }

    try {
      // Delete all images from storage
      const imageUrls = Object.values(report.images).filter(url => url);
      for (const url of imageUrls) {
        const filePath = url.split('/').pop();
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('checklist-images')
            .remove([`${session.user.id}/${filePath}`]);

          if (storageError) {
            console.error('Error deleting image:', storageError);
          }
        }
      }

      // Delete the checklist record
      const { error: dbError } = await supabase
        .from('checklists')
        .delete()
        .eq('id', report.id)
        .eq('user_id', session.user.id);

      if (dbError) throw dbError;
      
      await fetchReports();
      toast.success('Relatório excluído com sucesso');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Erro ao excluir relatório');
    }
  };

  const handleDownloadPDF = async (report: Report) => {
    setSelectedReport(report);
    
    setTimeout(async () => {
      if (reportRef.current) {
        try {
          const loadingToast = toast.loading('Gerando PDF...');
          
          await generatePDF(
            reportRef.current,
            `checklist_${report.type}_${report.client.name}_${report.inspection_date}.pdf`
          );
          
          toast.dismiss(loadingToast);
          toast.success('PDF gerado com sucesso!');
        } catch (error) {
          toast.error('Erro ao gerar PDF. Tente novamente.');
          console.error('Error generating PDF:', error);
        }
      }
      setSelectedReport(null);
    }, 500);
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-center text-white bg-blue-600 py-4 rounded-lg mb-6 sm:mb-8">
        Relatórios
      </h1>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Checklist
            </label>
            <select
              value={checklistType}
              onChange={(e) => setChecklistType(e.target.value)}
              className="w-full rounded-lg border-gray-300"
            >
              <option value="all">Todos</option>
              <option value="rdc216">RDC 216</option>
              <option value="hygiene">Higiênico Sanitário</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleFilter}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Filtrar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-0">
          {/* Desktop View */}
          <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conformidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(report.inspection_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.type === 'rdc216' ? 'RDC 216' : 'Higiênico Sanitário'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.observed_area}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${report.performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{report.performance.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Ver detalhes"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(report)}
                          className="text-green-600 hover:text-green-800"
                          title="Baixar PDF"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(report)}
                          className="text-red-600 hover:text-red-800"
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

          {/* Mobile View */}
          <div className="sm:hidden space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{report.client.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(report.inspection_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {report.type === 'rdc216' ? 'RDC 216' : 'Higiênico'}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Área: {report.observed_area}</p>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${report.performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{report.performance.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Ver detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(report)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Baixar PDF"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(report)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Excluir"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalhes do Checklist</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div ref={reportRef}>
              <PrintableReport
                type={selectedReport.type}
                client={selectedReport.client.name}
                date={selectedReport.inspection_date}
                area={selectedReport.observed_area}
                crn={selectedReport.crn_number}
                sections={selectedReport.type === 'rdc216' ? checklistRDC216 : checklistHygiene}
                values={selectedReport.values}
                observations={selectedReport.observations}
                images={selectedReport.images}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}