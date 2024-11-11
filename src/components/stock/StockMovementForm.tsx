import React from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  code: string;
  name: string;
  unit: string;
  current_stock: number;
}

interface StockMovementFormProps {
  product: Product;
  type: 'in' | 'out';
  onClose: () => void;
  onSubmit: () => void;
}

export default function StockMovementForm({ product, type, onClose, onSubmit }: StockMovementFormProps) {
  const session = useAuthStore((state) => state.session);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    quantity: '',
    unit_price: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      const quantity = parseFloat(formData.quantity);
      
      if (type === 'out' && quantity > product.current_stock) {
        toast.error('Quantidade maior que o estoque disponível');
        return;
      }

      const movementData = {
        user_id: session.user.id,
        product_id: product.id,
        type,
        quantity,
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
        notes: formData.notes,
        date: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('stock_movements')
        .insert([movementData]);

      if (error) throw error;

      toast.success(`${type === 'in' ? 'Entrada' : 'Saída'} registrada com sucesso`);
      onSubmit();
    } catch (error) {
      console.error('Error saving stock movement:', error);
      toast.error('Erro ao registrar movimentação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {type === 'in' ? 'Entrada' : 'Saída'} de Estoque
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Produto
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">Código: {product.code}</p>
                <p className="text-sm text-gray-500">
                  Estoque atual: {product.current_stock} {product.unit}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade ({product.unit})
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            {type === 'in' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço Unitário (R$)
                </label>
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                  min="0.01"
                  step="0.01"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
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
              {loading ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}