import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AuthPage = ({ setToken }) => {
    const history = useHistory();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = async () => {
        try {
            const endpoint = isRegistering ? 'user_register' : 'login';
            const response = await axios.post(`http://localhost:5001/${endpoint}`, { username, password });
            if (response.status === 200) {
                const data = response.data;
                setToken(data.access_token);
                setMessage('Operation successful');
                setLoggedIn(true); // If login/register is successful, set loggedIn to true
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage('Operation unsuccessful');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (loggedIn) {
        // Redirect to the user's main page upon successful login/registration
        return <Redirect to={`/${username}/mainpage`} />;
    }

    return (
        <Container>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
