import React, { useState } from 'react';
import { socket } from '../../socket';
import { session } from '../../utils/session';
import { handleFormat } from '../../utils';
import DatePickerItem from './DatePickerItem';
import SitePreview from '../SitePreview';

const TextMessage = ({ message, isFirstInGroup, isLastInGroup }) => {
  const { msg, isOther, actions } = message;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleClickGrammarDateTime = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleChooseDate = (date) => {
    if (showDatePicker) setShowDatePicker(!showDatePicker);

    if (!date) return;

    socket.emit(
      'message',
      JSON.stringify({
        botId: session.botId,
        type: 'message',
        user: session.Id,
        text: date,
        contentUrl: '',
      })
    );
  };

  return (
    <>
      <div
        style={{
          backgroundColor: isOther ? '#F3F4F6' : session.chatColor,
        }}
        className={`
    rounded-sm max-w-[75%]
    bg-gray-100 text-gray-800 px-3 py-2
    ${isOther ? `rounded-r-lg bg-gray-100 text-gray-800` : `rounded-l-lg bg-primary text-white mr-6`}
    ${(isFirstInGroup && `rounded-t-lg`) || ``}
    ${(isLastInGroup && `rounded-b-lg ml-0`) || `ml-14`}
    ${actions && actions.name === 'date-time' ? `flex flex-col gap-1  rounded-lg transition-all text-sm` : ` text-sm`}`}>
        {handleFormat(msg, isOther)}
        {actions && actions.name === 'date-time' && (
          <div className='flex flex-col gap-1 transition-all'>
            <div className='w-[80%] min-h-[2px] bg-gray-400 my-2 mx-auto rounded'></div>
            <button
              style={{ backgroundColor: session.chatColor }}
              className='bg-primary disabled:bg-gray-300 text-white p-1 rounded-[4px] active:scale-95 transition-all text-sm flex items-center justify-center'
              onClick={() => handleClickGrammarDateTime()}>
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                style={{ color: 'white' }}>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7 2C6.44772 2 6 2.44772 6 3V4H5C3.89543 4 3 4.89543 3 6V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V6C21 4.89543 20.1046 4 19 4H18V3C18 2.44772 17.5523 2 17 2C16.4477 2 16 2.44772 16 3V4H8V3C8 2.44772 7.55228 2 7 2ZM8 6H16V7C16 7.55228 16.4477 8 17 8C17.5523 8 18 7.55228 18 7V6H19C19.5523 6 20 6.44772 20 7V8H4V7C4 6.44772 4.44772 6 5 6H6V7C6 7.55228 6.44772 8 7 8C7.55228 8 8 7.55228 8 7V6ZM4 10V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V10H4Z'
                  fill='currentColor'
                />
              </svg>
            </button>
            {showDatePicker && <DatePickerItem actions={actions} getDateValue={handleChooseDate} />}
          </div>
        )}
        <SitePreview className={`ml-0 mr-0 ${isOther ? `` : `self-end`}`} message={msg} />
      </div>
    </>
  );
};

export default TextMessage;
