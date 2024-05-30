
export const searchBookTitle = (title) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}+intitle:${title}&maxResults=1`)
}

// query OpenLibrary for books, specifying query key and value
export const searchOpenLibrary = (query, queryType = "q") => {
    // specifying fields to reduce the amount of data returned
    return fetch(`https://openlibrary.org/search.json?fields=key,author_name,title,cover_i,first_sentence,seed&${queryType}=${query}`);
}

export const searchGoogleBooks = (query) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
};
