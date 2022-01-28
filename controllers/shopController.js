const Cart = require('../models/Cart')
const Product = require('../models/Product')


exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Shop',
    path: '/'
  })
}

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products=>{
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        products: products,
        path: 'products'
      })
    })
    .catch(err=>console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.prodId
  Product.findByPk(prodId)
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        pageTitle: 'Product Details',
        path: 'products'
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart=>{
    Product.fetchAll(products=>{
      const cartProducts = [];
      for (let product of products) {
        let cartData = cart.products.find(p=>p.id === product.id);
        if(cartData){
          cartProducts.push({productData: product, qty: cartData.qty, totalPrice: cart.totalPrice});
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: 'cart',
        products: cartProducts,
      })
    })
  })
}
exports.postCart = (req, res, next) => {
  const prodId = req.body.prodId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect('/cart')
}
exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.id
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price)
    res.redirect('/cart')
  })
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