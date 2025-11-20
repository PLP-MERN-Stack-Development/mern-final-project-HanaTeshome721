import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService, type Order } from '../services/order.service';

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-slate-600 text-lg mb-4">Please log in to view your orders.</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">My Orders</h1>
      <p className="text-slate-600 mb-8">View your ticket purchases and event registrations</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {order.event.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {formatDate(order.event.startDate)} • {order.event.venue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-slate-500">{order.tickets.length} ticket(s)</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-slate-900 mb-2">Tickets</h4>
                <div className="space-y-2">
                  {order.tickets.map((ticket) => (
                    <div key={ticket._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{ticket.attendee.name}</p>
                        <p className="text-sm text-slate-600">{ticket.attendee.email}</p>
                        <p className="text-xs text-slate-500 mt-1">{ticket.tierName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-slate-500">QR: {ticket.qrCode.slice(0, 8)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/events/${order.event._id}`}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
                >
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-slate-600 text-lg mb-4">You haven't purchased any tickets yet.</p>
          <Link
            to="/events"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block"
          >
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
}

