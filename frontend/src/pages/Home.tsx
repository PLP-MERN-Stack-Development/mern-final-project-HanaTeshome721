import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { eventService, type Event } from '../services/event.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data.slice(0, 3));
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section with Enhanced Animations */}
      <section className="relative overflow-hidden bg-gradient-animated text-white min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-float delay-500"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in-up">
              Create & Discover
              <br />
              <span className="bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-fade-in-up delay-200">
                Amazing Events
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 animate-fade-in-up delay-300">
              The all-in-one platform for event organizers and attendees. Manage tickets, track registrations, and create unforgettable experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-fade-in-up delay-400">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl hover:shadow-2xl">
                <Link to="/events">Browse Events</Link>
              </Button>
              <Button asChild size="lg" className="bg-primary-600/90 backdrop-blur-sm border-2 border-white/30 hover:bg-primary-600 shadow-lg hover:shadow-xl">
                <Link to="/register">Start Organizing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Staggered Animations */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-3 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-lg sm:text-xl text-dark-600">Powerful features for event management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: '🎫',
                title: 'Smart Ticketing',
                description: 'Create multiple ticket tiers, set capacity limits, and track sales in real-time.',
              },
              {
                icon: '📊',
                title: 'Analytics Dashboard',
                description: 'Monitor registrations, revenue, and attendee engagement with detailed insights.',
              },
              {
                icon: '🔔',
                title: 'Real-time Updates',
                description: 'Get instant notifications about ticket sales, cancellations, and event changes.',
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="p-6 sm:p-8 bg-gradient-to-br from-primary-50 to-white border-primary-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardHeader className="p-0">
                  <div className="text-5xl sm:text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mb-2 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events with Slide-in Animations */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-50/50 via-white to-primary-50/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4 animate-fade-in-up">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 mb-2">
                Featured Events
              </h2>
              <p className="text-base sm:text-lg text-dark-600">Discover exciting events happening near you</p>
            </div>
            <Link
              to="/events"
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors text-base sm:text-lg flex items-center gap-2 group"
            >
              View All
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse shadow-md">
                  <div className="h-48 bg-dark-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-dark-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-dark-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, idx) => (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className="block"
                >
                <Card
                  className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] group animate-scale-in border-0"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  {event.coverImage ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-48 sm:h-56 object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-800 transition-all duration-300">
                      <span className="text-6xl sm:text-7xl text-white/50 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                        🎉
                      </span>
                    </div>
                  )}
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-primary-100 text-primary-700 group-hover:bg-primary-200">
                        {event.category}
                      </Badge>
                      <span className="text-xs sm:text-sm text-muted-foreground">{formatDate(event.startDate)}</span>
                    </div>
                    <CardTitle className="text-lg sm:text-xl mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-sm mb-4 line-clamp-2">{event.description}</CardDescription>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">📍 {event.venue}</span>
                      <span className="text-primary-600 font-semibold text-sm sm:text-base group-hover:text-primary-700 transition-colors">
                        From ${Math.min(...event.ticketTiers.map((t) => t.price))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-dark-600 text-lg">No events available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
