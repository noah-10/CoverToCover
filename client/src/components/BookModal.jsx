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
                    <h1>{book.authors}</h1>
                </div>
                <div className="body">
                    <p>description...</p>
                </div>
                <div className="footer">
                    <button onClick={() => closeModal()}>Close</button>
                    {page === 'Currently Reading' ? (
                        <button onClick={() => bookState(book)}>Finished Book</button> 
                    ) : page === "Saved Book" ? (
                        <button onClick={() => bookState(book)}>Started Reading</button>
                    ) : (null)}
                </div>
            </div>
        </div>
    )
}

export default BookModal;