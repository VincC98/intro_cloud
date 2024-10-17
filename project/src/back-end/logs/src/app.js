const express = require('express')
const log = require('debug')('logs-d')

const app = express.Router()
const db =
  process.env.WITH_PERSISTENT_DATA ? require('./utils/crud-wp') : require('./utils/crud')

//post log to the db
//user performance 
app.post('/logs', (req, res) => {
  var usr = req.body.username
  var action = req.body.action
  var logs = req.body.log//can be use for data of a specific actiob
  log(usr)
  log(action)
  log(logs)
  return db.saveLogs(usr, action, logs)
    .then((token) => {
      res.status(200).json({ status: 'success', token })
    })
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })
    })

})

module.exports = app
