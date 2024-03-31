import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const ChatRoom = ({ username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async (message) => {
        const token = localStorage.getItem('token');
        const endpoint = `http://localhost:5001/${username}/messages`;

        try {
            const response = await axios.post(endpoint, { message }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <ListGroup>
                        {messages.map((msg, index) => (
                            <ListGroup.Item key={index}>
                                <strong>{msg.username}</strong>: {msg.message}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage(message);
                        setMessage('');
                    }}>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Send
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ChatRoom;