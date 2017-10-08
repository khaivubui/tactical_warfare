import mongoose from "mongoose";
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/my_database");

const userSchema = new Schema({
  username: { type: "String", required: true },
  passwordDigest: { type: "String", required: true }
});
