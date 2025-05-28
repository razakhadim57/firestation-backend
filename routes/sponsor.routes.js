import express from "express";
import * as SponsorController from "../controllers/sponsor.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, SponsorController.createSponsor);


router.delete("/:id", protect, SponsorController.deleteSponsor);

router.get("/", SponsorController.getSponsors);
router.put("/:id",  SponsorController.updateSponsor);
router.get("/stats", SponsorController.getSponsorStats);

router.post('/:id/view', SponsorController.trackView);
router.post('/:id/click', SponsorController.trackClick);

export default router;
