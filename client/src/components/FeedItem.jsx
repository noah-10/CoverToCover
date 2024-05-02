import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../../utils/mutations";
import BookModal from "./BookModal";

const FeedItem = ({ feedItem, incrementFeed } ) => {
    // use the save book mutation, get a mutation function
    const [saveBook, { error }] = useMutation(SAVE_BOOK);

    // State for if the modal is being shown
    const [showModal, setShowModal] = useState(false);

    // State for what book is clicked
    const [clickedBook, setClickedBook] = useState(null);

    // handle the user clicking on the Save Book button
    const handleSaveClick = async () => {
        try {
            // try to save the book to the user's data
            await saveBook({ variables: { input: feedItem } });
        } catch (error) {
            console.error(error);
        }
        // move on to the next book after saving
        incrementFeed();
    }

    // Function to set state of books thats clicked and to show modal
    const handleOpenModal = (book) => {
        setClickedBook(book);
        setShowModal(true);
    }

    // Function to empty the state of book clicked and not show modal
    const handleCloseModal = () => {
        setClickedBook(null);
        setShowModal(false);
    }

    return (
        <>
            <img onClick={() => handleOpenModal()} style={{width: "25vw"}} src={feedItem.cover} alt={`Cover of the book "${feedItem.title}`}></img>
            <div>Title: {feedItem.title}</div>
            <div>Authors: {feedItem.authors}</div>
            <button onClick={() => incrementFeed()}>Dismiss Book</button>
            <button onClick={() => handleSaveClick()}>Save Book</button>
            {showModal && (
                <BookModal closeModal={() => handleCloseModal()} book={feedItem} />
            )}
            {error && (
                <div>
                    {error.message}
                </div>
            )}
        </>
    )
}

export default FeedItem
