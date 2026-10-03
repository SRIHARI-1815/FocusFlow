const Transaction = require('../models/Transaction')

// Create transaction
const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      description,
      date,
    } = req.body

    if (!type || amount === undefined || !category) {
      return res.status(400).json({
        message: 'Type, amount and category are required',
      })
    }

    const transaction = await Transaction.create({
      userId: req.user.userId,
      type,
      amount,
      category,
      description,
      date,
    })

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create transaction',
      error: error.message,
    })
  }
}

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.userId,
    }).sort({ date: -1 })

    res.json({
      transactions,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch transactions',
      error: error.message,
    })
  }
}

// Get one transaction
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      })
    }

    res.json({
      transaction,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch transaction',
      error: error.message,
    })
  }
}

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      })
    }

    const {
      type,
      amount,
      category,
      description,
      date,
    } = req.body

    transaction.type = type ?? transaction.type
    transaction.amount = amount ?? transaction.amount
    transaction.category = category ?? transaction.category
    transaction.description =
      description ?? transaction.description
    transaction.date = date ?? transaction.date

    await transaction.save()

    res.json({
      message: 'Transaction updated successfully',
      transaction,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update transaction',
      error: error.message,
    })
  }
}

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      })
    }

    await transaction.deleteOne()

    res.json({
      message: 'Transaction deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete transaction',
      error: error.message,
    })
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
}