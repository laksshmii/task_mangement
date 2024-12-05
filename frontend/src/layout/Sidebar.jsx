
import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

const Sidebar = ({ isAuthenticated }) => {
    console.log(isAuthenticated);
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', height: '100vh' }}>
      <Nav vertical>
        <NavItem>
          <NavLink href="/home">Home</NavLink>
        </NavItem>
        {isAuthenticated && (
          <>
            <NavItem>
              <NavLink href="/tasks">Tasks</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/profile">Profile</NavLink>
            </NavItem>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
