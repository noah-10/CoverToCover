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
  });

  await User.create({
    username: 'user2',
    email: 'user2@example.com',
    password: 'password456',
    savedBooks: [],
    currentlyReading: [],
    finishedBooks: [],
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

  process.exit(0);
});