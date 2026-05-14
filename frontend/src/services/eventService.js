import api from './api';

export const createEvent = payload => api.post('/events/create', payload).then(res => res.data);
export const getEventById = id => api.get(`/events/${id}`).then(res => res.data);
export const getEventsByUser = userId => api.get(`/events/user/${userId}`).then(res => res.data);
