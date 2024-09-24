const Attendee = require('../models/attendees')
const Event = require('../models/events')

const registerAttendees = async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const existingAttendee = await Attendee.findOne({ userId, eventId: id })
    if (existingAttendee) {
      return res
        .status(400)
        .json({ message: 'Attendee already registered for this event' })
    }

    const attendee = new Attendee({
      userId,
      eventId: id
    })
    await attendee.save()

    await Event.findByIdAndUpdate(
      id,
      { $push: { attendees: attendee._id } },
      { new: true }
    )

    return res
      .status(200)
      .json({ message: 'Attendee registered successfully', attendee })
  } catch (error) {
    console.log('Error registering attendee:', error)
    return res
      .status(500)
      .json({ message: 'There was a problem, please try again later' })
  }
}

const deleteAttendee = async (req, res) => {
  const { id } = req.params

  try {
    const attendee = await Attendee.findById(id)
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' })
    }
    const { eventId } = attendee
    const deleteAttendee = await Attendee.findByIdAndDelete(id)
    if (!deleteAttendee) {
      return res.status(404).json({ message: 'Attendee not found' })
    }
    const updateListAttendancesEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $pull: { attendees: id }
      },
      { new: true }
    )
    if (!updateListAttendancesEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }
    return res.status(200).json({
      message: `Event: ${updateListAttendancesEvent.title} cancelled`
    })
  } catch (error) {
    console.error('Error interno del servidor', error)
    return res.status(500).json({ message: 'Internal error' })
  }
}

module.exports = {
  registerAttendees,
  deleteAttendee
}
