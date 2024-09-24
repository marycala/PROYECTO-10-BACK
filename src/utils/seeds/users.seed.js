const mongoose = require('mongoose')
const User = require('../../api/models/users')
const users = require('../../data/users')

const throwSeedUsers = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://marycala87:eLij1Mw0zn9zjDJo@cluster0.ntci8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )

    await User.collection.drop()
    console.log('Users eliminated')

    await User.insertMany(users)
    console.log('Users introduced')

    await mongoose.disconnect()
    console.log('Disconnect from DB')
  } catch (error) {
    console.log(error)
  }
}

throwSeedUsers()
