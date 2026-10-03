const Project = require('../models/Project')

// Create project
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      totalHours,
      deadline,
      status,
    } = req.body

    if (!name || totalHours === undefined || !deadline) {
      return res.status(400).json({
        message: 'Name, total hours and deadline are required',
      })
    }

    const project = await Project.create({
      userId: req.user.userId,
      name,
      description,
      totalHours,
      deadline,
      status,
    })

    res.status(201).json({
      message: 'Project created successfully',
      project,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create project',
      error: error.message,
    })
  }
}

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 })

    res.json({
      projects,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch projects',
      error: error.message,
    })
  }
}

// Get one project
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    res.json({
      project,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch project',
      error: error.message,
    })
  }
}

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    const {
      name,
      description,
      totalHours,
      deadline,
      status,
    } = req.body

    project.name = name ?? project.name
    project.description =
      description ?? project.description
    project.totalHours =
      totalHours ?? project.totalHours
    project.deadline =
      deadline ?? project.deadline
    project.status =
      status ?? project.status

    await project.save()

    res.json({
      message: 'Project updated successfully',
      project,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update project',
      error: error.message,
    })
  }
}

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    await project.deleteOne()

    res.json({
      message: 'Project deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete project',
      error: error.message,
    })
  }
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
}