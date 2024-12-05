import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaHome, FaUserPlus, FaTasks } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SidebarComponent = () => {
    return (
        <Sidebar 
            style={{
                height: '100vh',
                backgroundColor: '#2d4059', // Ensures the sidebar spans the full height of the viewport
            }}
        >
            <Menu 
                menuItemStyles={{
                    button: {
                        [`&.active`]: {
                            backgroundColor: '#13395e', // Highlight color for active links
                            color: '#b6c8d9',
                        },
                        color: '#ffffff', // Default text color
                        '&:hover': {
                            backgroundColor: '#2d4059', // Hover effect
                            color: '#b6c8d9',
                        },
                    },
                }}
            >
                <MenuItem 
                    icon={<FaHome />} 
                    component={<Link to="/dashboard" />}
                >
                    Dashboard
                </MenuItem>
                <MenuItem 
                    icon={<FaUserPlus />} 
                    component={<Link to="/addemployee" />}
                >
                    Add Employee
                </MenuItem>
                <MenuItem 
                    icon={<FaTasks />} 
                    component={<Link to="/addtask" />}
                >
                    Add Task
                </MenuItem>
            </Menu>
        </Sidebar>
    );
};

export default SidebarComponent;
