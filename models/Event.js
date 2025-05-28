import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  fireStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FireStation',
    required: true
  },
  title: {
    default: { type: String, required: true },
    en: String
  },
  description: {
    default: { type: String, required: true },
    en: String
  },
  date: { type: Date, required: true },
  time: { type: String },
  visible: { type: Boolean, default: true }
}, {
  timestamps: true
});

EventSchema.index({ fireStationId: 1, date: 1 });

export default mongoose.model('Event', EventSchema);
