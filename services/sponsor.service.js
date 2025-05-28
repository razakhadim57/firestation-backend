import Sponsor from "../models/Sponsor.js";

export const getSponsors = async (filter = {}) => {
  return await Sponsor.find(filter);
};

export const createSponsor = async (data) => {
  return await Sponsor.create(data);
};

export const updateSponsor = async (id, data) => {
  return await Sponsor.findByIdAndUpdate(id, data, { new: true });
};

export const getSponsorStats = async () => {
  const sponsors = await Sponsor.find({}, "name stats");
  return sponsors.map(s => ({ name: s.name, ...s.stats }));
};

export const trackSponsorView = async (id) => {
    try {
      return await Sponsor.findByIdAndUpdate(
        id,
        { $inc: { 'stats.views': 1 } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error tracking view: ${error.message}`);
    }
  }

export const trackSponsorClick = async (id) => {
    try {
      return await Sponsor.findByIdAndUpdate(
        id,
        { $inc: { 'stats.clicks': 1 } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error tracking click: ${error.message}`);
    }
  }



