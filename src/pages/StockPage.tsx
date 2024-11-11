import React from 'react';
import ProductList from '../components/stock/ProductList';
import ProductForm from '../components/stock/ProductForm';
import StockMovementForm from '../components/stock/StockMovementForm';
import { Package, Plus } from 'lucide-react';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  min_stock: number;
}

export default function StockPage() {
  const [showProductForm, setShowProductForm] = React.useState(false);
  const [showMovementForm, setShowMovementForm] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [movementType, setMovementType] = React.useState<'in' | 'out'>('in');
  const [refresh, setRefresh] = React.useState(0);

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleMovement = (product: Product, type: 'in' | 'out') => {
    setSelectedProduct(product);
    setMovementType(type);
    setShowMovementForm(true);
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setShowMovementForm(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = () => {
    setRefresh(prev => prev + 1);
    handleFormClose();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-brown-500" />
          <h1 className="text-2xl font-semibold text-gray-800">Gestão de Estoque</h1>
        </div>
        <button
          onClick={handleNewProduct}
          className="flex items-center gap-2 px-4 py-2 bg-brown-500 text-white rounded-lg hover:bg-brown-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </button>
      </div>

      <ProductList
        onEdit={handleEditProduct}
        onRefresh={() => setRefresh(prev => prev + 1)}
        onMovement={handleMovement}
        key={refresh}
      />

      {showProductForm && (
        <ProductForm
          product={selectedProduct}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {showMovementForm && selectedProduct && (
        <StockMovementForm
          product={selectedProduct}
          type={movementType}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}