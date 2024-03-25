import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatRoom = ({ username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() !== '') {
            socket.emit('message', { message, username });
            setMessage('');
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
                    <Form onSubmit={sendMessage}>
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
