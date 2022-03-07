import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: String,
  description: String,
  pages: Number,
  authors: [{ type: mongoose.Types.ObjectId, ref: "Author" }],
});

const book = mongoose.model("Book", BookSchema);

export default book;
