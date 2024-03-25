import React from 'react';

function MessageForm({ message, setMessage, sendMessage }) {
  return (
    <form onSubmit={sendMessage}>
      <input
        type="text"
        placeholder="Enter message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageForm;
