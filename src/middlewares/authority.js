const Event = require('../api/models/events')
const User = require('../api/models/users')

const Authority = async (req, res, next) => {
  const { user } = req
  const { id } = req.params
  const event = await Event.findById(id)
  const isUser = await User.findById(event.creator)
  const isAdmin = user.roles.includes('admin')
  if (isUser._id.toString() === user._id.toString() || isAdmin) next()
  else
    return res
      .status(404)
      .json({ message: 'You do not have permission to modify this event' })
}

module.exports = { Authority }
