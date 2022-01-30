const Product = require('../models/Product')

/* ------------------------------ Get Products ------------------------------ */
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products=>{
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        products: products,
        path: 'admin/products'
      })
    })
    .catch(err=>console.log(err))
}

/* ------------------------------ Add Products ------------------------------ */
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: 'admin/add-product', 
    editing: false
  })
} 
exports.postAddProduct = (req, res, next) => {
  const {title, description, price, imageUrl} = req.body
  const product = new Product(title, imageUrl, price, description, null, req.user._id)
  product.save()
    .then(() => {
      res.redirect('/products')
    })
    .catch(err => {console.log(err)})
}

/* ------------------------------ Edit Products ----------------------------- */
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode){
    res.redirect('/')
  }
  const prodId = req.params.prodId
  Product.findById(prodId)
    .then(product=>{
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: 'admin/edit-product',
        editing: editMode,
        product: product
      })
    })
    .catch(err => console.error(err))
}
exports.postEditProduct = (req, res, next) => {
  const {prodId, title, description, price, imageUrl} = req.body
  const product = new Product (title, imageUrl, price, description, prodId)
  product.save()
    .then(()=> {
      console.log('Updated')
      res.redirect('/admin/products')
    })
    .catch(err => {console.log(err)})
}

/* ----------------------------- Delete Products ---------------------------- */
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.prodId
  Product.deleteById(prodId)
    .then(()=>{
      console.log("Product deleted")
      res.redirect('/admin/products')
    })
    .catch(err => {console.log(err)})
}