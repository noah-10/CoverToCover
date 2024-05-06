import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import '../css/footer.css';

const Footer = () => {

    return (
        <div className="footer-container">
            <div className="subscription">
                <p className="subscription-heading">
                    Join our newsletter to hear about updates!
                </p>
                <p className="subscription-text">You can unsubscribe anytime!</p>
                <div className="input-area">
                    <form>
                        <input
                        type="email"
                        className="footer-input"
                        placeholder="Your Email"
                        />
                        <button className="footer-btn">Subscribe</button>
                    </form>
                </div>      
            </div>
            <div className="app-name">
                <small>Judge a Book © 2024</small>
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