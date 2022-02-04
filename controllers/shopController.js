const Order = require('../models/Order')
const Product = require('../models/Product')

/* ------------------------------- Index Page ------------------------------- */
exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Shop || Home Page',
    path: '/'
  })
}

/* ------------------------------ Get Products ------------------------------ */
exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        pageTitle: 'Product Details',
        path: 'products'
      })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        products: products,
        path: 'products'
      })
    })
    .catch(err => console.log(err))
}

/* ---------------------------- Get Cart Details ---------------------------- */
exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: 'cart',
        products: products,
      })
    })
    .catch(err => console.log(err))
}
exports.postCart = (req, res, next) => {
  const prodId = req.body.prodId
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

/* ------------------------ Delete from Cart ------------------------ */
exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.prodId
  req.user.removeFromCart(prodId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

/* ------------------------------ Order Details ----------------------------- */
exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'My Orders',
        path: 'orders',
        orders: orders
      })
    })
    .catch(err => console.log(err))
}

exports.postCreateOrder = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(item => {
        return { product: { ...item.productId._doc }, quantity: item.quantity }
      })
      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          userId: req.user
        }
      })
      return order.save()
    })
    .then(result=>{
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.error(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'checkout',
    path: 'checkout'
  })
}