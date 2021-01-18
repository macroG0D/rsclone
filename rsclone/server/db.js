const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://btfUser:btfPass2020q3@cluster0.anmdr.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db('test').collection('devices');
  console.log(err, collection);
  client.close();
});
