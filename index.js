import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Author from "./database/author.js"
import Book from "./database/book.js";

async function createAuthors(numberOfItems) {
  const authorDocs = [...new Array(numberOfItems)].map((_, index) => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    birthDate: new Date(faker.date.past()),
    city: faker.address.city(),
    gender: faker.name.gender(),
  }));
  return await Author.insertMany(authorDocs);
};

async function createBooks(numberOfItems, createdAuthors) {
  const bookDocs = [...new Array(numberOfItems)].map((_, index) => ({
      title: faker.name.title(),
      description: faker.lorem.paragraphs(),
      pages: faker.datatype.number(),
      authors: faker.random.arrayElements(createdAuthors, faker.datatype.number({max:100})),
  }));
  return await Book.insertMany(bookDocs);
};

async function init() {
  console.log("Cleaning DB");
  await Promise.all([Author.deleteMany({}), Book.deleteMany({})]);
  console.log("DB cleaned");
  const numberOfItems = 10000;
  console.log(`Adding ${numberOfItems} authors to the database`);
  console.time("Create Authors");
  const authors = await createAuthors(numberOfItems);
  console.timeEnd("Create Authors");
  console.log(`Adding ${numberOfItems} books to the database`);
  console.time("Create Books");
  await createBooks(numberOfItems, authors);
  console.timeEnd("Create Books");
  console.log(`Finished the database with ${numberOfItems} authors and books`);
}

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mongotest", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    console.log("DB connected.");
    await init()
    console.log("Init DB.");
    console.time("Book populate");
    await Book.find().populate("authors");
    console.timeEnd("Book populate");
    console.time("Book aggregate");
    await Book.aggregate([{
      $lookup: {
        from: "authors",
        localField: "authors",
        foreignField: "_id",
        as: "authors",
      },
    }]);
    console.timeEnd("Book aggregate");
    await mongoose.connection.db.dropDatabase();
    console.log("Dropping DB");
    process.exit();
  } catch(e) {
    console.error(e);
  }
  })();