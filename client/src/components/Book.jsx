
const Book = (props) => {
    return (
        <div className="saved-book">
            <div className="saved-cover">
                <img src={props.cover} alt={`image of book cover for ${props.title}`} />
            </div>
            <div className="saved-title">
                <p>{props.title}</p>
            </div>
            <div className="saved-author">
                <p>{props.author}</p>
            </div>
        </div>
    )
}

export default Book;