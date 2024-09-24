const {
  getUsers,
  getUserById,
  register,
  login,
  updateUser
} = require('../controllers/users')

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUserById)
usersRouter.post('/register', register)
usersRouter.post('/login', login)
usersRouter.put('/', updateUser)

module.exports = usersRouter
