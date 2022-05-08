const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.Port || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.remhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('grocery-warehouse').collection('my grocery');
        const orderCollection = client.db('grocery-warehouse').collection('order');

        app.get('/inventory', async (req, res) => {
            const querry = {};
            const cursor = serviceCollection.find(querry);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const querry={_id: ObjectId(id)};
            const service = await serviceCollection.findOne(querry);
            res.send(service);
        });

        // post
        app.post('/inventory', async(req, res) =>{
            const newInventory = req.body;
            const result = await serviceCollection.insertOne(newInventory);
            res.send(result);
        });

        // Delete
        app.delete('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });
        // order
        app.get('/order', async(req, res) =>{
            const email = req.query?.email;
            const query = {email: email};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })

        app.post('/order', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Gocery Server');
});
app.listen(port, () => {
    console.log('listenning', port);
})