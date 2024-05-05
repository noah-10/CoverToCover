
const Book = (props) => {
    return (
        <>
            <div className="book-cover" onClick={props.onClick}>
                <img src={props.cover} alt={`image of book cover for ${props.title}`} />
            </div>
        </>
    )
}

export default Book;