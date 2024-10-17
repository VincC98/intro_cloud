const bcrypt = require('bcryptjs')
const tku = require('./en-de-coders')

var carts = {}

function saveCart (usrName, cart) {
  return new Promise((resolve, reject) => {
    if (!carts[usrName]) {
      carts[usrName] = {
        cart
      }
      resolve(tku.encodeToken(usrName))
    } else {
      reject(new Error(`Cart of (${usrName}) already exist.`))
    }
  })
}

function loadCart (usrName, passw) {
  return new Promise((resolve, reject) => {
    if (carts[usrName]) {
      resolve(tku.encodeToken(usrName))
    } else {
      reject(new Error(`User (${usrName}) does not exist`))
    }
  })
}

module.exports = {
  saveCart,
  loadCart
}
