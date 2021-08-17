const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;
const user = new Schema({
  username: { type: String, required: true },
  _id: { type: String, required: true },
});

const User = mongoose.model("User", user);

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

function getAllUsers(req, res) {
  User.find({}, (error, data) => {
    if (error) return console.log(error);
    if (!data) {
      return console.log("There are no users in the database.");
    } else {
      return res.json(
        data.map((user) => {
          return {
            _id: user._id,
            username: user.username,
          };
        })
      );
    }
  });
}
module.exports = {
  getExerciseTrackerHTML,
  createUser,
  getAllUsers,
};
