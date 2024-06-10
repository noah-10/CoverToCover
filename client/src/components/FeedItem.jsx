import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { DISLIKED_BOOK, SAVE_BOOK } from "../../utils/mutations";
import BookModal from "./BookModal";
import { faBookmark, faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import coverLoadingPlaceholder from "../assets/coverLoadingPlaceholder.svg";

const FeedItem = ({ feedItem, checkFeed, screenSize } ) => {
    // use the save book mutation, get a mutation function
    const [saveBook, { error }] = useMutation(SAVE_BOOK);
    const [disLikedBook] = useMutation(DISLIKED_BOOK);

    const [source, setSource] = useState({index0: coverLoadingPlaceholder, index1: coverLoadingPlaceholder});
    const [position, setPosition] = useState({ x: null, y: null });
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 0, y: 0});
    const [overlayText, setOverlayText] = useState(null);
    // console.log(feedItem)
    useEffect(() => {
        // when the cover source updates, set the source to the placeholder until the cover loads
        setSource(coverLoadingPlaceholder);
    }, [feedItem.cover]);

    useEffect(() => {
        setSource({index0: feedItem[0].cover, index1: feedItem[1].cover})
    }, [feedItem]);

    // State for if the modal is being shown
    const [showModal, setShowModal] = useState(false);

    // State for what book is clicked
    const [clickedBook, setClickedBook] = useState(null);

    // handle the user clicking on the Save Book button
    const handleSaveClick = async () => {
        const element = document.querySelector('.small-feed-image-container');

        if(element){
            const screenWidth = window.innerWidth;
            // Animate the card swiping out of the screen
            element.style.transition = 'transform 1s ease-out, left 1s ease-out, opacity 0.5s ease-out';
            element.style.transform = `translateX(${screenWidth}px) rotate(90deg)`;
            element.style.opacity = 0; // Optionally fade out the card
            
            await likedBook();
            // 1 second delay before calling for the second book
            await new Promise(resolve => setTimeout(resolve, 1000));

            resetPosition();
            // move on to the next book after saving
            checkFeed(feedItem[0]);
        }else{
            await likedBook();
            checkFeed(feedItem[0]);
        }
        
    };

    const likedBook = async () => {
        try {
            const { score, __typename, ...formatBook} = feedItem[0]
            // try to save the book to the user's data
            await saveBook(
                { variables: { input: formatBook }}
            );
        } catch (error) {
            console.error(error);
        }
    }

    const dislikeBook = async () => {
        try{
            const { score, __typename, ...formatBook } = feedItem[0];
            await disLikedBook(
                { variables: { input: formatBook }}
            );
        }catch(err){
            return { error: err };
        }
    }

    const handleDislikeClick = async () => {
        const element = document.querySelector('.small-feed-image-container');

        if(element) {
            const screenWidth = window.innerWidth;

            // Animate the card swiping out of the screen
            element.style.transition = 'transform 1s ease-out, left 1s ease-out, opacity 0.5s ease-out';
            element.style.transform = `translateX(-${screenWidth}px) rotate(-90deg)`;
            element.style.opacity = 0; // Optionally fade out the card
            
            await dislikeBook();
    
            // 1 second delay before calling for the second book
            await new Promise(resolve => setTimeout(resolve, 1000)); 
    
            resetPosition();
            // move on to the next book after adding to db
            checkFeed(feedItem[0]);
        }else{
            await dislikeBook();
            checkFeed(feedItem[0]);
        }
       
    }   

    // Resets position of the book cover img
    const resetPosition = () => {
        // For element
        const element = document.querySelector('.small-feed-image-container');
        element.style.transition = 'transform 0s, left 0s, opacity 0s';
        element.style.transform = `translateX(0px) rotate(0deg)`;
        element.style.opacity = 1; 
        setPosition({ x: null, y: null });

        //  For the text "Save" and "Dislike"
        const textElem = document.querySelector('.img-text-overlay');
        textElem.style.opacity = 0;
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

    const touchStart = (e, type) => {
        setDragging(true);
        let typeEvent = null;

        if(type === "touch"){
            typeEvent = e.touches[0];
        }else{
            typeEvent = e;
            e.preventDefault();
        }
        setRel({
            x: typeEvent.pageX - position.x,
            y: typeEvent.pageY - position.y
        });
    }

    const touchMove = (e, type) => {
        if(!dragging) return;

        let typeEvent = null;
        if(type === "touch"){
            typeEvent = e.touches[0];
        }else{
            typeEvent = e;
            e.preventDefault();
        }

        const newPosition = {
            x: typeEvent.pageX - rel.x,
            y: typeEvent.pageY - rel.y
        };

        // Defining boundaries
        const minY = -20;
        const maxY = 20;

        newPosition.y = Math.max(minY, Math.min(newPosition.y, maxY));

        setPosition(newPosition);

        // Calculate rotation based on x-axis movement
        const deltaX = newPosition.x - (window.innerWidth - window.innerWidth * 1) / 2;
        const rotationAngle = deltaX / 10;

        const element = document.querySelector('.small-feed-image-container');
        if (element) {
            element.style.transform = `rotate(${rotationAngle}deg)`;
        }
        // calculate distance moved
        const initialDistance = 0;
        const distanceMoved = newPosition.x - initialDistance
        if(Math.sign(distanceMoved) > 0){
            setOverlayText("SAVE");
        }else{
            setOverlayText("DISLIKE");
        }

        // Update text opacity based on distance moved on x-axis
        const maxDistance = window.innerWidth / 2;
        const opacity = Math.min(1, (Math.abs(distanceMoved) / maxDistance) * 1.25);

        const textElem = document.querySelector('.img-text-overlay');
        if (textElem) {
            textElem.style.opacity = opacity;
        }
    }

    const touchEnd = () => {
        setDragging(false)

        const leftBoundary = window.innerWidth * -0.25; // 25% of the viewport width from the left
        const rightBoundary = window.innerWidth * 0.25; // 25% of the viewport width from the right

        if(position.x < leftBoundary){
            handleDislikeClick();
        }else if(position.x > rightBoundary){
            handleSaveClick();
        }
        else{

            setPosition({
                x: null,
                y: null,
            })

            const element = document.querySelector('.small-feed-image-container');
            element.style.transform = 'rotate(0deg)'
            const textElem = document.querySelector('.img-text-overlay');
            textElem.style.opacity = 0;
        }
    }

    return (
        <>
        {screenSize >= 800 ? (
            <div className="feed-content">
                <div className="book-info"> 
                    <div className="feed-title">
                        <h3>{feedItem[0].title}</h3>
                    </div>
                    <div className="feed-authors">
                        <p>{feedItem[0].authors}</p>
                    </div>
                </div>
                <div className="feed-info">
                    <div className="feed-image-container">
                        <img 
                            className="feed-img" 
                            onClick={() => handleOpenModal(feedItem[0])} 
                            src={source.index0} 
                            alt={`Cover of the book "${feedItem[0].title}"`}
                            style={{ imageRendering: 'high-quality', width: '100%', height: 'auto' }}>
                        </img>

                        {/* {showModal && (
                            <BookModal closeModal={() => handleCloseModal()} book={feedItem} />
                        )} */}
                    </div>

                    <div className="feed-description">
                        <p>{feedItem[0].description}</p>
                    </div>
                </div>
                <div className="feed-btns">
                    <button id="dismiss-button" onClick={() => handleDislikeClick()}><FontAwesomeIcon className="feed-icon" icon={faBan}></FontAwesomeIcon></button>   
                    <button id="save-button" onClick={() => handleSaveClick()}><FontAwesomeIcon className="feed-icon" icon={faBookmark}></FontAwesomeIcon></button>
                </div>
            </div>
        ): (
            <div className="small-feed-content">
                <div className="feed-img-container">
                    <div 
                        className="small-feed-image-container"
                        onMouseDown={(e) => touchStart(e, "mouse")}
                        onMouseMove={(e) => touchMove(e, 'mouse')}
                        onMouseUp={touchEnd}
                        onTouchStart={(e) => touchStart(e, 'touch')}
                        onTouchMove={(e) => touchMove(e, 'touch')}
                        onTouchEnd={touchEnd}
                        // onMouseLeave={mouseUp}
                        style={{
                            position: 'relative',
                            left: position.x,
                            top: position.y,
                        }}
                    >
                        <img 
                            className="small-feed-img" 
                            onClick={() => handleOpenModal(feedItem[0])} 
                            src={source.index0} 
                            alt={`Cover of the book "${feedItem[0].title}"`}
                            style={{ imageRendering: 'high-quality' }}>
                        </img>

                        <div className={overlayText === "SAVE" ? "save-text img-text-overlay" : "dislike-text img-text-overlay"}>
                            <p>{overlayText}</p>
                        </div>
                        

                        {/* {showModal && (
                            <BookModal closeModal={() => handleCloseModal()} book={feedItem} />
                        )} */}
                    </div>
                </div>
                <div className="next-img-container">
                    <img 
                        className="next-feed-img" 
                        src={source.index1} 
                        alt={`Cover of the book "${feedItem[1].title}"`}
                        style={{ imageRendering: 'high-quality' }}>
                    </img>
                </div>
                <div className="small-feed-btns">
                    <button id="small-dismiss-button" onClick={() => handleDislikeClick()}>
                        <FontAwesomeIcon className="feed-icon" icon={faBan}></FontAwesomeIcon>
                    </button>   
                    <button id="small-save-button" onClick={() => handleSaveClick()}>
                        <FontAwesomeIcon className="feed-icon" icon={faBookmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )}
        
        </>
    )
}

export default FeedItem
