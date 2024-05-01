
export const searchBookTitle = (title) => {
    return fetch(`https://openlibrary.org/search.json?title=${title}`)
}

