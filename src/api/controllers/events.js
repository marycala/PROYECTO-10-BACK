const { deleteFile } = require('../../utils/deleteFile')
const Event = require('../models/events')
const User = require('../models/users')

const createEvent = async (req, res, next) => {
  try {
    const userId = req.user._id

    const eventDuplicated = await Event.findOne({ title: req.body.title })

    if (eventDuplicated) {
      return res.status(400).json({ message: 'This event already exists' })
    }

    const eventData = { ...req.body }

    if (req.file) {
      eventData.img = req.file.path
    } else if (req.body.img) {
      eventData.img = req.body.img
    } else {
      eventData.img = null
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    eventData.creator = user._id

    const event = new Event(eventData)

    await event.save()

    const newEvent = await Event.findById(event._id).populate({
      path: 'creator',
      select: 'userName'
    })

    return res.status(201).json({
      message: 'Event created successfully',
      newEvent
    })
  } catch (error) {
    console.log('Error creating event:', error)
    return res.status(500).json({
      message: 'There was a problem, please try again',
      error: error.message
    })
  }
}

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate({
        path: 'creator',
        select: 'userName'
      })
      .populate({
        path: 'attendees',
        populate: {
          path: 'userId',
          select: 'userName'
        }
      })

    return res.status(200).json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return res.status(500).json({ message: 'Server error', error })
  }
}

const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    const event = await Event.findById(id)
      .populate({
        path: 'creator',
        select: 'userName'
      })
      .populate({
        path: 'attendees',
        populate: {
          path: 'userId',
          select: 'userName'
        }
      })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    return res.status(200).json(event)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const getEventByTitle = async (req, res) => {
  try {
    const { title } = req.params

    if (!title) {
      return res.status(400).json({ message: 'Search term is required' })
    }

    const events = await Event.find({ title: new RegExp(title, 'i') })
      .populate({
        path: 'creator',
        select: 'userName'
      })
      .populate({
        path: 'attendees',
        populate: {
          path: 'userId',
          select: 'userName'
        }
      })

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found' })
    }

    return res.status(200).json(events)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const getEventByDate = async (req, res) => {
  try {
    const { date } = req.params
    const event = await Event.find({ date })
      .populate({
        path: 'creator',
        select: 'userName'
      })
      .populate({
        path: 'attendees',
        populate: {
          path: 'userId',
          select: 'userName'
        }
      })
    if (!date) {
      return res.status(400).json({ message: 'Event not found' })
    }
    return res.status(200).json(event)
  } catch (error) {
    return res.status(500).json({ error: 'Server error', error })
  }
}

const updateEvent = async (req, res) => {
  const { user } = req
  const { id } = req.params
  try {
    const isAdmin = user.roles.includes('admin')

    const event = await Event.findById(id)

    if (!event) return res.status(404).json({ message: 'Event not found' })
    if (req.file) {
      deleteFile(event.img)
      req.body.img = req.file.path
    }
    let updateEvent = await Event.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).populate({
      path: 'creator',
      select: 'userName'
    })
    if (!updateEvent)
      return res.status(400).json({ message: 'Event not found' })

    if (isAdmin) {
      updateEvent = await updateEvent.populate({
        path: 'attendees',
        select: 'userName'
      })
    } else {
      updateEvent.attendees = updateEvent.attendees.length
    }

    return res.status(201).json({ message: 'Event update', updateEvent })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'There was a problem, please try again' })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params
    const event = await Event.findByIdAndDelete(id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    if (event.img) {
      deleteFile(event.img)
    }
    return res.status(200).json({
      message: 'Event successfully removed',
      deletedEvent: event
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getEventByTitle,
  getEventByDate,
  updateEvent,
  deleteEvent
}
