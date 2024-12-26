import React from 'react';
import { socket } from '../../socket';
import { session } from '../../utils/session';

const chooseAnswer = (title, value) => {
  if (!title || !value) return;

  try {
    socket.emit(
      'message',
      JSON.stringify({
        botId: session.botId,
        type: 'message',
        user: session.Id,
        text: title,
        data: { value: value, title: title },
        contentUrl: '',
      })
    );
  } catch (e) {}
};

const SuggestButtons = ({ message }) => {
  const { actions } = message;

  return (
    <div className='max-w-[75%] inline-flex flex-wrap gap-x-2 pr-38 ml-14'>
      {actions?.map((action, index) => {
        return (
          <div
            onClick={() => chooseAnswer(action?.name, action?.value)}
            key={index}
            style={{ color: session.chatColor }}
            className='max-w-[100%] border-[0.4px] h-fit text-sm text-green-400 rounded-xl mt-1 p-2 transition-all whitespace-pre-line break-words select-none cursor-pointer hover:bg-gray-200 active:bg-gray-300'>
            {action?.name}
          </div>
        );
      })}
    </div>
  );
};

export default SuggestButtons;
