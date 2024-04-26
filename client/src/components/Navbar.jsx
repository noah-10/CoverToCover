import { Link } from 'react-router-dom'
import { Navbar, Nav, Container, Tab } from 'react-bootstrap'

const AppNavbar = () => {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand as={Link} to='/'>
                    "Book Tinder"
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
