import React, { useState } from 'react';
import AuthPage from './AuthPage';
import ChatRoom from './ChatRoom';

const App = () => {
    const [token, setToken] = useState('');

    if (!token) {
        return <AuthPage setToken={setToken} />;
    }

    return <ChatRoom token={token} />;
};

export default App;
