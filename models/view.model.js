import mongoose from "mongoose";
const { Schema } = mongoose;

const viewSchema = new Schema(
    {
        modelType: {
            type: String,
            enum: ["Job", "Company", "Video", "Event", "Ad", "Reel", "Social", "Keyword"],
            required: true,
        },
        modelId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "modelType",
        },
        socialType: {
            type: String,
            enum: ["INSTAGRAM", "TWITTER", "LINKEDIN", "FACEBOOK", "TIKTOK", "WHATSAPP", "EMAIL", "Phone", "Location", "Website"],
            required: false,
        },
        date: {
            type: Date,
            required: false,
            default: Date.now,
        },
        viewCount: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    {
        timestamps: true,
        collection: "views",
    }
);

export default mongoose.model("View", viewSchema);
