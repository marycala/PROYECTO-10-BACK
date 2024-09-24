const bcrypt = require('bcrypt')

const users = [
  {
    userName: 'Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    events: []
  },
  {
    userName: 'Bob Williams',
    email: 'bob@example.com',
    password: bcrypt.hashSync('bob123', 10),
    events: []
  },
  {
    userName: 'Charlie Brown',
    email: 'charlie@example.com',
    password: bcrypt.hashSync('charlie123', 10),
    events: []
  },
  {
    userName: 'Diana Prince',
    email: 'diana@example.com',
    password: bcrypt.hashSync('diana123', 10),
    events: []
  },
  {
    userName: 'Evan Davis',
    email: 'evan@example.com',
    password: bcrypt.hashSync('evan123', 10),
    events: []
  },
  {
    userName: 'Fiona Hill',
    email: 'fiona@example.com',
    password: bcrypt.hashSync('fiona123', 10),
    events: []
  },
  {
    userName: 'George Miller',
    email: 'george@example.com',
    password: bcrypt.hashSync('george123', 10),
    events: []
  },
  {
    userName: 'Hannah Wilson',
    email: 'hannah@example.com',
    password: bcrypt.hashSync('hannah123', 10),
    events: []
  }
]

module.exports = users
