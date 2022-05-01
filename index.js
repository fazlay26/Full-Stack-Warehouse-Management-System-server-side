const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

//middleware
app.use(express.json())
app.use(cors());

//bike-manger
//xY2uDi7RYlBQzw90



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrjmg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const bikeCollection = client.db("bikeManager").collection("bikeinfo")

        //data load
        app.get('/info', async (req, res) => {
            const query = {}
            const cursor = bikeCollection.find(query)

            const infos = await cursor.toArray();
            console.log(infos);
            res.send(infos)
        })
        //data load by sinle id
        app.get('/info/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const infos = await bikeCollection.findOne(query)
            res.send(infos)

        })
        //decrease quantity 
        app.put('/info/:id', async (req, res) => {
            const id = req.params.id
            const updateQuantity = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedoc = {
                $set: {
                    quantity: updateQuantity.newQuantity
                }
            }
            const result = await bikeCollection.updateOne(filter, updatedoc, options)
            res.send(result)
        })
        //insert bike
        app.post('/info', async (req, res) => {
            const newItem = req.body
            const result = await bikeCollection.insertOne(newItem)
            res.send(result)
        })
        //delete item
        app.delete('/info/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bikeCollection.deleteOne(query)
            res.send(result)
        })
        //delete my item
        // app.delete('/myitem/:id', async (req, res) => {
        //     const id = req.params.id
        //     const query = { _id: ObjectId(id) }
        //     const result = await bikeCollection.deleteOne(query)
        //     res.send(result)
        // })
        //
        app.get('/myitem', async (req, res) => {
            const email = req.query.email
            console.log(email);
            const query = { email: email }
            const cursor = bikeCollection.find(query)
            const myItems = await cursor.toArray()
            res.send(myItems)
        })


    }
    catch {

    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('runinng bike manager', port)
})