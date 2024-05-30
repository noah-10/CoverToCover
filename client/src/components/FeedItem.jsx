import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { DISLIKED_BOOK, SAVE_BOOK } from "../../utils/mutations";
import BookModal from "./BookModal";

import coverLoadingPlaceholder from "../assets/coverLoadingPlaceholder.svg";

const FeedItem = ({ feedItem, checkFeed } ) => {
    // use the save book mutation, get a mutation function
    const [saveBook, { error }] = useMutation(SAVE_BOOK);
    const [disLikedBook] = useMutation(DISLIKED_BOOK);

    const [source, setSource] = useState(coverLoadingPlaceholder);

    useEffect(() => {
        // when the cover source updates, set the source to the placeholder until the cover loads
        setSource(coverLoadingPlaceholder);
    }, [feedItem.cover]);

    useEffect(() => {
        setSource(feedItem.cover)
    }, [feedItem]);

    // State for if the modal is being shown
    const [showModal, setShowModal] = useState(false);

    // State for what book is clicked
    const [clickedBook, setClickedBook] = useState(null);

    // handle the user clicking on the Save Book button
    const handleSaveClick = async () => {
        try {
            const { score, __typename, ...formatBook} = feedItem
            // try to save the book to the user's data
            await saveBook(
                { variables: { input: formatBook }}
            );
        } catch (error) {
            console.error(error);
        }
        // move on to the next book after saving
        checkFeed(feedItem);
    };

    const handleDislikeClick = async () => {
        try{
            const { score, __typename, ...formatBook } = feedItem;
            await disLikedBook(
                { variables: { input: formatBook }}
            );
        }catch(err){
            return { error: err };
        }

        checkFeed(feedItem);
    }   

    // Function to set state of books thats clicked and to show modal
    const handleOpenModal = (book) => {
        console.log(book);
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
        <div className="feed-item-container">
            <img 
                className="feed-img h-100" 
                onClick={() => handleOpenModal(feedItem)} 
                src={source} 
                alt={`Cover of the book "${feedItem.title}"`}
                style={{ imageRendering: 'high-quality', width: '100%', height: 'auto' }}>
            </img>

            {showModal && (
                <BookModal closeModal={() => handleCloseModal()} book={feedItem} />
            )}
        </div>
        <div className="feed-info">
            <div className="feed-title">
                <h3>{feedItem.title}</h3>
            </div>
            <div className="feed-authors">
                <p>{feedItem.authors}</p>
            </div>
            <div className="feed-description">
                <p>{feedItem.description}</p>
            </div>
            <div className="feed-btns">
                <button id="dismiss-button" onClick={() => handleDislikeClick()}>Dismiss Book</button>   
                <button id="save-button" onClick={() => handleSaveClick()}>Save Book</button>
            </div>
        </div>
        </>
    )
}

export default FeedItem
