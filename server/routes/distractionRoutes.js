const express = require('express')

const {
  createDistraction,
  getDistractions,
  getDistraction,
  updateDistraction,
  deleteDistraction,
} = require('../controllers/distractionController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createDistraction)

router.get('/', protect, getDistractions)

router.get('/:id', protect, getDistraction)

router.put('/:id', protect, updateDistraction)

router.delete('/:id', protect, deleteDistraction)

module.exports = router