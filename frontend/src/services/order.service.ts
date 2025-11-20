import api from './api';

export interface Attendee {
  name: string;
  email: string;
}

export interface CreateOrderData {
  eventId: string;
  tierId: string;
  quantity: number;
  contactEmail: string;
  contactName: string;
  attendees: Attendee[];
}

export interface Order {
  _id: string;
  event: {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    venue: string;
  };
  total: number;
  currency: string;
  status: string;
  tickets: Ticket[];
  contactEmail: string;
  contactName: string;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  qrCode: string;
  tierName: string;
  attendee: Attendee;
}

export interface CreateOrderResponse {
  order: Order;
  tickets: Ticket[];
}

export interface OrderListResponse {
  orders: Order[];
}

export const orderService = {
  createOrder: async (data: CreateOrderData): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>('/orders', data);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<OrderListResponse>('/orders/me');
    return response.data.orders;
  },
};

