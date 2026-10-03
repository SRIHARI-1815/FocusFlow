import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import Dashboard from './pages/Dashboard'
import Money from './pages/Money'
import Habits from './pages/Habits'
import Distractions from './pages/Distractions'
import Projects from './pages/Projects'
import Planner from './pages/Planner'
import Profile from './pages/Profile'

function App() {
  return (
    <>
      {/* Main Navigation */}
      <Navbar />

      {/* Application Routes */}
      <Routes>

        {/* =========================
            PUBLIC ROUTES
            ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            PROTECTED ROUTES
            ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/money"
            element={<Money />}
          />

          <Route
            path="/habits"
            element={<Habits />}
          />

          <Route
            path="/distractions"
            element={<Distractions />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/planner"
            element={<Planner />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Routes>
    </>
  )
}

export default App