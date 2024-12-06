import { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaHome, FaUserPlus, FaTasks } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SidebarComponent = () => {
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserRole(user?.role || "");
        }
    }, []); // Empty dependency array ensures this runs only once after initial render

    return (
        <Sidebar
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)"
            }}
        >
            <Menu>
                <MenuItem icon={<FaHome />}>
                    <Link to="/dashboard">Dashboard</Link>
                </MenuItem>
                {userRole === "admin" && (
                    <>
                        <MenuItem icon={<FaUserPlus />}>
                            <Link to="/addemployee">Add Employee</Link>
                        </MenuItem>

                    </>
                )}
                <MenuItem icon={<FaTasks />}>
                    <Link to="/addtask">Add Task</Link>
                </MenuItem>
            </Menu>
        </Sidebar>
    );
};

export default SidebarComponent;
