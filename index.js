const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
    
    //   get drones data 
    app.get("/drones",async(req,res)=>{
        const  cursor = dronesCollection.find({})
        const drones = await cursor.toArray();
        res.json(drones)
        
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