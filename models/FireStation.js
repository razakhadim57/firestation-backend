import mongoose from 'mongoose';
import slugify from 'slugify';

const FireStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: false
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  region: {
    type: String,
    required: false,
    ref: 'Region'
  },
  description: {
    defaultText: { type: String, required: true },
    en: String
  },
  videoUrl: String,
  profileImageUrl: String,
  gallery: [String],
  downloads: [String],
  sponsorSlots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsor'
  }],
  // sponsorSlots: [{
  //   sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' },
  //   slotNumber: Number,
  //   customVideoUrl: String,
  //   customLink: String,
  //   isActive: { type: Boolean, default: true }
  // }],
  chatbotQuestionsAnswers: [{
    question: String,
    answer: String,
    isActive: { type: Boolean, default: true },
    order: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'disabled'],
    required: false
  },
  seo: {
    title: String,
    description: String
  }
}, { timestamps: true });

FireStationSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

FireStationSchema.index({ slug: 1});

export const FireStation = mongoose.model('FireStation', FireStationSchema);