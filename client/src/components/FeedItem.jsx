const FeedItem = ({ feedItem, incrementFeed } ) => {
    return (
        <>
            <div>Title: {feedItem.title}</div>
            <div>Authors: {feedItem.authors}</div>
            <button onClick={() => incrementFeed()}>Dismiss Book</button>
            <button onClick={() => incrementFeed()}>Save Book</button>
        </>
    )
}

export default FeedItem
