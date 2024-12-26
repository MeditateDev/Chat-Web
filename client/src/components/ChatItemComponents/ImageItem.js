import { React, useState } from 'react';

import errorimage from '../../assets/errorimage.png';

const ImageItem = ({ src, isOther, isFirstInGroup, isLastInGroup }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`
        max-w-[85%] ${isOther ? `` : `self-end flex flex-row-reverse mr-6`}
      `}>
      <img
        src={src}
        alt=''
        onClick={() => handleImageClick()}
        className={`
          max-w-[85%] border cursor-pointer
          rounded-sm
          ${isOther ? `rounded-r-lg` : `rounded-l-lg`}
          ${(isFirstInGroup && `rounded-t-lg`) || ``}
          ${(isLastInGroup && `rounded-b-lg ml-0`) || `ml-14`}
        `}
        onError={(event) => {
          event.target.src = errorimage;
          event.onerror = null;
        }}
      />
      {isOpen && (
        <div
          className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50'
          onClick={() => handleClose()}>
          <div className='relative max-w-4xl max-h-4xl'>
            <img
              src={src}
              alt='Full Size'
              className='w-full h-auto rounded-lg shadow-lg'
              onError={(event) => {
                event.target.src = errorimage;
                event.onerror = null;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageItem;
