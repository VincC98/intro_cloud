
//in this file link with couchDB 
var cartsDB = require('nano')(process.env.DB_URL)

function saveCart (usr, cart) {
  return new Promise((resolve, reject) => {
    cartsDB.insert({ "cart" : cart}, usr, (error, success) => {
        if (success) {
          resolve(console.log(`Cart has been created for user ${usr} , with cart ${cart}`))
        } else {
          reject(
            new Error(`Error when trying to save (${usr})'s cart. Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}


function updateCart (usr, cart, _rev) {
  return new Promise((resolve, reject) => {
    cartsDB.insert({ "cart" : cart, "_rev": _rev}, usr, (error, success) => {
        if (success) {
          resolve(console.log(`Cart has been updated for user ${usr}`))
        } else {
          reject(
            new Error(`Error when trying to save (${usr})'s cart. Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}


function loadCart (usrName) {
  return new Promise((resolve, reject) => {
    cartsDB.get(usrName, (error, success) => {
      if (success) {
        resolve(success)
      } else {
        reject(new Error(`To fetch information of user . Reason: ${error.reason}.`))
      }
    })
  })
}

function delCart (usr, _rev) {
  return new Promise((resolve, reject) => {
    cartsDB.destroy(usr, _rev ,(error, success) => {
        if (success) {
          resolve(console.log(`Cart has been deleted for user ${usr}`))
        } else {
          reject(
            new Error(`Error when trying to delete (${usr})'s cart. Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}


module.exports = {
  saveCart,
  updateCart,
  loadCart,
  delCart
}
