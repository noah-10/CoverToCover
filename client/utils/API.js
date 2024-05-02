
export const searchBookTitle = (title) => {
    return fetch(`https://openlibrary.org/search.json?title=${title}`)
}

// query OpenLibrary for books, specifying query key and value
export const searchOpenLibrary = (query, queryType = "q") => {
    // specifying fields to reduce the amount of data returned
    return fetch(`https://openlibrary.org/search.json?fields=key,author_name,title,cover_i,first_sentence,seed&${queryType}=${query}`);
}
