const log = require('debug')('logs-d')

//in this file link with couchDB 
var logsDB = require('nano')(process.env.DB_URL)

function saveLogs (usr, action, logs) {
  return new Promise((resolve, reject) => {
    let current_date = new Date().toUTCString();
    logsDB.insert({"user": usr, "action": action, "log" : logs, "date" : current_date}, (error, success) => {
        if (success) {
          resolve(console.log(`Log has been stored`))
        } else {
          reject(
            new Error(`Error when trying to save log. Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}



module.exports = {
  saveLogs,

}
