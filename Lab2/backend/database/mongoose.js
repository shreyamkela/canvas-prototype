// Mongoose Setup - MongoDB - ORM

const mongoose = require("mongoose");
const options = {
  poolSize: 10
};
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://shreyamkela:Shreyam123@ds139576.mlab.com:39576/canvas-shreyamkela", options);
