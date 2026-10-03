const express = require('express')

const {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit,
} = require('../controllers/habitController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createHabit)

router.get('/', protect, getHabits)

router.get('/:id', protect, getHabit)

router.put('/:id', protect, updateHabit)

router.delete('/:id', protect, deleteHabit)

module.exports = router