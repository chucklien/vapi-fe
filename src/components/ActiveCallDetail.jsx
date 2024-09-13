import SpeechIndicator from './call/SpeechIndicator';
import Button from './base/Button';
import VolumeLevel from './call/VolumeLevel';
// import useMicrophoneVolume from '../hooks/useMicVolumeLevel';

const ActiveCallDetail = ({
  assistantIsSpeaking,
  volumeLevel,
  userVolumeLevel,
  onEndCallClick,
  isUserSpeaking,
  isInferencing,
}) => {
  // const level = useMicrophoneVolume();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          height: 'auto',
          backgroundColor: 'black',
          alignSelf: 'center',
        }}
      >
        <SpeechIndicator isSpeaking={assistantIsSpeaking} />
        <VolumeLevel volume={volumeLevel} />
        <SpeechIndicator style={{ marginTop: '15px' }} role="You" isSpeaking={isUserSpeaking} />
        <VolumeLevel volume={userVolumeLevel} />
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center', alignSelf: 'center' }}>
        <Button
          label="End Call"
          onClick={onEndCallClick}
          isConnected
          isInferencing={isInferencing}
          isUserSpeaking={isUserSpeaking}
        />
      </div>
    </div>
  );
};

export default ActiveCallDetail;
