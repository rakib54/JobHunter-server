const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

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


    app.post('/addJob', (req, res) => {
        const AddJob = req.body
        JobsCollection.insertOne(AddJob)
            .then(result => {
                console.log('added');
                res.send(result)
            })
    })

    app.get('/jobdetails', (req, res) => {
        const search = req.query.search
        JobsCollection.find({jobName: {$regex: search}}).limit(20)
            .toArray((err, jobDetails) => {
                res.send(jobDetails)
            })
    })

    app.get('/jobs', (req, res) => {
        JobsCollection.find({})
            .toArray((err, jobDetails) => {
                res.send(jobDetails)
            })
    })
});



app.listen(port)