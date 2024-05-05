import CurrentBooks from '../components/CurrentBooks';
import SavedBooks from '../components/SavedBooks';
import FinishedBooks from '../components/FinishedBooks';
import { useState } from 'react';
import '../css/library.css'

const Library = () => {
    const [displayedContainer, setDisplayedContainer] = useState("Saved Books");
    const [menuItems, setMenuItems] = useState(["Currently Reading", "Finished Books"])

    const handleMenuClick = (e) => {
        const clickedItem = e.target.textContent;
        setMenuItems(prevItems => {
            // add previous displayed container to the menu
            const updatedItems = [...prevItems, displayedContainer]

            //Remove selected displayed from the menu
            return updatedItems.filter(item => item !== clickedItem);
        })

        // Set displayed container
        setDisplayedContainer(e.target.textContent);
    }

    return (
        <>
            <h1>Library</h1>
            <div className="library-container">
                <div className="library-selection">
                    <p>View your library</p>
                    <ul className="library-list">
                        {menuItems.map((items, index) => (
                            <li key={index} onClick={handleMenuClick} value={items}>{items}</li>
                        ))}
                    </ul>
                </div>
                {displayedContainer === 'Saved Books' ? (
                    <div className='books-container'>
                        <SavedBooks />
                    </div>
                ): displayedContainer === "Currently Reading" ? (
                    <div className='books-container'>
                        <CurrentBooks />
                    </div>
                ) : (
                    <div className='books-container'>
                        <FinishedBooks />
                    </div>
                )}
                
                
                
            </div>
        </>
    );
}

export default Library;
