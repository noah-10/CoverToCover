const db = require('./connection');
const { User, Book, Preference } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  await cleanDB('Book', 'books');
  await cleanDB('User', 'users');
  await cleanDB('Preference', 'preferences');

  const books = await Book.insertMany([
    {
      authors: ['Author 1', 'Author 2'],
      title: 'Book 1',
      cover: 'cover1.jpg',
      bookId: '1',
      firstSentence: 'This is the first sentence of Book 1.',
      link: 'https://example.com/book1'
    },
  ]);

  const preferences = await Preference.insertMany([
    {
      authors: ['Author 1', 'Author 2'],
      subjects: ['Subject 1', 'Subject 2'],
      books: ['Book 1', 'Book 2']
    },
  ]);

  await User.create({
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    savedBooks: [books[0]._id],
    currentlyReading: [],
    finishedBooks: [],
    preferences: preferences[0]._id
  });

  await User.create({
    username: 'user2',
    email: 'user2@example.com',
    password: 'password456',
    savedBooks: [],
    currentlyReading: [],
    finishedBooks: [],
    preferences: preferences[1]._id
  });

  process.exit();
});