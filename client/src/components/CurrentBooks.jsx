import { useQuery, useMutation } from "@apollo/client"
import { CURRENTLY_READING } from "../../utils/queries"
import { REMOVE_CURRENTLY_READING_BOOK, ADD_FINISHED_BOOK } from '../../utils/mutations';

import { useEffect, useState } from "react";
import Book from "./Book";
import BookModal from "./BookModal";

const CurrentBooks = () => {

    const [removeBook] = useMutation(REMOVE_CURRENTLY_READING_BOOK);
    const [addToFinished] = useMutation(ADD_FINISHED_BOOK);

    // Query for currently reading books
    const { loading, data, refetch } = useQuery(CURRENTLY_READING);

    // Set state to show modal for not
    const [showModal, setShowModal] = useState(false);

    // State for book that's clicked
    const [clickedBook, setClickedBook] = useState(null);

    const [userBooks, setUserBooks] = useState([])

    useEffect(() => {
        refetch()
    }, []);
    
    useEffect(() => {
        if (!loading && data && data.currentlyReading.currentlyReading) {
            setUserBooks(data.currentlyReading.currentlyReading);
        }
    }, [loading, data]);


    const handleOpenModal = (book) => {
        setClickedBook(book);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setClickedBook(null);
        setShowModal(false);
    }

    const finishedBook = async (book) => {
        const { __typename, ...input } = book;
        const bookId = input.bookId;
        try{
            // Adds book to finished books subdocument
            const { data } = await addToFinished({
                variables: { input }
            });

            // Removes book from currently Reading subdocument
            await removeBook({
                variables: { bookId }
            });

            refetch();

            handleCloseModal();

            return data;
        }catch(err){
            return { error: err }
        }
         
    }

    return (
        <>
            <h2 className="mb-3">Currently Reading:</h2>
            <div className="books-collection">
                {userBooks.map((book) => {
                    return (
                        <div className="book-items" key={book.bookId}>
                            <Book 
                            cover={book.cover}
                            title={book.title}
                            author={book.authors}
                            onClick={() => handleOpenModal(book)}
                            />
                        </div>
                    );
                })}
            </div>
            {showModal && <BookModal 
                closeModal={handleCloseModal}
                book={clickedBook}
                page="Currently Reading"
                bookState={finishedBook}
            />}
        </>
    )

}

export default CurrentBooks;