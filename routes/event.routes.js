import express from "express";
import {
  create,
  get,
  update,
  getById,
  deleteEvent,
  view,
  getFilteredEvents,
} from "../controllers/event.controller.js";
import Event from "../models/Event.js";

const router = express.Router();

router.post("/",  create);
router.post("/getAllEvents", get);
router.put("/:id",  update);
router.get("/:id", getById);
router.delete("/:id", deleteEvent);
router.post("/viewEvent/:id", view);
router.post("/filteredEvents",  getFilteredEvents);

// Optionally get all events (admin only)
router.get("/",  async (req, res) => {
    
  try {
    // const userRole = getUserRole(req);
    // if (userRole !== "admin") {
    //   return res.status(403).send("Unauthorized: User is not allowed to get events.");
    // }
    const events = await Event.find().populate("fireStationId").populate("video");
    //   .populate({
    //     path: "fireStation",
    //     populate: {
    //       path: "region", // adjust as needed
    //     },
    //   })
      

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
