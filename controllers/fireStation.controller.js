import User from '../models/User.js';
import { getFireStations, createFireStation,getFireStationById, updateFireStation, deleteFireStation  } from '../services/fireStation.service.js';

export const create = async (req, res, next) => {
    try {

        console.log("Creating fire station with data:", req.body);
      const station = await createFireStation(req.body);

    await User.findByIdAndUpdate(
      req?.user?._id,
      { $push: { stationIds: station?._id } },
      { new: true }
    );


      res.status(201).json({
        success: true,
        data: station
      });
    } catch (error) {
      next(error);
    }
  }


  export const getAll = async (req, res, next) => { 
    try {
      const stations = await getFireStations(req.query);
      res.status(200).json({
        success: true,
        count: stations.length,
        data: stations
      });
    } catch (error) {
      next(error);
    }
  }
  export const getById = async (req, res, next) => {
    try {
      const station = await getFireStationById(req.params.id);
      if (!station) {
        return res.status(404).json({
          success: false,
          message: 'Fire station not found'
        });
      }
      res.status(200).json({
        success: true,
        data: station
      });
    } catch (error) {
      next(error);
    }
  }

  export const update = async (req, res, next) => {
    try {

    console.log("Updating fire station with ID:", req.params.id);
      const station = await updateFireStation(
        req.params.id,
        req.body
      );



      if (!station) {
        return res.status(404).json({
          success: false,
          message: 'Fire station not found'
        });
      }
      res.status(200).json({
        success: true,
        data: station
      });
    } catch (error) {
      next(error);
    }
  }

  export const deleteFire = async (req, res, next) => {
    try {
      const station = await deleteFireStation(req.params.id);
      if (!station) {
        return res.status(404).json({
          success: false,
          message: 'Fire station not found'
        });
      }
      res.status(201).json({
        success: true,
        data: {message: 'Fire station deleted successfully'}
      });
    } catch (error) {
      next(error);
    }
  }

