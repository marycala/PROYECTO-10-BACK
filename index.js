require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const eventsRouter = require('./src/api/routes/events')
const usersRouter = require('./src/api/routes/users')
const attendeesRouter = require('./src/api/routes/attendees')
const cloudinary = require('cloudinary').v2
const cors = require('cors')

const app = express()

connectDB()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://proyecto-10-back-mu.vercel.app',
      'https://proyecto-10-front-one.vercel.app'
    ],
    credentials: true
  })
)

app.use(express.json())

app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/attendees', attendeesRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
