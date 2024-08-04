import "../css/feed.css";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import FeedItem from "../components/FeedItem";
import { GET_ME, ALL_USERS } from "../../utils/queries";
import { getContentRecommendations } from "../../utils/contentRecommendation";
import { getCollaborativeRecommendation } from "../../utils/collaborativeRecommendation";
import { SAVE_BOOK, DISLIKED_BOOK } from "../../utils/mutations";
import { useApolloClient } from "@apollo/client";
import { getQuote } from "../../utils/quotes.js";
import NotLoggedIn from "../components/NotLoggedIn.jsx";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Feed = () => {
    const [feed, setFeed] = useState([]);
    const [feedIndex, setFeedIndex] = useState(0);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [saveBook] = useMutation(SAVE_BOOK);
    const [disLikedBook] = useMutation(DISLIKED_BOOK);
    const [quote, setQuote] = useState(getQuote());
    const [loadingWidth, setLoadingWidth] = useState(null)
    const [limitUsed, setLimitUsed] = useState(false);

    // get the logged in user
    const { data: userData, loading: userLoading } = useQuery(GET_ME);
    const user = userData?.me || [];
    const { data: allUsersData, loading: allUsersLoading, error } = useQuery(ALL_USERS)
    let allUsers = [];

    const location = useLocation();
    const feedRef = useRef(feed);

    const client = useApolloClient();

    useEffect(() => {
        if (!userLoading && userData && !allUsersLoading && allUsersData ) {
            allUsers = allUsersData.allUsers;
            getFeed();
        }
    }, [userLoading, userData, allUsersLoading, allUsersData]);

    // Update the ref each time feed changes
    useEffect(() => {
        console.log("feed", feed);
        feedRef.current = feed;
        if(feed && feed.length > 3){
            setLoadingBooks(false)
        }
    }, [feed]);

    // effect for tracking screen size to be able to change layout
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            if(window.innerWidth > 768){
                setLoadingWidth("w-25")
            }else{
                setLoadingWidth("w-50")
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [window.innerWidth]);

    useEffect(() => {

        // Function to call when leaving the Feed page
        const handleLeaveFeed = () => {
            console.log(feedRef.current);
          localStorage.setItem('feed', JSON.stringify(feedRef.current));
        };
    
        // Check if the current path is '/feed'
        if (location.pathname !== '/feed') {
          handleLeaveFeed();
        }
    
        // Return a cleanup function to be called when the component unmounts
        return () => {
          if (location.pathname === '/feed') {
            handleLeaveFeed();
          }
        };
      }, [location]);

    useEffect(() => {
    const localStorageFeed = JSON.parse(localStorage.getItem('feed'));
    if(localStorageFeed && localStorageFeed.length > 1){
        setFeed((prevFeed) => [...prevFeed, ...localStorageFeed]);
    }
    }, []);

    // Removes the feed item from feed state
    // Checks feed length after each click and will query to add to the feed
    const handleClick = async () => {
        const book = feed[0];
        const updateFeed = feed.filter(item => item.bookId !== book.bookId);
        setFeed(updateFeed);
        if(feed.length === 2){
            
            await client.refetchQueries({
                include: [GET_ME]
            });
            setLoadingBooks(true);
            getFeed();
        }
    }

    const getFeed = async () => {

        if(loadingBooks === false){
            return;
        }

        let localStorageFeed = null;

        if(localStorage.getItem('feed')){
            
            localStorageFeed = localStorage.getItem('feed');
            localStorageFeed = JSON.parse(localStorageFeed);
        }

        // Gets all of users preferences
        const userPreferences = await getPreferences();
        // Get collaborative books
        // const collaborativeBooks = await getCollaborativeRecommendation(userPreferences, allUsers, user, feed, localStorageFeed);

        // Get content based books
        const contentBooks = await getContentRecommendations(userPreferences, user, feed, localStorageFeed);
        console.log(contentBooks);

        if(contentBooks.limitReached === true){
            return setLimitUsed(true);
        }

        // let combinedArrays = null;

        // // Combine the arrays
        // if(collaborativeBooks){
        //     combinedArrays = collaborativeBooks.concat(contentBooks);
        // }else{
        //     combinedArrays = contentBooks;
        // }

        // const shuffleArray = (array) => {
        //     const newArray = array.slice();

        //     for(let i = newArray.length -1; i > 0; i--){
        //         const j = Math.floor(Math.random() * (i + 1));
        //         const temp = newArray[i];
        //         newArray[i] = newArray[j];
        //         newArray[j] = temp;
        //     }

        //     return newArray;
        // }

        // const shuffledBooks = shuffleArray(combinedArrays);

        setLoadingBooks(false);
        
        // Set array to feed
        setFeed((prevFeed) => [...prevFeed, ...contentBooks]);
    }

    // Gets uers preferences based on saved, currently reading, finished, and prefered genres
    const getPreferences = async () => {
        let sortedPreferences = [];
        let sortedDislikes = [];
        if(user){
            sortedPreferences = sortedPreferences.concat(
                // user.preferencedAuthor.map(preference => ({ queryType: "author", query: preference })),
                user.savedBooks ? user.savedBooks.flatMap(book => book.categories.map(category => (category))) : null,
                user.currentlyReading ? user.currentlyReading.flatMap(book => book.categories.map(category => (category))) : null,
                user.finishedBooks ? user.finishedBooks.flatMap(book => book.categories.map(category => (category))): null,
                user.preferencedGenre ? user.preferencedGenre.map(preference => (preference)): null
            );

            sortedDislikes = user.dislikedBooks ? user.dislikedBooks.flatMap(book => book.categories.map(category => (category))): null
        }


        return { sortedPreferences, sortedDislikes };
    }

    // if not logged in, show a message
    if (!user.username) {
        return (
            <NotLoggedIn />
        );
    }

    if(limitUsed && feed.length < 3){
        return(
            <div className="limit-used-container">
                <div className="limit-text">
                    <h1>Limit has been used for the day!</h1>
                    <p>Take this time to look through your library and start reading!</p>
                </div>
                <div className="limit-link">
                    <Link to='/library'><button>Library</button></Link>
                </div>
                <div className="check-back">
                    <small>Check back in 24 hours to find new books</small>
                </div>
            </div>
        )
    }


    // return the component
    return (
        <div className="container-fluid feed-container">
        
            {loadingBooks  ? (
                <>
                    <div className="d-flex justify-content-center w-100 align-items-center flex-column px-1 my-auto">
                        <div className="loading-quote">
                            <p>"{quote.quote}" - {quote.author}</p>
                        </div>
                        <div className={`${loadingWidth} loading-spinners d-flex justify-content-around my-5`}>
                            <div className="spinner-grow text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        
                        <div className="loading-text fs-5">
                            <p>Loading your personalized book recommendations...</p>
                        </div>
                    </div>
                </>
                
            ) : (
                <>
                    <FeedItem 
                        feedItem={feed} 
                        checkFeed = {handleClick}
                        screenSize = {screenWidth}
                        saveBook = {saveBook}
                        disLikedBook = {disLikedBook}
                    >
                    </FeedItem>
                </>
            )}
        </div>
    );
}

export default Feed;
