import { gql } from '@apollo/client'

export const GET_ME = gql`
    query Me {
        me {
            _id
            username
            preferencedAuthor
            preferencedGenre
            currentlyReading {
                _id
                authors
                bookId
                cover
                description
                link
                title
                categories
            }
            finishedBooks {
                _id
                authors
                bookId
                cover
                description
                link
                title
                categories
            }
            savedBooks {
                _id
                authors
                bookId
                cover
                description
                link
                title
                categories
            }
            dislikedBooks {
                _id
                authors
                bookId
                cover
                description
                link
                title
                categories
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
                description
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
                _id
                authors
                bookId
                cover
                description
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
                description
                link
                title
            }
        }
    }
`

export const MY_PREFERENCES = gql`
    query MyPreferences {
        myPreferences {
            preferencedAuthor
            preferencedGenre
        }
    }
`;

export const ALL_BOOKS = gql`
    query AllBooks {
        allBooks {
        bookId
        }
    }
`

export const ALL_USERS = gql`
    query AllUsers {
        allUsers {
            currentlyReading {
                _id
                categories
                bookId
                authors
                cover
                description
                title
            }
            finishedBooks {
                _id
                categories
                bookId
                description
                authors
                cover
                title
            }
            preferencedAuthor
            preferencedGenre
            savedBooks {
                _id
                authors
                bookId
                categories
                cover
                description
                title
            }
        }
    }
`

