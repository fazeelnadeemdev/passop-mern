const express = require('express');
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config()

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

client.connect();

// Get a all the password;
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

// Save a password;
app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true , result : findResult});
});


// Delete a password;
app.delete('/', async (req, res) => {
    const { id } = req.body; // Extract only the ID
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    
    // Tell MongoDB to delete the document where the id matches
    const findResult = await collection.deleteOne({ id }); 
    
    res.send({success: true , result : findResult});
});

app.listen(port, () => {
    console.log(`Example app listning on port http://localhost:${port}`)
});