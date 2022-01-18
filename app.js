const express = require("express");
const app = express();
const { getTopics } = require("./controllers/articles.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

//ERROR HANDLING
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
