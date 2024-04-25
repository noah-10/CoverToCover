//Query
// Get single user
// Get each users type of book
// get users preferences 


//Mutation
//login
//add user
//save book
//remove book
const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
        currentlyReading: [Book]
        finishedBooks: [Book]
        preferences: Preferences
    }

    type Book {
        authors: [String]
        title: String!
        cover: String
        bookId: String!
        firstSentence: String
        link: String
    }

    type Preference {
        authors: [String]
        subjects: [String]
        books: [String]
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

    type BookInput {
        authors: [String]
        title: String!
        cover: String
        bookId: String!
        firstSentence: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String): Auth
        saveBook(input: BookInput): User
        removeBook(bookId: String!): User
    }
`