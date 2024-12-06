import { useState, React, useEffect } from 'react';
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
    }, []);
    return (
        <Sidebar
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)"
            }}

        >
            <Menu

            >
                <MenuItem
                    icon={<FaHome />}
                    component={<Link to="/dashboard" />}
                >
                    Dashboard
                </MenuItem>
                {userRole === "admin" && (
                    <>
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
                    </>
                )}
                <MenuItem
                    icon={<FaTasks />}
                    component={<Link to="/addtask" />}
                >
                    View Task
                </MenuItem>
            </Menu>
        </Sidebar>
    );
};

export default SidebarComponent;
