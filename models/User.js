const { ObjectId } = require('mongodb');
const { getDb } = require('../utility/database')

class User {
  constructor(name, email, cart, _id) {
    Object.assign(this, { name, email, cart })
    this._id = _id
  }
  save() {
    return getDb().collection('users').insertOne(this)
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(p => {
      return p.productId.toString() === product._id.toString()
    })

    let newQuantity = 1
    let updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({ productId: ObjectId(product._id), quantity: newQuantity })
    }

    const updatedCart = { items: updatedCartItems }
    return getDb().collection('users').updateOne(
      { _id: ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    )
  }

  getCart() {
    let productIds = this.cart.items.map(i => i.productId)

    return getDb().collection('products').find({ _id: { $in: productIds } }).toArray()
      .then(products => {
        return products.map(p => {
          let qty = this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
          return { ...p, quantity: qty }
        })
      })
      .catch(err => console.log(err))
  }

  deleteCartProduct(productId) {
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString())
    console.log(updatedCartItems)
    return getDb().collection('users').updateOne(
      { _id: ObjectId(this._id) },
      { $set: { cart: { items: updatedCartItems } } }
    )
  }

  addOrder() {
    return this.getCart().then(products=>{
        const order = {
          items : products,
          user : {
            _id : ObjectId(this._id), 
            name : this.name
          }
        }
        return getDb().collection('orders').insertOne(order)
      })
      .then(results => {
        this.cart = [];
        return getDb().collection('users').updateOne(
          { _id: ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        )
      })
  }

  getOrders() {
    return getDb().collection('orders').find({'user._id': ObjectId(this._id)}).toArray()
  }


  static findById(id) {
    return getDb().collection('users').findOne({ _id: ObjectId(id) })
  }
}

module.exports = User