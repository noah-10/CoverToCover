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
    mutation AddUser($username: String!, $email: String!, $password: String!, $preferencedAuthor: [String], $preferencedGenre: [String]) {
        addUser(username: $username, email: $email, password: $password, preferencedAuthor: $preferencedAuthor, preferencedGenre: $preferencedGenre) {
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
export const REMOVE_BOOK = gql`
    mutation RemoveBook($bookId: String!) {
        removeBook(bookId: $bookId) {
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