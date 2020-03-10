const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/api/workouts", (req, res) => {
  db.Workout.find({}).then(data => {
    console.log(data);
    res.json(data);
  });
});

app.put("/api/workouts/:id", (req, res) => {
  console.log(req.body);
  db.Workout.findByIdAndUpdate(req.params.id, {
    $push: {
      exercises: req.body
    }
  }).then(data => {
    console.log(data);
    res.json(data);
  });
});

app.post("/api/workouts", ({ body }, res) => {
  db.Workout.create(body).then(data => {
    res.json(data);
  });
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port http://localhost:${PORT}`);
});
