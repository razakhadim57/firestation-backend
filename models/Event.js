import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: false,
    unique: true
  },
  description: {
    type: String,
    required: false,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: false
  },
  isVideoEvent: {
    type: Boolean,
    default: false,
    required: false,
  },
  isApproved: {
    type: Boolean,
    default: true,
    required: true,
  },
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "View",
    },
  ],
  viewCount: {
    type: Number,
    default: 0,
    required: false,
  },
  expired: {
    type: Boolean,
    default: false
  },
  fireStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FireStation',
    required: true
  },
}, {
  timestamps: true,
  collection: 'events'
});

export default mongoose.model("Event", eventSchema)
