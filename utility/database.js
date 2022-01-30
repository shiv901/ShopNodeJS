const mongoDB = require('mongodb')
const MongoClient = mongoDB.MongoClient

let _db

const mongoConnect = callback =>{
  MongoClient.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')
    .then(client=>{
      console.log('Connected to MongoDB Server...')
      _db = client.db('Eshop')
      callback()
    })
    .catch(err=>{
      console.log(err)
      throw err
    })
}

const getDb = ()=>{
  if(_db) return _db
  throw 'No DB found in the database'
}

module.exports = {mongoConnect, getDb}