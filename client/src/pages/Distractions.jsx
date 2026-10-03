import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  FiAlertCircle,
  FiClock,
  FiEdit2,
  FiMonitor,
  FiPlus,
  FiTrash2,
  FiX,
} from 'react-icons/fi'

function Distractions() {
  const { token } = useAuth()

  const [distractions, setDistractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    appName: '',
    category: 'Social Media',
    durationMinutes: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  })

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const fetchDistractions = async () => {
    try {
      const response = await api.get('/distractions', authConfig)
      setDistractions(response.data.distractions)
    } catch (error) {
      console.error('Failed to fetch distractions', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDistractions()
    }
  }, [token])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setForm({
      appName: '',
      category: 'Social Media',
      durationMinutes: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    })

    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const distractionData = {
        ...form,
        durationMinutes: Number(form.durationMinutes),
      }

      if (editingId) {
        await api.put(
          `/distractions/${editingId}`,
          distractionData,
          authConfig,
        )
      } else {
        await api.post(
          '/distractions',
          distractionData,
          authConfig,
        )
      }

      resetForm()
      await fetchDistractions()
    } catch (error) {
      console.error('Failed to save distraction', error)

      alert(
        error.response?.data?.message ||
          'Failed to save distraction',
      )
    }
  }

  const handleEdit = (distraction) => {
    setEditingId(distraction._id)

    setForm({
      appName: distraction.appName,
      category: distraction.category,
      durationMinutes: distraction.durationMinutes,
      date: distraction.date
        ? distraction.date.split('T')[0]
        : '',
      description: distraction.description || '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this distraction record?',
      )
    ) {
      return
    }

    try {
      await api.delete(`/distractions/${id}`, authConfig)
      await fetchDistractions()
    } catch (error) {
      console.error('Failed to delete distraction', error)

      alert(
        error.response?.data?.message ||
          'Failed to delete distraction',
      )
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const todayDistractions = distractions.filter((item) => {
    return (
      new Date(item.date).toISOString().split('T')[0] === today
    )
  })

  const totalMinutes = distractions.reduce(
    (sum, item) => sum + Number(item.durationMinutes || 0),
    0,
  )

  const todayMinutes = todayDistractions.reduce(
    (sum, item) => sum + Number(item.durationMinutes || 0),
    0,
  )

  const totalRecords = distractions.length

  const categoryTotals = {}

  distractions.forEach((item) => {
    const category = item.category

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(item.durationMinutes || 0)
  })

  const sortedCategories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )

  const mostDistractingCategory =
    sortedCategories.length > 0
      ? sortedCategories[0][0]
      : 'None'

  const topCategoryMinutes =
    sortedCategories.length > 0
      ? sortedCategories[0][1]
      : 0

  const todayPercentage =
    totalMinutes > 0
      ? Math.round((todayMinutes / totalMinutes) * 100)
      : 0

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

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Social Media':
        return 'distraction-category-social'
      case 'Video/Streaming':
        return 'distraction-category-video'
      case 'Gaming':
        return 'distraction-category-gaming'
      case 'Messaging':
        return 'distraction-category-messaging'
      case 'Browsing':
        return 'distraction-category-browsing'
      case 'Entertainment':
        return 'distraction-category-entertainment'
      default:
        return 'distraction-category-other'
    }
  }

  return (
    <div className="distractions-page">
      <div className="distractions-header">
        <div>
          <p className="distractions-eyebrow">
            DIGITAL WELLBEING
          </p>

          <h1>Distractions</h1>

          <p>
            Understand where your time is going and identify
            activities that reduce your focus.
          </p>
        </div>

        <div className="distractions-header-icon">
          <FiMonitor size={22} strokeWidth={1.7} />
        </div>
      </div>

      <section className="distractions-summary-grid">
        <div className="distraction-stat-card">
          <div className="distraction-stat-icon">
            <FiClock size={19} strokeWidth={1.7} />
          </div>

          <div>
            <span className="distraction-stat-label">
              Total Distraction
            </span>

            <strong>{formatMinutes(totalMinutes)}</strong>

            <small>all recorded time</small>
          </div>
        </div>

        <div className="distraction-stat-card">
          <div className="distraction-stat-icon distraction-danger">
            <FiAlertCircle size={19} strokeWidth={1.7} />
          </div>

          <div>
            <span className="distraction-stat-label">
              Today's Distraction
            </span>

            <strong>{formatMinutes(todayMinutes)}</strong>

            <small>recorded today</small>
          </div>
        </div>

        <div className="distraction-stat-card">
          <div className="distraction-stat-icon">
            <FiMonitor size={19} strokeWidth={1.7} />
          </div>

          <div>
            <span className="distraction-stat-label">
              Total Records
            </span>

            <strong>{totalRecords}</strong>

            <small>distraction entries</small>
          </div>
        </div>

        <div className="distraction-stat-card">
          <div className="distraction-stat-icon">
            <FiAlertCircle size={19} strokeWidth={1.7} />
          </div>

          <div>
            <span className="distraction-stat-label">
              Top Category
            </span>

            <strong className="distraction-stat-category">
              {mostDistractingCategory}
            </strong>

            <small>{formatMinutes(topCategoryMinutes)}</small>
          </div>
        </div>
      </section>

      <section className="distractions-card distraction-overview-card">
        <div className="distractions-card-header">
          <div>
            <span className="distractions-card-kicker">
              TODAY
            </span>

            <h2>Distraction Overview</h2>

            <p>
              Today's distraction time compared with all recorded
              distraction time.
            </p>
          </div>

          <strong className="distraction-percentage">
            {todayPercentage}%
          </strong>
        </div>

        <div className="distraction-progress-track">
          <div
            className="distraction-progress-fill"
            style={{ width: `${todayPercentage}%` }}
          />
        </div>

        <div className="distraction-overview-footer">
          <span>{formatMinutes(todayMinutes)} today</span>
          <span>{formatMinutes(totalMinutes)} total</span>
        </div>
      </section>

      <section className="distractions-card">
        <div className="distractions-card-header">
          <div>
            <span className="distractions-card-kicker">
              {editingId ? 'UPDATE RECORD' : 'NEW RECORD'}
            </span>

            <h2>
              {editingId
                ? 'Edit Distraction'
                : 'Record Distraction'}
            </h2>

            <p>
              Record the app or activity that consumed your time.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="distraction-icon-button"
              onClick={resetForm}
              title="Cancel edit"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="distractions-form-grid">
            <div className="distractions-field">
              <label>App / Activity</label>

              <input
                type="text"
                name="appName"
                placeholder="e.g. Instagram"
                value={form.appName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="distractions-field">
              <label>Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Social Media">
                  Social Media
                </option>

                <option value="Video/Streaming">
                  Video/Streaming
                </option>

                <option value="Gaming">
                  Gaming
                </option>

                <option value="Messaging">
                  Messaging
                </option>

                <option value="Browsing">
                  Browsing
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="distractions-field">
              <label>Duration</label>

              <div className="distraction-input-unit">
                <input
                  type="number"
                  name="durationMinutes"
                  min="1"
                  placeholder="30"
                  value={form.durationMinutes}
                  onChange={handleChange}
                  required
                />

                <span>min</span>
              </div>
            </div>

            <div className="distractions-field">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="distractions-field distractions-field-full">
              <label>Description</label>

              <textarea
                name="description"
                rows="3"
                placeholder="What caused the distraction?"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="distractions-form-footer">
            <button
              type="submit"
              className="distraction-primary-button"
            >
              {editingId ? (
                <>
                  <FiEdit2 size={16} />
                  Update Record
                </>
              ) : (
                <>
                  <FiPlus size={17} />
                  Add Record
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                className="distraction-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {sortedCategories.length > 0 && (
        <section className="distractions-card">
          <div className="distractions-card-header">
            <div>
              <span className="distractions-card-kicker">
                ANALYSIS
              </span>

              <h2>Category Breakdown</h2>

              <p>
                See which types of activities consume the most
                time.
              </p>
            </div>
          </div>

          <div className="distraction-category-list">
            {sortedCategories.map(([category, minutes]) => {
              const percentage =
                totalMinutes > 0
                  ? Math.round((minutes / totalMinutes) * 100)
                  : 0

              return (
                <div
                  className="distraction-category-row"
                  key={category}
                >
                  <div className="distraction-category-info">
                    <div>
                      <span
                        className={`distraction-category-tag ${getCategoryClass(
                          category,
                        )}`}
                      >
                        {category}
                      </span>

                      <strong>
                        {formatMinutes(minutes)}
                      </strong>
                    </div>

                    <span>{percentage}%</span>
                  </div>

                  <div className="distraction-category-track">
                    <div
                      className="distraction-category-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <small>
                    {percentage}% of total distraction time
                  </small>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="distractions-card">
        <div className="distractions-card-header">
          <div>
            <span className="distractions-card-kicker">
              HISTORY
            </span>

            <h2>Distraction History</h2>

            <p>
              Review and manage your recorded distraction
              activities.
            </p>
          </div>

          <span className="distraction-record-count">
            {totalRecords} records
          </span>
        </div>

        {loading ? (
          <div className="distractions-loading">
            <div className="distractions-loader" />
            <p>Loading distractions...</p>
          </div>
        ) : distractions.length === 0 ? (
          <div className="distractions-empty">
            <div className="distractions-empty-icon">
              <FiMonitor size={22} strokeWidth={1.6} />
            </div>

            <h3>No distraction records</h3>

            <p>
              Add your first distraction record above.
            </p>
          </div>
        ) : (
          <div className="distraction-history">
            {distractions.map((distraction) => (
              <div
                className="distraction-history-item"
                key={distraction._id}
              >
                <div className="distraction-history-main">
                  <div className="distraction-history-icon">
                    <FiMonitor size={18} strokeWidth={1.7} />
                  </div>

                  <div className="distraction-history-info">
                    <div className="distraction-history-title-row">
                      <h3>{distraction.appName}</h3>

                      <span
                        className={`distraction-category-tag ${getCategoryClass(
                          distraction.category,
                        )}`}
                      >
                        {distraction.category}
                      </span>
                    </div>

                    <div className="distraction-history-meta">
                      <span>
                        <FiClock size={14} />
                        {formatMinutes(
                          Number(
                            distraction.durationMinutes || 0,
                          ),
                        )}
                      </span>

                      <span>
                        {new Date(
                          distraction.date,
                        ).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    {distraction.description && (
                      <p>{distraction.description}</p>
                    )}
                  </div>
                </div>

                <div className="distraction-history-actions">
                  <button
                    type="button"
                    className="distraction-action-button"
                    onClick={() => handleEdit(distraction)}
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    type="button"
                    className="distraction-action-button danger"
                    onClick={() =>
                      handleDelete(distraction._id)
                    }
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Distractions