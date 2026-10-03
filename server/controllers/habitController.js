const Habit = require('../models/Habit')
const { calculateStreak } = require('../utils/habitStats')

// Create habit
const createHabit = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      targetMinutes,
      frequency,
      startDate,
    } = req.body

    if (!name || !category || !targetMinutes) {
      return res.status(400).json({
        message:
          'Name, category and target minutes are required',
      })
    }

    const habit = await Habit.create({
      userId: req.user.userId,
      name,
      description,
      category,
      targetMinutes,
      frequency,
      startDate,
    })

    res.status(201).json({
      message: 'Habit created successfully',
      habit,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create habit',
      error: error.message,
    })
  }
}

// Get all habits
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 })

    const habitsWithStats = await Promise.all(
      habits.map(async (habit) => {
        const streak = await calculateStreak(
          habit._id,
          req.user.userId
        )

        return {
          ...habit.toObject(),
          streak,
        }
      })
    )

    res.json({
      habits: habitsWithStats,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch habits',
      error: error.message,
    })
  }
}

// Get one habit
const getHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!habit) {
      return res.status(404).json({
        message: 'Habit not found',
      })
    }

    res.json({
      habit,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch habit',
      error: error.message,
    })
  }
}

// Update habit
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!habit) {
      return res.status(404).json({
        message: 'Habit not found',
      })
    }

    const {
      name,
      description,
      category,
      targetMinutes,
      frequency,
      startDate,
      isActive,
    } = req.body

    habit.name = name ?? habit.name
    habit.description =
      description ?? habit.description
    habit.category = category ?? habit.category
    habit.targetMinutes =
      targetMinutes ?? habit.targetMinutes
    habit.frequency =
      frequency ?? habit.frequency
    habit.startDate =
      startDate ?? habit.startDate
    habit.isActive =
      isActive ?? habit.isActive

    await habit.save()

    res.json({
      message: 'Habit updated successfully',
      habit,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update habit',
      error: error.message,
    })
  }
}

// Delete habit
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!habit) {
      return res.status(404).json({
        message: 'Habit not found',
      })
    }

    await habit.deleteOne()

    res.json({
      message: 'Habit deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete habit',
      error: error.message,
    })
  }
}

module.exports = {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit,
}