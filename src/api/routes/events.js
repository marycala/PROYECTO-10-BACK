const { isAuth } = require('../../middlewares/auth')
const { Authority } = require('../../middlewares/authority')
const upload = require('../../middlewares/file')
const {
  createEvent,
  getEvents,
  getEventById,
  getEventByTitle,
  getEventByDate,
  updateEvent,
  deleteEvent
} = require('../controllers/events')

const eventsRouter = require('express').Router()

eventsRouter.post('/create', upload.single('img'), isAuth, createEvent)
eventsRouter.get('/', getEvents)
eventsRouter.get('/:id', getEventById)
eventsRouter.get('/search/title/:title', getEventByTitle)
eventsRouter.get('/search/date/:date', getEventByDate)
eventsRouter.put('/:id', upload.single('img'), isAuth, Authority, updateEvent)
eventsRouter.delete('/:id', isAuth, Authority, deleteEvent)

module.exports = eventsRouter
