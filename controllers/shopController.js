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
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'Cart',
            path: 'cart',
            products: products,
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}
exports.postCart = (req, res, next) => {
  const prodId = req.body.prodId
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) { 
        newQuantity = product.cartItem.quantity + 1
        return product
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price)
  // })
  // res.redirect('/cart')
}
exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.prodId
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      let product = products[0]
      return product.cartItem.destroy()
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

/* ------------------------------ Order Details ----------------------------- */
exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
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
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product
          }))
        })
        .catch(err => console.log(err))
    })
    .then(result => {
      return fetchedCart.setProducts(null)
    })
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