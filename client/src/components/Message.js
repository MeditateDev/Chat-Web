import React from 'react';
import tw from 'tailwind-styled-components';
import { session } from '../utils/session';
import CardsContainer from './ChatItemComponents/CardComponents/CardsContainer';
import FormItem from './ChatItemComponents/FormItem';
import ImageItem from './ChatItemComponents/ImageItem';
import VideoItem from './ChatItemComponents/VideoItem';

import PrimasIcon from '../assets/primasIcon.png';
import TextMessage from './ChatItemComponents/TextMessage';

const SenderAvatar = tw.img`rounded-full object-cover h-[24px] w-[24px] self-end ml-5 mb-2 mr-3`;

const Content = ({ message, isFirstInGroup, isLastInGroup, lastMessage }) => {
  const { type, data, msg, isOther, result, errors, video } = message;

  //not handled this

  if (type === 'message' && msg) {
    return (
      <TextMessage
        message={message}
        isFirstInGroup={isFirstInGroup}
        isLastInGroup={isLastInGroup}
        lastMessage={lastMessage}
      />
    );
  }

  if (type === 'form' && data) {
    return (
      <FormItem
        data={data}
        openPop={!!(lastMessage && !result)}
        result={result}
        formErrors={errors}
        lastMessage={lastMessage}
        isFirstInGroup={isFirstInGroup}
        isLastInGroup={isLastInGroup}
        isOther={isOther}
      />
    );
  }

  if (type === 'image' && data) {
    return <ImageItem src={data} isOther={isOther} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup} />;
  }

  if (type === 'video' && data) {
    return (
      <VideoItem
        src={data}
        type={video?.type || ''}
        thumbnail={video?.thumbnail || ''}
        isFirstInGroup={isFirstInGroup}
        isLastInGroup={isLastInGroup}
        isOther={isOther}
      />
    );
  }

  if (type === 'cards' && data && data.length) {
    return (
      <CardsContainer data={data} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup} ratio={message.ratio} />
    );
  }

  return <></>;
};

const Message = ({ message, isFirstInGroup, isLastInGroup, lastMessage }) => {
  const { isOther, type } = message;

  if (type === 'buttons' || type === 'event') return <></>;

  return (
    <div className={`flex w-full overflow-y-auto ${isOther ? `flex-row ` : `flex-row-reverse`}`}>
      {isOther && isLastInGroup && <SenderAvatar src={session.logoUrl || PrimasIcon} alt='' />}
      <Content message={message} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup} lastMessage={lastMessage} />
    </div>
  );
};

export default Message;
