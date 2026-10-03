const express = require('express')

const {
  createSavingsGoal,
  getSavingsGoals,
  getSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} = require('../controllers/savingsGoalController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createSavingsGoal)

router.get('/', protect, getSavingsGoals)

router.get('/:id', protect, getSavingsGoal)

router.put('/:id', protect, updateSavingsGoal)

router.delete('/:id', protect, deleteSavingsGoal)

module.exports = router