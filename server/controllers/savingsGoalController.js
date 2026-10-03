const SavingsGoal = require('../models/SavingsGoal')

// Create savings goal
const createSavingsGoal = async (req, res) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      deadline,
      status,
    } = req.body

    const savingsGoal = await SavingsGoal.create({
      userId: req.user.userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      status: status || 'In Progress',
    })

    res.status(201).json({
      message: 'Savings goal created successfully',
      savingsGoal,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create savings goal',
      error: error.message,
    })
  }
}

// Get all savings goals
const getSavingsGoals = async (req, res) => {
  try {
    const savingsGoals = await SavingsGoal.find({
      userId: req.user.userId,
    }).sort({ deadline: 1 })

    res.json({
      savingsGoals,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch savings goals',
      error: error.message,
    })
  }
}

// Get one savings goal
const getSavingsGoal = async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!savingsGoal) {
      return res.status(404).json({
        message: 'Savings goal not found',
      })
    }

    res.json({
      savingsGoal,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch savings goal',
      error: error.message,
    })
  }
}

// Update savings goal
const updateSavingsGoal = async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!savingsGoal) {
      return res.status(404).json({
        message: 'Savings goal not found',
      })
    }

    res.json({
      message: 'Savings goal updated successfully',
      savingsGoal,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update savings goal',
      error: error.message,
    })
  }
}

// Delete savings goal
const deleteSavingsGoal = async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!savingsGoal) {
      return res.status(404).json({
        message: 'Savings goal not found',
      })
    }

    res.json({
      message: 'Savings goal deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete savings goal',
      error: error.message,
    })
  }
}

module.exports = {
  createSavingsGoal,
  getSavingsGoals,
  getSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
}