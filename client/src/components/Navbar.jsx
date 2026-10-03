import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiHome,
  FiGrid,
  FiDollarSign,
  FiCheckCircle,
  FiSmartphone,
  FiFolder,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi'
import { useState } from 'react'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const handleLogout = () => {
    closeMobileMenu()
    logout()
  }

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: FiHome,
      public: true,
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: FiGrid,
    },
    {
      path: '/money',
      label: 'Money',
      icon: FiDollarSign,
    },
    {
      path: '/habits',
      label: 'Habits',
      icon: FiCheckCircle,
    },
    {
      path: '/distractions',
      label: 'Distractions',
      icon: FiSmartphone,
    },
    {
      path: '/projects',
      label: 'Projects',
      icon: FiFolder,
    },
    {
      path: '/planner',
      label: 'Planner',
      icon: FiCalendar,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: FiUser,
    },
  ]

  return (
    <>
      <nav className="ff-navbar">
        <div className="ff-navbar-inner">

          {/* Brand */}
          <Link
            className="ff-brand"
            to="/"
            onClick={closeMobileMenu}
          >
            <span className="ff-brand-mark">
              <span></span>
            </span>

            <span className="ff-brand-text">
              FocusFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="ff-desktop-nav">

            {navItems
              .filter((item) => item.public || isAuthenticated)
              .map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`ff-nav-link ${
                      isActive(item.path) ? 'active' : ''
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

            {isAuthenticated && (
              <button
                type="button"
                className="ff-nav-link ff-logout"
                onClick={logout}
              >
                <FiLogOut size={16} strokeWidth={1.8} />
                <span>Logout</span>
              </button>
            )}

            {!isAuthenticated && (
              <div className="ff-auth-links">
                <Link
                  to="/login"
                  className={`ff-nav-link ${
                    isActive('/login') ? 'active' : ''
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="ff-register-button"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="ff-mobile-menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <FiX size={21} />
            ) : (
              <FiMenu size={21} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="ff-mobile-nav">

            {navItems
              .filter((item) => item.public || isAuthenticated)
              .map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`ff-mobile-nav-link ${
                      isActive(item.path) ? 'active' : ''
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

            {isAuthenticated && (
              <button
                type="button"
                className="ff-mobile-nav-link ff-mobile-logout"
                onClick={handleLogout}
              >
                <FiLogOut size={18} strokeWidth={1.8} />
                <span>Logout</span>
              </button>
            )}

            {!isAuthenticated && (
              <div className="ff-mobile-auth">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="ff-mobile-nav-link"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="ff-mobile-register"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar