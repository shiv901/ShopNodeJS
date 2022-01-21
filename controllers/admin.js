const Product = require('../models/Product')

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      products: products,
      path: 'products'
    })
  })
}

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: 'admin/add-product'
  })
}

exports.postAddProduct = (req, res, next) => {
  const {title, description, price, imageUrl} = req.body
  const product = new Product(title, imageUrl, price, description)
  product.save()
  res.redirect('/products')
}