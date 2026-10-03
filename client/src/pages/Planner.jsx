import { useEffect, useState } from 'react'
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiActivity,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
} from 'react-icons/fi'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Planner() {
  const { token } = useAuth()

  const [timeBlocks, setTimeBlocks] = useState([])
  const [projects, setProjects] = useState([])

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  const [form, setForm] = useState({
    title: '',
    type: 'Project',
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    status: 'Planned',
    description: '',
  })

  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects', authConfig)
      setProjects(response.data.projects)
    } catch (error) {
      console.error('Failed to fetch projects', error)
    }
  }

  const fetchTimeBlocks = async (date) => {
    try {
      setLoading(true)

      const response = await api.get(
        `/timeblocks/date/${date}`,
        authConfig
      )

      setTimeBlocks(response.data.timeBlocks)
    } catch (error) {
      console.error('Failed to fetch time blocks', error)
      setTimeBlocks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchProjects()
      fetchTimeBlocks(selectedDate)
    }
  }, [token, selectedDate])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleDateChange = (e) => {
    const date = e.target.value

    setSelectedDate(date)

    setForm({
      ...form,
      date,
    })
  }

  const resetForm = () => {
    setForm({
      title: '',
      type: 'Project',
      projectId: '',
      date: selectedDate,
      startTime: '',
      endTime: '',
      status: 'Planned',
      description: '',
    })

    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const timeBlockData = {
        ...form,
        projectId: form.projectId || null,
      }

      if (editingId) {
        await api.put(
          `/timeblocks/${editingId}`,
          timeBlockData,
          authConfig
        )
      } else {
        await api.post(
          '/timeblocks',
          timeBlockData,
          authConfig
        )
      }

      resetForm()
      await fetchTimeBlocks(selectedDate)
    } catch (error) {
      console.error('Failed to save time block', error)

      alert(
        error.response?.data?.message ||
          'Failed to save time block'
      )
    }
  }

  const handleEdit = (block) => {
    setEditingId(block._id)

    setForm({
      title: block.title,
      type: block.type,
      projectId: block.projectId?._id || '',
      date: block.date
        ? block.date.split('T')[0]
        : selectedDate,
      startTime: block.startTime,
      endTime: block.endTime,
      status: block.status,
      description: block.description || '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this time block?'
      )
    ) {
      return
    }

    try {
      await api.delete(`/timeblocks/${id}`, authConfig)
      await fetchTimeBlocks(selectedDate)
    } catch (error) {
      console.error('Failed to delete time block', error)

      alert(
        error.response?.data?.message ||
          'Failed to delete time block'
      )
    }
  }

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0

    const [startHour, startMinute] = start
      .split(':')
      .map(Number)

    const [endHour, endMinute] = end
      .split(':')
      .map(Number)

    const startTotal = startHour * 60 + startMinute
    const endTotal = endHour * 60 + endMinute

    if (endTotal <= startTotal) {
      return 0
    }

    return endTotal - startTotal
  }

  const totalMinutes = timeBlocks.reduce(
    (sum, block) =>
      sum +
      calculateDuration(
        block.startTime,
        block.endTime
      ),
    0
  )

  const completedBlocks = timeBlocks.filter(
    (block) => block.status === 'Completed'
  ).length

  const plannedBlocks = timeBlocks.filter(
    (block) => block.status === 'Planned'
  ).length

  const inProgressBlocks = timeBlocks.filter(
    (block) => block.status === 'In Progress'
  ).length

  const pendingBlocks =
    plannedBlocks + inProgressBlocks

  const completionPercentage =
    timeBlocks.length > 0
      ? Math.round(
          (completedBlocks / timeBlocks.length) * 100
        )
      : 0

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
      return `${remainingMinutes} min`
    }

    if (remainingMinutes === 0) {
      return `${hours} hr`
    }

    return `${hours} hr ${remainingMinutes} min`
  }

  const getTypeClass = (type) => {
    return `planner-type-${type
      .toLowerCase()
      .replace(/\s+/g, '-')}`
  }

  const getStatusClass = (status) => {
    if (status === 'Completed') {
      return 'planner-status-completed'
    }

    if (status === 'In Progress') {
      return 'planner-status-progress'
    }

    return 'planner-status-planned'
  }

  const formattedSelectedDate = new Date(
    `${selectedDate}T00:00:00`
  ).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="planner-page">

      <header className="planner-header">
        <div>
          <p className="planner-eyebrow">TIME MANAGEMENT</p>
          <h1>Daily Planner</h1>
          <p>
            Allocate your time, organize activities,
            and stay focused throughout the day.
          </p>
        </div>
      </header>

      <section className="planner-date-card">
        <div className="planner-date-icon">
          <FiCalendar size={20} />
        </div>

        <div className="planner-date-content">
          <span>Planning date</span>
          <strong>{formattedSelectedDate}</strong>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="planner-date-input"
        />
      </section>

      <section className="planner-summary-grid">

        <div className="planner-stat-card">
          <div className="planner-stat-icon">
            <FiCalendar />
          </div>

          <div>
            <span>Time Blocks</span>
            <strong>{timeBlocks.length}</strong>
            <small>scheduled activities</small>
          </div>
        </div>

        <div className="planner-stat-card">
          <div className="planner-stat-icon">
            <FiClock />
          </div>

          <div>
            <span>Allocated Time</span>
            <strong>{formatDuration(totalMinutes)}</strong>
            <small>planned for this day</small>
          </div>
        </div>

        <div className="planner-stat-card">
          <div className="planner-stat-icon planner-stat-success">
            <FiCheckCircle />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedBlocks}</strong>
            <small>completed blocks</small>
          </div>
        </div>

        <div className="planner-stat-card">
          <div className="planner-stat-icon planner-stat-info">
            <FiActivity />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingBlocks}</strong>
            <small>planned or in progress</small>
          </div>
        </div>

      </section>

      <section className="planner-card planner-progress-card">
        <div className="planner-section-heading">
          <div>
            <span>DAILY OVERVIEW</span>
            <h2>Daily Progress</h2>
            <p>
              Completion of your scheduled time blocks.
            </p>
          </div>

          <strong className="planner-progress-value">
            {completionPercentage}%
          </strong>
        </div>

        <div className="planner-progress-track">
          <div
            className="planner-progress-fill"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>

        <div className="planner-progress-meta">
          <span>
            {completedBlocks} of {timeBlocks.length} blocks completed
          </span>

          <span>
            {formatDuration(totalMinutes)} allocated
          </span>
        </div>
      </section>

      <section className="planner-card">

        <div className="planner-section-heading planner-form-heading">
          <div>
            <span>{editingId ? 'UPDATE SCHEDULE' : 'NEW SCHEDULE'}</span>

            <h2>
              {editingId
                ? 'Edit Time Block'
                : 'Add Time Block'}
            </h2>

            <p>
              Schedule an activity and allocate a specific
              period of time to it.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="planner-icon-button"
              onClick={resetForm}
              title="Cancel editing"
            >
              <FiX />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>

          <div className="planner-form-grid">

            <div className="planner-field planner-field-wide">
              <label>Activity</label>

              <input
                type="text"
                name="title"
                placeholder="e.g. MERN Project Development"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="planner-field">
              <label>Type</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="Project">Project</option>
                <option value="Study">Study</option>
                <option value="Habit">Habit</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="planner-field">
              <label>Project</label>

              <select
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
              >
                <option value="">No Project</option>

                {projects.map((project) => (
                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="planner-field">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleDateChange}
                required
              />
            </div>

            <div className="planner-field">
              <label>Start Time</label>

              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="planner-field">
              <label>End Time</label>

              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="planner-field">
              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            <div className="planner-field planner-field-full">
              <label>Description</label>

              <textarea
                name="description"
                rows="3"
                placeholder="Optional description..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

          </div>

          {form.startTime && form.endTime && (
            <div className="planner-duration-preview">
              <FiClock />

              <div>
                <span>Planned Duration</span>
                <strong>
                  {formatDuration(
                    calculateDuration(
                      form.startTime,
                      form.endTime
                    )
                  )}
                </strong>
              </div>
            </div>
          )}

          <div className="planner-form-actions">

            <button
              type="submit"
              className="planner-primary-button"
            >
              <FiPlus />

              {editingId
                ? 'Update Time Block'
                : 'Add Time Block'}
            </button>

            {editingId && (
              <button
                type="button"
                className="planner-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </section>

      <section className="planner-card planner-schedule-card">

        <div className="planner-section-heading">
          <div>
            <span>YOUR DAY</span>
            <h2>Daily Schedule</h2>
            <p>
              Activities planned for {formattedSelectedDate}.
            </p>
          </div>

          <div className="planner-block-count">
            {timeBlocks.length} blocks
          </div>
        </div>

        {loading ? (
          <div className="planner-state">
            <div className="planner-loader" />
            <p>Loading schedule...</p>
          </div>
        ) : timeBlocks.length === 0 ? (
          <div className="planner-state planner-empty">
            <div className="planner-empty-icon">
              <FiCalendar />
            </div>

            <h3>No schedule yet</h3>

            <p>
              Add a time block above to start planning
              your day.
            </p>
          </div>
        ) : (
          <div className="planner-timeline">

            {timeBlocks.map((block) => {
              const duration = calculateDuration(
                block.startTime,
                block.endTime
              )

              return (
                <div
                  className="planner-timeline-item"
                  key={block._id}
                >

                  <div className="planner-time-column">
                    <strong>{block.startTime}</strong>
                    <span>{block.endTime}</span>
                  </div>

                  <div className="planner-timeline-line">
                    <span />
                  </div>

                  <div className="planner-schedule-content">

                    <div className="planner-schedule-top">

                      <div>
                        <div className="planner-title-row">
                          <h3>{block.title}</h3>

                          <span
                            className={`planner-type-badge ${getTypeClass(
                              block.type
                            )}`}
                          >
                            {block.type}
                          </span>
                        </div>

                        <p>
                          {block.description ||
                            'No description'}
                        </p>
                      </div>

                      <div className="planner-schedule-actions">

                        <button
                          type="button"
                          onClick={() => handleEdit(block)}
                          className="planner-action-button"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(block._id)
                          }
                          className="planner-action-button planner-delete"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    </div>

                    <div className="planner-schedule-meta">

                      <span>
                        <FiClock />
                        {formatDuration(duration)}
                      </span>

                      {block.projectId?.name && (
                        <span>
                          Project: {block.projectId.name}
                        </span>
                      )}

                      <span
                        className={`planner-status ${getStatusClass(
                          block.status
                        )}`}
                      >
                        {block.status}
                      </span>

                    </div>

                  </div>

                </div>
              )
            })}

          </div>
        )}

      </section>

    </div>
  )
}

export default Planner