import { useState, useEffect, useCallback, useRef } from 'react';

import tw from 'tailwind-styled-components';
import TextareaAutosize from 'react-textarea-autosize';
// import FileUploading from 'react-files-uploading';

import { sendMessage, sendTyping } from '../socket';

// import paperplane from '../assets/paper-plane.png';

import { session } from '../utils/session';
import SitePreview from './SitePreview';

const MessagePrepareArea = tw.div`bg-white w-full flex flex-row h-fit mobile:my-0 pb-3 pt-2 items-end justify-center px-3 gap-2`;
const SendButton = tw.button`flex pl-1 transition-all h-[40px] w-[40px] select-none items-center justify-center
            rounded-full cursor-pointer active:scale-90 hover:bg-gray-200 hover:bg-opacity-90`;
let isTyping = false,
  typingTimeout;

const App = ({ messageInputRef }) => {
  const [message, setMessage] = useState('');
  const submitButtonRef = useRef();

  const onKeyUp = (e) => {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') return;
    const content = e.target.value;

    if (!content || !content.trim()) return;

    clearTimeout(typingTimeout);
    if (!isTyping) {
      sendTyping('on');
      isTyping = true;
    }

    typingTimeout = setTimeout(() => {
      if (isTyping) {
        sendTyping('off');
        isTyping = false;
      }
    }, 400);
  };

  const keyDownHandler = useCallback((event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      submitButtonRef.current.click();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);

    return () => document.removeEventListener('keydown', keyDownHandler);
  }, [keyDownHandler]);

  useEffect(() => {
    if (messageInputRef?.current) {
      setTimeout(() => {
        if (messageInputRef?.current) messageInputRef.current.focus();
      }, 200);
    }
  }, [messageInputRef]);

  return (
    <div className='w-full flex flex-col gap-1'>
      <SitePreview message={message} />
      <MessagePrepareArea>
        <div className={`transition-all h-fit bg-gray-100 px-4 py-2 rounded-[20px] flex grow items-center justify-center`}>
          <TextareaAutosize
            ref={messageInputRef}
            minRows={1}
            maxRows={3}
            value={message}
            name='text-chat'
            placeholder='Type a message here'
            className='flex-grow resize-none overflow-auto outline-none bg-transparent mr-0 min-h-[24px]'
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyUp={(e) => onKeyUp(e)}
          />
        </div>
        <SendButton
          ref={submitButtonRef}
          onClick={() => {
            if (!message || message.trim().length === 0) return;
            sendMessage(message);
            setMessage('');

            if (messageInputRef) {
              messageInputRef.current.focus();
            }
          }}>
          <svg
            className='w-6 h-6 rotate-90 text-primary'
            style={{ color: session.chatColor }}
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 18 20'>
            <path d='m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z' />
          </svg>
        </SendButton>
      </MessagePrepareArea>
    </div>
  );
};

export default App;
