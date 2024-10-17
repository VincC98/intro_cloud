//in this file link with couchDB 
var checkoutDB = require('nano')(process.env.DB_URL)

function saveCheckout (usr, checkout) {
  return new Promise((resolve, reject) => {
    checkoutDB.insert({ "checkout" : checkout}, usr, (error, success) => {
        if (success) {
          resolve(console.log(`Checkout history has been created for user ${usr} , with history ${checkout}`))
        } else {
          reject(
            new Error(`Error when trying to save (${usr})'s checkout. Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}


function updateCheckout (usr, checkout, _rev) {
  return new Promise((resolve, reject) => {
    checkoutDB.insert({ "checkout" : checkout, "_rev": _rev}, usr, (error, success) => {
        if (success) {
          resolve(console.log(`Checkout history has been updated for user ${usr}`))
        } else {
          reject(
            new Error(`Error when trying to save (${usr})'s checkout. Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}


function loadCheckout (usrName) {
  return new Promise((resolve, reject) => {
    checkoutDB.get(usrName, (error, success) => {
      if (success) {
        resolve(success)
      } else {
        reject(new Error(`To fetch information of user . Reason: ${error.reason}.`))
      }
    })
  })
}



module.exports = {
  saveCheckout,
  updateCheckout,
  loadCheckout
}
