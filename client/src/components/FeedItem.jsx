const FeedItem = ({ feedItem } ) => {
    return (
        <>
            <div>Title: {feedItem.title}</div>
            <div>Authors: {feedItem.authors}</div>
        </>
    )
}

export default FeedItem
