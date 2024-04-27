import { useQuery } from "@apollo/client"
import { SAVED_BOOKS } from "../../utils/queries"

import { useEffect, useState } from "react";
import Book from "./Book";
import BookModal from "./BookModal";

const SavedBooks = () => {

    const { loading, data, refetch } = useQuery(SAVED_BOOKS);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        refetch()
    }, []);

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
                            onClick={() => setShowModal(true)}
                            />
                        </div>
                    );
                })}
            </div>
            <BookModal 
                show={showModal}    
            />
        </div>
    )

}

export default SavedBooks;