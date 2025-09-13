import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Coffee, Utensils, Eye } from 'lucide-react';
import { Product } from '@/types';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';
import ConfirmDialog from './ConfirmDialog';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [referencedProductIds, setReferencedProductIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          const referencedIds = new Set<number>();
          ordersData.forEach((order: { orderItems?: Array<{ productId: number }> }) => {
            order.orderItems?.forEach((item: { productId: number }) => {
              referencedIds.add(item.productId);
            });
          });
          setReferencedProductIds(referencedIds);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'coffee':
      case 'tea':
        return <Coffee className="h-5 w-5 text-amber-600" />;
      default:
        return <Utensils className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        // Update referenced products list
        const updatedReferencedIds = new Set(referencedProductIds);
        updatedReferencedIds.delete(id);
        setReferencedProductIds(updatedReferencedIds);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeleteClick = (product: Product) => {
    if (referencedProductIds.has(product.id)) {
      return; // Don't show confirmation for referenced products
    }
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      handleDeleteProduct(selectedProduct.id);
    }
    setShowConfirm(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (savedProduct: Product) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
    } else {
      // Add new product
      setProducts([...products, savedProduct]);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your cafe menu and pricing
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center min-w-0 flex-1">
                  {getCategoryIcon(product.category)}
                  <span className="ml-2 text-xs sm:text-sm text-gray-500 truncate">{product.category}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="text-gray-400 hover:text-blue-600 p-1"
                    title="View Details"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Edit Product"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    disabled={loading || referencedProductIds.has(product.id)}
                    className={`p-1 ${
                      loading || referencedProductIds.has(product.id)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-400 hover:text-red-600'
                    }`}
                    title={
                      loading
                        ? 'Loading...'
                        : referencedProductIds.has(product.id)
                        ? 'Cannot delete - product is used in orders'
                        : 'Delete Product'
                    }
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-amber-600">
                  €{product.price.toFixed(2)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {selectedCategory === 'all' 
              ? 'No products found. Add your first product to get started!' 
              : `No products found in the ${selectedCategory} category.`
            }
          </p>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        product={selectedProduct}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedProduct(null);
        }}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedProduct(null);
        }}
        type="danger"
      />
    </div>
  );
};

export default ProductsPage;
