const express = require('express')
const log = require('debug')('reco-d')

const app = express.Router()
const db = require('./utils/crud-wp')

  
  app.get('/recommendations/', (req, res) => {

  
      //query log DB map/reduce function or view
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
      return db.loadRecommendation(formattedDate)
        .then((res_db) => {
          res.status(200).json({ status: 'success', res_db})
          })
          .catch((err) => {
                res.status(409).json({ status: 'error', message: String(err) })
          }) 

      });
    
  app.post('/recommendations/', (req, res) => {
    var reco = req.body.recommendations
    log(reco)
    return db.saveRecommendation(reco)
        .then((res_db) => {
          res.status(200).json({ status: 'success', res_db})
          })
          .catch((err) => {
                res.status(409).json({ status: 'error', message: String(err) })
          }) 

  });

  

module.exports = app
