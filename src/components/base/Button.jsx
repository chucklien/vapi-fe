import ScaleLoader from 'react-spinners/ScaleLoader';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';

const Button = ({ label, onClick, isLoading, disabled, isConnected }) => {
  const opacity = disabled ? 0.75 : 1;
  const cursor = disabled ? 'not-allowed' : 'pointer';

  const Contents = isLoading ? (
    <ScaleLoader
      color="#000"
      height={20}
      width={5}
      margin={0.5}
      loading={true}
      size={50}
      css={{ display: 'block', margin: '0 auto' }}
    />
  ) : isConnected ? (
    <BiMicrophone size={60} />
  ) : (
    <BiMicrophoneOff size={60} />
  );

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        color: 'black',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        opacity,
        cursor,
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Contents}
    </button>
  );
};

export default Button;
