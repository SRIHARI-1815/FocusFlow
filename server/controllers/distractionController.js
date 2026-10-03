const Distraction = require('../models/Distraction')

// Create distraction
const createDistraction = async (req, res) => {
  try {
    const {
      appName,
      category,
      durationMinutes,
      date,
      description,
    } = req.body

    if (
      !appName ||
      !category ||
      !durationMinutes
    ) {
      return res.status(400).json({
        message:
          'App name, category and duration are required',
      })
    }

    const distraction =
      await Distraction.create({
        userId: req.user.userId,
        appName,
        category,
        durationMinutes,
        date,
        description,
      })

    res.status(201).json({
      message:
        'Distraction created successfully',
      distraction,
    })
  } catch (error) {
    res.status(500).json({
      message:
        'Failed to create distraction',
      error: error.message,
    })
  }
}

// Get all distractions
const getDistractions = async (req, res) => {
  try {
    const distractions =
      await Distraction.find({
        userId: req.user.userId,
      }).sort({ date: -1 })

    res.json({
      distractions,
    })
  } catch (error) {
    res.status(500).json({
      message:
        'Failed to fetch distractions',
      error: error.message,
    })
  }
}

// Get one distraction
const getDistraction = async (req, res) => {
  try {
    const distraction =
      await Distraction.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      })

    if (!distraction) {
      return res.status(404).json({
        message: 'Distraction not found',
      })
    }

    res.json({
      distraction,
    })
  } catch (error) {
    res.status(500).json({
      message:
        'Failed to fetch distraction',
      error: error.message,
    })
  }
}

// Update distraction
const updateDistraction = async (req, res) => {
  try {
    const distraction =
      await Distraction.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      })

    if (!distraction) {
      return res.status(404).json({
        message: 'Distraction not found',
      })
    }

    const {
      appName,
      category,
      durationMinutes,
      date,
      description,
    } = req.body

    distraction.appName =
      appName ?? distraction.appName

    distraction.category =
      category ?? distraction.category

    distraction.durationMinutes =
      durationMinutes ??
      distraction.durationMinutes

    distraction.date =
      date ?? distraction.date

    distraction.description =
      description ?? distraction.description

    await distraction.save()

    res.json({
      message:
        'Distraction updated successfully',
      distraction,
    })
  } catch (error) {
    res.status(500).json({
      message:
        'Failed to update distraction',
      error: error.message,
    })
  }
}

// Delete distraction
const deleteDistraction = async (req, res) => {
  try {
    const distraction =
      await Distraction.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      })

    if (!distraction) {
      return res.status(404).json({
        message: 'Distraction not found',
      })
    }

    await distraction.deleteOne()

    res.json({
      message:
        'Distraction deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message:
        'Failed to delete distraction',
      error: error.message,
    })
  }
}

module.exports = {
  createDistraction,
  getDistractions,
  getDistraction,
  updateDistraction,
  deleteDistraction,
}