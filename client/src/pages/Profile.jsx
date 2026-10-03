import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user, logout } = useAuth()
  const [showLogout, setShowLogout] = useState(false)

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          User information is not available.
        </div>
      </div>
    )
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <div className="container py-4">

      {/* HEADER */}

      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          Profile
        </h2>

        <p className="text-muted mb-0">
          Manage your FocusFlow account and
          authentication settings.
        </p>
      </div>

      {/* PROFILE HEADER */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">

          <div className="d-flex align-items-center">

            <div
              className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold me-3"
              style={{
                width: '70px',
                height: '70px',
                fontSize: '24px',
              }}
            >
              {initials}
            </div>

            <div>

              <h4 className="fw-bold mb-1">
                {user.name}
              </h4>

              <p className="text-muted mb-2">
                {user.email}
              </p>

              <span className="badge text-bg-success">
                Active Account
              </span>

            </div>

          </div>

        </div>
      </div>

      <div className="row g-4">

        {/* ACCOUNT INFORMATION */}

        <div className="col-lg-7">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body p-4">

              <div className="mb-4">

                <h5 className="fw-bold mb-1">
                  Account Information
                </h5>

                <small className="text-muted">
                  Basic information associated with
                  your FocusFlow account.
                </small>

              </div>

              <div className="mb-3">

                <label className="form-label text-muted fw-semibold">
                  Name
                </label>

                <div className="form-control bg-light">
                  {user.name}
                </div>

              </div>

              <div className="mb-3">

                <label className="form-label text-muted fw-semibold">
                  Email Address
                </label>

                <div className="form-control bg-light">
                  {user.email}
                </div>

              </div>

              <div>

                <label className="form-label text-muted fw-semibold">
                  Account Status
                </label>

                <div className="form-control bg-light d-flex align-items-center">

                  <span
                    className="bg-success rounded-circle me-2"
                    style={{
                      width: '8px',
                      height: '8px',
                    }}
                  />

                  Active

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* SECURITY */}

        <div className="col-lg-5">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body p-4">

              <h5 className="fw-bold mb-1">
                Security
              </h5>

              <small className="text-muted d-block mb-4">
                Authentication information for your
                current session.
              </small>

              <div className="bg-light rounded p-3 mb-4">

                <div className="d-flex justify-content-between align-items-center mb-2">

                  <span className="text-muted">
                    Authentication
                  </span>

                  <span className="badge text-bg-success">
                    JWT
                  </span>

                </div>

                <small className="text-muted">
                  Your protected requests use JSON Web
                  Token authentication.
                </small>

              </div>

              <div className="border rounded p-3">

                <small className="text-muted d-block mb-1">
                  Session Status
                </small>

                <strong>
                  Authenticated
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ACCOUNT ACTIONS */}

      <div className="card border-0 shadow-sm mt-4">

        <div className="card-body p-4">

          <div className="row align-items-center">

            <div className="col-md-8">

              <h5 className="fw-bold mb-1">
                Account Actions
              </h5>

              <p className="text-muted mb-0">
                Sign out of your FocusFlow account on
                this device.
              </p>

            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">

              {!showLogout ? (

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    setShowLogout(true)
                  }
                >
                  Logout
                </button>

              ) : (

                <div>

                  <p className="small text-muted mb-2">
                    Are you sure you want to logout?
                  </p>

                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={logout}
                  >
                    Yes, Logout
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowLogout(false)
                    }
                  >
                    Cancel
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile