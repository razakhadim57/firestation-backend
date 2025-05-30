import mongoose from "mongoose";
const { Schema } = mongoose;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: false,
  },
  banner: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: false,
  },
  category: [
    {
      type: String,
      required: true,
    }
  ],
  fireStation: {  // <-- changed here
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FireStation',
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    formattedAddress: String,
    city: String,
    plz: String,
    country: String,
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
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
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: true,
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MyVideos',
    required: false,
  },
  isVideoJob: {
    type: Boolean,
    default: false,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobApplications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: false,
    },
  ],
}, {
  timestamps: true,
  collection: 'jobs',
});
jobSchema.index({ 'address': '2dsphere' });

export default mongoose.model("Job", jobSchema);
