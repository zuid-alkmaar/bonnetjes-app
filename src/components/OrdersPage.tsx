import { useState, useEffect } from 'react';
import { Trash2, CreditCard, Check } from 'lucide-react';
import { Order } from '@/types';
import OrderViewPage from './OrderViewPage';
import ConfirmDialog from './ConfirmDialog';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewingOrderId, setViewingOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(orders.filter(o => o.id !== id));
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleViewOrder = (orderId: number) => {
    setViewingOrderId(orderId);
  };

  const handleBackToOrders = () => {
    setViewingOrderId(null);
    // Refresh orders list
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  };

  const handleDeleteClick = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation(); // Prevent triggering the view order
    setSelectedOrder(order);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedOrder) {
      handleDeleteOrder(selectedOrder.id);
    }
    setShowConfirm(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  // Show order view page if an order is selected
  if (viewingOrderId) {
    return (
      <OrderViewPage
        orderId={viewingOrderId}
        onBack={handleBackToOrders}
        onOrderDeleted={handleBackToOrders}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and track all customer orders
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id}>
              <div
                className="px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleViewOrder(order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0">
                      {order.isPaid ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id} - {order.customerName}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.isPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p>€{order.totalAmount.toFixed(2)}</p>
                        <span className="mx-2">•</span>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleDeleteClick(e, order)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50"
                      title="Delete Order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found. Create your first order to get started!</p>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Order"
        message={`Are you sure you want to delete Order #${selectedOrder?.id} for ${selectedOrder?.customerName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedOrder(null);
        }}
        type="danger"
      />
    </div>
  );
};

export default OrdersPage;
