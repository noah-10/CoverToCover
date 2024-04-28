import { useQuery } from "@apollo/client"
import { CURRENTLY_READING } from "../../utils/queries"

import { useEffect, useState } from "react";
import Book from "./Book";
import BookModal from "./BookModal";

const CurrentBooks = () => {

    const { loading, data, refetch } = useQuery(CURRENTLY_READING);
    const [showModal, setShowModal] = useState(false);
    const [clickedBook, setClickedBook] = useState(null)

    useEffect(() => {
        refetch()
    }, []);

    const user = data || [];

    if(loading){
        return <div>Loading...</div>
    };

    if(!user?.currentlyReading.currentlyReading){
        return (
            <h1>You need to be logged in to see this</h1>
        )
    };

    const userCurrentlyReading = user.currentlyReading.currentlyReading;

    const handleOpenModal = (book) => {
        setClickedBook(book);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setClickedBook(null);
        setShowModal(false);
    }

    return (
        <div className="current-books-container">
            <h2>Current Books:</h2>
            <div className="current-books-collection">
                {userCurrentlyReading.map((book) => {
                    return (
                        <div className="current-books" key={book.bookId}>
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
            />}
        </div>
    )

}

export default CurrentBooks;