import { useQuery } from "@apollo/client"
import { FINISHED_BOOKS } from "../../utils/queries"

import { useEffect, useState } from "react";
import Book from "./Book";
import BookModal from "./BookModal";

const FinishedBooks = () => {

    // Query for finished books
    const { loading, data, refetch } = useQuery(FINISHED_BOOKS);

    // State for books
    const [userBooks, setUserBooks] = useState([]);

    // State to show modal or not
    const [showModal, setShowModal] = useState(false);

    // State for book that's clicked
    const [clickedBook, setClickedBook] = useState(null)

    useEffect(() => {
        refetch()
    }, []);

    useEffect(() => {
        if (!loading && data && data.finishedBooks.finishedBooks) {
            setUserBooks(data.finishedBooks.finishedBooks);
        }
    }, [loading, data]);

    const handleOpenModal = (book) => {
        setClickedBook(book);
        setShowModal(true);
        document.body.style.overflow = "hidden";
    }

    const handleCloseModal = () => {
        setClickedBook(null);
        setShowModal(false);
        document.body.style.overflow = null;
    }

    return (
        <>
            <h2>Finished Books:</h2>
            {userBooks.length > 0 ? (
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
            ): (
                <div className="no-books">
                    <p>You do not have any finished books!</p>
                    <p>Pick up a book and start reading!</p>
                </div>
            )}
            
            {showModal && <BookModal 
                closeModal={handleCloseModal}
                book={clickedBook}
            />}
        </>
    )

}

export default FinishedBooks;