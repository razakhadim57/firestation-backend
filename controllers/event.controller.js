import {
  createEvent,
  updateEvent,
  getEvents,
  getSingleEvents,
  deleteById,
  viewEvent,
  getFilteredEventService,
} from "../services/event.service.js";
import { createSchema } from "./event.controller.validator.js";

export const create = async (req, res, next) => {
  try {
    const validBody = await createSchema.validate(req.body);
    if (validBody.error) {
      return res.status(400).send(validBody.error);
    }
    const abc = await createEvent(validBody.value);
    res.status(201).send({message:"Event has been created.", abc});
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const get = async (req, res, next) => {
  try {
    const events = await getEvents(req.body);
    res.status(200).json(events);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).send("Event id not found.");

    const event = await updateEvent(id, req.body);
    if (event) res.status(200).json(event);
    else res.status(404).send("Event Not Found.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).send("Event id not found.");

    const event = await getSingleEvents(id);
    if (event) res.status(200).json(event);
    else res.status(404).send("Event Not Found.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).send("Event id not found.");

    const deleted = await deleteById(id);
    if (deleted.deletedCount) res.status(200).send(deleted);
    else res.status(404).send("Event Not Found.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const view = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).send("Event id not found.");

    await viewEvent(id);
    res.status(200).send("Event Viewed");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getFilteredEvents = async (req, res, next) => {
  try {
    // const userRole = getUserRole(req);
    // if (userRole !== "admin") {
    //   return res.status(403).send("Unauthorized: User is not allowed to get these Events.");
    // }
    const filters = req.body;
    const events = await getFilteredEventService(filters);
    res.status(200).json(events);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
