import { useState, useEffect } from 'react';

const useVolumeListener = audioStream => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!audioStream) return; // Don't do anything if there's no audio stream

    let audioContext;
    let analyser;
    let dataArray;
    let animationId;

    const getVolumeLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      let values = 0;
      const length = dataArray.length;

      for (let i = 0; i < length; i++) {
        values += dataArray[i];
      }

      const average = values / length;
      setVolume(average);

      // Continuously update the volume level
      animationId = requestAnimationFrame(getVolumeLevel);
    };

    const setupAnalyser = () => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      const source = audioContext.createMediaStreamSource(audioStream);
      source.connect(analyser);
      getVolumeLevel();
    };

    setupAnalyser();

    // Cleanup on unmount
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioContext) audioContext.close();
    };
  }, [audioStream]);

  return volume; // Return volume level
};

export default useVolumeListener;
