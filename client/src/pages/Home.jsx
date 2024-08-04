import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/home.css';
import Auth from '../../utils/auth.js';
import { faBarsProgress, faHandPointUp, faUser, faBan, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SwipeFeed from '../components/SwipeFeed.jsx';

const Home = () => {

    let [demoIndex, setDemoIndex] = useState(0);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [swipeMode, setSwipeMode] = useState(false);
    const [resetState, setResetState] = useState(false);
    let [nextSwipe, setNextSwipe] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [window.innerWidth]);

    const changeIndex = () => {
        if(demoIndex === 2){
            setDemoIndex(0);
        }else{
            setDemoIndex(++demoIndex);
        }

        if(nextSwipe === 2){
            setNextSwipe(0)
        }else{
            setNextSwipe(++nextSwipe)
        }
    }

    const books = [
        {
            title: "Books You'll Love",
            cover: "http://books.google.com/books/content?id=BIxPEAAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api",
            description: "Welcome to Judge A Book, where book discovery meets fun. Our user-friendly feed helps you find new and exciting books in a matter of minutes. Give our demo feed a try and experience the joy of effortless book discovery today!",
            authors: "Enjoy a seamless book discovery experience",
        },
        {
            title: "Of Mice and Men",
            cover: "http://books.google.com/books/content?id=BIxPEAAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api",
            description: "A controversial tale of friendship and tragedy during the Great Depression, in a deluxe centennial edition Over seventy-five years since its first publication, Steinbeck’s tale of commitment, loneliness, hope, and loss remains one of America’s most widely read and taught novels. An unlikely pair, George and Lennie, two migrant workers in California during the Great Depression, grasp for their American Dream. They hustle work when they can, living a hand-to-mouth existence. For George and Lennie have a plan: to own an acre of land and a shack they can call their own. When they land jobs on a ranch in the Salinas Valley, the fulfillment of their dream seems to be within their grasp. But even George cannot guard Lennie from the provocations, nor predict the consequences of Lennie's unswerving obedience to the things George taught him. Of Mice and Men represents an experiment in form, which Steinbeck described as “a kind of playable novel, written in a novel form but so scened and set that it can be played as it stands.” A rarity in American letters, it achieved remarkable success as a novel, a Broadway play, and three acclaimed films. This Centennial edition, specially designed to commemorate one hundred years of Steinbeck, features french flaps and deckle-edged pages. For more than sixty-five years, Penguin has been the leading publisher of classic literature in the English-speaking world. With more than 1,500 titles, Penguin Classics represents a global bookshelf of the best works throughout history and across genres and disciplines. Readers trust the series to provide authoritative texts enhanced by introductions and notes by distinguished scholars and contemporary authors, as well as up-to-date translations by award-winning translators.",
            authors: "John Steinbeck",
        },
        {
            title: "The Giver",
            cover: "http://books.google.com/books/content?id=Coi9AwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api",
            description: 'Living in a "perfect" world without social ills, a boy approaches the time when he will receive a life assignment from the Elders, but his selection leads him to a mysterious man known as the Giver, who reveals the dark secrets behind the utopian facade.',
            authors: "Lous Lowry",
        }
    ]
    
    return (
        <div className='home-container'>
            <div className="home-overlay">
                <div className="overlay-text">
                    <h2>Judge a Book</h2>
                    <p>Exploring New Worlds, One Page at a Time: Your Ultimate Book Discovery Companion with Judge a Book</p>
                </div>
                <div className="get-started">
                    {Auth.loggedIn() ? (
                        <Link to='/feed'><button>START SWIPING</button></Link>
                    ) : (
                        <Link to='/signup'><button>GET STARTED</button></Link>
                    )}
                </div>
            </div>
            <div className="info-container">
                <div className="info-content">
                    <h3>Unlock the World of Books at Your Fingertips</h3>
                    <FontAwesomeIcon className='home-icon' icon={faHandPointUp} />
                    <p>Effortlessly Expand Your Reading List with Just One Click</p>
                </div>
                <div className="info-content">
                    <h3>Curated to Each User's Taste</h3>
                    <FontAwesomeIcon className='home-icon' icon={faUser} />
                    <p>Curated Selections Designed to Reflect Each User's Personal Reading Preferences</p>
                </div>
                <div className="info-content">
                    <h3>Stay on Top of Your Reading Path</h3>
                    <FontAwesomeIcon className='home-icon' icon={faBarsProgress} />
                    <p>Effortlessly Keep Tabs on Your Reading Progress</p>
                </div>
            </div>
            {swipeMode === false || screenWidth > 600 ? (
                <div className="demo-container">
                {screenWidth < 600 ? (
                    <div className="demo-switch-mode">
                        <div className="demo-switch-text">
                            <p>Switch to swiping mode</p>
                        </div>
                        <div className="demo-switch-btn">
                            <button onClick={() => setSwipeMode(true)}>X</button>
                        </div>
                    </div>
                ): (
                    null
                )}
                <div className="demo-content">
                    <div className="demo-info"> 
                        <div className="demo-title">
                            <h3>{books[demoIndex].title}</h3>
                        </div>
                        <div className="demo-authors">
                            <p>{books[demoIndex].authors}</p>
                        </div>
                    </div>
                    <div className="demo-book-info">
                        <div className="demo-image-container">
                            <img 
                                className="demo-img" 
                                src={books[demoIndex].cover}  
                                alt={`Cover of the book "${books[demoIndex].title}"`}
                                style={{ imageRendering: 'high-quality', width: '100%', height: 'auto' }}>
                            </img>
                        </div>

                        <div className="demo-description">
                            <p>{books[demoIndex].description}</p>
                        </div>
                    </div>
                    <div className="demo-btns">
                        <button id="demo-dismiss-button" onClick={() => changeIndex()}><FontAwesomeIcon className="feed-icon" icon={faBan}></FontAwesomeIcon></button>   
                        <button id="demo-save-button" onClick={() => changeIndex()}><FontAwesomeIcon className="feed-icon" icon={faBookmark}></FontAwesomeIcon></button>
                    </div>
                </div>
            </div>
            ) : (
                <div className="demo-swipe-container">
                    <div className="demo-switch-mode">
                        <div className="demo-switch-text">
                            <p>Switch to swiping mode</p>
                        </div>
                        <div className="demo-switch-btn">
                            <button onClick={() => setSwipeMode(false)}>X</button>
                        </div>
                    </div>
                    <SwipeFeed 
                        feedItem={[books[demoIndex], books[nextSwipe]]}
                        reset={{resetState, setResetState}}
                        demoFeed={changeIndex}
                    />
                </div>
            )}
            
        </div>
    );
}

export default Home;
