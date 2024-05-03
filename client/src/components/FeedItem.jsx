import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../../utils/mutations";
import BookModal from "./BookModal";

import coverLoadingPlaceholder from "../assets/coverLoadingPlaceholder.svg";
import { loadImage } from "../../utils/loadImage";

const FeedItem = ({ feedItem, incrementFeed } ) => {
    // use the save book mutation, get a mutation function
    const [saveBook, { error }] = useMutation(SAVE_BOOK);

    // adapted from https://stackoverflow.com/questions/63854208/dynamically-load-images-with-react
    // dynamically load the cover image, showing a placeholder until loaded
    const [source, setSource] = useState(coverLoadingPlaceholder);

    useEffect(() => {
        // start preloading the image and set the image source when loaded
        const load = async () => {
            await loadImage(feedItem.cover).then((src) => setSource(src));
        }
        load();
    }, [source, setSource]);

    useEffect(() => {
        // when the cover source updates, set the source to the placeholder until the cover loads
        setSource(coverLoadingPlaceholder);
    }, [feedItem.cover]);

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
            <img onClick={() => handleOpenModal()} style={{width: "25vw"}} src={source} alt={`Cover of the book "${feedItem.title}"`}></img>
            <div>Title: {feedItem.title}</div>
            <div>Authors: {feedItem.authors.join(", ")}</div>
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
