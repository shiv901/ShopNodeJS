const {ObjectId} = require('mongodb')
const {getDb} = require('../utility/database')

class Product {
  constructor(title, imageUrl, price, description, _id, userId){
    Object.assign(this, {title,imageUrl, price, description, userId})
    this._id = _id ? ObjectId(_id) : null;
  }
  save(){
    let db;
    if(this._id){
      db = getDb().collection('products').updateOne({_id: this._id}, {$set: this})
    } else{
      db = getDb().collection('products').insertOne(this)
    }
    return db
      .then(result =>{
        console.log(result)
      })
      .catch(err => console.log(err))
  }

  static fetchAll(){
    return getDb().collection('products').find().toArray()
      .then(products =>{
        // console.log(products)
        return products
      }) 
      .catch(err => console.log(err))
  }

  static findById(prodId){
    return getDb().collection('products')
      .find(ObjectId(prodId)).next()
      .then(products => {
        // console.log(products)
        return products
      })
      .catch(err => console.log(err))
  }

  static deleteById(prodId){
    return getDb().collection('products').deleteOne({_id:ObjectId(prodId)})
      .then(() => {
        console.log('deleted from Model')
      })
      .catch(err=>console.log(err))
  }
}


module.exports = Product