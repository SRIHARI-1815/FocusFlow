const HabitLog = require('../models/HabitLog')
const Habit = require('../models/Habit')

// Create or update today's habit log
const markHabit = async (req, res) => {
  try {
    const {
      habitId,
      date,
      completed,
      completedMinutes,
    } = req.body

    if (!habitId || !date) {
      return res.status(400).json({
        message: 'Habit ID and date are required',
      })
    }

    // Make sure the habit belongs to the logged-in user
    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user.userId,
    })

    if (!habit) {
      return res.status(404).json({
        message: 'Habit not found',
      })
    }

    // Check if a log already exists for this habit and date
    let habitLog = await HabitLog.findOne({
      habitId,
      date,
    })

    if (habitLog) {
      habitLog.completed =
        completed ?? habitLog.completed

      habitLog.completedMinutes =
        completedMinutes ??
        habitLog.completedMinutes

      await habitLog.save()

      return res.json({
        message: 'Habit log updated successfully',
        habitLog,
      })
    }

    // Create new log
    habitLog = await HabitLog.create({
      userId: req.user.userId,
      habitId,
      date,
      completed: completed ?? false,
      completedMinutes: completedMinutes ?? 0,
    })

    res.status(201).json({
      message: 'Habit marked successfully',
      habitLog,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to mark habit',
      error: error.message,
    })
  }
}

// Get habit logs
const getHabitLogs = async (req, res) => {
  try {
    const logs = await HabitLog.find({
      userId: req.user.userId,
    })
      .populate('habitId', 'name category targetMinutes')
      .sort({ date: -1 })

    res.json({
      logs,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch habit logs',
      error: error.message,
    })
  }
}

// Get logs for one habit
const getLogsForHabit = async (req, res) => {
  try {
    // Make sure the habit belongs to the logged-in user
    const habit = await Habit.findOne({
      _id: req.params.habitId,
      userId: req.user.userId,
    })

    if (!habit) {
      return res.status(404).json({
        message: 'Habit not found',
      })
    }

    const logs = await HabitLog.find({
      habitId: req.params.habitId,
      userId: req.user.userId,
    }).sort({ date: -1 })

    res.json({
      logs,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch habit logs',
      error: error.message,
    })
  }
}

// Delete a habit log
const deleteHabitLog = async (req, res) => {
  try {
    const habitLog = await HabitLog.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!habitLog) {
      return res.status(404).json({
        message: 'Habit log not found',
      })
    }

    await habitLog.deleteOne()

    res.json({
      message: 'Habit log deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete habit log',
      error: error.message,
    })
  }
}

module.exports = {
  markHabit,
  getHabitLogs,
  getLogsForHabit,
  deleteHabitLog,
}