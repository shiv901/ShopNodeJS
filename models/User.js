const {ObjectId} = require('mongodb');
const {getDb} = require('../utility/database')

class User {
  constructor(name, email){
    Object.assis(this, {name, email})
  }
  save(){
    return getDb().collection('users').insertOne(this)
  }

  static findById(id){
    return getDb().collection('users').findOne({_id: ObjectId(id)})
  }
}

module.exports = User