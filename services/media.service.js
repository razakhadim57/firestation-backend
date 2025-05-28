import Media from '../models/Media.js';


export const createMedia = async ({ fireStationId, type, url, label, uploadedBy }) => {
  return await Media.create({ fireStationId, type, url, label, uploadedBy });
};


export const getAllMedia = async (filter = {}) => {
  return await Media.find(filter).sort({ createdAt: -1 });
};


export const getMediaByStation = async (stationId) => {
  return await Media.find({ fireStationId: stationId }).sort({ createdAt: -1 });
};


export const deleteMedia = async (id) => {
  return await Media.findByIdAndDelete(id);
};
