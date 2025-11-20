import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService, type Event } from '../services/event.service';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const categories = Array.from(new Set(events.map((e) => e.category)));

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-2">Discover Events</h1>
        <p className="text-base sm:text-lg text-dark-600">Find your next unforgettable experience</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 sm:mb-8 space-y-4 md:flex md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-dark-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-dark-900 placeholder-dark-400"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-auto px-4 py-3 border border-dark-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-dark-900"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-md">
              <div className="h-48 bg-dark-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-dark-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-dark-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-primary-100"
            >
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl text-white/50">🎉</span>
                </div>
              )}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                    {event.category}
                  </span>
                  <span className="text-xs sm:text-sm text-dark-500">{formatDate(event.startDate)}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-dark-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs sm:text-sm text-dark-500">📍 {event.venue}</span>
                  <span className="text-primary-600 font-semibold text-sm sm:text-base">
                    From ${Math.min(...event.ticketTiers.map((t) => t.price))}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
          <p className="text-dark-600 text-lg">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
