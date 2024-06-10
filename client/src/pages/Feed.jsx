import "../css/feed.css";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import FeedItem from "../components/FeedItem";
import { searchGoogleBooks } from "../../utils/API";

import { GET_ME, ALL_USERS } from "../../utils/queries";

import coverPlaceholder from "../assets/coverPlaceholder.svg";
import { loadImage } from "../../utils/loadImage";

import { getContentRecommendations } from "../../utils/contentRecommendation";
import { getCollaborativeRecommendation } from "../../utils/collaborativeRecommendation";


const Feed = () => {
    const [feed, setFeed] = useState([]);
    const [feedIndex, setFeedIndex] = useState(0);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // get the logged in user
    const { data: userData, loading: userLoading } = useQuery(GET_ME);
    const user = userData?.me || [];
    const { data: allUsersData, loading: allUsersLoading, error } = useQuery(ALL_USERS)
    let allUsers = [];


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
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [window.innerWidth]);

    // Removes the feed item from feed state
    // Checks feed length after each click and will query to add to the feed
    const handleClick = (book) => {
        const updateFeed = feed.filter(item => item.bookId !== book.bookId);
        setFeed(updateFeed);
        if(feed.length <= 5){
            getFeed();
        }
    }


    const getFeed = async () => {
        
        // Gets all of users preferences
        const userPreferences = await getPreferences();
        // Get collaborative books
        const collaborativeBooks = await getCollaborativeRecommendation(userPreferences, allUsers, user);

        // Get content based books
        const contentBooks = await getContentRecommendations(userPreferences, user);

        // Combine the arrays
        let combinedArrays = collaborativeBooks.concat(contentBooks);

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
            {feedIndex < feed.length 
            ? 
            <>
            <>
                <FeedItem 
                    feedItem={feed} 
                    checkFeed = {handleClick}
                    screenSize = {screenWidth}
                >
                </FeedItem>
            </>
            
            </>
            :
            "Loading books..."}
        </div>
    );
}

export default Feed;
