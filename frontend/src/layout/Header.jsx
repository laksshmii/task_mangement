import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar = ({ isAuthenticated, toggleNavbar, isOpen }) => {
  const navigate = useNavigate();

  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand href="/">Task Management </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto" navbar>
          {!isAuthenticated ? (
            <>
              <NavItem>
                <NavLink href="/login">Login</NavLink>
              </NavItem>

            </>
          ) : (
            <>
              <NavItem>
                <NavLink href="/dashboard">Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/logout">Logout</NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default AppNavbar;