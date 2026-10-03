const express = require('express')

const {
  createTimeBlock,
  getTimeBlocks,
  getTimeBlocksByDate,
  getTimeBlock,
  updateTimeBlock,
  deleteTimeBlock,
} = require('../controllers/plannerController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createTimeBlock)
router.get('/', protect, getTimeBlocks)
router.get('/date/:date', protect, getTimeBlocksByDate)
router.get('/:id', protect, getTimeBlock)
router.put('/:id', protect, updateTimeBlock)
router.delete('/:id', protect, deleteTimeBlock)

module.exports = router