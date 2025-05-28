import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  link: { type: String },
  videoUrl: { type: String },
  socialLinks: {
    website: { type: String },
    google: { type: String },
    facebook: { type: String },
    instagram: { type: String }
  },
  stats: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Sponsor", sponsorSchema);
