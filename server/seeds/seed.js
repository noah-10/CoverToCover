const db = require('../config/connection');
const { User } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  await cleanDB("User", "users");

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

  const savedBook = { title: "Harry Potter", bookId: "1" };
  await User.findOneAndUpdate(
    { username: "user1" },
    { $addToSet: { savedBooks: savedBook } },
    { new: true }
  );

  const currentlyReadingBook = { title: "The Silent Patient", bookId: "2" };
  await User.findOneAndUpdate(
    { username: "user1" },
    { $addToSet: { currentlyReading: currentlyReadingBook } },
    { new: true }
  );

  const finishedBook = { title: "The Maidens", bookId: "3" };
  await User.findOneAndUpdate(
    { username: "user2" },
    { $addToSet: { finishedBooks: finishedBook } },
    { new: true }
  );

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

  process.exit(0);
});