const HabitLog = require('../models/HabitLog')

const calculateStreak = async (habitId, userId) => {
  const logs = await HabitLog.find({
    habitId,
    userId,
    completed: true,
  }).sort({ date: -1 })

  if (logs.length === 0) {
    return 0
  }

  const completedDates = new Set(
    logs.map((log) =>
      new Date(log.date).toISOString().split('T')[0]
    )
  )

  let streak = 0
  const currentDate = new Date()

  while (true) {
    const dateString = currentDate
      .toISOString()
      .split('T')[0]

    if (!completedDates.has(dateString)) {
      break
    }

    streak++

    currentDate.setDate(
      currentDate.getDate() - 1
    )
  }

  return streak
}

module.exports = {
  calculateStreak,
}