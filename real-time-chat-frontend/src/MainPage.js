import React from 'react';

const MainPage = ({ username }) => {
    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <div>
                <button>Messages</button>
                <button>Contacts</button>
                <button>Settings</button>
            </div>
        </div>
    );
};

export default MainPage;