const {
  registerAttendees,
  deleteAttendee
} = require('../controllers/attendees')

const attendeesRouter = require('express').Router()

attendeesRouter.post('/:eventId', registerAttendees)
attendeesRouter.delete('/:attendeeId', deleteAttendee)

module.exports = attendeesRouter
