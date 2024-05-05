import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`

export const ADD_USER = gql`
    mutation Mutation($username: String!, $email: String!, $password: String!, $preferencedAuthor: [String], $preferencedGenre: [String], $currentlyReading: [BookInput], $finishedBooks: [BookInput]) {
        addUser(username: $username, email: $email, password: $password, preferencedAuthor: $preferencedAuthor, preferencedGenre: $preferencedGenre, currentlyReading: $currentlyReading, finishedBooks: $finishedBooks) {
            token
            user {
                _id
                username
            }
        }
    }
`

export const SAVE_BOOK = gql`
    mutation SaveBook($input: BookInput) {
        saveBook(input: $input) {
            savedBooks {
                authors
                bookId
                cover
                firstSentence
                link
                title
            }
        }
    }
`
// Removes a saved book
export const REMOVE_SAVED_BOOK = gql`
    mutation RemoveSavedBook($bookId: String!) {
        removeSavedBook(bookId: $bookId) {
            savedBooks {
                authors
                bookId
                firstSentence
                cover
                link
                title
            }
        }
    }
`
// Removes a saved book
export const REMOVE_CURRENTLY_READING_BOOK = gql`
    mutation RemoveCurrentlyReadingBook($bookId: String!) {
        removeCurrentlyReadingBook(bookId: $bookId) {
            currentlyReading {
                authors
                bookId
                firstSentence
                cover
                link
                title
            }
        }
    }
`

export const ADD_FINISHED_BOOK = gql`
    mutation AddToFinished($input: BookInput) {
        addToFinished(input: $input) {
            finishedBooks {
                authors
                bookId
                cover
                firstSentence
                link
                title
            }
        }
    }
`

export const ADD_CURRENTLY_READING = gql`
    mutation AddToCurrentlyReading($input: BookInput) {
        addToCurrentlyReading(input: $input) {
            currentlyReading {
                authors
                bookId
                cover
                firstSentence
                link
                title
            }
        }
    }
`

export const ADD_PREFERENCE_AUTHOR = gql`
    mutation AddPreferenceAuthor($authors: [String!]) {
        addPreferenceAuthor(authors: $authors) {
            preferencedAuthor
        }
    }
`

export const ADD_PREFERENCE_GENRE = gql`
    mutation AddPreferenceGenre($genre: [String!]) {
        addPreferenceGenre(genre: $genre) {
            preferencedGenre
        }
  }
`
export const UPDATE_USERNAME = gql`
    mutation UpdateUsername($username: String!) {
        updateUsername(username: $username) {
            _id
            username
        }
    }
`;

export const UPDATE_EMAIL = gql`
    mutation UpdateEmail($email: String!) {
        updateEmail(email: $email) {
            _id
            email
        }
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($password: String!) {
        updatePassword(password: $password) {
            _id
            username
        }
    }
`;

export const REMOVE_PREFERENCE_AUTHOR = gql`
  mutation RemovePreferenceAuthor($authorId: ID!) {
    removePreferenceAuthor(authorId: $authorId) {
      preferencedAuthor
    }
  }
`;

export const REMOVE_PREFERENCE_GENRE = gql`
  mutation RemovePreferenceGenre($genreId: ID!) {
    removePreferenceGenre(genreId: $genreId) {
      preferencedGenre
    }
  }
`;