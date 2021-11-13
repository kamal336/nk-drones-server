const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwr8o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
    try {
      await client.connect();
      const database = client.db("nk_drones");
      const bannerCollection = database.collection("banners");
      const dronesCollection = database.collection("all_drones");
      const ordersCollection = database.collection("orders");
      const usersCollection  = database.collection("users");
      const reviewsCollection = database.collection("reviews");

    //   get drones data 
    app.get("/drones",async(req,res)=>{
        const  cursor = dronesCollection.find({})
        const drones = await cursor.toArray();
        res.json(drones)
        
    })

    // get all orders 
    app.get("/orders",async(req,res)=>{
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      console.log(orders);
      res.json(orders)
    })

    // get my orders 
    app.get("/orders/myorders",async(req,res)=>{
      const email = req.query.email;
      const query = { email: email}
      const cursor = ordersCollection.find(query);
      const appointments = await cursor.toArray();
      res.json(appointments);
    })
     
    // get reviews 
    app.get("/reviews",async(req,res)=>{
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      console.log(reviews);
      res.json(reviews)
    })
     
    // get admin 
    app.get("/users/:email",async(req,res)=>{
      const email = req.params.email;
      const query = {email: email};
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin = true;
      } 
      console.log(isAdmin);
      res.json({admin: isAdmin})
    })

    //  send order data 
    app.post("/orders",async(req,res)=>{
      const query = req.body;
      const result = await ordersCollection.insertOne(query);
      res.json(result)
      console.log(result);
    })

    // sent user to data base 
    app.post("/users",async(req,res)=>{
      const user  = req.body;
      const result= await usersCollection.insertOne(user);
      res.json(result)
    })
   
    // review products 
    app.post("/reviews",async(req,res)=>{
      const review = req.body;
      const result = await reviewsCollection.insertOne(review)
      console.log(result);
      res.json(result);
    })
  
    // update user profile 
    app.put("/users",async(req,res)=>{
      const user = req.body;
      const filter = {email: user.email};
      const option = {upsert: true};
      const updateDoc = {$set: user};
      const result = await usersCollection.updateOne(filter,updateDoc,option);
      res.json(result);
    })

    // make admin 
    app.put("/users/admin",async(req,res)=>{
      const user = req.body;
      const filter = {email: user.email};
      const updateDoc = {$set: {role: 'admin'}};
      const result = await usersCollection.updateOne(filter,updateDoc);
      res.json(result);
      console.log(result);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

// run server 
app.get("/",(req,res)=>{
    console.log('server start')
    res.send('server is running')
})

app.listen(port,()=>{
    console.log('server is running localhost:',port);
})