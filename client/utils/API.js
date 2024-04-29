// query OpenLibrary for books, specifying query key and value
export const searchOpenLibrary = (query, queryType = "q") => {
    return fetch(`https://openlibrary.org/search.json?${queryType}=${query}`);
}