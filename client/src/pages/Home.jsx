import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/home.css';
import Auth from '../../utils/auth.js';
import { faBarsProgress, faHandPointUp, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Home = () => {
    
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
        </div>
    );
}

export default Home;
