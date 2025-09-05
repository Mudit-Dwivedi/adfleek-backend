const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  prompt: {
    type: String,
    required: true
  },
  aspectRatio: {
    type: String,
    default: "1:1"
  },
  variations: {
    type: Number,
    default: 1
  },
  uploadedImages: [{
    type: String // base64 encoded images or URLs
  }],
  isRefinement: {
    type: Boolean,
    default: false
  },
  isRegeneration: {
    type: Boolean,
    default: false
  },
  refinedFrom: {
    type: String, // base64 encoded image or URL
    default: null
  },
  imageUrls: [{
    type: String // base64 encoded images or URLs
  }],
  feedback: {
    type: Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

const chatSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to a User model if you have one
  },
  title: {
    type: String,
    required: true
  },
  messages: [messageSchema]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

// Add index for better query performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ 'messages.createdAt': -1 });

module.exports = mongoose.model('Chat', chatSchema);