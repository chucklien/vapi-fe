import { useRef, useEffect, useState } from 'react';
import { tail } from 'ramda';

import ActiveCallDetail from './components/ActiveCallDetail';
import Button from './components/base/Button';
import Vapi from '@vapi-ai/web';
import { isPublicKeyMissingError } from './utils';
import Chat from './components/Chat';
import { BiMicrophoneOff, BiMicrophone } from 'react-icons/bi';

let originalStream;
let audioCtx;
const App = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [userVolumeLevel, setUserVolumeLevel] = useState(0);
  const [conversations, setConversations] = useState([]);
  const callObject = useRef(null);
  const [isInferencing, setIsInference] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [vapiInstance, setVapiInstance] = useState(null);

  // const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } = usePublicKeyInvalid();

  // hook into Vapi events
  useEffect(() => {
    if (vapiInstance) {
      vapiInstance.on('call-start', () => {
        setConnecting(false);
        setConnected(true);

        // setShowPublicKeyInvalidMessage(false);
      });

      vapiInstance.on('call-end', () => {
        setConnecting(false);
        setConnected(false);
        setUserVolumeLevel(0);

        // setShowPublicKeyInvalidMessage(false);
      });

      vapiInstance.on('speech-start', () => {
        console.log('speech start');
        setAssistantIsSpeaking(true);
        setIsInference(false);
      });

      vapiInstance.on('speech-end', () => {
        console.log('speech end');
        setAssistantIsSpeaking(false);
      });

      vapiInstance.on('volume-level', level => {
        setVolumeLevel(level);
      });

      vapiInstance.on('message', message => {
        // console.log('message', message);
        if (message.type === 'conversation-update') {
          setConversations(message?.conversation);
        }
        if (
          message.type === 'speech-update' &&
          message.role === 'user' &&
          message.status === 'started'
        ) {
          setIsUserSpeaking(true);
        }
        if (
          message.type === 'speech-update' &&
          message.role === 'user' &&
          message.status === 'stopped'
        ) {
          setIsUserSpeaking(false);
          setIsInference(true);
        }
      });

      vapiInstance.on('error', error => {
        console.error(error);

        setConnecting(false);
        // if (isPublicKeyMissingError({ vapiError: error })) {
        //   setShowPublicKeyInvalidMessage(true);
        // }
      });
    }
    // we only want this to fire on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vapiInstance]);

  // call start handler
  const startCallInline = async () => {
    setConnecting(true);

    // Get the processed audio stream with increased gain
    const processedAudioStream = await getProcessedAudioStream();
    const audioTrack = processedAudioStream.getAudioTracks()[0];

    // Create a new instance of Vapi with the processed audio stream
    const vapiWithProcessedAudio = new Vapi(
      'e0987027-c3a6-4236-81d8-146bf26b02f0',
      undefined,
      undefined,
      { audioSource: audioTrack },
    );

    callObject.current = await vapiWithProcessedAudio.start('0c197331-6c70-48b3-9e41-6c32f4a9be51');

    const dailyCallInstance = vapiWithProcessedAudio.getDailyCallObject();

    if (dailyCallInstance) {
      dailyCallInstance.startLocalAudioLevelObserver(100);

      dailyCallInstance.on('local-audio-level', e => {
        if (e) {
          setUserVolumeLevel(e.audioLevel);
        }
      });
    } else {
      console.error('Failed to access Daily.js call instance');
    }

    // Set the Vapi instance for event handling
    setVapiInstance(vapiWithProcessedAudio);
  };
  const endCall = () => {
    vapiInstance.stop();
    setVapiInstance(null);
    if (originalStream) {
      originalStream.getTracks().forEach(track => track.stop());
    }

    // Close the AudioContext
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {!connected && conversations.length > 0 && (
        <Chat
          style={{
            marginBottom: '15px',
            width: '100%',
            maxWidth: '768px',
            boxSizing: 'border-box',
          }}
          conversations={tail(conversations)}
        />
      )}
      {!connected && conversations.length === 0 && (
        <p style={{ marginTop: '50px', color: '#333333' }}>按下開始對談</p>
      )}
      <div style={{ marginTop: 'auto', marginBottom: '85px' }}>
        {!connected ? (
          <Button label="Call" onClick={startCallInline} isLoading={connecting} />
        ) : (
          <ActiveCallDetail
            assistantIsSpeaking={assistantIsSpeaking}
            volumeLevel={volumeLevel}
            userVolumeLevel={userVolumeLevel}
            onEndCallClick={endCall}
            isUserSpeaking={isUserSpeaking}
            isInferencing={isInferencing}
          />
        )}
      </div>
    </div>
  );
};

async function getProcessedAudioStream() {
  originalStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false,
    },
  });

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(originalStream);
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 3.0; // Increase gain

  const destination = audioCtx.createMediaStreamDestination();
  source.connect(gainNode);
  gainNode.connect(destination);

  return destination.stream;
}

const assistantOptions = {
  name: 'Vapi’s Pizza Front Desk',
  firstMessage: 'Vappy’s Pizzeria speaking, how can I help you?',
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'en-US',
  },
  voice: {
    provider: 'playht',
    voiceId: 'jennifer',
  },
  model: {
    provider: 'openai',
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a voice assistant for Vappy’s Pizzeria, a pizza shop located on the Internet.

Your job is to take the order of customers calling in. The menu has only 3 types
of items: pizza, sides, and drinks. There are no other types of items on the menu.

1) There are 3 kinds of pizza: cheese pizza, pepperoni pizza, and vegetarian pizza
(often called "veggie" pizza).
2) There are 3 kinds of sides: french fries, garlic bread, and chicken wings.
3) There are 2 kinds of drinks: soda, and water. (if a customer asks for a
brand name like "coca cola", just let them know that we only offer "soda")

Customers can only order 1 of each item. If a customer tries to order more
than 1 item within each category, politely inform them that only 1 item per
category may be ordered.

Customers must order 1 item from at least 1 category to have a complete order.
They can order just a pizza, or just a side, or just a drink.

Be sure to introduce the menu items, don't assume that the caller knows what
is on the menu (most appropriate at the start of the conversation).

If the customer goes off-topic or off-track and talks about anything but the
process of ordering, politely steer the conversation back to collecting their order.

Once you have all the information you need pertaining to their order, you can
end the conversation. You can say something like "Awesome, we'll have that ready
for you in 10-20 minutes." to naturally let the customer know the order has been
fully communicated.

It is important that you collect the order in an efficient manner (succinct replies
& direct questions). You only have 1 task here, and it is to collect the customers
order, then end the conversation.

- Be sure to be kind of funny and witty!
- Keep all your responses short and simple. Use casual language, phrases like "Umm...", "Well...", and "I mean" are preferred.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
};

const usePublicKeyInvalid = () => {
  const [showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage] = useState(false);

  // close public key invalid message after delay
  useEffect(() => {
    if (showPublicKeyInvalidMessage) {
      setTimeout(() => {
        setShowPublicKeyInvalidMessage(false);
      }, 3000);
    }
  }, [showPublicKeyInvalidMessage]);

  return {
    showPublicKeyInvalidMessage,
    setShowPublicKeyInvalidMessage,
  };
};

const PleaseSetYourPublicKeyMessage = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '25px',
        left: '25px',
        padding: '10px',
        color: '#fff',
        backgroundColor: '#f03e3e',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      Is your Vapi Public Key missing? (recheck your code)
    </div>
  );
};

export default App;
