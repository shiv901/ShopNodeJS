const express = require('express');
const bodyParser = require('body-parser');


const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorsController = require('./controllers/errors')

const sequelize = require('./utility/database')


const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended:false }))

app.use('/admin', adminRouter);
app.use(shopRoutes)

app.use(errorsController.get404)

sequelize.sync()
  .then(()=>{
    app.listen(3000, ()=> console.log('Server running...'))
  })
  .catch(err => console.log(err))

