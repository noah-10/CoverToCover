import '../css/bookModal.css';

const BookModal = ({ closeModal, book }) => {
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
                    <h1>{book.authors.join(", ")}</h1>
                </div>
                <div className="body">
                    <p>{book.firstSentence ? book.firstSentence : "No preview available"}</p>
                </div>
                <div className="footer">
                    <button onClick={() => closeModal()}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default BookModal;