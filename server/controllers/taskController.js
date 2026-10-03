const Task = require('../models/Task')

console.log('TASK MODEL:', Task)
console.log('TASK CREATE:', typeof Task.create)

const Project = require('../models/Project')

// Create task
const createTask = async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      priority,
      estimatedMinutes,
      deadline,
      status,
    } = req.body

    if (
      !projectId ||
      !title ||
      estimatedMinutes === undefined ||
      !deadline
    ) {
      return res.status(400).json({
        message:
          'Project ID, title, estimated minutes and deadline are required',
      })
    }

    // Check whether project belongs to logged-in user
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    const task = await Task.create({
      userId: req.user.userId,
      projectId,
      title,
      description,
      priority,
      estimatedMinutes,
      deadline,
      status,
    })

    res.status(201).json({
      message: 'Task created successfully',
      task,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create task',
      error: error.message,
    })
  }
}

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.userId,
    })
      .populate('projectId', 'name status')
      .sort({ deadline: 1 })

    res.json({
      tasks,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch tasks',
      error: error.message,
    })
  }
}

// Get tasks for one project
const getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    const tasks = await Task.find({
      projectId: req.params.projectId,
      userId: req.user.userId,
    }).sort({ deadline: 1 })

    res.json({
      tasks,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch project tasks',
      error: error.message,
    })
  }
}

// Get one task
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).populate('projectId', 'name status')

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    res.json({
      task,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch task',
      error: error.message,
    })
  }
}

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    const {
      projectId,
      title,
      description,
      priority,
      estimatedMinutes,
      deadline,
      status,
    } = req.body

    if (projectId && projectId !== task.projectId.toString()) {
      const project = await Project.findOne({
        _id: projectId,
        userId: req.user.userId,
      })

      if (!project) {
        return res.status(404).json({
          message: 'Project not found',
        })
      }

      task.projectId = projectId
    }

    task.title = title ?? task.title
    task.description =
      description ?? task.description
    task.priority =
      priority ?? task.priority
    task.estimatedMinutes =
      estimatedMinutes ?? task.estimatedMinutes
    task.deadline =
      deadline ?? task.deadline
    task.status =
      status ?? task.status

    await task.save()

    res.json({
      message: 'Task updated successfully',
      task,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update task',
      error: error.message,
    })
  }
}

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    await task.deleteOne()

    res.json({
      message: 'Task deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete task',
      error: error.message,
    })
  }
}

module.exports = {
  createTask,
  getTasks,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
}