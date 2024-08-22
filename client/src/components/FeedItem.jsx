import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { DISLIKED_BOOK, SAVE_BOOK } from "../../utils/mutations";
import BookModal from "./BookModal";
import { faBookmark, faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SwipeFeed from "./SwipeFeed";

import coverLoadingPlaceholder from "../assets/coverLoadingPlaceholder.svg";

const FeedItem = ({ feedItem, checkFeed, screenSize, saveBook, disLikedBook } ) => {

    const [source, setSource] = useState({index0: coverLoadingPlaceholder, index1: coverLoadingPlaceholder});
    const [swipeMode, setSwipeMode] = useState(false);
    const [resetState, setResetState] = useState(false);
    useEffect(() => {
        // when the cover source updates, set the source to the placeholder until the cover loads
        setSource(coverLoadingPlaceholder);
    }, [feedItem.cover]);

    useEffect(() => {
        setSource({index0: feedItem[0].cover, index1: feedItem[1].cover})
    }, [feedItem]);


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
        const element = document.querySelector('.swipe-image-container');

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

    // handle the user clicking on the Save Book button
    const handleSaveClick = async () => {
        const element = document.querySelector('.swipe-image-container');

        if(element){
            const screenWidth = window.innerWidth;
            // Animate the card swiping out of the screen
            element.style.transition = 'transform 1s ease-out, left 1s ease-out, opacity 0.5s ease-out';
            element.style.transform = `translateX(${screenWidth}px) rotate(90deg)`;
            element.style.opacity = 0; // Optionally fade out the card
            
            await likedBook();
            // 1 second delay before calling for the second book
            await new Promise(resolve => setTimeout(resolve, 1000));

            setResetState(true);

            // move on to the next book after saving
            checkFeed(feedItem[0]);
        }else{
            await likedBook();
            checkFeed(feedItem[0]);
        }
        
    };


    return (
        <>
        {swipeMode === false || screenSize > 600  ? (
            <>
            {screenSize < 600 ? (
                <div className="switch-mode">
                    <div className="switch-text">
                        <p>Switch to swiping mode</p>
                    </div>
                    <div className="switch-btn">
                        <button onClick={() => setSwipeMode(true)}>X</button>
                    </div>
                </div>
            ) : (
                null
            )}
            
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
                            src={source.index0} 
                            alt={`Cover of the book "${feedItem[0].title}"`}
                            style={{ imageRendering: 'high-quality', width: '100%', height: 'auto' }}>
                        </img>
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
            </>
        ): (
            <>
                {screenSize < 600 ? (
                <>
                <div className="switch-mode">
                    <div className="switch-text">
                        <p>Switch to standard mode</p>
                    </div>
                    <div className="switch-btn">
                        <button onClick={() => setSwipeMode(false)}>X</button>
                    </div>
                </div>
                <SwipeFeed
                    feedItem={[feedItem[0], feedItem[1]]}
                    likedBook={() => handleSaveClick()}
                    dislikedBook={() => handleDislikeClick()}
                    reset={{resetState, setResetState}}
                />
                
                </>
                ): null}
            </>
        )}
        
        </>
    )
}

export default FeedItem
