import { useState, useEffect } from "react";
import { faBookmark, faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BookModal from "./BookModal";
import '../css/swipeFeed.css';

const SwipeFeed = ({ feedItem, likedBook, dislikedBook, reset, demoFeed }) => {

    const [position, setPosition] = useState({ x: null, y: null });
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 0, y: 0});
    const [overlayText, setOverlayText] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if(reset.resetState === true){
            resetPosition();
        }
    }, [reset]);

    // Resets position of the book cover img
    const resetPosition = () => {
        // For element
        const element = document.querySelector('.swipe-image-container');
        element.style.transition = 'transform 0s, left 0s, opacity 0s';
        element.style.transform = `translateX(0px) rotate(0deg)`;
        element.style.opacity = 1; 
        setPosition({ x: null, y: null });

        //  For the text "Save" and "Dislike"
        const textElem = document.querySelector('.img-text-overlay');
        textElem.style.opacity = 0;

        reset.setResetState(false);
    }

    // Function to set state of books thats clicked and to show modal
    const handleOpenModal = () => {
        setShowModal(true);
        const bodyElem = document.querySelector("body");
        bodyElem.style.overflow = "hidden"
    }

    // Function to empty the state of book clicked and not show modal
    const handleCloseModal = () => {
        setShowModal(false);
        const bodyElem = document.querySelector("body");
        bodyElem.style.overflow = null;
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

        const element = document.querySelector('.swipe-image-container');
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

        // Determine if user is clicking or swiping
        const swipeThreshold = 10;
        if(Math.abs(position.x) < swipeThreshold || position.x === null){
            handleOpenModal();
        }

        const leftBoundary = window.innerWidth * -0.25; // 25% of the viewport width from the left
        const rightBoundary = window.innerWidth * 0.25; // 25% of the viewport width from the right

        if(position.x < leftBoundary  && dislikedBook){
            dislikedBook();
        }else if(position.x > rightBoundary && likedBook ){
            likedBook();
        }else if(position.x < leftBoundary || position.x > rightBoundary && demoFeed){
            demoFeed();
            resetPosition();
        }
        else{

            setPosition({
                x: null,
                y: null,
            })

            const element = document.querySelector('.swipe-image-container');
            element.style.transform = 'rotate(0deg)'
            const textElem = document.querySelector('.img-text-overlay');
            textElem.style.opacity = 0;
        }
    }

    const handleLikeClick = () => {
        if(likedBook){
            likedBook();
        }else{
            demoFeed();
            resetPosition();
        }
    }

    const handleDislikeClick = () => {
        if(dislikedBook){
            dislikedBook();
        }else{
            demoFeed();
            resetPosition();
        }
    }

    return(
        <div className="swipe-feed-content">
            <div className="swipe-images-container">
                <div 
                    className="swipe-image-container"
                    onMouseDown={(e) => touchStart(e, "mouse")}
                    onMouseMove={(e) => touchMove(e, 'mouse')}
                    onMouseUp={touchEnd}
                    onTouchStart={(e) => touchStart(e, 'touch')}
                    onTouchMove={(e) => touchMove(e, 'touch')}
                    onTouchEnd={touchEnd}
                    style={{
                        position: 'relative',
                        left: position.x,
                        top: position.y,
                    }}
                >
                    <img 
                        className="swipe-img" 
                        // onClick={() => handleOpenModal(feedItem[0])} 
                        src={feedItem[0].cover} 
                        alt={`Cover of the book "${feedItem[0].title}"`}
                        style={{ imageRendering: 'high-quality' }}>
                    </img>

                    <div className={overlayText === "SAVE" ? "save-text img-text-overlay" : "dislike-text img-text-overlay"}>
                        <p>{overlayText}</p>
                    </div>
                    
                    
                </div>
                <div className="next-img-container">
                    <img 
                        className="next-feed-img" 
                        src={feedItem[1].cover} 
                        alt={`Cover of the book "${feedItem[1].title}"`}
                        style={{ imageRendering: 'high-quality' }}>
                    </img>
                </div>
            </div>
            
            <div className="small-feed-btns">
                <button id="small-dismiss-button" onClick={() => handleDislikeClick()}>
                    <FontAwesomeIcon className="feed-icon" icon={faBan}></FontAwesomeIcon>
                </button>   
                <button id="small-save-button" onClick={() => handleLikeClick()}>
                    <FontAwesomeIcon className="feed-icon" icon={faBookmark}></FontAwesomeIcon>
                </button>
            </div>
            {showModal && (
                        <BookModal closeModal={() => handleCloseModal()} book={feedItem[0]} />
            )}
        </div>
    )
}

export default SwipeFeed;