import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import Auth from '../../utils/auth';
import '../css/navbar.css';

const AppNavbar = () => {
    return (
        <Navbar className='Navbar'>
            <Container fluid className='p-0 navbar-container'>
                <Navbar.Brand as={Link} to='/'>
                    Judge a Book
                </Navbar.Brand>
                <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
                    <Nav>
                        {Auth.loggedIn() ? (
                            <>
                                <Nav.Link as={Link} to='/feed'>Feed</Nav.Link>
                                <Nav.Link as={Link} to='/library'>Library</Nav.Link>
                                <Nav.Link as={Link} to='/settings'>Settings</Nav.Link>
                                <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to='/signup'>Sign In</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
