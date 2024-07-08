import "../css/feed.css";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import FeedItem from "../components/FeedItem";
import { GET_ME, ALL_USERS } from "../../utils/queries";
import { getContentRecommendations } from "../../utils/contentRecommendation";
import { getCollaborativeRecommendation } from "../../utils/collaborativeRecommendation";
import { SAVE_BOOK, DISLIKED_BOOK } from "../../utils/mutations";
import { useApolloClient } from "@apollo/client";
import { getQuote } from "../../utils/quotes.js";

const Feed = () => {
    const [feed, setFeed] = useState([]);
    const [feedIndex, setFeedIndex] = useState(0);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [saveBook] = useMutation(SAVE_BOOK);
    const [disLikedBook] = useMutation(DISLIKED_BOOK);
    const [quote, setQuote] = useState(getQuote());
    const [loadingWidth, setLoadingWidth] = useState(null)

    // get the logged in user
    const { data: userData, loading: userLoading } = useQuery(GET_ME);
    const user = userData?.me || [];
    const { data: allUsersData, loading: allUsersLoading, error } = useQuery(ALL_USERS)
    let allUsers = [];

    const client = useApolloClient();

    useEffect(() => {
        if (!userLoading && userData && !allUsersLoading && allUsersData ) {
            allUsers = allUsersData.allUsers;
            getFeed();
        }
    }, [userLoading, userData, allUsersLoading, allUsersData]);

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

    // Removes the feed item from feed state
    // Checks feed length after each click and will query to add to the feed
    const handleClick = async (book) => {
        const updateFeed = feed.filter(item => item.bookId !== book.bookId);
        setFeed(updateFeed);
        if(feed.length <= 5){
            
            await client.refetchQueries({
                include: [GET_ME]
            });
            getFeed();
        }
    }

    const getFeed = async () => {
        
        // Gets all of users preferences
        const userPreferences = await getPreferences();
        // Get collaborative books
        const collaborativeBooks = await getCollaborativeRecommendation(userPreferences, allUsers, user);

        // Get content based books
        const contentBooks = await getContentRecommendations(userPreferences, user, feed);

        // Combine the arrays
        let combinedArrays = collaborativeBooks.concat(contentBooks);

        setLoadingBooks(false);

        // Set array to feed
        setFeed((prevFeed) => [...prevFeed, ...combinedArrays]);

        // setFeed(collaborativeBooks)
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
            <h1>You need to be logged in to see this</h1>
        );
    }

    

    // return the component
    return (
        <div className="container-fluid feed-container">
            {loadingBooks  ? (
                <>
                    <div className="d-flex justify-content-center w-100 align-items-center flex-column px-1">
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
