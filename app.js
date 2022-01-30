const express = require('express');
const bodyParser = require('body-parser');


const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorsController = require('./controllers/errors')

const {mongoConnect} = require('./utility/database');
const User = require('./models/User');


const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended:false }))

/* ----------------- Adding Temp User ----------------- */
app.use((req, res, next) => {
  User.findById('61f5bf3e4dfdf98e06e44fe3')
    .then(user=>{
      req.user = user;
      next()
    })
    .catch(err => console.log(err))
})

/* ----------------- All User Routes ----------------- */
app.use('/admin', adminRouter);
app.use(shopRoutes)

app.use(errorsController.get404)

mongoConnect(()=>{
  app.listen(3000, ()=> console.log('Server running...'))
})
