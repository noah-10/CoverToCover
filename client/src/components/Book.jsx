
const Book = (props) => {
    return (
        <>
            <div className="book-cover w-100 h-100" onClick={props.onClick} style={{ backgroundImage: `url(${props.cover})`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
                {/* <img src={props.cover} alt={`image of book cover for ${props.title}`} /> */}
            </div>
        </>
    )
}

export default Book;