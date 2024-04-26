const db = require('./connection');
const { User, Book, Preference } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  await cleanDB('Book', 'books');
  await cleanDB('User', 'users');
  await cleanDB('Preference', 'preferences');

  const book = await Book.findOneAndUpdate(
    { bookId: '1' },
    {
      $set: {
        authors: ['Author 1', 'Author 2'],
        title: 'Book 1',
        cover: 'cover1.jpg',
        firstSentence: 'This is the first sentence of Book 1.',
        link: 'https://example.com/book1'
      }
    }
  );

  const preference = await Preference.findOneAndUpdate(
    { subjects: ['Subject 1', 'Subject 2'] },
    {
      $addToSet: {
        authors: { $each: ['Author 1', 'Author 2'] },
        books: book._id
      }
    }
  );

  await User.create({
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    savedBooks: [book._id],
    currentlyReading: [],
    finishedBooks: [],
    preferences: preference._id
  });

  await User.create({
    username: 'user2',
    email: 'user2@example.com',
    password: 'password456',
    savedBooks: [],
    currentlyReading: [],
    finishedBooks: [],
    preferences: preference._id
  });

  process.exit();
});