import { searchOpenLibrary } from "../../utils/API";

const Feed = () => {
    // return an array of books based on a query and optional queryType
    const getBookData = async (query, queryType = "q") => {
        try {
            // query OpenLibrary, receiving a response
            const response = await searchOpenLibrary(query, queryType);
            
            // if the response was not ok, throw an error
            if (!response.ok) {
                throw new Error("error fetching books");
            }
            
            // parse the response as json
            const { docs } = await response.json();

            // save the relevant parts of the response
            const bookData = docs.map((book) => ({
                authors: book.author_name,
                title: book.title,
                cover: `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`,
                bookId: book.key,
                firstSentence: book.first_sentence,
                link: `https://openlibrary.org${book.seed[0]}`
            }));

            // return the book data from the query
            return bookData;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>Feed</div>
    );
}

export default Feed;
