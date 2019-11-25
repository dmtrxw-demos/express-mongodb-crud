require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const url = "mongodb://localhost:27017";
const dbName = "school";

const client = new MongoClient(url);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

client.connect(function(err, client) {
  const db = client.db(dbName);
  app.get("/", function(req, res) {
    res.json({
      message: "Hello world",
    });
  });

  app.get("/students", function(req, res) {
    db.collection("students")
      .find({})
      .toArray(function(err, docs) {
        res.json(docs);
      });
  });

  app.post("/students", function(req, res) {
    const { name, batch } = req.body;
    db.collection("students").insertOne({ name, batch }, function(
      err,
      response
    ) {
      const newRecord = response.ops[0];
      res.json(newRecord);
    });
  });

  app.get("/students/:id", function(req, res) {
    const { name, batch } = req.body;
    db.collection("students").findOne(
      { _id: ObjectId(req.params.id) },
      function(err, record) {
        res.json(record);
      }
    );
  });

  app.put("/students/:id", function(req, res) {
    const { name, batch } = req.body;
    db.collection("students").findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $set: { name, batch } },
      { returnOriginal: false },
      function(err, response) {
        const newRecord = response.value;
        res.json(response);
      }
    );
  });

  app.delete("/students/:id", function(req, res) {
    db.collection("students").findOneAndDelete(
      { _id: ObjectId(req.params.id) },
      function(err, response) {
        res.json(response);
      },
    );
  });

  app.listen(port, function() {
    console.log("Listening on port", port);
  });
});
