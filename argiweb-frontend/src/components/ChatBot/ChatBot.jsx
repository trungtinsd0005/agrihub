import React, { useState } from 'react';
import './ChatBot.scss';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <img src="https://cdn-icons-png.freepik.com/512/13086/13086996.png" alt="Chatbot Icon" />
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <iframe
            allow="microphone;"
            width="350"
            height="430"
            src="https://console.dialogflow.com/api-client/demo/embedded/f0442203-59a0-4d79-af7c-bd4ff3d9f391">
          </iframe>
          <button className="close-btn" onClick={toggleChatbot}>X</button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;