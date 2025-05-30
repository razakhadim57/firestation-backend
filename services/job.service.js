import Job from "../models/Job.js";
import View from "../models/view.model.js";
import {FireStation} from "../models/FireStation.js";  // changed import here
import MyVideos from "../models/myVideos.model.js";
import { applyAggregation } from "../utils/dateFormattor.js";
import slugify from "slugify";

export const createJob = async (data) => {
  try {
    if (!data.address || typeof data.address.longitude === 'undefined' || typeof data.address.latitude === 'undefined') {
      throw new Error("Address with valid latitude and longitude is required.");
    }

    data.address.type = "Point";
    data.address.coordinates = [
      data.address.longitude,
      data.address.latitude,
    ];

    const slugOptions = {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      locale: "de",
      lower: true,
    };

    let baseSlug = slugify(data.title, slugOptions);
    let slug = baseSlug;
    let slugExists = true;
    let counter = 1;

    while (slugExists) {
      const existingJob = await Job.findOne({ slug });
      if (existingJob) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      } else {
        slugExists = false;
      }
    }

    data.slug = slug;

    const fireStation = await FireStation.findById(data.fireStation);
    if (!fireStation) {
      throw new Error("FireStation Not Found.");
    }

    let latestJob;

    if (data.isVideoJob && data.video) {
      let video;
      try {
        video = await MyVideos.findById(data.video);
      } catch (videoErr) {
        throw new Error("Error fetching video: " + videoErr.message);
      }
      if (!video) {
        throw new Error("Video Not Found.");
      }

      try {
        latestJob = await Job.create(data);
      } catch (createErr) {
        throw new Error("Failed to create job: " + createErr.message);
      }

      try {
        await MyVideos.findByIdAndUpdate(
          video._id,
          { job: latestJob._id },
          { new: true }
        );
      } catch (updateVideoErr) {
        // Optional: You might want to handle or log this failure separately
        throw new Error("Failed to link video to job: " + updateVideoErr.message);
      }
    } else {
      try {
        latestJob = await Job.create(data);
      } catch (createErr) {
        throw new Error("Failed to create job: " + createErr.message);
      }
    }

    return latestJob;
  } catch (err) {
    // You can also log the error here if desired
    throw err;
  }
};


export const updateJob = async (id, body) => {
  if (body?.address?.longitude || body?.address?.latitude) {
    body.address.type = "Point";
    body.address.coordinates = [
      body?.address?.longitude,
      body?.address?.latitude,
    ];
  }

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
      const existingJob = await Job.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (existingJob) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      } else {
        slugExists = false;
      }
    }

    body.slug = newSlug;
  }

  return await Job.findByIdAndUpdate(id, body, { new: true });
};

export const deleteById = async (id) => {
  return await Job.deleteOne({ _id: id });
};

export const getJobs = async (filter = {}) => {
  // If filter includes fireStation, use it, else return all jobs with approved fireStations
  if (filter?.fireStation) {
    return await Job.find(filter)
    .populate("fireStation")
    .populate("video");
    // .populate("category")
    //   .populate("jobApplications")
  } else {
    const approvedFireStationIds = await FireStation.find({ isApproved: true }).distinct("_id");
    return await Job.find({
      ...filter,
      fireStation: { $in: approvedFireStationIds },
    }).populate("fireStation")
      .populate("video");
  }
};

export const getSingleJob = async (id) => {
  return await Job.findById(id)
    .populate("fireStation")
    .populate("video");
};

export const searchJobs = async (latitude, longitude) => {
  try {
    const point = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
    let dbQuery = {
      "address.coordinates": {
        $geoWithin: {
          $centerSphere: [point.coordinates, 50 / 6371],
        },
      },
    };

    let jobs = await Job.find(dbQuery)
      .populate("fireStation")
      .populate("video")
      .limit(50);

    if (jobs.length < 50) {
      let dbNotQuery = {
        "address.coordinates": {
          $not: {
            $geoWithin: {
              $centerSphere: [point.coordinates, 50 / 6371],
            },
          },
        },
      };

      let moreJobs = await Job.find(dbNotQuery)
        .populate("fireStation")
        .populate("video")
        .limit(50 - jobs.length);

      jobs = [...jobs, ...moreJobs];
    }

    return jobs;
  } catch (err) {
    throw err;
  }
};

export const getFilteredJobs = async (filters) => {
  let query = {};

  if (filters.startDate && filters.endDate) {
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    query.$and = [
      { createdAt: { $gte: startDate } },
      { createdAt: { $lte: endDate } },
    ];
  }

  if (typeof filters.expired !== "undefined") {
    query.expired = filters.expired;
  }

  if (typeof filters.isApproved !== "undefined") {
    query.isApproved = filters.isApproved;
  }
  if (typeof filters.isVideoJob !== "undefined") {
    query.isVideoJob = filters.isVideoJob;
  }

  if (filters.fireStation) {
    query.fireStation = filters.fireStation;
  }

  let jobs = await Job.find(query).populate({
    path: 'views',
    select: 'date modelType viewCount',
  });

  let result = applyAggregation(jobs, filters?.period, filters?.startDate, filters?.endDate);

  return result;
};

export const viewJob = async (id) => {
  try {
    const job = await Job.findById(id).populate("fireStation");
    if (!job) throw new Error("Job not found");
    if (!job.isApproved) throw new Error("Job is not approved");
    if (job.expired) throw new Error("Job is expired");
    if (!job.fireStation?.isApproved) throw new Error("Associated fireStation is not approved");

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const view = await View.findOneAndUpdate(
      { modelType: "Job", modelId: id, date: { $gte: startOfDay, $lte: endOfDay } },
      { $inc: { viewCount: 1 } },
      { new: true, upsert: true }
    );

    if (!job.views.some((viewId) => viewId.equals(view._id))) {
      job.views.push(view._id);
      await job.save();
    }

    return job;
  } catch (err) {
    throw err;
  }
};
