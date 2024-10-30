const { generateSign, verifySign } = require('../../utils/jwt')
const User = require('../models/users')
const bcrypt = require('bcrypt')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate({
      path: 'events',
      select: 'title'
    })
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).populate({
      path: 'event',
      select: 'title'
    })
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const register = async (req, res, next) => {
  const { email, password, userName } = req.body

  try {
    const emailDuplicated = await User.findOne({ email })
    if (emailDuplicated) {
      return res.status(400).json({ message: 'The user already exists' })
    }

    const newUser = new User({ userName, email, password })
    await newUser.save()

    const userToReturn = newUser.toObject()
    delete userToReturn.password

    return res
      .status(201)
      .json({ message: 'User created successfully', user: userToReturn })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = generateSign(user._id)

      try {
        verifySign(token)
        return res.status(200).json({ token, user })
      } catch (error) {
        return res
          .status(401)
          .json({ message: 'Session expired. Please log in again.' })
      }
    } else {
      return res.status(400).json({ message: 'Incorrect email or password' })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params

    if (req.user._id.toString() !== id) {
      return res.status(400).json('You are not authorized')
    }

    const { email } = req.body
    if (!email) {
      return res.status(400).json('Email is required')
    }

    const userUpdated = await User.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    )

    if (!userUpdated) {
      return res.status(404).json('User not found')
    }

    return res.status(200).json(userUpdated)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = {
  getUsers,
  getUserById,
  register,
  login,
  updateUser
}
