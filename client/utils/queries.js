import { gql } from '@apollo/client'

export const GET_ME = gql`
    query Me {
        me {
            _id
            username
            currentlyReading {
                authors
                bookId
                cover
                firstSentence
                link
                title
            }
            finishedBooks {
                authors
                bookId
                cover
                firstSentence
                link
                title
            }
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

export const SAVED_BOOKS = gql`
    query SavedBooks {
        savedBooks {
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

export const CURRENTLY_READING = gql`
    query CurrentlyReading {
        currentlyReading {
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

export const FINISHED_BOOKS = gql`
    query FinishedBooks {
        finishedBooks {
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

export const MY_PREFERENCES = gql`
    query MyPreferences {
        myPreferences {
            preferences {
                authors
                books
                subjects
            }
        }
    }
`