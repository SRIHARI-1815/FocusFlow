const express = require('express')

const {
  markHabit,
  getHabitLogs,
  getLogsForHabit,
  deleteHabitLog,
} = require('../controllers/habitLogController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

// Create or update a habit log
router.post('/', protect, markHabit)

// Get all habit logs
router.get('/', protect, getHabitLogs)

// Get logs for one habit
router.get('/habit/:habitId', protect, getLogsForHabit)

// Delete a habit log
router.delete('/:id', protect, deleteHabitLog)

module.exports = router