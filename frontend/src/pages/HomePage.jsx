import React, { useState } from 'react';
import Background from '../components/BackgroundWrapper';
import { Container, Button, Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse, NavbarText } from 'reactstrap';
import TypingAnimation from '../components/TypingAnimation';

function HomePage() {
    const handleGetStartedClick = () => {
        window.location.href = '/login';
    }

    return (
        <div className="App">
            <Background imageUrl="https://i.pinimg.com/736x/c5/a8/b2/c5a8b29b51c10dcc80df7ce018354241.jpg">
                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        padding: '30px',
                        borderRadius: '10px',
                    }}
                >
                    <Container className="text-center">
                        <TypingAnimation
                            head="Task Management"
                            sub="Stay organized and productive."
                            textArray={[
                                'Welcome to Task Management!',
                                'Manage your tasks efficiently.',
                                'Get Started Today!',
                            ]}
                        />
                        <Button color="primary" className="mt-4" onClick={handleGetStartedClick}>
                            Login
                        </Button>
                    </Container>
                </div>
            </Background>


        </div>
    );
}

export default HomePage;
