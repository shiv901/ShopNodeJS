const Product = require('../models/Product')

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      products: products,
      path: 'admin/products'
    })
  })
}

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: 'admin/add-product', 
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  const {title, description, price, imageUrl} = req.body
  const product = new Product(null, title, imageUrl, price, description)
  product.save()
  res.redirect('/products')
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode){
    res.redirect('/')
  }
  const prodId = req.params.prodId
  Product.findById(prodId, product => {
    console.log(product);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: 'admin/edit-product',
      editing: editMode,
      prod: product
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  const {prodId, title, description, price, imageUrl} = req.body
  const updatedProduct = new Product(prodId, title, imageUrl, price, description)
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.prodId
  Product.deleteById(prodId)
  res.redirect('/admin/products')
}