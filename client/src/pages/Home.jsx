import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiDollarSign,
  FiCheckCircle,
  FiSmartphone,
  FiFolder,
  FiCalendar,
  FiBarChart2,
} from 'react-icons/fi'

function Home() {
  const modules = [
    {
      icon: FiDollarSign,
      title: 'Money Tracker',
      description:
        'Track income, expenses, balance, savings and transaction history.',
    },
    {
      icon: FiCheckCircle,
      title: 'Habit Tracker',
      description:
        'Create habits, record daily progress and monitor completion and streaks.',
    },
    {
      icon: FiSmartphone,
      title: 'Distraction Tracker',
      description:
        'Record distracting activities and understand how much time they consume.',
    },
    {
      icon: FiFolder,
      title: 'Projects & Tasks',
      description:
        'Organize academic and personal projects with tasks, deadlines and priorities.',
    },
    {
      icon: FiCalendar,
      title: 'Daily Planner',
      description:
        'Allocate available time between projects, study, habits and other activities.',
    },
    {
      icon: FiBarChart2,
      title: 'Productivity Dashboard',
      description:
        'View important productivity, financial and habit information in one place.',
    },
  ]

  return (
    <div className="home-page">

      {/* HERO */}

      <section className="home-hero">
        <div className="home-hero-inner">

          <div className="home-hero-content">
            <p className="home-eyebrow">
              PERSONAL PRODUCTIVITY SYSTEM
            </p>

            <h1>
              Make your time,
              <br />
              money and habits
              <span> work together.</span>
            </h1>

            <p className="home-hero-description">
              FocusFlow brings your finances, habits, distractions,
              projects and daily schedule into one focused workspace.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/register"
                className="home-primary-button"
              >
                Get Started
                <FiArrowRight />
              </Link>

              <Link
                to="/login"
                className="home-secondary-button"
              >
                Login
              </Link>
            </div>

            <div className="home-hero-note">
              <span />
              One system for the things that shape your productivity.
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}

          <div className="home-dashboard-preview">

            <div className="home-preview-header">
              <div>
                <span>FOCUSFLOW</span>
                <strong>Overview</strong>
              </div>

              <div className="home-preview-avatar">
                S
              </div>
            </div>

            <div className="home-preview-greeting">
              <span>Good afternoon</span>
              <strong>Your day at a glance.</strong>
            </div>

            <div className="home-preview-stats">

              <div className="home-preview-stat">
                <span>Balance</span>
                <strong>₹25,000</strong>
                <small>available</small>
              </div>

              <div className="home-preview-stat">
                <span>Focus Time</span>
                <strong>4.2 hrs</strong>
                <small>today</small>
              </div>

              <div className="home-preview-stat">
                <span>Habits</span>
                <strong>80%</strong>
                <small>completion</small>
              </div>

              <div className="home-preview-stat">
                <span>Distraction</span>
                <strong>1.1 hrs</strong>
                <small>today</small>
              </div>

            </div>

            <div className="home-preview-focus">

              <div className="home-preview-section-title">
                <div>
                  <span>THIS WEEK</span>
                  <strong>Focus Overview</strong>
                </div>

                <small>4.2h</small>
              </div>

              <div className="home-mini-chart">
                <span style={{ height: '38%' }} />
                <span style={{ height: '58%' }} />
                <span style={{ height: '45%' }} />
                <span style={{ height: '72%' }} />
                <span style={{ height: '86%' }} />
                <span style={{ height: '62%' }} />
                <span style={{ height: '78%' }} />
              </div>

              <div className="home-chart-labels">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>

            </div>

            <div className="home-preview-bottom">

              <div>
                <span>Today's Schedule</span>
                <strong>3 activities</strong>
              </div>

              <div className="home-preview-progress">
                <span />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* INTRO */}

      <section className="home-intro">
        <div className="home-intro-inner">

          <p className="home-eyebrow">
            EVERYTHING CONNECTED
          </p>

          <h2>
            Productivity is more than
            <br />
            a single habit.
          </h2>

          <p>
            FocusFlow gives you a centralized view of the areas
            that influence how you spend your resources, time and
            attention.
          </p>

        </div>
      </section>

      {/* MODULES */}

      <section className="home-modules">
        <div className="home-modules-inner">

          <div className="home-section-heading">
            <div>
              <p className="home-eyebrow">CORE MODULES</p>

              <h2>
                Everything in
                <br />
                one place.
              </h2>
            </div>

            <p>
              Six connected areas designed to help you
              understand and manage your everyday productivity.
            </p>
          </div>

          <div className="home-module-grid">

            {modules.map((module, index) => {
              const Icon = module.icon

              return (
                <div
                  className="home-module-card"
                  key={module.title}
                >
                  <div className="home-module-number">
                    0{index + 1}
                  </div>

                  <div className="home-module-icon">
                    <Icon />
                  </div>

                  <h3>{module.title}</h3>

                  <p>{module.description}</p>

                  <span className="home-module-line" />
                </div>
              )
            })}

          </div>

        </div>
      </section>

      {/* LOGIC */}

      <section className="home-logic">
        <div className="home-logic-inner">

          <div className="home-logic-heading">
            <p className="home-eyebrow">THE FOCUSFLOW APPROACH</p>

            <h2>
              Understand where
              <br />
              your resources go.
            </h2>
          </div>

          <div className="home-logic-grid">

            <div className="home-logic-item">
              <span>01</span>
              <strong>Money</strong>
              <p>
                Understand where your financial resources are going.
              </p>
            </div>

            <div className="home-logic-item">
              <span>02</span>
              <strong>Time</strong>
              <p>
                See how your available time is being allocated.
              </p>
            </div>

            <div className="home-logic-item">
              <span>03</span>
              <strong>Habits</strong>
              <p>
                Build consistency through repeated actions.
              </p>
            </div>

            <div className="home-logic-item">
              <span>04</span>
              <strong>Distractions</strong>
              <p>
                Identify activities that consume your attention.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}

      <section className="home-cta">
        <div className="home-cta-inner">

          <p className="home-eyebrow">
            START WITH FOCUSFLOW
          </p>

          <h2>
            Take control of
            <br />
            your day.
          </h2>

          <p>
            Bring your productivity system together in one place.
          </p>

          <Link
            to="/register"
            className="home-primary-button"
          >
            Create Your Account
            <FiArrowRight />
          </Link>

        </div>
      </section>

      {/* FOOTER */}

      <footer className="home-footer">
        <div className="home-footer-inner">

          <div className="home-footer-brand">
            <span className="home-footer-mark">
              <span />
            </span>

            <strong>FocusFlow</strong>
          </div>

          <p>
            Personal Productivity Management System
          </p>

        </div>
      </footer>

    </div>
  )
}

export default Home