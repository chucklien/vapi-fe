import React from 'react';
import { MessageLeft, MessageRight } from './Message';

const Chat = ({ style, conversations }) => {
  console.log('conversation', conversations);
  return (
    <div
      style={{
        maxWidth: '768px',
        overflow: 'scroll',
        padding: '20px',
        ...style,
      }}
    >
      {conversations.map(message =>
        message.role === 'assistant' ? (
          <MessageLeft
            message={message.content}
            photoURL=""
            displayName="HeartSpace🍋"
            avatarDisp={true}
          />
        ) : (
          <MessageRight message={message.content} photoURL="" displayName="Me" avatarDisp={false} />
        ),
      )}
    </div>
  );
};

export default Chat;
