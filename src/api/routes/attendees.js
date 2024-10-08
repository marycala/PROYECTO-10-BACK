const { isAuth } = require('../../middlewares/isAuth')

const {
  registerAttendees,
  deleteAttendee
} = require('../controllers/attendees')

const attendeesRouter = require('express').Router()

attendeesRouter.post('/:id', registerAttendees)
attendeesRouter.delete('/:id', isAuth, deleteAttendee)

module.exports = attendeesRouter
