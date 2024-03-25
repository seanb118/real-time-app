import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AuthPage = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            const token = response.data.access_token;
            setToken(token);
            setMessage('Login successful');
        } catch (error) {
            setMessage('Invalid credentials');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/user_register', { username, password });
            setMessage('Registration successful');
        } catch (error) {
            setMessage('Username already exists!');
        }
    };

    return (
        <Container>
            <h2>Real-Time Chat</h2>
            <Form onSubmit={handleLogin}>
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
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
                <Button variant="secondary" onClick={handleRegister}>
                    Register
                </Button>
            </Form>
            {message && <p>{message}</p>}
        </Container>
    );
};

export default AuthPage;
