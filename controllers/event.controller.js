import * as eventService from '../services/event.service.js';

export const create = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const events = await eventService.getEvents(req.query);
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const event = await eventService.deleteEvent(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};
