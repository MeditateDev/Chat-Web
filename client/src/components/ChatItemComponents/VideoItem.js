import React from 'react';

const VideoItem = ({ src, type, thumbnail, isFirstInGroup, isLastInGroup, isOther }) => {
  return (
    <div
      className={`rounded-sm mobile:w-[75%] w-[65%] overflow-hidden border
        ${isOther ? `rounded-r-lg` : `rounded-l-lg`}
        ${(isFirstInGroup && `rounded-t-lg`) || ``}
        ${(isLastInGroup && `rounded-b-lg ml-0`) || `ml-14`}`}>
      <video className='w-full h-full object-cover' controls>
        <source src={src} type={type} poster={thumbnail} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoItem;
