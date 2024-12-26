import React from 'react';

import fileicon from '../../assets/filedownload.png';

const FileItem = ({ file }) => {
  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  return (
    <div
      title='Click to download'
      onClick={() => handleDownload(file)}
      className='w-[180px] flex flex-row gap-4 items-center px-3 py-2 rounded-xl bg-gray-200 cursor-pointer select-none'>
      <div className='h-[32px] w-[32px] flex items-center justify-center bg-gray-200 rounded-full'>
        <img src={fileicon} className='w-[24px] pointer-events-none' alt='' />
      </div>
      <div className='flex flex-col w-[100px]'>
        <span className='text-sm truncate text-gray-700'>{file.name}</span>
        <span className='text-xs text-gray-500'>{file.size}</span>
      </div>
    </div>
  );
};

export default FileItem;
