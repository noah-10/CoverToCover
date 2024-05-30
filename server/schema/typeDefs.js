
const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
        currentlyReading: [Book]
        finishedBooks: [Book]
        dislikedBooks: [Book]
        preferencedAuthor: [String]
        preferencedGenre: [String]
    }

    type Book {
        _id: ID!
        authors: [String]
        title: String!
        cover: String
        bookId: String!
        description: String
        categories: [String]
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        savedBooks: User
        currentlyReading: User
        finishedBooks: User
        myPreferences: User
        allBooks: Book
        allUsers:[User]
    }

    input BookInput {
        _id: ID
        authors: [String]
        title: String!
        cover: String
        bookId: String!
        description: String
        categories: [String]
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!, preferencedAuthor: [String], preferencedGenre: [String], currentlyReading: [BookInput], finishedBooks: [BookInput]): Auth
        saveBook(input: BookInput): User
        removeSavedBook(bookId: String!): User
        removeCurrentlyReadingBook(bookId: String!): User
        finishedReading(bookId: ID!): User
        addToCurrentlyReading(input: BookInput): User
        addPreferenceAuthor(authors: [String!]): User
        addPreferenceGenre(genre: [String!]): User
        updateUsername(username: String!): User
        updateEmail(email: String!): User
        updatePassword(password: String!): User
        removePreferenceAuthor(authorId: ID!): User
        removePreferenceGenre(genreId: ID!): User
        addDislikedBook(input: BookInput): User
    }
`;


module.exports = typeDefs;