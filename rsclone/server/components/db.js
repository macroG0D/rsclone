const { MongoClient } = require('mongodb');
const { DEFAULT_DB_SORT, DEFAULT_DB_LIMIT } = require('../constants');

module.exports = class Db {
  constructor(user, pass) {
    this.uri = `mongodb+srv://${user}:${pass}@cluster0.anmdr.mongodb.net/test?retryWrites=true&w=majority`;
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    this.methods = {
      getAll: this.getAll.bind(this),
      create: this.create.bind(this),
    };
    this.dbName = 'game';
    this.collectionName = 'board';
  }

  async getDb(dbName = this.dbName) {
    const client = await MongoClient.connect(this.uri, this.options);
    return client.db(dbName);
  }

  async getCollection(dbName = this.dbName, collectionName = this.collectionName) {
    const db = await this.getDb(dbName);
    return db.collection(collectionName);
  }

  async getAll(
    sort = DEFAULT_DB_SORT,
    limit = DEFAULT_DB_LIMIT,
    dbName = this.dbName,
    collectionName = this.collectionName,
  ) {
    const collection = await this.getCollection(dbName, collectionName);
    return collection.find({}).sort(sort).limit(limit).toArray();
  }

  async create(item, dbName = this.dbName, collectionName = this.collectionName) {
    const collection = await this.getCollection(dbName, collectionName);
    const response = await collection.insertOne(item);
    return response;
  }

  async query(query, callBack, ...rest) {
    const method = this.methods[query];
    const ret = method(...rest);
    ret.then(
      (result) => callBack(result),
      (error) => callBack(error, true),
    );
  }
};

/*
const db = new Db('btfUser', 'btfPass2020q3');

const ret = db.getCollection('game', 'board');
ret.then(
  (result) => console.log(result),
  (error) => console.log(error),
);

const item = {
  score: 10,
  time: 0,
  name: 'Max2',
};
const ret = db.create('game', 'board', item);

function printAll(result) {
  console.log(result);
}

db.query('getAll', printAll);

const collection = db.getAll('game', 'board');
collection.then(
  (result) => console.log(result),
  (error) => console.log(error),
);
*/
