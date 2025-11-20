import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService, type Event, type CreateEventData } from '../services/event.service';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    category: '',
    ticketTiers: [{ name: 'General Admission', price: 0, quantity: 100 }],
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch organizer's events
    // For now, we'll show all events
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const newEvent = await eventService.createEvent(formData);
      setEvents([...events, newEvent]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        venue: '',
        category: '',
        ticketTiers: [{ name: 'General Admission', price: 0, quantity: 100 }],
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (eventId: string) => {
    try {
      await eventService.publishEvent(eventId);
      setEvents(events.map((e) => (e._id === eventId ? { ...e, status: 'published' } : e)));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to publish event');
    }
  };

  if (user?.role !== 'organizer') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-slate-600 text-lg">You need to be an organizer to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Organizer Dashboard</h1>
          <p className="text-slate-600">Manage your events and track registrations</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
        >
          {showCreateForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Event</h2>
          <form onSubmit={handleCreateEvent} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            </div>
          ))
        ) : events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {event.coverImage ? (
                <img src={event.coverImage} alt={event.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-6xl text-white/50">🎉</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                    {event.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="flex gap-2">
                  <Link
                    to={`/events/${event._id}`}
                    className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold text-center hover:bg-indigo-100 transition-colors"
                  >
                    View
                  </Link>
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(event._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-600 text-lg">No events yet. Create your first event!</p>
          </div>
        )}
      </div>
    </div>
  );
}

