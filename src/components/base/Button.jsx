import ScaleLoader from 'react-spinners/ScaleLoader';
import RiseLoader from 'react-spinners/RiseLoader';
import BounceLoader from 'react-spinners/BounceLoader';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { propEq, cond, always } from 'ramda';

const Button = ({
  label,
  onClick,
  isLoading,
  disabled,
  isConnected = false,
  isInferencing,
  isUserSpeaking,
}) => {
  const opacity = disabled ? 0.75 : 1;
  const cursor = disabled ? 'not-allowed' : 'pointer';

  // const Contents = isLoading ? (
  //   <ScaleLoader
  //     color="#000"
  //     height={20}
  //     width={5}
  //     margin={0.5}
  //     loading={true}
  //     size={50}
  //     css={{ display: 'block', margin: '0 auto' }}
  //   />
  // ) : isConnected ? (
  //   <BiMicrophone size={60} />
  // ) : (
  //   <BiMicrophoneOff size={60} />
  // );

  const Contents = cond([
    [
      propEq(true, 'isLoading'),
      always(
        <ScaleLoader
          color="#000"
          height={20}
          width={5}
          margin={0.5}
          loading={true}
          size={50}
          css={{ display: 'block', margin: '0 auto' }}
        />,
      ),
    ],
    [
      propEq(true, 'isUserSpeaking'),
      always(
        <RiseLoader
          color="#000"
          height={20}
          width={5}
          margin={0.5}
          loading={true}
          size={10}
          css={{ display: 'block', margin: '0 auto' }}
        />,
      ),
    ],
    [
      propEq(true, 'isInferencing'),
      always(
        <BounceLoader
          color="#000"
          height={20}
          width={5}
          margin={0.5}
          loading={true}
          size={50}
          css={{ display: 'block', margin: '0 auto' }}
        />,
      ),
    ],
    [propEq(true, 'isConnected'), always(<BiMicrophone size={60} />)],
    [propEq(false, 'isConnected'), always(<BiMicrophoneOff size={60} />)],
  ])({
    isLoading,
    isConnected,
    isUserSpeaking,
    isInferencing,
  });

  // console.log({
  //   isLoading,
  //   isConnected,
  //   isUserSpeaking,
  //   isInferencing,
  // });
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        color: 'black',
        border: '2px solid #ddd',
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
