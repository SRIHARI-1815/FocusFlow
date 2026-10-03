const mongoose = require('mongoose')

const savingsGoalSchema = new mongoose.Schema(
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

    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    currentAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['In Progress', 'Completed'],
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  'SavingsGoal',
  savingsGoalSchema
)