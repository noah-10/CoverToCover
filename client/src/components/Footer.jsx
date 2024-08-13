import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import '../css/footer.css';

const Footer = () => {

    return (
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-recommendation">
                    <p className="footer-heading">
                        Have any recommendations?
                    </p>
                    <p className="footer-text">
                        Any ideas or recommendations are useful!
                    </p>
                    <div className="input-area">
                        <form>
                            <input
                            type="text"
                            className="footer-input"
                            placeholder="Recommendation"
                            />
                            <button className="footer-btn">Send</button>
                        </form>
                    </div>
                </div>
                <div className="links">
                    <Link to={'/'} className='footer-link'>
                        <p>Home</p>
                    </Link>
                    <Link to={'/feed'} className='footer-link'>
                        <p>Feed</p>
                    </Link>
                    <Link to={'/library'} className='footer-link'>
                        <p>Library</p>
                    </Link>
                    <Link to={'/setting'} className='footer-link'>
                        <p>Setting</p>
                    </Link>
                </div>
            </div>
            <div className="app-name">
                <small>Cover To Cover © 2024</small>
            </div>
            <div className="footer-links">
                <a href="https://github.com/SpencerSurface/judge-a-book">
                    <FontAwesomeIcon icon={faGithub} />
                </a>
            </div>
        </div>
    )
}

export default Footer;