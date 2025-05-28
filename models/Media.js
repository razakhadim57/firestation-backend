import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  fireStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FireStation',
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'pdf', 'video'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

MediaSchema.index({ fireStationId: 1 });

export default mongoose.model('Media', MediaSchema);
