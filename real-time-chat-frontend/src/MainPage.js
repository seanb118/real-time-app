import React from 'react';
import ContactList from './ContactList';
import UserProfile from './UserProfile';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';

const MainPage = ({ username }) => {
    return (
        <div className="main-page">
            <UserProfile username={username} />
            <div className="chat-container">
                <ContactList />
                <div className="message-area">
                    <MessageDisplay />
                    <MessageInput />
                </div>
            </div>
        </div>
    );
};

export default MainPage;