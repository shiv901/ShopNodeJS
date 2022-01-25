const Cart = require('../models/Cart')
const Product = require('../models/Product')


exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Shop',
    path: '/'
  })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId
  Product.findById(prodId, product => {
    res.render('shop/product-details', {
      prod: product,
      pageTitle: 'Product Details',
      path: 'products'
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      products: products,
      path: 'products'
    })
  })
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: 'cart'
  })
}
exports.postCart = (req, res, next) => {
  const prodId = req.body.prodId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)

  })
  res.redirect('/cart')
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'My Orders',
    path: 'orders'
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'checkout',
    path: 'checkout'
  })
}