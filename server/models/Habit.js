const mongoose = require('mongoose')

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    targetMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      required: true,
      default: 'daily',
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Habit', habitSchema)