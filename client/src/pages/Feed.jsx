import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import FeedItem from "../components/FeedItem";
import { searchOpenLibrary } from "../../utils/API";

import { GET_ME } from "../../utils/queries";

const Feed = () => {
    const [feed, setFeed] = useState([]);
    const [feedIndex, setFeedIndex] = useState(0);

    // get the logged in user
    const { data } = useQuery(GET_ME);
    const user = data?.me || [];

    // return an array of books based on a query and optional queryType
    const getBookData = async (query, queryType = "q") => {
        try {
            // query OpenLibrary, receiving a response
            const response = await searchOpenLibrary(query, queryType);
            
            // if the response was not ok, throw an error
            if (!response.ok) {
                throw new Error("error fetching books");
            }
            
            // parse the response as json
            const { docs } = await response.json();

            // save the relevant parts of the response
            const bookData = docs.map((book) => ({
                authors: book.author_name,
                title: book.title,
                cover: `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`,
                bookId: book.key,
                firstSentence: book.first_sentence ? book.first_sentence[0] : "",
                link: `https://openlibrary.org${book.seed[0]}`
            }));

            // return the book data from the query
            return bookData;
        } catch (error) {
            console.error(error);
        }
    }

    // return partial feeds
    const getPartialFeeds = async () => {
        // put all the preferences into one array, specifying query and query type (author or subject)
        let sortedPreferences = [];
        sortedPreferences = sortedPreferences.concat(
            user.preferencedAuthor.map(preference => ({ queryType: "author", query: preference })),
            user.preferencedGenre.map(preference => ({ queryType: "subject", query: preference })));

        // array for the partial feeds
        const partialFeeds = [];
        // sleep function to wait ms milliseconds
        let sleep = (ms) => new Promise(res => setTimeout(res, ms));
        // temporary feed to display to user faster
        let tempFeed = [];
        // make an API call for each preference
        for (let i = 0; i < sortedPreferences.length; i++) {
            // space out API calls a little, so as to not spam the server
            // run on every iteration but the first
            if (i !== 0) {
                await sleep(1000); 
            }
            // make the calls and get the results
            let preference = sortedPreferences[i];
            const data = await getBookData(preference.query, preference.queryType);
            partialFeeds.push(data);
            // save intermediate results to the overall feed to get page loaded faster
            if (data.length > 0) {
                tempFeed.push(data[0]);
                setFeed(tempFeed);
            }
        }

        return partialFeeds;
    }

    // return complete feed
    const getFeed = async () => {
        // get the partial feeds
        const partialFeeds = await getPartialFeeds();

        // find the maximum length 
        const maxLength = partialFeeds.reduce((acc, cur) => acc > cur.length ? acc : cur.length, 0) * partialFeeds.length;

        const result = [];

        // cycle through the partial feeds, alternatingly adding all their books to a single feed
        for (let i = 0; i < maxLength * partialFeeds.length; i++) {
            const feedNumber = i % partialFeeds.length;
            const feedIndex = Math.floor(i / partialFeeds.length);
            if (feedIndex < partialFeeds[feedNumber].length) {
                result.push(partialFeeds[feedNumber][feedIndex]);
            }
        }

        // save the generated feed in the state
        setFeed(result);
    }

    // only fetch the feed when the user's data is loaded
    useEffect(() => {
        if (user.preferencedAuthor && user.preferencedGenre) {
            getFeed();
        }
    }, [user]);

    // progress to the next feed item
    const incrementFeed = () => {
        setFeedIndex(feedIndex + 1);
    }

    // if not logged in, show a message
    if (!user.username) {
        return (
            <h1>You need to be logged in to see this</h1>
        );
    }

    // return the component
    return (
        <div>
            {feedIndex < feed.length 
            ? 
            <FeedItem feedItem={feed[feedIndex]} incrementFeed={incrementFeed}></FeedItem>
            :
            "No books"}
        </div>
    );
}

export default Feed;
