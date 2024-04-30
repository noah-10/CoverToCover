import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import Auth from '../../utils/auth';

const AppNavbar = () => {
    return (
        <Navbar>
            <Container fluid>
                <Navbar.Brand as={Link} to='/'>
                    "Book Tinder"
                </Navbar.Brand>
                <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
                    <Nav>
                        <Nav.Link as={Link} to='/feed'>Feed</Nav.Link>
                        <Nav.Link as={Link} to='/library'>Library</Nav.Link>
                        <Nav.Link as={Link} to='/settings'>Settings</Nav.Link>
                        {Auth.loggedIn() ? (
                            <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to='/signup'>Sign Up</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
