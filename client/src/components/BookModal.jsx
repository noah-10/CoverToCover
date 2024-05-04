import '../css/bookModal.css';

const BookModal = ({ closeModal, book, page, bookState }) => {
    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="close-btn">
                    <button onClick={() => closeModal()}> X </button>
                </div>
                <div className="title">
                    <h1>{book.title}</h1>
                </div>
                <div className="author">
                    <h2>{book.authors.join(", ")}</h2>
                </div>
                <div className="body">
                    <p>{book.firstSentence ? book.firstSentence : "No preview available"}</p>
                </div>
                <div className="footer">
                    <button className='modal-btn' onClick={() => closeModal()}>Close</button>
                    {page === 'Currently Reading' ? (
                        <button className='btn-action' onClick={() => bookState(book)}>Finished</button> 
                    ) : page === "Saved Book" ? (
                        <button className='btn-action' onClick={() => bookState(book)}>Started</button>
                    ) : (null)}
                </div>
            </div>
        </div>
    )
}

export default BookModal;