import Event from '../models/Event.js';

export const createEvent = async (data) => {
  return await Event.create(data);
};

export const getEvents = async (filters = {}) => {
  const query = {};
  if (filters.fireStationId) query.fireStationId = filters.fireStationId;
  if (filters.region) query.region = filters.region; // if region stored on event or joined, otherwise remove
  if (filters.date) query.date = { $gte: new Date(filters.date) };
  if (typeof filters.visible !== 'undefined') query.visible = filters.visible;

  return await Event.find(query).sort({ date: 1 });
};

export const getEventById = async (id) => {
  return await Event.findById(id);
};

export const updateEvent = async (id, data) => {
  return await Event.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEvent = async (id) => {
  return await Event.findByIdAndDelete(id);
};
