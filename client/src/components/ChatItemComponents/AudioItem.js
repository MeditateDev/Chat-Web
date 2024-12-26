import React, { useState, useRef, useEffect } from 'react';

import play from '../../assets/play.png';
import pause from '../../assets/pause.png';

import tw from 'tailwind-styled-components';
const PlayButton = tw.button`absolute flex items-center justify-center z-50 top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 h-[26px] w-[26px] bg-white rounded-full`;
const CurrentTime = tw.div`absolute select-none text-sm flex items-center justify-center top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 text-gray-500 px-2 py-1 rounded-full`;

const AudioItem = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handlePlay = () => {
    const audioElement = audioRef.current;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef?.current?.currentTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = progressBar?.offsetWidth;
    const seekTime = (clickPosition / progressBarWidth) * audioRef?.current?.duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  useEffect(() => { }, [audioRef]);

  return (
    <div className='w-full h-fit relative'>
      <audio ref={audioRef} src={src} className='w-full' onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnded} />
      <PlayButton onClick={handlePlay} className={`${isPlaying ? `` : `pl-[2px]`}`}>
        <img src={isPlaying ? pause : play} alt='play' className='h-[12px] w-[12px] pointer-events-none' />
      </PlayButton>
      <div
        onClick={handleProgressBarClick}
        className='mobile:w-[60%] relative tablet:w-[40%] w-[20%] bg-gray-200 h-10 overflow-hidden rounded-lg'>
        <CurrentTime>{formatTime(duration - currentTime)}</CurrentTime>
        <div
          className='h-full bg-[#b9b9b956] transition-all'
          style={{ width: `${(currentTime / audioRef?.current?.duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default AudioItem;
