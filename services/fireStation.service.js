import { FireStation } from "../models/FireStation.js";


export const createFireStation = async (fireStationData) => {
    try {

    console.log("Creating fire station with data:", fireStationData);
      const newStation = new FireStation(fireStationData);

      console.log("New fire station object created:", newStation);

      return await newStation.save();
    } catch (error) {
      throw new Error(`Error creating fire station: ${error.message}`);
    }
  }

export const getFireStations = async (filters = {}) => {
    try {
      const query = {};
      if (filters.name) query.name = new RegExp(filters.name, 'i');
      if (filters.region) query.region = filters.region;
      
      return await FireStation.find(query);
    } catch (error) {
      throw new Error(`Error fetching fire stations: ${error.message}`);
    }
  }

export const getFireStationById = async (id) => {
    try {
      return await FireStation.findById(id);
    } catch (error) {
      throw new Error(`Error finding fire station: ${error.message}`);
    }
  }

export const updateFireStation = async (id, updateData) => {
    try {


        console.log("Updating fire station with ID:", id);
        console.log("Update data:", updateData);

        const updatedStation = await FireStation.findByIdAndUpdate(id, updateData, { new: true});
console.log("Updated fire station object:", updatedStation);
      return updatedStation;
    } catch (error) {
      throw new Error(`Error updating fire station: ${error.message}`);
    }
  }

export const deleteFireStation = async (id) => {
    try {
      return await FireStation.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting fire station: ${error.message}`);
    }
  }

