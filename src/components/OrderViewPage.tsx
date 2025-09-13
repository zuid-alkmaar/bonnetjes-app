import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, Edit, Save, X } from 'lucide-react';
import { Order, Product, OrderItem } from '@/types';
import ConfirmDialog from './ConfirmDialog';

interface OrderViewPageProps {
  orderId: number;
  onBack: () => void;
  onOrderDeleted: () => void;
}

const OrderViewPage = ({ orderId, onBack, onOrderDeleted }: OrderViewPageProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderResponse, productsResponse] = await Promise.all([
          fetch(`/api/orders/${orderId}`),
          fetch('/api/products')
        ]);

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          setOrder(orderData);
          setEditedItems(orderData.orderItems || []);
        } else {
          console.error('Failed to fetch order');
        }

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);





  const handleDeleteOrder = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onOrderDeleted();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setEditedItems(editedItems.filter(item => item.id !== itemId));
    } else {
      setEditedItems(editedItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleAddProduct = (product: Product) => {
    const newItem = {
      id: Date.now(), // Temporary ID for new items
      productId: product.id,
      quantity: 1,
      price: product.price,
      product: product
    };
    setEditedItems([...editedItems, newItem]);
    setShowAddProduct(false);
  };

  const handleSaveChanges = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}/items`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: editedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        setEditedItems(updatedOrder.orderItems || []);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedItems(order?.orderItems || []);
    setIsEditing(false);
    setShowAddProduct(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">Order not found</div>
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700"
                >
                  Edit Items
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Order
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <p className="mt-1 text-lg text-gray-900">{order.customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <p className="mt-1 text-lg font-semibold text-amber-600">€{order.totalAmount.toFixed(2)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order Date</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>


        </div>
      </div>

      {/* Order Items */}
      {editedItems && editedItems.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
              {isEditing && (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Product
                </button>
              )}
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {editedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">{item.product.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Category: {item.product.category} • €{item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">Qty: {item.quantity}</p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Subtotal: €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-amber-600">
                  €{editedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Add Product to Order</h2>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.filter(p => p.isActive).map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-sm font-medium text-amber-600 mt-1">€{product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Order"
        message={`Are you sure you want to delete Order #${order.id} for ${order.customerName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteOrder}
        onCancel={() => setShowConfirm(false)}
        type="danger"
      />
    </div>
  );
};

export default OrderViewPage;
