import api from './api';

export interface TicketTier {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  remainingQuantity?: number;
  description?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  category: string;
  coverImage?: string;
  slug: string;
  status: 'draft' | 'published';
  ticketTiers: TicketTier[];
  tags?: string[];
  organizer?: {
    name: string;
    email: string;
  };
}

export interface EventListResponse {
  events: Event[];
}

export interface EventResponse {
  event: Event;
}

export interface CreateEventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  category: string;
  coverImage?: string;
  slug?: string;
  ticketTiers: TicketTier[];
  tags?: string[];
}

export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get<EventListResponse>('/events');
    return response.data.events;
  },

  getEventById: async (eventId: string): Promise<Event> => {
    const response = await api.get<EventResponse>(`/events/${eventId}`);
    return response.data.event;
  },

  createEvent: async (data: CreateEventData): Promise<Event> => {
    const response = await api.post<EventResponse>('/events', data);
    return response.data.event;
  },

  publishEvent: async (eventId: string): Promise<Event> => {
    const response = await api.post<EventResponse>(`/events/${eventId}/publish`);
    return response.data.event;
  },
};

