const express = require('express')
const log = require('debug')('checkout-d')

const app = express.Router()
const db =
  process.env.WITH_PERSISTENT_DATA ? require('./utils/crud-wp') : require('./utils/crud')

//create or update a checkout in the db
app.post('/checkout', (req, res) => {
  var usr = req.body.username
  var checkout = req.body.checkout
  return db.saveCheckout(usr, checkout)
    .then((token) => {
      res.status(200).json({ status: 'success', token })
    })
    .catch((err) => {
      //pas de fonction update dans nano du coup obligé de recupérer le _rev pour remplacer 
      return db.loadCheckout(usr)
        .then((res_db) => {
            res.status(200).json({ status: 'success', res_db})
            return db.updateCheckout(usr, checkout, res_db["_rev"])
              .then((resp) => {
                log(resp)
              })
        .catch((err) => {
            res.status(409).json({ status: 'error', message: String(err) })
        })
      
      })
    })  
})
 
//retrieve a checkout 
app.get('/checkout/:username', (req, res) => {
  var usr = req.params.username
  log(`Getting checkout of user : (${usr})`)
  return db.loadCheckout(usr)
    .then((res_db) => {
      res.status(200).json({ status: 'success', res_db})
      log(`response from db ${res_db["_rev"]}`)
    })
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })
    })
    
})

module.exports = app
