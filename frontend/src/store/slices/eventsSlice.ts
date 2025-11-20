import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type EventSummary = {
  id: string;
  name: string;
  date: string;
  venue: string;
};

type EventsState = {
  items: EventSummary[];
};

const initialState: EventsState = {
  items: [],
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<EventSummary[]>) {
      state.items = action.payload;
    },
  },
});

export const { setEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
