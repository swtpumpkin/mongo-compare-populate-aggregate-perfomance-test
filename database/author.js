import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
  name: String,
  email: String,
  birthDate: Date,
  city: String,
  gender: String,
});

const author = mongoose.model("Author", AuthorSchema);

export default author;
