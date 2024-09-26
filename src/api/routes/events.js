const { isAuth } = require('../../middlewares/isAuth')
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

eventsRouter.post('/create/:id', isAuth, upload.single('img'), createEvent)
eventsRouter.get('/', getEvents)
eventsRouter.get('/:id', getEventById)
eventsRouter.get('/search/title/:title', getEventByTitle)
eventsRouter.get('/search/date/:date', getEventByDate)
eventsRouter.put('/:id', upload.single('img'), isAuth, updateEvent)
eventsRouter.delete('/:id', isAuth, deleteEvent)

module.exports = eventsRouter
