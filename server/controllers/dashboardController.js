const Transaction = require('../models/Transaction')
const Habit = require('../models/Habit')
const HabitLog = require('../models/HabitLog')
const Distraction = require('../models/Distraction')
const Project = require('../models/Project')
const Task = require('../models/Task')

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId

    const transactions = await Transaction.find({
      userId,
    })

    const habits = await Habit.find({
      userId,
      isActive: true,
    })

    const habitLogs = await HabitLog.find({
      userId,
    })

    const distractions = await Distraction.find({
      userId,
    })

    const projects = await Project.find({
      userId,
    })

    const tasks = await Task.find({
      userId,
    })

    const totalIncome = transactions
      .filter(
        (transaction) =>
          transaction.type === 'income'
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      )

    const totalExpenses = transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense'
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount),
        0
      )

    const balance =
      totalIncome - totalExpenses

    const today = new Date()

    const todayString = today
      .toISOString()
      .split('T')[0]

    const todayDistractions =
      distractions.filter((distraction) => {
        const dateString = new Date(
          distraction.date
        )
          .toISOString()
          .split('T')[0]

        return dateString === todayString
      })

    const todayDistractionMinutes =
      todayDistractions.reduce(
        (sum, distraction) =>
          sum +
          Number(
            distraction.durationMinutes || 0
          ),
        0
      )

    const todayHabitLogs =
      habitLogs.filter((log) => {
        const dateString = new Date(log.date)
          .toISOString()
          .split('T')[0]

        return dateString === todayString
      })

    const completedHabits =
      todayHabitLogs.filter(
        (log) => log.completed
      ).length

    const habitCompletion =
      habits.length > 0
        ? Math.round(
            (completedHabits /
              habits.length) *
              100
          )
        : 0

    const activeProjects =
      projects.filter(
        (project) =>
          project.status === 'In Progress'
      ).length

    const pendingTasks =
      tasks.filter(
        (task) =>
          task.status !== 'Completed'
      ).length

    const completedTasks =
      tasks.filter(
        (task) =>
          task.status === 'Completed'
      ).length

    const focusMinutes =
      todayHabitLogs.reduce(
        (sum, log) =>
          sum +
          Number(log.completedMinutes || 0),
        0
      )

    const totalTrackedMinutes =
      focusMinutes +
      todayDistractionMinutes

    const focusScore =
      totalTrackedMinutes > 0
        ? Math.round(
            (focusMinutes /
              totalTrackedMinutes) *
              100
          )
        : 0

    res.json({
      summary: {
        balance,
        totalIncome,
        totalExpenses,
        todayDistractionMinutes,
        completedHabits,
        totalHabits: habits.length,
        habitCompletion,
        activeProjects,
        pendingTasks,
        completedTasks,
        focusMinutes,
        focusScore,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch dashboard data',
      error: error.message,
    })
  }
}

module.exports = {
  getDashboard,
}