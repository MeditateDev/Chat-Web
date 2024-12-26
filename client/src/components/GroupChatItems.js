import React from 'react';
import { session } from '../utils/session';
import { groupMessage } from '../utils';
import tw from 'tailwind-styled-components';
import Message from './Message';
import moment from 'moment';
import SuggestButtons from './ChatItemComponents/SuggestButtons';

const Container = tw.div`flex flex-col gap-3`;

const GroupContainer = tw.div`flex flex-col w-full gap-[4px]`;
const SenderName = tw.span`w-[200px] truncate text-xs text-gray-400 cursor-default`;

const GroupMessage = ({ group, isLastGroup, botName }) => {
  if (!Array.isArray(group) || !group.length) return <></>;

  const notUser = group[0].isOther;
  const agentName = group[0].agentName;
  const time = group[group.length - 1].time;

  if (group.length === 1 && group[0].type === 'event') {
    return <div className='flex items-center justify-center text-[11px] italic text-gray-500'>{group[0]?.content}</div>;
  }

  return (
    <GroupContainer>
      <div className={`${notUser ? 'ml-[3.8rem] text-left' : 'text-right mr-6'}`}>
        <SenderName>{notUser ? botName || agentName || session.botName || 'Primas Bot' : 'You'}</SenderName>
      </div>
      {group.map((message, i) => {
        return (
          <Message
            key={i}
            message={message}
            isFirstInGroup={i === 0}
            isLastInGroup={i === group.length - 1 || group[i + 1]?.type === 'buttons'}
            lastMessage={isLastGroup && i === group.length - 1}
          />
        );
      })}
      <span
        className={`${
          notUser ? 'self-start ml-[3.8rem]' : 'self-end mr-6'
        } text-xs font-normal flex items-center gap-2 leading-4 text-gray-400 mt-1`}>
        {moment(time).format('hh:mm A')}
        {/* {isLastGroup && !notUser && true && (
          <img src={session.logoUrl} className='w-[10px] h-[10px] transition-all duration-150' alt='' title='Seen' />
        )} */}
      </span>
    </GroupContainer>
  );
};

const GroupChatItems = ({ chatItems, botName }) => {
  const groups = groupMessage(chatItems);

  return (
    <Container>
      {groups.map((group, i) => {
        return <GroupMessage key={i} group={group} isLastGroup={i === groups.length - 1} botName={botName} />;
      })}
      {chatItems[chatItems.length - 1]?.type === 'buttons' && <SuggestButtons message={chatItems[chatItems.length - 1]} />}
    </Container>
  );
};

export default GroupChatItems;
