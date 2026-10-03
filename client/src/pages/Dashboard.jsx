import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiDollarSign,
  FiClock,
  FiSmartphone,
  FiCheckCircle,
  FiBriefcase,
  FiArrowUpRight,
  FiPlus,
  FiCalendar,
  FiTarget,
  FiActivity,
} from 'react-icons/fi'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await api.get('/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setData(response.data.summary)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load dashboard'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="dashboard-loading">
          <div className="ff-loading-dot"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="ff-error">
          <strong>Unable to load dashboard</strong>
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="dashboard-page">

        {/* =========================
            HEADER
            ========================= */}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              PERSONAL OVERVIEW
            </p>

            <h1>
              Good afternoon, {user?.name || 'User'}
            </h1>

            <p className="dashboard-subtitle">
              Here is your overview for today.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <Link
              to="/planner"
              className="dashboard-secondary-button"
            >
              <FiCalendar size={16} />
              Planner
            </Link>

            <Link
              to="/projects"
              className="dashboard-primary-button"
            >
              <FiPlus size={16} />
              New Project
            </Link>
          </div>
        </div>

        {/* =========================
            TOP STAT CARDS
            ========================= */}

        <div className="dashboard-stat-grid">

          <DashboardStat
            icon={<FiDollarSign />}
            label="Total Balance"
            value={`₹${Number(data.balance || 0).toLocaleString()}`}
            meta="Available balance"
            link="/money"
          />

          <DashboardStat
            icon={<FiClock />}
            label="Focus Time"
            value={`${data.focusMinutes || 0}m`}
            meta="Tracked today"
            link="/planner"
          />

          <DashboardStat
            icon={<FiSmartphone />}
            label="Distractions"
            value={`${data.todayDistractionMinutes || 0}m`}
            meta="Today"
            link="/distractions"
          />

          <DashboardStat
            icon={<FiCheckCircle />}
            label="Habit Completion"
            value={`${data.habitCompletion || 0}%`}
            meta={`${data.completedHabits || 0}/${data.totalHabits || 0} completed`}
            link="/habits"
          />

        </div>

        {/* =========================
            MAIN CONTENT
            ========================= */}

        <div className="dashboard-main-grid">

          {/* LEFT COLUMN */}

          <div className="dashboard-main-column">

            {/* Focus Overview */}

            <section className="dashboard-card focus-overview-card">

              <div className="dashboard-card-header">
                <div>
                  <p className="dashboard-card-kicker">
                    PRODUCTIVITY
                  </p>

                  <h2>Focus Overview</h2>

                  <p>
                    Your productivity snapshot for today.
                  </p>
                </div>

                <div className="focus-score">
                  <span>{data.focusScore || 0}%</span>
                  <small>focus score</small>
                </div>
              </div>

              <div className="focus-metrics">

                <div className="focus-metric">
                  <span className="metric-dot focus-dot"></span>

                  <div>
                    <strong>
                      {data.focusMinutes || 0} min
                    </strong>

                    <small>Focused time</small>
                  </div>
                </div>

                <div className="focus-metric">
                  <span className="metric-dot distraction-dot"></span>

                  <div>
                    <strong>
                      {data.todayDistractionMinutes || 0} min
                    </strong>

                    <small>Distraction time</small>
                  </div>
                </div>

              </div>

              <div className="focus-progress-wrapper">
                <div className="focus-progress">
                  <div
                    className="focus-progress-bar"
                    style={{
                      width: `${Math.min(
                        Number(data.focusScore || 0),
                        100
                      )}%`,
                    }}
                  ></div>
                </div>

                <span>
                  {data.focusScore || 0}% focused
                </span>
              </div>

            </section>

            {/* Habit Progress */}

            <section className="dashboard-card">

              <div className="dashboard-card-header compact">

                <div>
                  <p className="dashboard-card-kicker">
                    DAILY ROUTINE
                  </p>

                  <h2>Habit Progress</h2>
                </div>

                <Link
                  to="/habits"
                  className="dashboard-text-link"
                >
                  View habits
                  <FiArrowUpRight size={15} />
                </Link>

              </div>

              <div className="habit-progress-content">

                <div className="habit-progress-number">
                  <strong>
                    {data.habitCompletion || 0}%
                  </strong>

                  <span>
                    today's completion
                  </span>
                </div>

                <div className="habit-progress-area">

                  <div className="habit-progress">
                    <div
                      className="habit-progress-bar"
                      style={{
                        width: `${Math.min(
                          Number(data.habitCompletion || 0),
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="habit-progress-labels">
                    <span>
                      {data.completedHabits || 0} completed
                    </span>

                    <span>
                      {data.totalHabits || 0} total
                    </span>
                  </div>

                </div>

              </div>

            </section>

            {/* Projects */}

            <section className="dashboard-card">

              <div className="dashboard-card-header compact">

                <div>
                  <p className="dashboard-card-kicker">
                    WORK
                  </p>

                  <h2>Projects & Tasks</h2>
                </div>

                <Link
                  to="/projects"
                  className="dashboard-text-link"
                >
                  View projects
                  <FiArrowUpRight size={15} />
                </Link>

              </div>

              <div className="project-summary-grid">

                <DashboardMiniStat
                  icon={<FiBriefcase />}
                  label="Active Projects"
                  value={data.activeProjects || 0}
                />

                <DashboardMiniStat
                  icon={<FiTarget />}
                  label="Pending Tasks"
                  value={data.pendingTasks || 0}
                />

                <DashboardMiniStat
                  icon={<FiCheckCircle />}
                  label="Completed Tasks"
                  value={data.completedTasks || 0}
                />

              </div>

            </section>

          </div>

          {/* RIGHT COLUMN */}

          <aside className="dashboard-side-column">

            {/* Today's Snapshot */}

            <section className="dashboard-card snapshot-card">

              <div className="dashboard-card-header compact">

                <div>
                  <p className="dashboard-card-kicker">
                    TODAY
                  </p>

                  <h2>Daily Snapshot</h2>
                </div>

                <FiActivity
                  className="dashboard-header-icon"
                  size={19}
                />

              </div>

              <div className="snapshot-list">

                <SnapshotRow
                  label="Focus time"
                  value={`${data.focusMinutes || 0} min`}
                />

                <SnapshotRow
                  label="Distraction time"
                  value={`${data.todayDistractionMinutes || 0} min`}
                />

                <SnapshotRow
                  label="Habits"
                  value={`${data.completedHabits || 0}/${data.totalHabits || 0}`}
                />

                <SnapshotRow
                  label="Pending tasks"
                  value={data.pendingTasks || 0}
                />

              </div>

            </section>

            {/* Financial Summary */}

            <section className="dashboard-card finance-card">

              <div className="dashboard-card-header compact">

                <div>
                  <p className="dashboard-card-kicker">
                    FINANCES
                  </p>

                  <h2>Money Overview</h2>
                </div>

                <Link
                  to="/money"
                  className="dashboard-icon-link"
                  aria-label="Open money tracker"
                >
                  <FiArrowUpRight size={16} />
                </Link>

              </div>

              <div className="finance-balance">
                <span>Current balance</span>

                <strong>
                  ₹{Number(data.balance || 0).toLocaleString()}
                </strong>
              </div>

              <div className="finance-row">
                <div>
                  <span>Income</span>
                  <strong className="income-value">
                    ₹{Number(data.totalIncome || 0).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Expenses</span>
                  <strong className="expense-value">
                    ₹{Number(data.totalExpenses || 0).toLocaleString()}
                  </strong>
                </div>
              </div>

            </section>

            {/* Quick Actions */}

            <section className="dashboard-card quick-actions-card">

              <div className="dashboard-card-header compact">

                <div>
                  <p className="dashboard-card-kicker">
                    SHORTCUTS
                  </p>

                  <h2>Quick Actions</h2>
                </div>

              </div>

              <div className="quick-actions">

                <QuickAction
                  to="/money"
                  icon={<FiDollarSign />}
                  label="Add transaction"
                />

                <QuickAction
                  to="/habits"
                  icon={<FiCheckCircle />}
                  label="Update habits"
                />

                <QuickAction
                  to="/distractions"
                  icon={<FiSmartphone />}
                  label="Log distraction"
                />

                <QuickAction
                  to="/planner"
                  icon={<FiCalendar />}
                  label="Plan your day"
                />

              </div>

            </section>

          </aside>

        </div>

      </div>
    </div>
  )
}

/* =========================================================
   STAT COMPONENT
   ========================================================= */

function DashboardStat({
  icon,
  label,
  value,
  meta,
  link,
}) {
  return (
    <Link
      to={link}
      className="dashboard-stat-card"
    >
      <div className="dashboard-stat-top">
        <div className="dashboard-stat-icon">
          {icon}
        </div>

        <FiArrowUpRight
          className="dashboard-stat-arrow"
          size={15}
        />
      </div>

      <div className="dashboard-stat-label">
        {label}
      </div>

      <div className="dashboard-stat-value">
        {value}
      </div>

      <div className="dashboard-stat-meta">
        {meta}
      </div>
    </Link>
  )
}

/* =========================================================
   MINI STAT
   ========================================================= */

function DashboardMiniStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="dashboard-mini-stat">

      <div className="dashboard-mini-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  )
}

/* =========================================================
   SNAPSHOT ROW
   ========================================================= */

function SnapshotRow({
  label,
  value,
}) {
  return (
    <div className="snapshot-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

/* =========================================================
   QUICK ACTION
   ========================================================= */

function QuickAction({
  to,
  icon,
  label,
}) {
  return (
    <Link
      to={to}
      className="quick-action"
    >
      <span className="quick-action-icon">
        {icon}
      </span>

      <span>{label}</span>

      <FiArrowUpRight
        className="quick-action-arrow"
        size={15}
      />
    </Link>
  )
}

export default Dashboard