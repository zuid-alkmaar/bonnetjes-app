'use client';

import { useState } from 'react';
import { Coffee, ShoppingCart, Package, Plus } from 'lucide-react';
import DashboardPage from '@/components/DashboardPage';
import OrdersPage from '@/components/OrdersPage';
import ProductsPage from '@/components/ProductsPage';
import CreateOrderPage from '@/components/CreateOrderPage';
import OrderViewPage from '@/components/OrderViewPage';



export default function Home() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'orders' | 'products' | 'create-order'>('dashboard');
  const [viewingOrderId, setViewingOrderId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleViewOrder = (orderId: number) => {
    setViewingOrderId(orderId);
    setCurrentPage('orders');
  };

  const handleBackFromOrder = () => {
    setViewingOrderId(null);
  };

  const handleOrderCreated = () => {
    setCurrentPage('orders');
    setViewingOrderId(null);
  };

  // Navigation component
  const Navigation = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
            <h1 className="ml-2 text-lg sm:text-xl font-bold text-gray-900">Bonnetjes Cafe</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'dashboard'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Coffee className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden lg:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentPage('orders')}
              className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'orders'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden lg:inline">Orders</span>
            </button>
            <button
              onClick={() => setCurrentPage('products')}
              className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'products'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden lg:inline">Products</span>
            </button>
            <button
              onClick={() => setCurrentPage('create-order')}
              className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 ${
                currentPage === 'create-order' ? 'bg-amber-700' : ''
              }`}
            >
              <Plus className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden lg:inline">New Order</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center px-2 py-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => {
                  setCurrentPage('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'dashboard'
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Coffee className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentPage('orders');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'orders'
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders
              </button>
              <button
                onClick={() => {
                  setCurrentPage('products');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'products'
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="h-4 w-4 mr-2" />
                Products
              </button>
              <button
                onClick={() => {
                  setCurrentPage('create-order');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-amber-600 text-white hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {currentPage === 'dashboard' && <DashboardPage onViewOrder={handleViewOrder} />}
          {currentPage === 'orders' && !viewingOrderId && <OrdersPage />}
          {currentPage === 'orders' && viewingOrderId && (
            <OrderViewPage
              orderId={viewingOrderId}
              onBack={handleBackFromOrder}
              onOrderDeleted={handleBackFromOrder}
            />
          )}
          {currentPage === 'products' && <ProductsPage />}
          {currentPage === 'create-order' && <CreateOrderPage onOrderCreated={handleOrderCreated} />}
        </div>
      </main>
    </div>
  );
}
