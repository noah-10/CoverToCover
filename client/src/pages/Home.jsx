import { useState, useEffect } from 'react';

const Home = () => {
    const [bookCoverUrl, setBookCoverUrl] = useState('');

    useEffect(() => {
        const fetchBookCover = async () => {
            try {
                const olid = 'OL33891821M';
                const imageUrl = `http://covers.openlibrary.org/b/OLID/${olid}-M.jpg`;
                setBookCoverUrl(imageUrl);
            } catch (error) {
                console.error('Error fetching book cover:', error);
            }
        };

        fetchBookCover();
    }, []);

    return (
        <>
            <div className="home-banner"></div>
            <div className="home-container">
                <div className="main-content">
                    <h2>Welcome to Book Tinder</h2>
                    <p>Find your next favorite book!</p>
                    <h3>How to Use Book Tinder</h3>
                    <ul className="no-bullets">
                        <li>Explore books by swiping left or right.</li>
                        <li>Save books to your library for later.</li>
                        <li>Discover new authors and genres.</li>
                    </ul>
                    <p>Get started by swiping through our collection of books!</p>
                    {bookCoverUrl && (
                        <div className="image-container">
                            <img src={bookCoverUrl} alt="Book Cover" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;
