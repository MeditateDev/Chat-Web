import React from 'react';

const NotFoundPage = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <h1 className='text-5xl p-5 text-center'>404 Not Found</h1>
      <span className='text-lg p-5 text-center'>The page you are looking for could not be found.</span>
    </div>
  );
};

export default NotFoundPage;
