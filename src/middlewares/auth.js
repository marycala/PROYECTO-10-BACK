const User = require('../api/models/users')
const { verifySign } = require('../utils/jwt')

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json('Authorization token is missing')
    }

    const parsedToken = token.replace('Bearer ', '')

    const { id } = verifySign(parsedToken)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json('Invalid token or ID')
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json('User not found')
    }

    user.password = null
    req.user = user
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { isAuth }
