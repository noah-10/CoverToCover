
const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
        currentlyReading: [Book]
        finishedBooks: [Book]
        preferencedAuthor: [String]
        preferencedGenre: [String]
    }

    type Book {
        authors: [String]
        title: String!
        cover: Int
        bookId: String!
        firstSentence: String
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
    }

    input BookInput {
        authors: [String]
        title: String!
        cover: Int
        bookId: String!
        firstSentence: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!, preferencedAuthor: [String], preferencedGenre: [String], currentlyReading: [BookInput], finishedBooks: [BookInput]): Auth
        saveBook(input: BookInput): User
        removeBook(bookId: String!): User
        addToFinished(input: BookInput): User
        addToCurrentlyReading(input: BookInput): User
        addPreferenceAuthor(authors: [String!]): User
        addPreferenceGenre(genre: [String!]): User
        updateUsername(username: String!): User
        updateEmail(email: String!): User
        updatePassword(password: String!): User
        updatePreferences(authors: [String], subjects: [String], books: [String]): User
    }
`

module.exports = typeDefs;