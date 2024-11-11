import React from 'react';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  min_stock: number;
}

interface ProductListProps {
  onEdit: (product: Product) => void;
  onRefresh: () => void;
  onMovement: (product: Product, type: 'in' | 'out') => void;
}

export default function ProductList({ onEdit, onRefresh, onMovement }: ProductListProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const session = useAuthStore((state) => state.session);

  const fetchProducts = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', session.user.id)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, [session?.user?.id]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita e todos os movimentos relacionados serão excluídos.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      toast.success('Produto excluído com sucesso');
      onRefresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= 0) {
      return 'bg-red-100 text-red-800';
    }
    if (current <= min) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brown-500"></div>
      </div>
    );
  }

  // Mobile view
  const renderMobileView = () => (
    <div className="space-y-4 sm:hidden">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">Código: {product.code}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStockStatus(product.current_stock, product.min_stock)}`}>
              {product.current_stock} {product.unit}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">Categoria: {product.category}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onMovement(product, 'in')}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              title="Entrada"
            >
              <ArrowDownRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onMovement(product, 'out')}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Saída"
            >
              <ArrowUpRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Editar"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Excluir"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop view
  const renderDesktopView = () => (
    <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatus(product.current_stock, product.min_stock)}`}>
                    {product.current_stock} {product.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onMovement(product, 'in')}
                      className="text-green-600 hover:text-green-900"
                      title="Entrada"
                    >
                      <ArrowDownRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onMovement(product, 'out')}
                      className="text-red-600 hover:text-red-900"
                      title="Saída"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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

  return (
    <>
      {renderMobileView()}
      {renderDesktopView()}
    </>
  );
}