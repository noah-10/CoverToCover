import { useQuery, useMutation } from "@apollo/client"
import { CURRENTLY_READING } from "../../utils/queries"
import { FINISHED_READING } from '../../utils/mutations';
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import Book from "./Book";
import BookModal from "./BookModal";

const CurrentBooks = () => {

    const [finishedReading] = useMutation(FINISHED_READING);

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
        document.body.style.overflow = "hidden";
    }

    const handleCloseModal = () => {
        setClickedBook(null);
        setShowModal(false);
        document.body.style.overflow = null;
    }

    const finishedBook = async (book) => {
        
        try{
            const bookId = book._id;
            // Adds book to finished books subdocument
            const { data } = await finishedReading({
                variables: { bookId }
            });

            if(!data){
                return { message: "Error adding book to finished" };
            }

            handleCloseModal();

            refetch();

            return data;
        }catch(err){
            return { error: err }
        }
         
    }

    return (
        <>
            <h2 className="mb-3">Currently Reading:</h2>
            {userBooks.length > 0 ? (
                <div className="books-collection">
                {userBooks.map((book) => {
                    return (
                        <div className="book-items" key={book.bookId}>
                            <Book 
                            cover={book.cover}
                            title={book.title}
                            author={book.authors}
                            _id={book._id}
                            onClick={() => handleOpenModal(book)}
                            />
                        </div>
                    );
                })}
            </div>
            ) : (
                <div className="no-books">
                    <p>You are not currently reading any books!</p>
                    <p>Pick up a book and start reading!</p>
                </div>
            )}
            
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