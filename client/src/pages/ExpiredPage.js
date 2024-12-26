import React from 'react';

const ExpiredPage = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <h1 className='text-5xl p-5 text-center'>Oops! Looks like this link has expired!</h1>
      <span className='text-lg p-5 text-center'>To continue, kindly generate a fresh link or contact support for help.</span>
    </div>
  );
};

export default ExpiredPage;
