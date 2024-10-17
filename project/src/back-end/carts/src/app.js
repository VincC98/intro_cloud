const express = require('express')
const log = require('debug')('carts-d')

const app = express.Router()
const db =
  process.env.WITH_PERSISTENT_DATA ? require('./utils/crud-wp') : require('./utils/crud')

//create or update a cart in the db
app.post('/cart', (req, res) => {
  var usr = req.body.username
  var cart = req.body.cart

  return db.saveCart(usr, cart)
    .then((token) => {
      res.status(200).json({ status: 'success', token })
    })
    .catch((err) => {
      return db.loadCart(usr)
        .then((res_db) => {
            res.status(200).json({ status: 'success', res_db})
            return db.updateCart(usr, cart, res_db["_rev"])
              .then((resp) => {
                log(resp)
              })
        .catch((err) => {
            res.status(409).json({ status: 'error', message: String(err) })
        })
      
      })
    })  
})
//del user cart
app.post('/cart/delete', (req, res) => {
  var usr = req.body.username
  log(usr)
  return db.loadCart(usr)
    .then((res_db) => {
        return db.delCart(usr, res_db["_rev"])
          .then((resp) => {
            res.status(200).json({ status: 'success', resp})
          })
    .catch((err) => {
        res.status(409).json({ status: 'error', message: String(err) })
      })
    })
  }) 
 
//retrieve a cart 
app.get('/cart/:username', (req, res) => {
  var usr = req.params.username
  log(`Getting cart of user : (${usr})`)
  return db.loadCart(usr)
    .then((res_db) => {
      res.status(200).json({ status: 'success', res_db})
      log(`response from db ${res_db["_rev"]}`)
    })
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })
    })
    
})

module.exports = app
