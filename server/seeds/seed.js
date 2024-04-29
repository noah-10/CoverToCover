const db = require('../config/connection');
const { User } = require('../models');

db.once('open', async () => {




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

  const book = {"title": "Harry Potter", "bookId": "1"}

  await User.findOneAndUpdate(
    {
      username: "user1"
    },
    {
      $addToSet: {savedBooks: book}
    },
    {
      new: true
    }
  )

  process.exit();
});