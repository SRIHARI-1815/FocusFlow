const express = require('express')

const {
  createTask,
  getTasks,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createTask)
router.get('/', protect, getTasks)
router.get('/project/:projectId', protect, getProjectTasks)
router.get('/:id', protect, getTask)
router.put('/:id', protect, updateTask)
router.delete('/:id', protect, deleteTask)

module.exports = router