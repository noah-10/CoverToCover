import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import Auth from '../../utils/auth';
import '../css/navbar.css';
import { useState, useEffect } from 'react';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AppNavbar = () => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // const [navbarState, setNavbarState] = useState("offcanvas-end");

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    });

    const handleLinkClick = () => {
        // Get the offcanvas element
        const offcanvasElement = document.getElementById('offcanvasNavbar');
        // Create a new Bootstrap Offcanvas instance
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        // Hide the offcanvas
        offcanvas.hide();
    };


    return (
        <>
        {windowWidth > 756 ? (
        <Navbar className='Navbar'>
            <Container fluid className='p-0 navbar-container'>
                <Navbar.Brand as={Link} to='/'>
                    Cover To Cover
                </Navbar.Brand>
                <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
                    <Nav>
                        {Auth.loggedIn() ? (
                            <>
                                <Nav.Link as={Link} to='/feed'>Feed</Nav.Link>
                                <Nav.Link as={Link} to='/library'>Library</Nav.Link>
                                {/* <Nav.Link as={Link} to='/settings'>Settings</Nav.Link> */}
                                <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to='/signup'>Sign Up</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        ): (
            <nav className="navbar w-100">
                <div className="container-fluid">
                    {/* <Navbar.Brand as={Link} to='/'>
                        Cover To Cover
                    </Navbar.Brand> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="toggler-icon"><FontAwesomeIcon icon={faBars} /></span>
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                                <Link 
                                        className="nav-link active" 
                                        aria-current="page" 
                                        to='/'
                                        onClick={() => handleLinkClick()}
                                >   Cover To Cover
                                </Link>
                                </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link active" 
                                        aria-current="page" 
                                        to='/feed'
                                        onClick={() => handleLinkClick()}
                                    >   Feed
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link active" 
                                        aria-current="page" 
                                        to='/library'
                                        onClick={() => handleLinkClick()}
                                    >
                                        Library
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link 
                                        className="nav-link active" 
                                        aria-current="page" 
                                        to='/setting'
                                        onClick={() => handleLinkClick()}
                                    >
                                        Setting
                                    </Link>
                                </li> */}
                                {Auth.loggedIn() ? (
                                    <li className="nav-item">
                                        <Link 
                                            className="nav-link active" 
                                            aria-current="page" 
                                            onClick={Auth.logout}
                                        >
                                            Logout
                                        </Link>
                                </li>
                                ): (
                                    <li className="nav-item">
                                        <Link 
                                            className="nav-link active" 
                                            aria-current="page" 
                                            to='/signup'
                                            onClick={() => handleLinkClick()}
                                        >
                                            Sign Up
                                        </Link>
                                </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        )}
        
        </>
    );
}

export default AppNavbar;
