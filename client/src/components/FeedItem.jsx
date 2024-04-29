const FeedItem = ({ feedItem } ) => {
    return (
        <>
            <div>Title: {feedItem.title}</div>
            <div>Authors: {feedItem.authors}</div>
            <button>Dismiss Book</button>
            <button>Save Book</button>
        </>
    )
}

export default FeedItem
