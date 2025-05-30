import mongoose from "mongoose";
const { Schema } = mongoose;

const myVideosSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
    },
    link: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    videoThumbnailBanner: {
      type: String,
    },
    description: {
      type: String,
    },
    vimeoLink: {
      type: String,
    },
    compressVideoLink: {
      type: String,
    },
    lineIndex: {
      type: Number,
      required: false,
    },
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "View",
      },
    ],
    viewCount: {
      type: Number,
      required: false,
    },
    fireStationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FireStation",
      required: false,
      index: true, //
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: false,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false,
    },
    isAd: {
      type: Boolean,
      default: false,
      required: false,
    },
    size: {
      type: Number,
    },
    mimetype: {
      type: String,
    },
    compressedThumbnail: {
      type: String,
    },
    key: {
      type: String,
    },
    status: {
      type: String,
      required: false,
    },
    tags: [{ type: String }],
    description: {
      type: String,
    },
    isReel: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: false,
    }, 
  },
  {
    timestamps: true,
    collection: "my_videos",
  }
);

export default mongoose.model("MyVideos", myVideosSchema);
