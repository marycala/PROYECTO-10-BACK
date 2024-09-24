const mongoose = require('mongoose')
const Event = require('../../api/models/events')
const events = require('../../data/events')

const throwSeedEvents = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://marycala87:eLij1Mw0zn9zjDJo@cluster0.ntci8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )

    await Event.collection.drop()
    console.log('Events eliminated')

    await Event.insertMany(events)
    console.log('Events introduced')

    await mongoose.disconnect()
    console.log('Disconnect from DB')
  } catch (error) {
    console.log(error)
  }
}

throwSeedEvents()
