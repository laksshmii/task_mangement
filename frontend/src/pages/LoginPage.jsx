import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Card, CardBody, CardTitle, CardFooter } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // Email validation
    if (!credentials.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!credentials.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission (API integration)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Make API call to login
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: credentials.email,
          password: credentials.password,
        });

        console.log(response);
        // Check if login is successful (adjust based on API response)
        if (response.data.message === "Login successful") {
          toast.success('Login successful!', {
            position: "top-right",
            autoClose: 6000,
          });
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('userId', JSON.stringify(response.data.user.id));
          localStorage.setItem('role', response.data.user.role);
          window.location.href = '/dashboard'; // Redirect after successful login
        } else {
          toast.error('Login failed. Please check your credentials.', {
            position: "top-right",
            autoClose: 6000,

          })
          alert('sdf')
        }
      } catch (error) {
        console.error('Error during login:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card className="col-md-4 p-4">
        <CardTitle tag="h2" className="text-center mb-4">Login</CardTitle>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                invalid={!!errors.email}  // Show error if exists
              />
              <FormFeedback>{errors.email}</FormFeedback>  {/* Display error message */}
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                invalid={!!errors.password}  // Show error if exists
              />
              <FormFeedback>{errors.password}</FormFeedback>  {/* Display error message */}
            </FormGroup>

            <Button color="primary" type="submit" block disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </CardBody>
        <CardFooter className="text-muted text-center">Don't have an account? <a href="/register">Register</a></CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
