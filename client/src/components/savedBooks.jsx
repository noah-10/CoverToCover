import { useQuery } from "@apollo/client"
import { SAVED_BOOKS } from "../../utils/queries"

import { useEffect, useState } from "react";
import Book from "./Book";
import BookModal from "./BookModal";

import '../css/savedBooks.css'

const SavedBooks = () => {

    const { loading, data, refetch } = useQuery(SAVED_BOOKS);
    const [showModal, setShowModal] = useState(false);
    const [clickedBook, setClickedBook] = useState(null)

    useEffect(() => {
        refetch()
    }, []);

    useEffect(() => {
        console.log(clickedBook);
    })

    const user = data || [];

    if(loading){
        return <div>Loading...</div>
    };

    if(!user?.savedBooks.savedBooks){
        return (
            <h1>You need to be logged in to see this</h1>
        )
    };

    const userSavedBooks = user.savedBooks.savedBooks;

    const handleOpenModal = (book) => {
        setClickedBook(book);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setClickedBook(null);
        setShowModal(false);
    }

    return (
        <div className="saved-books-container">
            <h2>Saved Books:</h2>
            <div className="saved-books-collection">
                {userSavedBooks.map((book) => {
                    return (
                        <div className="saved-books" key={book.bookId}>
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

export default SavedBooks;