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
  Product.fetchAll()
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
  req.user.getCart()
    .then(products => {
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
    .then(product=>{
      return req.user.addToCart(product)
    })
    .then(result => {
      // console.log(result);
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

/* ------------------------ Delete from Cart ------------------------ */
exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.prodId
  req.user.deleteCartProduct(prodId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

/* ------------------------------ Order Details ----------------------------- */
exports.getOrders = (req, res, next) => {
  req.user.getOrders()
    .then(orders=>{
      res.render('shop/orders', {
        pageTitle: 'My Orders',
        path: 'orders', 
        orders: orders
      })    
    })
    .catch(err=>console.log(err))
}

exports.postCreateOrder = (req, res, next) => {
  req.user.addOrder()
    .then(()=>{
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