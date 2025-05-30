import express from "express";
import {
  create,
  get,
  update,
  getById,
  deleteJob,
  search,
  view,
  getFilteredJobController,
} from "../controllers/job.controller.js";
import { upload } from '../middleware/multer.js';
// import { importJobCSV } from "../controllers/importJob.controller.js";

const router = express.Router();

router.post("/",  create);
router.post("/getAllJobs", get);
router.put("/:id",  update);
router.get("/:id", getById);
router.delete("/:id", deleteJob);
router.post("/searchJobs", search);
router.post("/viewJob/:id", view);
router.post("/filteredJobs",  getFilteredJobController);

// router.post('/importJob', upload.single('file'), importJobCSV);

export default router;
