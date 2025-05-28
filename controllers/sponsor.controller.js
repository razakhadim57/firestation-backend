import { FireStation } from "../models/FireStation.js";
import Sponsor from "../models/Sponsor.js";
import User from "../models/User.js";
import * as SponsorService from "../services/sponsor.service.js";



export const getSponsors = async (req, res) => {
  try {
    const sponsors = await SponsorService.getSponsors(req.query);
    res.json(sponsors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSponsor = async (req, res) => {
  try {
    const newSponsor = await SponsorService.createSponsor({
      ...req.body,
      createdBy: req.user._id
    });

    const {stationsId} = req?.body;

    if (stationsId) {
     await FireStation.findByIdAndUpdate(
      req?.body?.stationsId,
      { $push: { sponsorSlots: newSponsor._id } },
      { new: true }
    );
    }

    if (req?.user?._id) {
        await User.findByIdAndUpdate(
        req.user._id,
        { $push: { sponsorIds: newSponsor._id } },
        { new: true }
        );
    }



    res.status(201).json(newSponsor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSponsor = async (req, res) => {
  try {
    const updated = await SponsorService.updateSponsor(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Sponsor not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSponsorStats = async (req, res) => {
  try {
    const stats = await SponsorService.getSponsorStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) return res.status(404).json({ error: "Sponsor not found" });
    res.json({ message: "Sponsor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const trackView = async (req, res) => {

    try {
      await SponsorService.trackSponsorView(req.params.id);
      res.status(200).json({
        success: true,
        message: 'View tracked successfully'
      });
    } catch (error) {
      next(error);
    }
  }


export const trackClick = async (req, res) => {

    try {
      await SponsorService.trackSponsorClick(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Click tracked successfully'
      });
    } catch (error) {
      next(error);
    }
  }


