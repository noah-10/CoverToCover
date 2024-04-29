
const Book = (props) => {
    return (
        <div className="saved-book" onClick={props.onClick}>
            <div className="saved-cover">
                <img src={props.cover} alt={`image of book cover for ${props.title}`} />
            </div>
        </div>
    )
}

export default Book;