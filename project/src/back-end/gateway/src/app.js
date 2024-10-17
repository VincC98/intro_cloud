const express = require('express')
const log = require('debug')('gateway-d')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')


//to modify
const url = 'http://192.168.56.102'

const app = express.Router()
const url_authentification =  `${url}:3001`
const url_cart =  `${url}:3004`
const url_checkout =  `${url}:3005`
const url_logs =  `${url}:3007`
const url_products = `${url}:3009`
const url_recommendations = `${url}:3012`


function computeRecommendations() {
  return new Promise((resolve, reject) => {
    const mapReduce = 'http://admin:admin@192.168.56.102:3008/logs/_design/queries/_view/previous_checkout_sum?group=true';

    axios.get(mapReduce)
      .then(response => {
        
        //sort the array of objects by value in descending order
        const sortedMap = response.data.rows.sort((a, b) => b.value - a.value);

        //extract the three highest values
        const highestValues = sortedMap.slice(0, 4);
        resolve(highestValues); 
      })
      .catch(error => {
        reject(error); 
      });
  });
}
app.post('/recommendations', async (req, res) => {
  let reco = await computeRecommendations();
  log("inside post recommendations")
  log(reco)
  axios.post(`${url_recommendations}/recommendations`, { recommendations : reco})
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})

app.get('/recommendations', (req, res) => {
  axios.get(`${url_recommendations}/recommendations`)
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})
//for JWT verification
app.use(cookieParser());
app.use(cors({ credentials: true, origin: `${url}:3000`}));
/**
 * middleware function that verifies the integrity of the token (sent inside the cookie)
 */
const verifyToken = (req, res, next) => {

    const token = req.cookies.ScappSession

    // Verify the token using the secret key used in the authentification microservice
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      log(err)
      if (err) {
        return res.sendStatus(403); //forbidden if token is invalid
      }
      log("JWT valide")
      req.user = user; 
      next(); //continue to the next request
      });
};

/**
 * middleware function to compute the time between request found on this blog:
 * https://ipirozhenko.com/blog/measuring-requests-duration-nodejs-express/
 */
const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} [STARTED]`)
  const start = process.hrtime()

  res.on('finish', () => {            
      const durationInMilliseconds = getDurationInMilliseconds (start)
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
      let logs = {method : req.method, url : req.originalUrl, respStatus : res.statusCode};
      axios.post(`${url_logs}/logs`, { username : "performance_user", action : "microservice performance", log : logs})
  })
  next()
})
//gateway for authentification service (no token verification)
app.post('/user', (req, res) => {
  var username = req.body.username
  var password = req.body.password
  axios
  .post(`${url_authentification}/user`, { username, password })
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})

app.get('/user/:username/:password', (req, res) => {
  var username = req.params.username
  var password = req.params.password
  
  axios
			.get(`${url_authentification}/user/${username}/${password}`, { username, password })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => {
        res.status(409).json({ status: 'error', message: String(err) });
      });
})
//from there token verification for each microservice
//gateway for cart service
app.post('/cart', verifyToken, (req, res) => {
  var usr = req.user.sub
  var cart = req.body.cart
  axios.post(`${url_cart}/cart`, { username : usr, cart : cart })
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})

app.post('/cart/delete', verifyToken, (req, res) => {
  var username = req.user.sub
  log(username)
  axios.post(`${url_cart}/cart/delete`, { username : username})
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})

app.get('/cart', verifyToken, (req, res) => {
  var username = req.user.sub
  axios
      .get(`${url_cart}/cart/${username}`)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => {
        res.status(409).json({ status: 'error', message: String(err) });
      });
})

//gateway for checkout service
app.post('/checkout', verifyToken, (req, res) => {
  var usr = req.user.sub
  var prevCheckout = req.body.checkout
  axios.post(`${url_checkout}/checkout`, { username : usr, checkout : prevCheckout})
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})

app.get('/checkout', verifyToken, (req, res) => {
  var username = req.user.sub
  axios
      .get(`${url_checkout}/checkout/${username}`)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => {
        res.status(409).json({ status: 'error', message: String(err) });
      });
})
//gateway for products service
app.post('/product', verifyToken, (req, res) => {

  modalProduct = { name: req.body.name, price: req.body.price, category: req.body.category, image: req.body.image, description: req.body.description};
  axios.post(`${url_products}/product`, modalProduct)
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})

app.post('/product/update', verifyToken, (req, res) => {

  modalProduct = {_id:req.body._id , name: req.body.name, price: req.body.price, category: req.body.category, image: req.body.image, description: req.body.description};
  axios.post(`${url_products}/product/update`, modalProduct)
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})

app.get('/product/delete/:name', verifyToken, (req, res) => {
  var name = req.params.name
  axios.get(`${url_products}/product/delete/${name}`)
    .then((response) => {
      res.status(200).json(response.data);
      })
      .catch((err) => {
        res.status(409).json({ status: 'error', message: String(err) });
      });
})
//no need to verify token since non logged user can see the products too
app.get('/product/:name', (req, res) => {
  var name = req.params.name
  axios.get(`${url_products}/product/${name}`)
    .then((response) => {
      res.status(200).json(response.data);
      })
      .catch((err) => {
        res.status(409).json({ status: 'error', message: String(err) });
      });
})

//gateway for logs service
app.post('/logs', verifyToken, (req, res) => {
  var usr = req.user.sub
  var req_action = req.body.action
  var logs = req.body.log
  log(req.user.sub)
  axios.post(`${url_logs}/logs`, { username : usr, action : req_action, log : logs})
  .then((response) => {
    
    res.status(200).json(response.data);
  })
  .catch((err) => {
    res.status(409).json({ status: 'error', message: String(err) });
  });
})



module.exports = app
