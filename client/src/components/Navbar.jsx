import { Link } from 'react-router-dom'
import { Navbar, Nav, Container, Tab } from 'react-bootstrap'

const AppNavbar = () => {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand as={Link} to='/'>
                    "Book Tinder"
                </Navbar.Brand>
                <Navbar.Collapse id="navbar">
                    <Nav>
                        <Nav.Link as={Link} to='/feed'>Feed</Nav.Link>
                        <Nav.Link as={Link} to='/library'>Library</Nav.Link>
                        <Nav.Link as={Link} to='/settings'>Settings</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
