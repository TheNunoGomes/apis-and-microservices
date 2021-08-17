function getExerciseTrackerHTML(req, res) {
  res.sendFile(process.cwd() + "/views/exercisetracker.html");
}

module.exports = {
  getExerciseTrackerHTML,
};
