import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { Product, Order, CreateOrderItem } from '@/types';

interface CreateOrderPageProps {
  onOrderCreated?: () => void;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

const CreateOrderPage = ({ onOrderCreated }: CreateOrderPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'all'
    ? products.filter(p => p.isActive)
    : products.filter(p => p.category === selectedCategory && p.isActive);

  const addToOrder = (product: Product) => {
    const existingItem = orderItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems(orderItems.filter(item => item.product.id !== productId));
    } else {
      setOrderItems(orderItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromOrder = (productId: number) => {
    setOrderItems(orderItems.filter(item => item.product.id !== productId));
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleSubmitOrder = async () => {
    if (!customerName.trim() || orderItems.length === 0) {
      return;
    }

    try {
      const orderData = {
        customerName,
        orderItems: orderItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Reset form
        setCustomerName('');
        setOrderItems([]);
        // Redirect to orders page
        onOrderCreated?.();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Products Section */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
          <p className="mt-1 text-sm text-gray-600">
            Select products to add to the order
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <span className="text-lg font-bold text-amber-600">€{product.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              <button
                onClick={() => addToOrder(product)}
                className="w-full bg-amber-600 text-white px-3 py-2 rounded-md hover:bg-amber-700 transition-colors"
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Order Summary
          </h2>

          {/* Customer Name */}
          <div className="mb-4">
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter customer name"
            />
          </div>

          {/* Order Items */}
          <div className="mb-4">
            {orderItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No items added yet</p>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-500">€{item.product.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromOrder(item.product.id)}
                        className="text-red-400 hover:text-red-600 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          {orderItems.length > 0 && (
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-xl font-bold text-amber-600">€{getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={orderItems.length === 0 || !customerName.trim()}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
