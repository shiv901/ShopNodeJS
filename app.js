const express = require('express');
const bodyParser = require('body-parser');


const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorsController = require('./controllers/errors')

const mongoose = require('mongoose')
const User = require('./models/User');


const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended:false }))

/* ----------------- Adding Temp User ----------------- */
app.use((req, res, next) => {
  User.findById('61faf11b48a18ab9b1db108e')
    .then(user=>{
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

/* ----------------- All User Routes ----------------- */
app.use('/admin', adminRouter);
app.use(shopRoutes)

app.use(errorsController.get404)

mongoose.connect('mongodb://localhost:27017/Eshop?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')
  .then(()=>{
    User.findOne().then(user => {
      if(!user) {
        const user = new User({
          name: 'John',
          email: 'john@gmail.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(3000, ()=> console.log('Server running...'))
  })
  .catch(err => console.log(err))
