import { useEffect, useState } from 'react'
import {
  FiFolder,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiClock,
  FiCheckCircle,
  FiTarget,
  FiCalendar,
  FiList,
} from 'react-icons/fi'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Projects() {
  const { token } = useAuth()

  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    totalHours: '',
    deadline: '',
    status: 'Not Started',
  })

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    estimatedMinutes: '',
    deadline: '',
    status: 'Pending',
  })

  const [editingProjectId, setEditingProjectId] =
    useState(null)

  const [editingTaskId, setEditingTaskId] =
    useState(null)

  const [loading, setLoading] = useState(true)

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  // =========================================================
  // PROJECT DATA
  // =========================================================

  const fetchProjects = async () => {
    try {
      const response = await api.get(
        '/projects',
        authConfig
      )

      setProjects(response.data.projects)
    } catch (error) {
      console.error(
        'Failed to fetch projects',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchProjects()
    }
  }, [token])

  // =========================================================
  // FORM HANDLERS
  // =========================================================

  const handleProjectChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleTaskChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    })
  }

  const resetProjectForm = () => {
    setProjectForm({
      name: '',
      description: '',
      totalHours: '',
      deadline: '',
      status: 'Not Started',
    })

    setEditingProjectId(null)
  }

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      priority: 'Medium',
      estimatedMinutes: '',
      deadline: '',
      status: 'Pending',
    })

    setEditingTaskId(null)
  }

  // =========================================================
  // PROJECT CRUD
  // =========================================================

  const handleProjectSubmit = async (e) => {
    e.preventDefault()

    try {
      const projectData = {
        ...projectForm,
        totalHours: Number(projectForm.totalHours),
      }

      if (editingProjectId) {
        await api.put(
          `/projects/${editingProjectId}`,
          projectData,
          authConfig
        )
      } else {
        await api.post(
          '/projects',
          projectData,
          authConfig
        )
      }

      resetProjectForm()
      await fetchProjects()
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Failed to save project'
      )
    }
  }

  const handleEditProject = (project) => {
    setEditingProjectId(project._id)

    setProjectForm({
      name: project.name,
      description: project.description || '',
      totalHours: project.totalHours,
      deadline: project.deadline
        ? project.deadline.split('T')[0]
        : '',
      status: project.status,
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDeleteProject = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this project?'
      )
    ) {
      return
    }

    try {
      await api.delete(
        `/projects/${id}`,
        authConfig
      )

      if (selectedProject?._id === id) {
        setSelectedProject(null)
        setTasks([])
      }

      await fetchProjects()
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Failed to delete project'
      )
    }
  }

  // =========================================================
  // TASK CRUD
  // =========================================================

  const fetchTasks = async (projectId) => {
    try {
      const response = await api.get(
        `/tasks/project/${projectId}`,
        authConfig
      )

      setTasks(response.data.tasks)
    } catch (error) {
      console.error(
        'Failed to fetch tasks',
        error
      )

      setTasks([])
    }
  }

  const selectProject = async (project) => {
    setSelectedProject(project)
    resetTaskForm()

    await fetchTasks(project._id)

    setTimeout(() => {
      document
        .getElementById('task-section')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    }, 100)
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()

    if (!selectedProject) {
      return
    }

    try {
      const taskData = {
        projectId: selectedProject._id,
        ...taskForm,
        estimatedMinutes: Number(
          taskForm.estimatedMinutes
        ),
      }

      if (editingTaskId) {
        await api.put(
          `/tasks/${editingTaskId}`,
          taskData,
          authConfig
        )
      } else {
        await api.post(
          '/tasks',
          taskData,
          authConfig
        )
      }

      resetTaskForm()
      await fetchTasks(selectedProject._id)
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Failed to save task'
      )
    }
  }

  const handleEditTask = (task) => {
    setEditingTaskId(task._id)

    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      estimatedMinutes: task.estimatedMinutes,
      deadline: task.deadline
        ? task.deadline.split('T')[0]
        : '',
      status: task.status,
    })

    setTimeout(() => {
      document
        .getElementById('task-form')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
    }, 100)
  }

  const handleDeleteTask = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this task?'
      )
    ) {
      return
    }

    try {
      await api.delete(
        `/tasks/${id}`,
        authConfig
      )

      await fetchTasks(selectedProject._id)
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Failed to delete task'
      )
    }
  }

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalProjects = projects.length

  const activeProjects = projects.filter(
    (project) =>
      project.status === 'In Progress'
  ).length

  const completedProjects = projects.filter(
    (project) =>
      project.status === 'Completed'
  ).length

  const notStartedProjects =
    projects.filter(
      (project) =>
        project.status === 'Not Started'
    ).length

  const totalHours = projects.reduce(
    (sum, project) =>
      sum + Number(project.totalHours || 0),
    0
  )

  const completedTasks = tasks.filter(
    (task) =>
      task.status === 'Completed'
  ).length

  const pendingTasks = tasks.filter(
    (task) =>
      task.status !== 'Completed'
  ).length

  const taskMinutes = tasks.reduce(
    (sum, task) =>
      sum + Number(task.estimatedMinutes || 0),
    0
  )

  const taskCompletion =
    tasks.length > 0
      ? Math.round(
          (completedTasks / tasks.length) * 100
        )
      : 0

  // =========================================================
  // HELPERS
  // =========================================================

  const getProjectProgress = (status) => {
    if (status === 'Completed') {
      return 100
    }

    if (status === 'In Progress') {
      return 50
    }

    return 0
  }

  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const remaining = minutes % 60

    if (hours === 0) {
      return `${remaining} min`
    }

    if (remaining === 0) {
      return `${hours} hr`
    }

    return `${hours} hr ${remaining} min`
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="page-container">
      <div className="projects-page">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="projects-header">

          <div>
            <p className="projects-eyebrow">
              WORK MANAGEMENT
            </p>

            <h1>Projects</h1>

            <p>
              Organize projects, deadlines, tasks and
              allocated time in one place.
            </p>
          </div>

          <div className="projects-header-icon">
            <FiFolder size={21} />
          </div>

        </div>

        {/* =================================================
            SUMMARY
            ================================================= */}

        <div className="projects-summary-grid">

          <ProjectStat
            icon={<FiFolder />}
            label="Total Projects"
            value={totalProjects}
            detail="all projects"
            type="default"
          />

          <ProjectStat
            icon={<FiActivityIcon />}
            label="Active Projects"
            value={activeProjects}
            detail="currently in progress"
            type="active"
          />

          <ProjectStat
            icon={<FiCheckCircle />}
            label="Completed"
            value={completedProjects}
            detail="finished projects"
            type="success"
          />

          <ProjectStat
            icon={<FiClock />}
            label="Allocated Hours"
            value={totalHours}
            detail="planned project hours"
            type="target"
          />

        </div>

        {/* =================================================
            PROJECT OVERVIEW
            ================================================= */}

        <section className="projects-overview-card">

          <div className="projects-card-header">

            <div>
              <p className="projects-card-kicker">
                OVERVIEW
              </p>

              <h2>Project Status</h2>

              <p>
                Current distribution of your projects.
              </p>
            </div>

          </div>

          <div className="project-status-grid">

            <ProjectStatus
              label="Not Started"
              value={notStartedProjects}
              percentage={
                totalProjects > 0
                  ? Math.round(
                      (notStartedProjects /
                        totalProjects) *
                        100
                    )
                  : 0
              }
              type="neutral"
            />

            <ProjectStatus
              label="In Progress"
              value={activeProjects}
              percentage={
                totalProjects > 0
                  ? Math.round(
                      (activeProjects /
                        totalProjects) *
                        100
                    )
                  : 0
              }
              type="active"
            />

            <ProjectStatus
              label="Completed"
              value={completedProjects}
              percentage={
                totalProjects > 0
                  ? Math.round(
                      (completedProjects /
                        totalProjects) *
                        100
                    )
                  : 0
              }
              type="completed"
            />

          </div>

        </section>

        {/* =================================================
            PROJECT FORM
            ================================================= */}

        <section className="projects-card">

          <div className="projects-card-header">

            <div>
              <p className="projects-card-kicker">
                PROJECT SETUP
              </p>

              <h2>
                {editingProjectId
                  ? 'Edit Project'
                  : 'Create New Project'}
              </h2>

              <p>
                Define the project, available time and
                deadline.
              </p>
            </div>

            {editingProjectId && (
              <button
                type="button"
                className="projects-icon-button"
                onClick={resetProjectForm}
                title="Cancel edit"
              >
                <FiX size={17} />
              </button>
            )}

          </div>

          <form onSubmit={handleProjectSubmit}>

            <div className="projects-form-grid">

              <div className="projects-field project-name-field">
                <label>Project Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="MERN Mini Project"
                  value={projectForm.name}
                  onChange={handleProjectChange}
                  required
                />
              </div>

              <div className="projects-field">
                <label>Total Hours</label>

                <div className="projects-input-with-unit">
                  <input
                    type="number"
                    name="totalHours"
                    className="form-control"
                    min="0"
                    placeholder="40"
                    value={projectForm.totalHours}
                    onChange={handleProjectChange}
                    required
                  />

                  <span>hrs</span>
                </div>
              </div>

              <div className="projects-field">
                <label>Deadline</label>

                <input
                  type="date"
                  name="deadline"
                  className="form-control"
                  value={projectForm.deadline}
                  onChange={handleProjectChange}
                  required
                />
              </div>

              <div className="projects-field project-description-field">
                <label>Description</label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="2"
                  placeholder="Describe what you want to accomplish..."
                  value={projectForm.description}
                  onChange={handleProjectChange}
                />
              </div>

              <div className="projects-field">
                <label>Status</label>

                <select
                  name="status"
                  className="form-select"
                  value={projectForm.status}
                  onChange={handleProjectChange}
                >
                  <option value="Not Started">
                    Not Started
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>

            </div>

            <div className="projects-form-footer">

              <button
                type="submit"
                className="projects-submit-button"
              >
                {editingProjectId ? (
                  <>
                    <FiEdit2 size={15} />
                    Update Project
                  </>
                ) : (
                  <>
                    <FiPlus size={16} />
                    Create Project
                  </>
                )}
              </button>

              {editingProjectId && (
                <button
                  type="button"
                  className="projects-cancel-button"
                  onClick={resetProjectForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* =================================================
            PROJECT LIST
            ================================================= */}

        <section className="projects-card">

          <div className="projects-card-header projects-list-header">

            <div>
              <p className="projects-card-kicker">
                PROJECTS
              </p>

              <h2>Your Projects</h2>

              <p>
                Select a project to manage its tasks.
              </p>
            </div>

            <span className="projects-count">
              {totalProjects}
            </span>

          </div>

          {loading ? (

            <div className="projects-empty">

              <span className="projects-loading" />

              <p>Loading projects...</p>

            </div>

          ) : projects.length === 0 ? (

            <div className="projects-empty">

              <div className="projects-empty-icon">
                <FiFolder size={20} />
              </div>

              <strong>No projects yet</strong>

              <p>
                Create your first project above.
              </p>

            </div>

          ) : (

            <div className="projects-grid">

              {projects.map((project) => {

                const progress =
                  getProjectProgress(
                    project.status
                  )

                const isSelected =
                  selectedProject?._id ===
                  project._id

                return (
                  <article
                    className={`project-item-card ${
                      isSelected ? 'selected' : ''
                    }`}
                    key={project._id}
                  >

                    {/* TOP */}

                    <div className="project-item-top">

                      <div className="project-item-icon">
                        <FiFolder size={18} />
                      </div>

                      <span
                        className={`project-status ${
                          project.status === 'Completed'
                            ? 'completed'
                            : project.status ===
                              'In Progress'
                            ? 'active'
                            : 'neutral'
                        }`}
                      >
                        {project.status}
                      </span>

                    </div>

                    {/* TITLE */}

                    <div className="project-item-title">

                      <h3>{project.name}</h3>

                      <span>
                        {project.totalHours} hours allocated
                      </span>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="project-item-description">
                      {project.description ||
                        'No description provided.'}
                    </p>

                    {/* PROGRESS */}

                    <div className="project-progress">

                      <div className="project-progress-header">

                        <span>
                          Project Progress
                        </span>

                        <strong>
                          {progress}%
                        </strong>

                      </div>

                      <div className="project-progress-track">

                        <div
                          className={`project-progress-fill ${
                            project.status ===
                            'Completed'
                              ? 'completed'
                              : project.status ===
                                'In Progress'
                              ? 'active'
                              : ''
                          }`}
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* DEADLINE */}

                    <div className="project-deadline">

                      <FiCalendar size={14} />

                      <div>
                        <span>Deadline</span>

                        <strong>
                          {new Date(
                            project.deadline
                          ).toLocaleDateString(
                            'en-IN'
                          )}
                        </strong>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="project-actions">

                      <button
                        type="button"
                        className="project-manage-button"
                        onClick={() =>
                          selectProject(project)
                        }
                      >
                        <FiList size={14} />
                        Manage Tasks
                      </button>

                      <button
                        type="button"
                        className="project-edit-button"
                        onClick={() =>
                          handleEditProject(project)
                        }
                        title="Edit project"
                      >
                        <FiEdit2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="project-delete-button"
                        onClick={() =>
                          handleDeleteProject(
                            project._id
                          )
                        }
                        title="Delete project"
                      >
                        <FiTrash2 size={14} />
                      </button>

                    </div>

                  </article>
                )
              })}

            </div>

          )}

        </section>

        {/* =================================================
            TASK SECTION
            ================================================= */}

        {selectedProject && (

          <section
            id="task-section"
            className="projects-card task-section"
          >

            {/* TASK HEADER */}

            <div className="projects-card-header">

              <div>

                <p className="projects-card-kicker">
                  TASK MANAGEMENT
                </p>

                <div className="task-heading-row">

                  <h2>Project Tasks</h2>

                  <span className="selected-project-name">
                    {selectedProject.name}
                  </span>

                </div>

                <p>
                  {tasks.length} tasks ·{' '}
                  {completedTasks} completed ·{' '}
                  {pendingTasks} pending ·{' '}
                  {formatMinutes(taskMinutes)} allocated
                </p>

              </div>

              <button
                type="button"
                className="projects-icon-button"
                onClick={() => {
                  setSelectedProject(null)
                  setTasks([])
                  resetTaskForm()
                }}
                title="Close task section"
              >
                <FiX size={17} />
              </button>

            </div>

            {/* TASK PROGRESS */}

            <div className="task-progress-box">

              <div className="task-progress-header">

                <div>
                  <span>Task Completion</span>
                  <small>
                    {completedTasks} of {tasks.length}{' '}
                    tasks completed
                  </small>
                </div>

                <strong>
                  {taskCompletion}%
                </strong>

              </div>

              <div className="task-progress-track">

                <div
                  className="task-progress-fill"
                  style={{
                    width: `${taskCompletion}%`,
                  }}
                />

              </div>

            </div>

            {/* TASK FORM */}

            <div
              id="task-form"
              className="task-form-box"
            >

              <div className="task-form-header">

                <div>
                  <p className="projects-card-kicker">
                    TASK SETUP
                  </p>

                  <h3>
                    {editingTaskId
                      ? 'Edit Task'
                      : 'Add Task'}
                  </h3>

                  <p>
                    Break the project into manageable
                    tasks.
                  </p>
                </div>

                {editingTaskId && (
                  <button
                    type="button"
                    className="projects-icon-button"
                    onClick={resetTaskForm}
                  >
                    <FiX size={17} />
                  </button>
                )}

              </div>

              <form onSubmit={handleTaskSubmit}>

                <div className="task-form-grid">

                  <div className="projects-field task-title-field">
                    <label>Task Title</label>

                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Create login page"
                      value={taskForm.title}
                      onChange={handleTaskChange}
                      required
                    />
                  </div>

                  <div className="projects-field">
                    <label>Priority</label>

                    <select
                      name="priority"
                      className="form-select"
                      value={taskForm.priority}
                      onChange={handleTaskChange}
                    >
                      <option value="Low">
                        Low
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="High">
                        High
                      </option>
                    </select>
                  </div>

                  <div className="projects-field">
                    <label>Estimated Time</label>

                    <div className="projects-input-with-unit">
                      <input
                        type="number"
                        name="estimatedMinutes"
                        className="form-control"
                        min="1"
                        placeholder="60"
                        value={
                          taskForm.estimatedMinutes
                        }
                        onChange={handleTaskChange}
                        required
                      />

                      <span>min</span>
                    </div>
                  </div>

                  <div className="projects-field task-description-field">
                    <label>Description</label>

                    <textarea
                      name="description"
                      className="form-control"
                      rows="2"
                      placeholder="Describe the task..."
                      value={taskForm.description}
                      onChange={handleTaskChange}
                    />
                  </div>

                  <div className="projects-field">
                    <label>Deadline</label>

                    <input
                      type="date"
                      name="deadline"
                      className="form-control"
                      value={taskForm.deadline}
                      onChange={handleTaskChange}
                      required
                    />
                  </div>

                  <div className="projects-field">
                    <label>Status</label>

                    <select
                      name="status"
                      className="form-select"
                      value={taskForm.status}
                      onChange={handleTaskChange}
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>
                  </div>

                </div>

                <div className="projects-form-footer">

                  <button
                    type="submit"
                    className="projects-submit-button"
                  >
                    {editingTaskId ? (
                      <>
                        <FiEdit2 size={15} />
                        Update Task
                      </>
                    ) : (
                      <>
                        <FiPlus size={16} />
                        Add Task
                      </>
                    )}
                  </button>

                  {editingTaskId && (
                    <button
                      type="button"
                      className="projects-cancel-button"
                      onClick={resetTaskForm}
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </form>

            </div>

            {/* TASK LIST */}

            {tasks.length === 0 ? (

              <div className="projects-empty task-empty">

                <div className="projects-empty-icon">
                  <FiList size={20} />
                </div>

                <strong>No tasks yet</strong>

                <p>
                  Add the first task for this project
                  above.
                </p>

              </div>

            ) : (

              <div className="tasks-grid">

                {tasks.map((task) => {

                  const isCompleted =
                    task.status === 'Completed'

                  return (
                    <article
                      className="task-item-card"
                      key={task._id}
                    >

                      <div className="task-item-top">

                        <div
                          className={`task-priority ${
                            task.priority.toLowerCase()
                          }`}
                        >
                          {task.priority}
                        </div>

                        <span
                          className={`task-status ${
                            task.status ===
                            'Completed'
                              ? 'completed'
                              : task.status ===
                                'In Progress'
                              ? 'active'
                              : 'pending'
                          }`}
                        >
                          {task.status}
                        </span>

                      </div>

                      <div className="task-item-title">

                        <h3
                          className={
                            isCompleted
                              ? 'completed-title'
                              : ''
                          }
                        >
                          {task.title}
                        </h3>

                        <p>
                          {task.description ||
                            'No description'}
                        </p>

                      </div>

                      <div className="task-details">

                        <div>
                          <FiClock size={14} />

                          <span>
                            {formatMinutes(
                              Number(
                                task.estimatedMinutes
                              )
                            )}
                          </span>
                        </div>

                        <div>
                          <FiCalendar size={14} />

                          <span>
                            {new Date(
                              task.deadline
                            ).toLocaleDateString(
                              'en-IN'
                            )}
                          </span>
                        </div>

                      </div>

                      <div className="task-actions">

                        <button
                          type="button"
                          className="task-edit-button"
                          onClick={() =>
                            handleEditTask(task)
                          }
                        >
                          <FiEdit2 size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="task-delete-button"
                          onClick={() =>
                            handleDeleteTask(
                              task._id
                            )
                          }
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </button>

                      </div>

                    </article>
                  )
                })}

              </div>

            )}

          </section>

        )}

      </div>
    </div>
  )
}

// =========================================================
// PROJECT STAT
// =========================================================

function ProjectStat({
  icon,
  label,
  value,
  detail,
  type,
}) {
  return (
    <div className="project-stat-card">

      <div className={`project-stat-icon ${type}`}>
        {icon}
      </div>

      <div className="project-stat-content">

        <span>{label}</span>

        <strong>{value}</strong>

        <small>{detail}</small>

      </div>

    </div>
  )
}

// =========================================================
// PROJECT STATUS
// =========================================================

function ProjectStatus({
  label,
  value,
  percentage,
  type,
}) {
  return (
    <div className="project-status-item">

      <div className="project-status-header">

        <span>{label}</span>

        <strong>{value}</strong>

      </div>

      <div className="project-status-track">

        <div
          className={`project-status-fill ${type}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <small>
        {percentage}% of projects
      </small>

    </div>
  )
}

// Small activity icon component to avoid adding
// another dependency or changing project logic.
function FiActivityIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 12 7 12 10 4 14 20 17 12 21 12" />
    </svg>
  )
}

export default Projects