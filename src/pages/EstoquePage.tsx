import React from 'react';
import { Boxes, PackagePlus, PackageMinus, Package } from 'lucide-react';
import ProductList from '../components/stock/ProductList';
import ProductForm from '../components/stock/ProductForm';
import StockMovementForm from '../components/stock/StockMovementForm';
import StockMovementList from '../components/stock/StockMovementList';

export default function EstoquePage() {
  const [activeTab, setActiveTab] = React.useState<'products' | 'movements'>('products');
  const [showProductForm, setShowProductForm] = React.useState(false);
  const [showMovementForm, setShowMovementForm] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [movementType, setMovementType] = React.useState<'entry' | 'exit'>('entry');

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleNewMovement = (type: 'entry' | 'exit') => {
    setMovementType(type);
    setShowMovementForm(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center text-white bg-brown-500 py-4 rounded-lg mb-8">
        Gestão de Estoque
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'products'
              ? 'bg-brown-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Package className="h-5 w-5" />
          <span>Produtos</span>
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'movements'
              ? 'bg-brown-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Boxes className="h-5 w-5" />
          <span>Movimentações</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        {activeTab === 'products' ? (
          <button
            onClick={handleNewProduct}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Package className="h-5 w-5" />
            <span>Novo Produto</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => handleNewMovement('entry')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PackagePlus className="h-5 w-5" />
              <span>Nova Entrada</span>
            </button>
            <button
              onClick={() => handleNewMovement('exit')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <PackageMinus className="h-5 w-5" />
              <span>Nova Saída</span>
            </button>
          </>
        )}
      </div>

      {/* Content */}
      {activeTab === 'products' ? (
        <ProductList onEdit={handleEditProduct} />
      ) : (
        <StockMovementList />
      )}

      {/* Modals */}
      {showProductForm && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setShowProductForm(false)}
          onSuccess={() => {
            setShowProductForm(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showMovementForm && (
        <StockMovementForm
          type={movementType}
          onClose={() => setShowMovementForm(false)}
          onSuccess={() => setShowMovementForm(false)}
        />
      )}
    </div>
  );
}