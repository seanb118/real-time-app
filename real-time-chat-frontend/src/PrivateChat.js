import React from 'react';

const PrivateChats = ({ username, contactId }) => {
    return (
        <div>
            <h2>Private Chats</h2>
            <p>View historic messages and chat with contact {contactId}</p>
        </div>
    );
};

export default PrivateChats;