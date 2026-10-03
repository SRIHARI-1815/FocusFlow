const TimeBlock = require('../models/TimeBlock')
const Project = require('../models/Project')

// Create time block
const createTimeBlock = async (req, res) => {
  try {
    const {
      title,
      type,
      projectId,
      date,
      startTime,
      endTime,
      status,
      description,
    } = req.body

    if (
      !title ||
      !type ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message:
          'Title, type, date, start time and end time are required',
      })
    }

    // If a project is selected, verify ownership
    if (projectId) {
      const project = await Project.findOne({
        _id: projectId,
        userId: req.user.userId,
      })

      if (!project) {
        return res.status(404).json({
          message: 'Project not found',
        })
      }
    }

    const timeBlock = await TimeBlock.create({
      userId: req.user.userId,
      title,
      type,
      projectId: projectId || null,
      date,
      startTime,
      endTime,
      status,
      description,
    })

    res.status(201).json({
      message: 'Time block created successfully',
      timeBlock,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create time block',
      error: error.message,
    })
  }
}

// Get all time blocks
const getTimeBlocks = async (req, res) => {
  try {
    const timeBlocks = await TimeBlock.find({
      userId: req.user.userId,
    })
      .populate('projectId', 'name')
      .sort({
        date: 1,
        startTime: 1,
      })

    res.json({
      timeBlocks,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch time blocks',
      error: error.message,
    })
  }
}

// Get time blocks for a specific date
const getTimeBlocksByDate = async (req, res) => {
  try {
    const timeBlocks = await TimeBlock.find({
      userId: req.user.userId,
      date: req.params.date,
    })
      .populate('projectId', 'name')
      .sort({
        startTime: 1,
      })

    res.json({
      timeBlocks,
    })
  } catch (error) {
    res.status(500).json({
      message:
        'Failed to fetch time blocks for date',
      error: error.message,
    })
  }
}

// Get one time block
const getTimeBlock = async (req, res) => {
  try {
    const timeBlock = await TimeBlock.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).populate('projectId', 'name')

    if (!timeBlock) {
      return res.status(404).json({
        message: 'Time block not found',
      })
    }

    res.json({
      timeBlock,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch time block',
      error: error.message,
    })
  }
}

// Update time block
const updateTimeBlock = async (req, res) => {
  try {
    const timeBlock = await TimeBlock.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!timeBlock) {
      return res.status(404).json({
        message: 'Time block not found',
      })
    }

    const {
      title,
      type,
      projectId,
      date,
      startTime,
      endTime,
      status,
      description,
    } = req.body

    if (projectId) {
      const project = await Project.findOne({
        _id: projectId,
        userId: req.user.userId,
      })

      if (!project) {
        return res.status(404).json({
          message: 'Project not found',
        })
      }

      timeBlock.projectId = projectId
    }

    if (projectId === null) {
      timeBlock.projectId = null
    }

    timeBlock.title = title ?? timeBlock.title
    timeBlock.type = type ?? timeBlock.type
    timeBlock.date = date ?? timeBlock.date
    timeBlock.startTime =
      startTime ?? timeBlock.startTime
    timeBlock.endTime =
      endTime ?? timeBlock.endTime
    timeBlock.status =
      status ?? timeBlock.status
    timeBlock.description =
      description ?? timeBlock.description

    await timeBlock.save()

    res.json({
      message: 'Time block updated successfully',
      timeBlock,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update time block',
      error: error.message,
    })
  }
}

// Delete time block
const deleteTimeBlock = async (req, res) => {
  try {
    const timeBlock = await TimeBlock.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!timeBlock) {
      return res.status(404).json({
        message: 'Time block not found',
      })
    }

    await timeBlock.deleteOne()

    res.json({
      message: 'Time block deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete time block',
      error: error.message,
    })
  }
}

module.exports = {
  createTimeBlock,
  getTimeBlocks,
  getTimeBlocksByDate,
  getTimeBlock,
  updateTimeBlock,
  deleteTimeBlock,
}