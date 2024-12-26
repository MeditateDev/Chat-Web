import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

const Loading = ({ className, color }) => {
  return (
    <div className={`flex justify-center items-center w-full h-full ${className} `}>
      <BeatLoader color={color} />
    </div>
  );
};

export default Loading;
