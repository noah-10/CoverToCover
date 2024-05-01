const db = require('../config/connection');
const { User } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  // clear existing data
  await cleanDB("User", "users");

  // create seed users
  await User.create({
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    savedBooks: [],
    currentlyReading: [],
    finishedBooks: [],
    preferencedAuthor: [],
    preferencedGenre: []
  });

  await User.create({
    username: 'user2',
    email: 'user2@example.com',
    password: 'password456',
    savedBooks: [],
    currentlyReading: [],
    finishedBooks: [],
    preferencedAuthor: [],
    preferencedGenre: []
  });

  // populate seed users' saved books
  const savedBook = { title: "Harry Potter", bookId: "1" };
  await User.findOneAndUpdate(
    { username: "user1" },
    { $addToSet: { savedBooks: savedBook } },
    { new: true }
  );

  // populate seed users' currently reading
  const currentlyReadingBook = { title: "The Silent Patient", bookId: "2" };
  await User.findOneAndUpdate(
    { username: "user1" },
    { $addToSet: { currentlyReading: currentlyReadingBook } },
    { new: true }
  );

  // populate seed users' finished books
  const finishedBook = { title: "The Maidens", bookId: "3" };
  await User.findOneAndUpdate(
    { username: "user2" },
    { $addToSet: { finishedBooks: finishedBook } },
    { new: true }
  );

  // populate seed users' author preferences
  await User.findOneAndUpdate(
    { username: "user1" },
    { $addToSet: { preferencedAuthor: { $each: ["Ursula K. Le Guin", "Umberto Eco", "Walter Rodney"] } } },
    { new: true }
  );

  await User.findOneAndUpdate(
    { username: "user2" },
    { $addToSet: { preferencedAuthor: { $each: ["J. R. R. Tolkien", "Angela Davis", "Liu Cixin"] } } },
    { new: true }
  );

  // populate seed users' genre preferences
  await User.findOneAndUpdate(
    { username: "user1" },
    { $addToSet: { preferencedGenre: { $each: ["mystery", "comedy", "paranormal"] } } },
    { new: true }
  );

  await User.findOneAndUpdate(
    { username: "user2" },
    { $addToSet: { preferencedGenre: { $each: ["science fiction", "fairy tale", "thriller"] } } },
    { new: true }
  );

  // exit
  process.exit(0);
});