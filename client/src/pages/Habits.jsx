import { useEffect, useState } from 'react'
import {
  FiCheckCircle,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiClock,
  FiActivity,
  FiTarget,
} from 'react-icons/fi'
import api from '../services/api'

function Habits() {
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Study',
    targetMinutes: '',
    frequency: 'daily',
    startDate: today,
    isActive: true,
  })

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchHabits = async () => {
    try {
      const response = await api.get('/habits', getConfig())
      setHabits(response.data.habits)
    } catch (error) {
      console.error('Failed to fetch habits:', error)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await api.get('/habit-logs', getConfig())
      setLogs(response.data.logs)
    } catch (error) {
      console.error('Failed to fetch habit logs:', error)
    }
  }

  const loadData = async () => {
    setLoading(true)

    await Promise.all([
      fetchHabits(),
      fetchLogs(),
    ])

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // =========================================================
  // HABIT FORM
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Study',
      targetMinutes: '',
      frequency: 'daily',
      startDate: today,
      isActive: true,
    })

    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await api.put(
          `/habits/${editingId}`,
          formData,
          getConfig()
        )
      } else {
        await api.post(
          '/habits',
          formData,
          getConfig()
        )
      }

      resetForm()
      await fetchHabits()
    } catch (error) {
      console.error('Failed to save habit:', error)
    }
  }

  const handleEdit = (habit) => {
    setEditingId(habit._id)

    setFormData({
      name: habit.name,
      description: habit.description || '',
      category: habit.category,
      targetMinutes: habit.targetMinutes,
      frequency: habit.frequency,
      startDate: habit.startDate.split('T')[0],
      isActive: habit.isActive,
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this habit?'
    )

    if (!confirmed) return

    try {
      await api.delete(
        `/habits/${id}`,
        getConfig()
      )

      await loadData()
    } catch (error) {
      console.error('Failed to delete habit:', error)
    }
  }

  // =========================================================
  // HABIT LOGS
  // =========================================================

  const getTodayLog = (habitId) => {
    return logs.find((log) => {
      const logDate = new Date(log.date)
        .toISOString()
        .split('T')[0]

      const logHabitId =
        log.habitId?._id || log.habitId

      return (
        String(logHabitId) === String(habitId) &&
        logDate === today
      )
    })
  }

  const markHabit = async (habit) => {
    const existingLog = getTodayLog(habit._id)

    try {
      await api.post(
        '/habit-logs',
        {
          habitId: habit._id,
          date: today,
          completed: !existingLog?.completed,
          completedMinutes: existingLog?.completed
            ? 0
            : habit.targetMinutes,
        },
        getConfig()
      )

      await fetchLogs()
      await fetchHabits()
    } catch (error) {
      console.error('Failed to mark habit:', error)
    }
  }

  // =========================================================
  // SUMMARY
  // =========================================================

  const activeHabits = habits.filter(
    (habit) => habit.isActive
  ).length

  const completedToday = habits.filter(
    (habit) => getTodayLog(habit._id)?.completed
  ).length

  const todayTarget = habits
    .filter(
      (habit) =>
        habit.frequency === 'daily' &&
        habit.isActive
    )
    .reduce(
      (total, habit) =>
        total + Number(habit.targetMinutes),
      0
    )

  const completionPercentage =
    activeHabits > 0
      ? Math.round(
          (completedToday / activeHabits) * 100
        )
      : 0

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="page-container">
      <div className="habits-page">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="habits-header">
          <div>
            <p className="habits-eyebrow">
              PERSONAL DEVELOPMENT
            </p>

            <h1>Habits</h1>

            <p>
              Build consistent habits and track your
              daily progress.
            </p>
          </div>

          <div className="habits-header-icon">
            <FiCheckCircle size={21} />
          </div>
        </div>

        {/* =================================================
            SUMMARY
            ================================================= */}

        <div className="habits-summary-grid">

          <HabitStat
            icon={<FiActivity />}
            label="Total Habits"
            value={habits.length}
            detail="created habits"
            type="default"
          />

          <HabitStat
            icon={<FiCheckCircle />}
            label="Active Habits"
            value={activeHabits}
            detail="currently active"
            type="success"
          />

          <HabitStat
            icon={<FiTarget />}
            label="Completed Today"
            value={`${completedToday}/${activeHabits}`}
            detail="habits completed"
            type="default"
          />

          <HabitStat
            icon={<FiClock />}
            label="Daily Target"
            value={todayTarget}
            detail="minutes"
            type="target"
          />

        </div>

        {/* =================================================
            TODAY'S PROGRESS
            ================================================= */}

        <section className="habits-progress-card">

          <div className="habits-progress-header">
            <div>
              <p className="habits-card-kicker">
                TODAY
              </p>

              <h2>Today's Progress</h2>

              <p>
                {completedToday} of {activeHabits}{' '}
                active habits completed
              </p>
            </div>

            <strong>
              {completionPercentage}%
            </strong>
          </div>

          <div className="habits-progress-track">
            <div
              className="habits-progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

        </section>

        {/* =================================================
            ADD / EDIT HABIT
            ================================================= */}

        <section className="habits-card">

          <div className="habits-card-header">

            <div>
              <p className="habits-card-kicker">
                HABIT SETUP
              </p>

              <h2>
                {editingId
                  ? 'Edit Habit'
                  : 'Add Habit'}
              </h2>

              <p>
                Create a habit you want to maintain
                consistently.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                className="habits-icon-button"
                onClick={resetForm}
                title="Cancel edit"
              >
                <FiX size={17} />
              </button>
            )}

          </div>

          <form onSubmit={handleSubmit}>

            <div className="habits-form-grid">

              <div className="habits-field habits-field-wide">
                <label>Habit Name</label>

                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Study Electronics"
                  required
                />
              </div>

              <div className="habits-field">
                <label>Category</label>

                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Study">Study</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Reading">Reading</option>
                  <option value="Health">Health</option>
                  <option value="Project">Project</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="habits-field">
                <label>Target Minutes</label>

                <input
                  type="number"
                  className="form-control"
                  name="targetMinutes"
                  value={formData.targetMinutes}
                  onChange={handleChange}
                  placeholder="120"
                  min="1"
                  required
                />
              </div>

              <div className="habits-field">
                <label>Frequency</label>

                <select
                  className="form-select"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="habits-field">
                <label>Start Date</label>

                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="habits-field habits-description-field">
                <label>Description</label>

                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Study electronics for college"
                />
              </div>

              <div className="habits-active-field">

                <label>Active</label>

                <label className="habits-switch">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />

                  <span className="habits-switch-slider" />
                </label>

              </div>

              <div className="habits-form-action">

                <button
                  type="submit"
                  className="habits-submit-button"
                >
                  {editingId ? (
                    <>
                      <FiEdit2 size={15} />
                      Update Habit
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} />
                      Add Habit
                    </>
                  )}
                </button>

              </div>

            </div>

          </form>

        </section>

        {/* =================================================
            HABIT LIST
            ================================================= */}

        <section className="habits-card">

          <div className="habits-card-header habits-list-header">

            <div>
              <p className="habits-card-kicker">
                DAILY ROUTINE
              </p>

              <h2>My Habits</h2>

              <p>
                Mark your habits as completed each day.
              </p>
            </div>

            <span className="habits-count">
              {habits.length}
            </span>

          </div>

          {loading ? (

            <div className="habits-empty">
              <span className="habits-loading" />

              <p>Loading habits...</p>
            </div>

          ) : habits.length === 0 ? (

            <div className="habits-empty">

              <div className="habits-empty-icon">
                <FiCheckCircle size={20} />
              </div>

              <strong>No habits yet</strong>

              <p>
                Add your first habit above.
              </p>

            </div>

          ) : (

            <div className="habits-grid">

              {habits.map((habit) => {

                const todayLog =
                  getTodayLog(habit._id)

                const completed =
                  todayLog?.completed === true

                const target =
                  Number(habit.targetMinutes)

                return (
                  <article
                    className="habit-item-card"
                    key={habit._id}
                  >

                    {/* TOP */}

                    <div className="habit-item-top">

                      <div className="habit-item-icon">
                        <FiCheckCircle size={18} />
                      </div>

                      <span
                        className={`habit-status ${
                          completed
                            ? 'completed'
                            : habit.isActive
                            ? 'active'
                            : 'inactive'
                        }`}
                      >
                        {completed
                          ? 'Completed'
                          : habit.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>

                    </div>

                    {/* TITLE */}

                    <div className="habit-item-title">

                      <h3>{habit.name}</h3>

                      <span>
                        {habit.category}
                      </span>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="habit-item-description">
                      {habit.description ||
                        'No description'}
                    </p>

                    {/* META */}

                    <div className="habit-meta">

                      <span>
                        {habit.frequency}
                      </span>

                      <span>
                        {target} min/day
                      </span>

                      <span>
                        {habit.streak || 0} day streak
                      </span>

                    </div>

                    {/* TARGET */}

                    <div className="habit-target">

                      <div className="habit-target-header">

                        <span>
                          Daily Target
                        </span>

                        <strong>
                          {target} min
                        </strong>

                      </div>

                      <div className="habit-target-track">
                        <div
                          className={`habit-target-fill ${
                            completed
                              ? 'completed'
                              : ''
                          }`}
                          style={{
                            width: completed
                              ? '100%'
                              : '0%',
                          }}
                        />
                      </div>

                    </div>

                    {/* START DATE */}

                    <p className="habit-start-date">
                      Started:{' '}
                      {new Date(
                        habit.startDate
                      ).toLocaleDateString('en-IN')}
                    </p>

                    {/* COMPLETE */}

                    {habit.isActive && (
                      <button
                        type="button"
                        className={`habit-complete-button ${
                          completed
                            ? 'completed'
                            : ''
                        }`}
                        onClick={() =>
                          markHabit(habit)
                        }
                      >
                        <FiCheckCircle size={15} />

                        {completed
                          ? 'Undo Completion'
                          : 'Mark Complete'}
                      </button>
                    )}

                    {/* ACTIONS */}

                    <div className="habit-actions">

                      <button
                        type="button"
                        className="habit-edit-button"
                        onClick={() =>
                          handleEdit(habit)
                        }
                      >
                        <FiEdit2 size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="habit-delete-button"
                        onClick={() =>
                          handleDelete(habit._id)
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

      </div>
    </div>
  )
}

// =========================================================
// HABIT STAT
// =========================================================

function HabitStat({
  icon,
  label,
  value,
  detail,
  type,
}) {
  return (
    <div className="habit-stat-card">

      <div className={`habit-stat-icon ${type}`}>
        {icon}
      </div>

      <div className="habit-stat-content">

        <span>{label}</span>

        <strong>{value}</strong>

        <small>{detail}</small>

      </div>

    </div>
  )
}

export default Habits