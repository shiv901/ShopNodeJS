const express = require('express');
const bodyParser = require('body-parser');


const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorsController = require('./controllers/errors')

const sequelize = require('./utility/database');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');


const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended:false }))

/* -------------------- Adding Temp User -------------------- */
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user=>{
      req.user = user;
      next()
    })
    .catch(err => console.log(err))
})
app.use('/admin', adminRouter);
app.use(shopRoutes)

app.use(errorsController.get404)

/* ******** Model Associations ******** */
Product.belongsTo(User, {constrain: true, onDelete: 'CASCADE'})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})
Order.belongsTo(User)
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem})

sequelize
  // .sync({force: true})
  .sync()
  .then(result =>{
    return User.findByPk(1)
  })
  .then(user => {
    if(!user){
      return User.create({name: 'John', email: 'Johndoe@test.com'})
    }
    return user
  })
  .then(user => {
    return user.createCart()
  })
  .then(cart => {
    app.listen(3000, ()=> console.log('Server running...'))
  })
  .catch(err => console.log(err))

