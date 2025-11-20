import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, type Event } from '../services/event.service';
import { orderService, type CreateOrderData } from '../services/order.service';
import { useAuth } from '../context/AuthContext';

export default function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [attendees, setAttendees] = useState<Array<{ name: string; email: string }>>([{ name: '', email: '' }]);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const data = await eventService.getEventById(eventId);
        setEvent(data);
        if (data.ticketTiers.length > 0) {
          setSelectedTier(data.ticketTiers[0]._id || '');
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (quantity > 0) {
      const newAttendees = Array(quantity).fill(null).map((_, i) => attendees[i] || { name: '', email: '' });
      setAttendees(newAttendees);
    }
  }, [quantity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!eventId || !selectedTier) return;

    setProcessing(true);
    try {
      const orderData: CreateOrderData = {
        eventId,
        tierId: selectedTier,
        quantity,
        contactEmail,
        contactName,
        attendees: attendees.slice(0, quantity),
      };

      const result = await orderService.createOrder(orderData);
      navigate('/orders', { state: { orderId: result.order._id } });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  const selectedTierData = event?.ticketTiers.find((t) => t._id === selectedTier);
  const totalPrice = selectedTierData ? selectedTierData.price * quantity : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-pulse">
          <div className="h-64 sm:h-80 lg:h-96 bg-dark-200 rounded-2xl mb-6"></div>
          <div className="h-8 bg-dark-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-dark-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
        <p className="text-dark-600 text-lg">Event not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-96 object-cover rounded-2xl mb-6"
            />
          ) : (
            <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-6 flex items-center justify-center">
              <span className="text-7xl sm:text-8xl lg:text-9xl text-white/50">🎉</span>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-primary-100">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 sm:px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-semibold">
                {event.category}
              </span>
              {event.status === 'published' && (
                <span className="px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                  Published
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-900 mb-4">{event.title}</h1>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 text-dark-600">
                <span className="text-lg sm:text-xl">📅</span>
                <span className="text-sm sm:text-base">{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-dark-600">
                <span className="text-lg sm:text-xl">📍</span>
                <span className="text-sm sm:text-base">{event.venue}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl sm:text-2xl font-bold text-dark-900 mb-3 sm:mb-4">About This Event</h2>
              <p className="text-dark-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">{event.description}</p>
            </div>
          </div>
        </div>

        {/* Ticket Purchase Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg sticky top-24 border border-primary-100">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-900 mb-4 sm:mb-6">Get Tickets</h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Ticket Tier Selection */}
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">Ticket Type</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-4 py-3 border border-dark-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-dark-900"
                  required
                >
                  {event.ticketTiers.map((tier) => (
                    <option key={tier._id} value={tier._id}>
                      {tier.name} - ${tier.price} ({tier.remainingQuantity || tier.quantity} available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={selectedTierData?.remainingQuantity || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-dark-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-dark-900"
                  required
                />
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 border border-dark-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-dark-900 placeholder-dark-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">Your Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-dark-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-dark-900 placeholder-dark-400"
                  required
                />
              </div>

              {/* Attendee Details */}
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">Attendee Details</label>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {attendees.slice(0, quantity).map((attendee, idx) => (
                    <div key={idx} className="p-3 bg-primary-50 rounded-lg space-y-2 border border-primary-100">
                      <input
                        type="text"
                        placeholder="Attendee Name"
                        value={attendee.name}
                        onChange={(e) => {
                          const newAttendees = [...attendees];
                          newAttendees[idx].name = e.target.value;
                          setAttendees(newAttendees);
                        }}
                        className="w-full px-3 py-2 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-dark-900 placeholder-dark-400 text-sm"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Attendee Email"
                        value={attendee.email}
                        onChange={(e) => {
                          const newAttendees = [...attendees];
                          newAttendees[idx].email = e.target.value;
                          setAttendees(newAttendees);
                        }}
                        className="w-full px-3 py-2 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-dark-900 placeholder-dark-400 text-sm"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-dark-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base sm:text-lg font-semibold text-dark-700">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary-600">${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full px-6 py-4 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {processing ? 'Processing...' : 'Purchase Tickets'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

