const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;
const user = new Schema({
  username: { type: String, required: true },
  _id: { type: String, required: true },
});
const exercise = new Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, default: new Date().toString() },
  duration: { type: Number, required: true },
  description: { type: String, required: true },
});

const User = mongoose.model("User", user);
const Exercise = mongoose.model("Exercise", exercise);

function getExerciseTrackerHTML(req, res) {
  res.sendFile(process.cwd() + "/views/exercisetracker.html");
}

function createUser(req, res) {
  User.findOne({ username: req.body.username }, (error, data) => {
    if (error) return console.log(error);
    if (!data) {
      const _id = shortid();
      const { username } = req.body;
      const newUser = new User({
        username,
        _id,
      });

      newUser.save((error, data) => {
        if (error) return console.log(error);
        return res.json({
          username,
          _id,
        });
      });
    } else {
      let { username, _id } = data;
      return res.json({
        username,
        _id,
      });
    }
  });
  return;
}

async function getAllUsers(req, res) {
  return new Promise((resolve, reject) => {
    User.find({}, (error, data) => {
      if (error) return reject(error);
      if (!data) {
        return reject("There are no users in the database.");
      } else {
        return resolve(
          data.map((user) => {
            return {
              _id: user._id,
              username: user.username,
            };
          })
        );
      }
    });
  });
}

async function getUserById(_id) {
  return new Promise((resolve, reject) =>
    User.findOne({ _id }, (error, data) => {
      if (error) return reject(error);
      if (!data) {
        return reject("The user ID introduced does not exist.");
      } else {
        const { username } = data;
        return resolve({
          _id,
          username,
        });
      }
    })
  );
}

function createExercise(req, res) {
  let {
    user: { username, _id },
    description,
    duration,
  } = req.body;
  duration = Number(duration);
  const exercise = {
    username,
    userId: _id,
    description,
    duration,
  };

  if (req.body.date) {
    const exerciseDate = new Date(req.body.date).toString();
    if (exerciseDate != NaN) exercise.date = exerciseDate;
  }

  const newExercise = new Exercise(exercise);

  newExercise.save((error, data) => {
    if (error) return console.log(error);
    let weekday = new Array(7);
    weekday[0] = "Mon";
    weekday[1] = "Tue";
    weekday[2] = "Wed";
    weekday[3] = "Thu";
    weekday[4] = "Fri";
    weekday[5] = "Sat";
    weekday[6] = "Sun";
    let month = new Array(12);
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Ago";
    month[8] = "Set";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    let date = new Date(data.date);
    date = `${weekday[date.getDay()]} ${
      month[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`;

    return res.json({
      username,
      _id: exercise.userId,
      description,
      duration,
      date,
    });
  });
}

async function getExercisesByUser(userId) {
  return new Promise((resolve, reject) => {
    Exercise.find({ userId }, (error, data) => {
      if (error) return reject(error);
      if (!data) {
        return reject(
          "There are no exercises that correspond to the applied filters."
        );
      } else {
        return resolve(data);
      }
    });
  });
}

module.exports = {
  getExerciseTrackerHTML,
  createUser,
  createExercise,
  getUserById,
  getAllUsers,
  getExercisesByUser,
};
