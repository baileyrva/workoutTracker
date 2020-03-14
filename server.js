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

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://user:password1@ds225608.mlab.com:25608/heroku_01kdtf86",
  {
    useNewUrlParser: true
  }
);

//Routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

//render exercise html page with this route so user can see that page when he or she clicks "new workout"
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

//grab last workout
app.get("/api/workouts", (req, res) => {
  db.Workout.find({}).then(data => {
    // console.log(data)
    res.json(data);
  });
});

//route to update
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

//route to create to post aka create an exercise
app.post("/api/workouts", ({ body }, res) => {
  // console.log(body);
  db.Workout.create(body).then(data => {
    //dostuff
    res.json(data);
  });
});

//render stats html page with this route so user can see that page when he or she clicks "new workout"
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

//this route display
app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    // .populate("Workout")
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
