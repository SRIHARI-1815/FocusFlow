const express = require('express')

const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/moneyController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createTransaction)

router.get('/', protect, getTransactions)

router.get('/:id', protect, getTransaction)

router.put('/:id', protect, updateTransaction)

router.delete('/:id', protect, deleteTransaction)

module.exports = router