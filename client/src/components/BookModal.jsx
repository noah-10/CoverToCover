import { useState, useEffect } from 'react';
import '../css/bookModal.css';

const BookModal = ({ closeModal, book, page, bookState }) => {
    const [titleOverflow, setTitleOverflow] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [clickableTitle, setClickableTitle] = useState(null);

    // Effect for resize of screen
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if(window.innerWidth < 426 && book.title.length > 40){
                setTitleOverflow("title-overflow");
            }else{
                setTitleOverflow("");
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [window.innerWidth]);

    // Effect to set the class if it follows the following statement
    useEffect(() => {
        if(window.innerWidth < 426 && book.title.length > 40){
            setTitleOverflow("title-overflow");
        }
    }, []);

    // Allows to see full title if it previously had overflow
    const handleClickTitle = () => {
        if(window.innerWidth < 426 && book.title.length > 40){

            if(titleOverflow === "title-overflow"){
                setTitleOverflow("");
                const titleh1 = document.querySelector(".title h1");
                titleh1.style.cursor = "pointer";
            }else{
                setTitleOverflow("title-overflow");
            }
        }
    }

    return (
        <div className="modal-background">
            <div className="modal-container">
                <div className="close-btn">
                    <button onClick={() => closeModal()}> X </button>
                </div>
                <div className= 'title' onClick={() => handleClickTitle()}>
                    <h1 
                        className={`${titleOverflow}`} >{book.title}</h1>
                </div>
                <div className="author">
                    <h2>{book.authors}</h2>
                </div>
                <div className="body">
                    <p>{book.description ? book.description : "No preview available"}</p>
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