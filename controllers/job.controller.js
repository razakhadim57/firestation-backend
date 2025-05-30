import { createSchema, searchSchema } from './job.controller.validator.js';
import {
  createJob,
  updateJob,
  getJobs,
  getSingleJob,
  deleteById,
  searchJobs,
  getFilteredJobs,
  viewJob,
} from '../services/job.service.js';

export const create = async (req, res, next) => {
  try {
    console.log("Creating job with body:", req.body);
    const validBody = await createSchema.validate(req.body);
    if (validBody.error) return res.status(400).send(validBody.error);
console.log("Validated job body:", validBody.value);
    await createJob(validBody.value);
    res.status(201).send("Job has been created.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const get = async (req, res, next) => {
  try {
    const jobs = await getJobs(req.body);
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).send("Job id not found.");

    const job = await updateJob(id, req.body);
    if (job) res.status(200).send(job);
    else res.status(404).send("Job Not Found.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).send("Job id not found.");

    const job = await getSingleJob(id);
    if (job) res.status(200).send(job);
    else res.status(404).send("Job Not Found.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).send("Job id not found.");

    const deleted = await deleteById(id);
    if (deleted.deletedCount) res.status(200).send(deleted);
    else res.status(404).send("Job Not Found.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const search = async (req, res, next) => {
  try {
    const validBody = await searchSchema.validate(req.body);
    if (validBody.error) return res.status(400).send(validBody.error);

    const jobs = await searchJobs(req.body.latitude, req.body.longitude);
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getFilteredJobController = async (req, res, next) => {
  try {
    const filters = req.body;
    const jobs = await getFilteredJobs(filters);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const view = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).send("Job id not found.");

    await viewJob(id);
    res.status(200).send("Job Viewed");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
