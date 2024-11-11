import React from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

const PRODUCT_CATEGORIES = [
  { value: 'cereais', label: 'Cereais e Farináceos' },
  { value: 'proteinas', label: 'Proteínas e Carnes' },
  { value: 'laticinios', label: 'Laticínios' },
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'leguminosas', label: 'Leguminosas' },
  { value: 'oleos', label: 'Óleos e Gorduras' },
  { value: 'condimentos', label: 'Condimentos e Temperos' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'sobremesas', label: 'Sobremesas e Doces' },
  { value: 'dieteticos', label: 'Produtos Dietéticos' },
  { value: 'suplementos', label: 'Suplementos Nutricionais' },
  { value: 'descartaveis', label: 'Descartáveis' },
  { value: 'higiene', label: 'Higiene e Limpeza' },
  { value: 'outros', label: 'Outros' }
];

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  const session = useAuthStore((state) => state.session);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    code: product?.code || '',
    name: product?.name || '',
    category: product?.category || '',
    unit: product?.unit || '',
    min_stock: product?.min_stock || 0,
  });

  React.useEffect(() => {
    if (!product) {
      generateProductCode();
    }
  }, [product]);

  const generateProductCode = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('code')
        .order('code', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextCode = '0001';
      if (data && data.length > 0) {
        const lastCode = parseInt(data[0].code);
        nextCode = (lastCode + 1).toString().padStart(4, '0');
      }

      setFormData(prev => ({ ...prev, code: nextCode }));
    } catch (error) {
      console.error('Error generating product code:', error);
      toast.error('Erro ao gerar código do produto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!session?.user?.id) {
        throw new Error('No user ID found');
      }

      const productData = {
        ...formData,
        user_id: session.user.id,
      };

      const { error } = product
        ? await supabase
            .from('products')
            .update(productData)
            .eq('id', product.id)
        : await supabase
            .from('products')
            .insert([productData]);

      if (error) throw error;

      toast.success(product ? 'Produto atualizado com sucesso' : 'Produto cadastrado com sucesso');
      onSubmit();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                required
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unidade
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                required
              >
                <option value="">Selecione uma unidade</option>
                <option value="un">Unidade</option>
                <option value="kg">Quilograma</option>
                <option value="g">Grama</option>
                <option value="l">Litro</option>
                <option value="ml">Mililitro</option>
                <option value="cx">Caixa</option>
                <option value="pct">Pacote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estoque Mínimo
              </label>
              <input
                type="number"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-500 hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}