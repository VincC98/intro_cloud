const log = require('debug')('reco-d')

//in this file link with couchDB 
var recoDB = require('nano')(process.env.DB_URL)
var logsDB = require('nano')(process.env.DB_URL_LOG)

function saveRecommendation (recommendation) {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`; 
    recoDB.insert({'_id':formattedDate,"recommendation": recommendation}, (error, success) => {
        if (success) {
          resolve(console.log(`recommendation has been stored`))
        } else {
          reject(
            new Error(`Error when trying to save log. Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}
function loadRecommendation (date) {
  return new Promise((resolve, reject) => {
    recoDB.get(date, (error, success) => {
      if (success) {
        resolve(success)
      } else {
        reject(new Error(`To fetch information of recommendation (${date}). Reason: ${error.reason}.`))
      }
    })
  })
}






module.exports = {
  saveRecommendation,
  loadRecommendation
}
