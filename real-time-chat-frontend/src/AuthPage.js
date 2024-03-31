import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AuthPage = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const endpoint = isRegistering ? 'user_register' : 'login';
            const response = await axios.post(`http://localhost:5001/${endpoint}`, { username, password });
            const data = response.data;

            if (response.status === 200) {
                setToken(data.access_token);
                setMessage('Operation successful');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('An error occurred');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Form.Check
                        type="checkbox"
                        label="Show Password"
                        onChange={togglePasswordVisibility}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {isRegistering ? 'Register' : 'Login'}
                </Button>
            </Form>

            <Button variant="link" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </Button>

            {message && <p>{message}</p>}
        </Container>
    );
};

export default AuthPage;