import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Added Navigate import
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Collapse,
  Button,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/AddEmployeePage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isOpen, setIsOpen] = useState(false); // Navbar toggle
  const [sidebarToggled, setSidebarToggled] = useState(true); // Sidebar collapse/expand state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication check

  const toggleNavbar = () => setIsOpen(!isOpen); // Toggle Navbar
  const toggleSidebar = () => setSidebarToggled(!sidebarToggled); // Toggle Sidebar

  useEffect(() => {
    // Add your login check here
    // Example: if user is authenticated (you can use cookies/localStorage here)
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        {/* Only show Sidebar after login */}
        {isAuthenticated && (
          <Sidebar
            collapsed={!sidebarToggled}
            toggled={sidebarToggled}
            handleToggleSidebar={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Navbar is always visible */}
          {isAuthenticated ? (
            <Navbar color="light" light expand="md" className="">
              <NavbarBrand href="/">Task Management App</NavbarBrand>
              <NavbarToggler onClick={toggleNavbar} />
              <Collapse isOpen={isOpen} navbar>
                <Nav className="ms-auto" navbar>
                  {" "}
                  {/* Change ml-auto to ms-auto for Bootstrap 5 */}
                  {/* Conditionally render Login and Register links if the user is not authenticated */}
                  {!isAuthenticated ? (
                    <>
                      <NavItem className="nav-item">
                        <NavLink href="/login">Login</NavLink>
                      </NavItem>
                      <NavItem className="nav-item">
                        <NavLink href="/register">Register</NavLink>
                      </NavItem>
                    </>
                  ) : (
                    <>
                      <NavItem className="nav-item">
                        <NavLink href="/profile">Profile</NavLink>
                      </NavItem>
                      <NavItem className="nav-item">
                        <NavLink>
                          {" "}
                          <Button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              localStorage.removeItem("isAuthenticated");
                              setIsAuthenticated(false);
                              window.location.href = "/";
                            }}
                          >
                            Logout
                          </Button>{" "}
                        </NavLink>
                      </NavItem>
                    </>
                  )}
                </Nav>
              </Collapse>
            </Navbar>
          ) : null}
          {/* Routing Content */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Routes>
              {/* Show HomePage only if user is authenticated */}
              {isAuthenticated ? (
                <Route path="/" element={<HomePage />} />
              ) : (
                <Route path="/" element={<HomePage />} />
              )}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/login"
                element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
              />
              <Route path="/addemployee" element={<RegisterPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
