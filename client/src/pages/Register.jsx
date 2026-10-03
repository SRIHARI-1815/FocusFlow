import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiUser,
  FiMail,
  FiLock,
} from 'react-icons/fi'
import { registerUser } from '../services/authService'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      alert('Registration successful. Please login.')

      navigate('/login')
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Registration failed'
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
              GET STARTED
            </p>

            <h1>Create account</h1>

            <p>
              Start managing your time, money
              and habits in one place.
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
              <label htmlFor="name">
                Full Name
              </label>

              <div className="auth-input-wrapper">
                <FiUser />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="auth-input-wrapper">
                <FiLock />

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="6"
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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
              Already have an account?
            </span>

            <Link to="/login">
              Login
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

export default Register