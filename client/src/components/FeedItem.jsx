const FeedItem = ({ feedItem, incrementFeed } ) => {
    return (
        <>
            <img style={{width: "25vw"}} src={feedItem.cover} alt={`Cover of the book "${feedItem.title}`}></img>
            <div>Title: {feedItem.title}</div>
            <div>Authors: {feedItem.authors}</div>
            <button onClick={() => incrementFeed()}>Dismiss Book</button>
            <button onClick={() => incrementFeed()}>Save Book</button>
        </>
    )
}

export default FeedItem
