import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../../utils/mutations";

const FeedItem = ({ feedItem, incrementFeed } ) => {
    // use the save book mutation, get a mutation function
    const [saveBook, { error }] = useMutation(SAVE_BOOK);

    // handle the user clicking on the Save Book button
    const handleSaveClick = async () => {
        try {
            // try to save the book to the user's data
            await saveBook({ variables: { input: {
                ...feedItem,
                firstSentence: feedItem.firstSentence ? feedItem.firstSentence[0] : ""
            } } });
        } catch (error) {
            console.error(error);
        }
        // move on to the next book after saving
        incrementFeed();
    }

    return (
        <>
            <img style={{width: "25vw"}} src={feedItem.cover} alt={`Cover of the book "${feedItem.title}`}></img>
            <div>Title: {feedItem.title}</div>
            <div>Authors: {feedItem.authors}</div>
            <button onClick={() => incrementFeed()}>Dismiss Book</button>
            <button onClick={() => handleSaveClick()}>Save Book</button>
            {error && (
                <div>
                    {error.message}
                </div>
            )}
        </>
    )
}

export default FeedItem
