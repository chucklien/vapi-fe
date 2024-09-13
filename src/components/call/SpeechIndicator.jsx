import React from 'react';

const SpeechIndicator = ({ style, role = 'Helper', isSpeaking }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', ...style }}>
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: isSpeaking ? '#3ef07c' : '#f03e3e',
          marginRight: '10px',
          borderRadius: '4px',
        }}
      />
      <p style={{ color: 'white', margin: 0 }}>
        {isSpeaking ? `${role} speaking` : `${role} not speaking`}
      </p>
    </div>
  );
};

export default SpeechIndicator;
