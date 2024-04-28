import { useQuery } from "@apollo/client"
import { FINISHED_BOOKS } from "../../utils/queries"

import { useEffect, useState } from "react";
import Book from "./Book";
import BookModal from "./BookModal";

const FinishedBooks = () => {

    const { loading, data, refetch } = useQuery(FINISHED_BOOKS);
    const [showModal, setShowModal] = useState(false);
    const [clickedBook, setClickedBook] = useState(null)

    useEffect(() => {
        refetch()
    }, []);

    const user = data || [];

    if(loading){
        return <div>Loading...</div>
    };

    if(!user?.finishedBooks.finishedBooks){
        return (
            <h1>You need to be logged in to see this</h1>
        )
    };

    const userFinishedBooks = user.finishedBooks.finishedBooks;

    console.log(userFinishedBooks)

    const handleOpenModal = (book) => {
        setClickedBook(book);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setClickedBook(null);
        setShowModal(false);
    }

    return (
        <div className="finished-books-container">
            <h2>Finished Books:</h2>
            <div className="finished-books-collection">
                {userFinishedBooks.map((book) => {
                    return (
                        <div className="finished-books" key={book.bookId}>
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

export default FinishedBooks;