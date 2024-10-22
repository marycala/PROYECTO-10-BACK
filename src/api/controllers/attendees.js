const Attendee = require('../models/attendees')
const Event = require('../models/events')
const User = require('../models/users')

const registerAttendees = async (req, res) => {
  const { userId } = req.body
  const eventId = req.params.eventId

  try {
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const existingAttendee = await Attendee.findOne({ userId, eventId })
    if (existingAttendee) {
      return res
        .status(400)
        .json({ message: 'Attendee already registered for this event' })
    }

    const attendee = new Attendee({
      userId,
      eventId
    })
    await attendee.save()

    await Event.findByIdAndUpdate(
      eventId,
      { $push: { attendees: attendee._id } },
      { new: true }
    )

    await User.findByIdAndUpdate(
      userId,
      { $push: { events: event._id } },
      { new: true }
    )

    return res
      .status(200)
      .json({ message: 'Attendee registered successfully', attendee })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'There was a problem, please try again later' })
  }
}

const deleteAttendee = async (req, res) => {
  const { attendeeId } = req.params

  try {
    const attendee = await Attendee.findById(attendeeId)
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' })
    }

    const { eventId, userId } = attendee

    await Attendee.findByIdAndDelete(attendeeId)

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: attendee._id } },
      { new: true }
    )

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { events: eventId } },
      { new: true }
    )

    return res.status(200).json({
      message: `Attendance for event: ${updatedEvent.title} cancelled`
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' })
  }
}

module.exports = {
  registerAttendees,
  deleteAttendee
}
