const mongoose = require("mongoose");

const db = mongoose.connect(process.env.DB_URL,{useNewUrlParser: true, useUnifiedTopology: true});
console.log(process.env.DB_URL);
const { Schema } = mongoose;

const chatSchema = new Schema({
    username: String,
    msg: String,
    date: {type: Date, default: new Date()}

  });

module.exports = {db,chatSchema};

