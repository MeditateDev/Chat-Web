import React from 'react';

const Button = ({ children, className = '', ...rest }) => {
  return (
    <button
      className={`outline-none transition-all rounded-lg py-2 px-4 active:scale-95 cursor-pointer select-none hover:bg-opacity-90 text-center ${className} `}
      {...rest}>
      {children}
    </button>
  );
};

export default Button;
