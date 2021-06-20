const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4bol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const JobsCollection = client.db("JobsBD").collection("JobPost");

    app.post('/addJob', (res, req) => {
        const AddJob = req.body
        JobsCollection.insertOne(AddJob)
            .then(result => {
                res.send(result)
            })
    })
});







app.listen(port)