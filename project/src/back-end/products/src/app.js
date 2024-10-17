const express = require('express')
const log = require('debug')('products-d')

const app = express.Router()
const db =
  process.env.WITH_PERSISTENT_DATA ? require('./utils/crud-wp') : require('./utils/crud')

//create or update a product in the db
app.post('/product', (req, res) => {

  var name = req.body.name
  var image = req.body.image
  var price = req.body.price
  var category = req.body.category
  var description = req.body.description
  log(name)
  return db.saveProduct(name, price, image, category,description)
    .then((resp) => {
      res.status(200).json({ status: 'success', resp })
    })
    .catch((err) => {
      res.status(409).json({ status: 'error', message: String(err) })

    })  
})

//update a product
app.post('/product/update', (req, res) => {

  var name = req.body.name
  var id = req.body._id
  var image = req.body.image
  var price = req.body.price
  var category = req.body.category
  var description = req.body.description


  return db.loadProduct(id)
    .then((res_db) => {

      res.status(200).json({ status: 'success', res_db})
      log(`response from db ${res_db["_rev"]}`)

      return db.updateProduct( name, price, image, category,description, id, res_db["_rev"])
        .then((resp) => {
          log(resp)
        })
        .catch((err) => {
            res.status(409).json({ status: 'error', message: String(err) })
          })
        })
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })
    })
})

 
//retrieve a product 
app.get('/product/:product', (req, res) => {
  var product = req.params.product
  if(product == `all`){
    log(`Retrieve all porducts`)
    return db.loadAllProduct()
      .then((res_db) => {
        res.status(200).json({ status: 'success', res_db})
        log(`response from db ${res_db}`)
      })
      .catch((err) => {
        res.status(404).json({ status: 'error', message: String(err) })
      })
  }
  else{
    log(`Retrieve porduct : (${product})`)
    return db.loadProduct(product)
    .then((res_db) => {
      res.status(200).json({ status: 'success', res_db})
      log(`response from db ${res_db["_rev"]}`)
    })
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })

    })
  }
})

//delete a product 
app.get('/product/delete/:product', (req, res) => {
  var product = req.params.product
  log(`Deleting porduct : (${product})`)
  return db.loadProduct(product)
    .then((res_db) => {
      res.status(200).json({ status: 'success', res_db})
      log(`response from db ${res_db["_rev"]}`)
      return db.delProduct(product, res_db["_rev"])
        .then((resp) => {
          log(resp)
        })
    })
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })
    })
})

module.exports = app
