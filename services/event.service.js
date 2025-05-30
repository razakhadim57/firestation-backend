import Event from "../models/Event.js";
import { FireStation } from "../models/FireStation.js";

import MyVideos from "../models/myVideos.model.js";
import View from "../models/view.model.js";
import slugify from "slugify";
import { applyAggregation } from "../utils/dateFormattor.js";

export const createEvent = async (data) => {
  try {
    const slugOptions = {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      locale: "de",
      lower: true,
    };

    let baseSlug = slugify(data.name, slugOptions);
    let slug = baseSlug;
    let slugExists = true;
    let counter = 1;

    while (slugExists) {
      const existingEvent = await Event.findOne({ slug });
      if (existingEvent) {
        slug = `${baseSlug}_${counter}`;
        counter++;
      } else {
        slugExists = false;
      }
    }

    data.slug = slug;

    let latestEvent;
    if (data?.isVideoEvent && data?.video) {
      let video = await MyVideos.findById(data.video);
      if (!video) {
        throw new Error("Video Not Found");
      }
      latestEvent = await Event.create(data);
      await MyVideos.findByIdAndUpdate(video._id, { event: latestEvent._id });
    } else {
      latestEvent = await Event.create(data);
    }
    return latestEvent;
  } catch (err) {
    throw err;
  }
};

export const updateEvent = async (id, body) => {
  if (body?.slug) {
    const slugOptions = {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      locale: "de",
      lower: true,
    };

    let baseSlug = slugify(body.slug, slugOptions);
    let newSlug = baseSlug;
    let slugExists = true;
    let counter = 1;

    while (slugExists) {
      const existingEvent = await Event.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (existingEvent) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      } else {
        slugExists = false;
      }
    }

    body.slug = newSlug;
  }
  return await Event.findByIdAndUpdate(id, body, { new: true });
};

export const deleteById = async (id) => {
  return await Event.deleteOne({ _id: id });
};

export const getEvents = async (filter = {}) => {
  if (filter?.fireStationId) {
    return await Event.find(filter)
      .populate("video")
      .populate("fireStationId");
  } else {
    // Find all approved fireStations' ids to filter events
    const approvedFireStationIds = await FireStation.find({ isApproved: true }).distinct("_id");

    return await Event.find({
      ...filter,
      fireStation: { $in: approvedFireStationIds },
    })
      .populate("video")
      .populate("fireStationId");
  }
};

export const getSingleEvents = async (id) => {
  return await Event.findById(id)
    .populate("fireStationId")
    .populate("video");
};

export const viewEvent = async (id) => {
  try {
    const event = await Event.findOne({
      _id: id,
      isApproved: true,
      expired: false,
    }).populate({
      path: "fireStationId",
      match: { isApproved: true },
    });

    if (!event) {
      throw new Error("Event not found or conditions not met");
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const view = await View.findOneAndUpdate(
      { modelType: "Event", modelId: id, date: { $gte: startOfDay, $lte: endOfDay } },
      { $inc: { viewCount: 1 } },
      { new: true, upsert: true }
    );

    if (!event.views.some((viewId) => viewId.equals(view._id))) {
      event.views.push(view._id);
      await event.save();
    }

    return event;
  } catch (err) {
    throw err;
  }
};

export const getFilteredEventService = async (filters) => {
  let query = {};

  if (filters?.startDate && filters?.endDate) {
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    query.$and = [{ from: { $lte: endDate } }, { to: { $gte: startDate } }];
  }

  if (typeof filters.expired !== "undefined") {
    query.expired = filters.expired;
  }

  if (typeof filters.isApproved !== "undefined") {
    query.isApproved = filters.isApproved;
  }

  if (typeof filters.isVideoEvent !== "undefined") {
    query.isVideoEvent = filters.isVideoEvent;
  }

  if (filters.fireStation) {
    query.fireStationId = filters.fireStation;
  }

  let events = await Event.find(query).populate({
    path: "views",
    select: "date modelType viewCount",
  });

  let result = applyAggregation(events, filters?.period, filters?.startDate, filters?.endDate);

  return result;
};
