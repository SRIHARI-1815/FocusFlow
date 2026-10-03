const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const protect = require('./middleware/authMiddleware')
const moneyRoutes = require('./routes/moneyRoutes')
const habitRoutes = require('./routes/habitRoutes')
const habitLogRoutes = require('./routes/habitLogRoutes')
const distractionRoutes = require('./routes/distractionRoutes')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')
const plannerRoutes = require('./routes/plannerRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const savingsGoalRoutes = require('./routes/savingsGoalRoutes')

console.log('DASHBOARD ROUTES:', dashboardRoutes)
console.log('DASHBOARD ROUTES TYPE:', typeof dashboardRoutes)


dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Simple POST test route
app.post('/api/test', (req, res) => {
  res.json({
    message: 'POST route is working',
  })
})

// Authentication routes
app.use('/api/auth', authRoutes)

app.use('/api/transactions', moneyRoutes)

app.use('/api/habits', habitRoutes)

app.use('/api/habit-logs', habitLogRoutes)

app.use('/api/distractions', distractionRoutes)

app.use('/api/projects', projectRoutes)

app.use('/api/tasks', taskRoutes)

app.use('/api/timeblocks', plannerRoutes)

app.use('/api/dashboard', dashboardRoutes)

app.use('/api/savings-goals', savingsGoalRoutes)



// Test GET route
app.get('/', (req, res) => {
  res.json({
    message: 'FocusFlow API is running',
  })
})

const PORT = process.env.PORT || 5000

app.get('/api/protected', protect, (req, res) => {
  res.json({
    message: 'You accessed a protected route',
    userId: req.user.userId,
  })
})


app.listen(PORT, () => {
  console.log(`FocusFlow server running on port ${PORT}`)
})