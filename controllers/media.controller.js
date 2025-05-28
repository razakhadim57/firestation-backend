import * as mediaService from '../services/media.service.js';
import { uploadObject, deleteAssetByUrl } from '../config/storage.js';


export const uploadMedia = async (req, res, next) => {
  try {
    const file = req.file;
    const { fireStationId, type } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    if (!fireStationId || !type) {
      return res.status(400).json({ success: false, message: 'Missing fireStationId or type' });
    }

    const result = await uploadObject(file.buffer, file.originalname, file.mimetype);
    const url = result.location;

    const media = await mediaService.createMedia({
      fireStationId,
      type,
      url,
      label: file.originalname,
      uploadedBy: req.user._id
    });

    res.status(201).json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
};


export const getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.station) filter.fireStationId = req.query.station;
    const items = await mediaService.getAllMedia(filter);
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};


export const remove = async (req, res, next) => {
  try {
    const media = await mediaService.deleteMedia(req?.params?.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }
    await deleteAssetByUrl(media.url);
    res.json({ success: true, message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
};
