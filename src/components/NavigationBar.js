import Logo from './Logo';
import { Navbar, Container, Nav, NavLink } from 'react-bootstrap';

    
const NavigationBar=()=> {


    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">
                    <Logo />
                    World Weather Map
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse className="justify-content-end" id="navbar-nav">
                    <Nav className="ml-auto">
                        <NavLink href="https://github.com/jatin13905/World-Map-Application" target="_blank">World Map Application Repository</NavLink>
                        <NavLink href="https://github.com/jatin13905" target="_blank">Jatin Kumar</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;
