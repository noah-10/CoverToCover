import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../../utils/mutations";

const FeedItem = ({ feedItem, incrementFeed } ) => {
    const [saveBook] = useMutation(SAVE_BOOK);

    const handleSaveClick = async () => {
        try {
            await saveBook({ variables: { input: {
                ...feedItem,
                firstSentence: feedItem.firstSentence ? feedItem.firstSentence[0] : ""
            } } });
        } catch (error) {
            console.error(error);
        }
        incrementFeed();
    }

    return (
        <>
            <img style={{width: "25vw"}} src={feedItem.cover} alt={`Cover of the book "${feedItem.title}`}></img>
            <div>Title: {feedItem.title}</div>
            <div>Authors: {feedItem.authors}</div>
            <button onClick={() => incrementFeed()}>Dismiss Book</button>
            <button onClick={() => handleSaveClick()}>Save Book</button>
        </>
    )
}

export default FeedItem
