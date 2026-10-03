import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiLock, FiMail } from 'react-icons/fi'
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    try {
      setLoading(true)

      const data = await loginUser(formData)

      login(data.user, data.token)

      navigate('/dashboard')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-brand">
          <Link to="/" className="auth-brand-link">
            <span className="auth-brand-mark">
              <span />
            </span>

            <span>FocusFlow</span>
          </Link>
        </div>

        <div className="auth-card">

          <div className="auth-card-header">
            <p className="auth-eyebrow">
              WELCOME BACK
            </p>

            <h1>Sign in</h1>

            <p>
              Continue managing your time,
              habits and productivity.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            <div className="auth-field">
              <label htmlFor="email">
                Email
              </label>

              <div className="auth-input-wrapper">
                <FiMail />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="auth-input-wrapper">
                <FiLock />

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <FiArrowRight />
                </>
              )}
            </button>

          </form>

          <div className="auth-divider">
            <span />
            <small>OR</small>
            <span />
          </div>

          <div className="auth-register">
            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
              <FiArrowRight />
            </Link>
          </div>

        </div>

        <p className="auth-footer-text">
          Personal Productivity Management System
        </p>

      </div>

    </div>
  )
}

export default Login