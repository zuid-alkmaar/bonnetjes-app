import { useState, useEffect } from 'react';
import { ShoppingCart, Package, DollarSign, Clock } from 'lucide-react';
import { DashboardStats, Order } from '@/types';

interface DashboardPageProps {
  onViewOrder?: (orderId: number) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const DashboardPage = ({ onViewOrder }: DashboardPageProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, ordersResponse] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/orders')
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error('Failed to fetch dashboard stats');
        }

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          // Get the 5 most recent orders
          setRecentOrders(ordersData.slice(0, 5));
        } else {
          console.error('Failed to fetch recent orders');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Failed to load dashboard data</div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-3 sm:p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
          </div>
          <div className="ml-3 sm:ml-5 w-0 flex-1">
            <dl>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-base sm:text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to your cafe management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="text-blue-600"
        />
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon={Clock}
          color="text-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={`€${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="text-yellow-600"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          icon={Package}
          color="text-purple-600"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
          <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">
            Recent Orders
          </h3>
          {recentOrders.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => onViewOrder?.(order.id)}
                    className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="mr-2 sm:mr-3 flex-shrink-0">
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <p className="text-sm sm:text-base font-medium text-gray-900 truncate">Order #{order.id}</p>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm sm:text-base font-medium text-gray-900">€{order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 hidden sm:block">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <p>No recent orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
