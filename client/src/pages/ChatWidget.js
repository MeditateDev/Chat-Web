/* eslint-disable eqeqeq */
import tw from 'tailwind-styled-components';
import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { io } from 'socket.io-client';
// import moment from 'moment';
import { session } from '../utils/session';
// import LazyLoad from 'react-lazyload';
import PrimasIcon from '../assets/primasIcon.png';
import reloadImg from '../assets/reload.png';
import closeImg from '../assets/close.png';
// import maximizeImg from '../assets/maximize.png';
// import restoreDownImg from '../assets/restore-down.png';

import { BOT_ID, CALL_FLOW_ID } from '../constant';
import TypingGIF from '../assets/typing.gif';

import MessagePrepareArea from '../components/MessagePrepareArea';
import { decrypt, getParamValue, openPopChat, sendBubbleMsg, showChatIcon, toggleChat } from '../utils';
import { playNotificationSound } from '../utils/notification';
import GroupChatItems from '../components/GroupChatItems';
import { sendCustomData, socket, triggerChat, triggerOpenThread } from '../socket';

const MessagesHeader = tw.header`h-[50px] w-full flex justify-between bg-white px-5 py-4 border-b-[1px]`;
const MessagesArea = tw.div`min-h-[50%] w-full flex-1 bg-white flex flex-col p-5 px-0 gap-3 overflow-auto transition-all scroll-smooth`;

// const ClearConversation = tw.div`top-0 left-0 w-full absolute flex items-center justify-center h-10 bg-opacity-20 bg-gray-300`;
const BotTypingContainer = tw.div`flex flex-col w-full gap-[4px] transition-all`;
const BotName = tw.span`w-[200px] truncate text-xs text-gray-400 cursor-default`;
const BotAvatar = tw.img`rounded-full object-cover h-[24px] w-[24px] self-end ml-5 mb-2 mr-3`;

const ChatWidget = () => {
  const [chatItems, setChatItems] = useState([...(session.notLoadConv != 1 && session.getConversation())]);
  const [enableInputChat, setEnableInputChat] = useState(() => {
    try {
      const conv = session.getConversation();
      if (conv && conv[conv.length - 1].type === 'form' && conv[conv.length - 1].data.Skip === 'true') return true;
      if (conv && conv[conv.length - 1].type === 'form' && !conv[conv.length - 1].result) {
        return false;
      }
    } catch (e) {}
    return true;
  });
  const [isBotTyping, setIsBotTyping] = useState(false);
  // const [agentSeenStatus, setAgentSeenStatus] = useState(false);
  const [userSeen, setUserSeen] = useState(true);
  // const [toggleMaximizeBtn, setToggleMaximizeBtn] = useState(true);
  const [logoChatBoxUrl, setLogoChatBoxUrl] = useState(session.logoUrl);
  const [botName, setBotName] = useState(session.botName);
  const messageAreaRef = useRef();
  const messageInputRef = useRef();

  const receiveMessage = useCallback((event) => {
    if (!event || !event.data) return;
    if (event.data.type === 'DETECT_PRODUCT') {
      sendCustomData(event.data.value);
    } else if (event.data.type === 'CHANGE_LOGO') {
      event.data.value && event.data.value.logoUrl && setLogoChatBoxUrl(event.data.value.logoUrl);
    } else if (event.data.type === 'CHANGE_COLOR') {
      if (event.data.value && event.data.value.chatColor) session.chatColor = event.data.value.chatColor;
    } else if (event.data.type === 'FOCUS_INPUT') {
      if (messageInputRef?.current) {
        messageInputRef.current.focus();
      }
    } else if (event.data.type === 'RUN_FLOW') {
      session.jsonFlow = event.data.value;
      session.useJSONFlow = true;
      triggerChat();
    } else if (event.data.type === 'TOGGLE_CHAT') {
      session.isOpenedChatWindow = event.data.value;
    }
  }, []);

  const handleRestartConversation = () => {
    localStorage.setItem('conversationMessage', '');
    setChatItems((prev) => []);
    localStorage.setItem('userId', session.Id);
    localStorage.removeItem('agentName');
    session.cleanConversation();
    if (socket) {
      socket.emit(
        'message',
        JSON.stringify({
          botId: session.botId || BOT_ID,
          type: 'event',
          eventName: 'endConversation',
          user: session.Id,
          callFlowId: (session.callFlowId && decrypt(session.callFlowId)) || session.callFlowId || CALL_FLOW_ID,
          contentUrl: '',
          customData: session.getURLParams(),
        })
      );
    }

    setIsBotTyping(false);
    // setAgentSeenStatus(false);
    setEnableInputChat(true);

    if (session.greetingMessage) {
      setChatItems((prev) => [
        {
          key: uuidv4(),
          type: 'message',
          isOther: true,
          msg: session.greetingMessage,
        },
      ]);

      session.appendContent({
        key: uuidv4(),
        type: 'message',
        isOther: true,
        msg: session.greetingMessage,
      });
    }

    if (messageInputRef?.current) {
      messageInputRef.current.focus();
    }

    triggerOpenThread();
  };

  useEffect(() => {
    if (chatItems.length) {
      session.updateConversation(chatItems);
    }

    setTimeout(() => {
      if (messageAreaRef.current) messageAreaRef.current.scrollTop = messageAreaRef.current?.scrollHeight;
    }, 100);
  }, [chatItems, isBotTyping]);

  useEffect(() => {
    if (session.restartConv == 1) {
      handleRestartConversation();
    }

    if (
      session.triggerChatFlow == 1 &&
      session.restartConv != 1 &&
      ((!session.getConversation().length && !session.greetingMessage) ||
        (session.getConversation().length == 1 && session.greetingMessage))
    ) {
      triggerOpenThread();
    }

    if (session.greetingMessage) {
      setChatItems((prev) => [
        {
          key: uuidv4(),
          type: 'message',
          isOther: true,
          msg: session.greetingMessage,
        },
      ]);

      session.appendContent({
        key: uuidv4(),
        type: 'message',
        isOther: true,
        msg: session.greetingMessage,
      });
    }

    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        if (message?.type === 'seen') {
          // return setAgentSeenStatus(true);
          return;
        }
        if (message?.type === 'typing') {
          // setAgentSeenStatus(false);
          setIsBotTyping(true);
          return;
        }
        if (message?.type === 'stop-typing') {
          setTimeout(() => {
            setIsBotTyping(false);
          }, 500);
          return;
        }
        if (message?.type === 'message') {
          playNotificationSound();
          setEnableInputChat(true);

          if (message?.text?.trim()) {
            setIsBotTyping(false);
          }
          // setAgentSeenStatus(false);

          setUserSeen(false);
          if (message?.text) {
            setChatItems((prev) => {
              return [
                ...prev,
                {
                  key: uuidv4(),
                  type: 'message',
                  isOther: true,
                  msg: message?.text?.trim(),
                  agentName: localStorage.getItem('agentName'),
                  actions: message?.actions,
                  time: new Date(),
                },
                {
                  ...((message.buttons &&
                    message.buttons.length && {
                      key: uuidv4(),
                      type: 'buttons',
                      isOther: true,
                      agentName: localStorage.getItem('agentName'),
                      actions: message.buttons,
                      time: new Date(),
                    }) ||
                    {}),
                },
              ].filter((e) => e.key);
            });
            sendBubbleMsg(message.text);
          }
          return;
        }
        if (message?.type === 'form') {
          playNotificationSound();
          setChatItems((prev) => [
            ...prev,
            {
              key: uuidv4(),
              type: 'form',
              isOther: true,
              agentName: localStorage.getItem('agentName'),
              data: message?.form,
              time: new Date(),
            },
          ]);
          setEnableInputChat((prev) => {
            if (message.form.Skip === 'true') return true;
            return false;
          });
          return;
        }
        if (message?.type === 'validate-result') {
          setChatItems((prev) => {
            let newData = prev;

            const lastIndex = newData.findLastIndex((e) => e.type === 'form');

            if (lastIndex < 0) return prev;

            newData[lastIndex].result = message?.result?.valid;
            newData[lastIndex].errors = message?.result?.errors;

            return [...newData];
          });
          setEnableInputChat(true);
          return;
        }
        if (message?.type === 'agent-connect') {
          if (!message?.data?.agentName) return;
          localStorage.setItem('agentName', message?.data?.agentName);
          setChatItems((prev) => [
            ...prev,
            {
              key: uuidv4(),
              type: 'event',
              eventName: 'agent-connect',
              content: message?.data?.content,
              agentName: message?.data?.agentName,
              isOther: true,
              time: new Date(),
            },
          ]);
        }
        if (message?.type === 'agent-disconnect') {
          localStorage.removeItem('agentName');
          setChatItems((prev) => [
            ...prev,
            {
              key: uuidv4(),
              type: 'event',
              eventName: 'agent-disconnect',
              content: message?.data?.content,
              isOther: true,
              time: new Date(),
            },
          ]);
        }
        if (message?.type == 'show-chat-icon') {
          showChatIcon();
          return;
        }
        if (message?.type == 'replace-bot-name') {
          const isTalkingWithAgent = !!message?.channelData?.isTalkingWithAgent;
          const newBotName = (isTalkingWithAgent && message?.channelData.agentName) || getParamValue('name');
          localStorage.setItem('agentName', newBotName);
          setBotName(getParamValue('name')); // trigger state change to reload bot name

          if (isTalkingWithAgent) {
            showChatIcon();
            openPopChat();
          }
        }
        if (message?.type === 'cards') {
          playNotificationSound();

          setChatItems((prev) => [
            ...prev,
            {
              key: uuidv4(),
              type: 'cards',
              isOther: true,
              agentName: localStorage.getItem('agentName'),
              data: message?.cards,
              ratio: message?.ratio,
              time: new Date(),
            },
          ]);
        }
        if (message?.type === 'image') {
          playNotificationSound();

          setChatItems((prev) =>
            [
              ...prev,
              {
                key: uuidv4(),
                type: 'image',
                isOther: true,
                agentName: localStorage.getItem('agentName'),
                data: message?.imageUrl,
                time: new Date(),
              },
              {
                ...((message.buttons &&
                  message.buttons.length && {
                    key: uuidv4(),
                    type: 'buttons',
                    isOther: true,
                    agentName: localStorage.getItem('agentName'),
                    actions: message.buttons,
                    time: new Date(),
                  }) ||
                  {}),
              },
            ].filter((e) => e.key)
          );
        }
        if (message?.type === 'video') {
          playNotificationSound();

          setChatItems((prev) =>
            [
              ...prev,
              {
                key: uuidv4(),
                type: 'video',
                isOther: true,
                agentName: localStorage.getItem('agentName'),
                data: message?.videoUrl,
                time: new Date(),
              },
              {
                ...((message.buttons &&
                  message.buttons.length && {
                    key: uuidv4(),
                    type: 'buttons',
                    isOther: true,
                    agentName: localStorage.getItem('agentName'),
                    actions: message.buttons,
                    time: new Date(),
                  }) ||
                  {}),
              },
            ].filter((e) => e.key)
          );
        }
        if (message?.type == 'buttons') {
          setChatItems((prev) => [
            ...prev,
            {
              key: uuidv4(),
              type: 'buttons',
              isOther: true,
              agentName: localStorage.getItem('agentName'),
              actions: message?.buttons,
              time: new Date(),
            },
          ]);
        }
        if (message?.type === 'endOfConversation') {
          session.useJSONFlow = !!session.jsonFlow;
        }
      } catch (error) {
        // console.log(error);
      }
    });
    socket.on('broadcast-message', (data) => {
      try {
        const message = JSON.parse(data);
        if (message?.type === 'message') {
          if (message?.text?.trim()) {
            setIsBotTyping(false);
          }
          setChatItems((prev) => [
            ...prev,
            {
              key: uuidv4(),
              type: 'message',
              isOther: false,
              msg: message?.text?.trim(),
              time: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      }
    });

    if (messageInputRef?.current) {
      messageInputRef.current.focus();
    }

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('message', receiveMessage);
    return () => {
      window.removeEventListener('message', receiveMessage);
    };
  }, [receiveMessage]);

  useEffect(() => {
    if (botName) {
      document.title = botName;
    }
  }, [botName]);

  const handleOnContainerClick = () => {
    if (userSeen) return;
    setUserSeen(true);
    if (!socket) return;
    socket.emit(
      'message',
      JSON.stringify({
        userId: session.Id,
        action: 'seen',
        botId: session.botId || BOT_ID,
      })
    );
  };

  // const toggleMaximumBtn = () => {
  //   setToggleMaximizeBtn((prev) => !prev);
  // };

  // const checkConnectWithAgent = () => {
  //   const convs = getConversation();
  //   if (!convs || !convs.length) {
  //     return false;
  //   }
  //   const reverseConvs = convs.reverse();
  //   const connectedEvt = reverseConvs.findIndex((c) => c.type == 'event' && c.eventName == 'agent-connect');
  //   const disconnectedEvt = reverseConvs.findIndex((c) => c.type == 'event' && c.eventName == 'agent-disconnect');

  //   return connectedEvt < disconnectedEvt;
  // };

  return (
    <div className='h-[calc(100dvh)] w-full flex flex-col'>
      <MessagesHeader onClick={() => handleOnContainerClick()}>
        <div className='flex gap-2 items-center w-[70%]'>
          <img src={logoChatBoxUrl || PrimasIcon} alt='PrimasBot' className='rounded-full object-cover w-[2rem] h-[2rem]' />
          <h3
            className='text-lg w-full truncate'
            title={botName || localStorage.getItem('agentName') || session.botName || 'Primas Bot'}
            style={{ color: '#111111' }}>
            {botName || localStorage.getItem('agentName') || session.botName || 'Primas Bot'}
          </h3>
        </div>
        <div className='flex justify-end items-center w-[200px] gap-3'>
          {getParamValue('hideRestartButton') != 1 && (
            <div
              onClick={() => handleRestartConversation()}
              className='flex justify-center items-center rounded-full w-[32px] h-[32px] text-black bg-gray-50 hover:bg-gray-300 hover:bg-opacity-90 active:scale-90 cursor-pointer'>
              <img src={reloadImg} alt='' className='w-[20px]' title='Restart conversation' />
            </div>
          )}

          {session.displayControl === '1' && (
            <div className='flex justify-end items-center gap-3'>
              <div
                onClick={() => toggleChat()}
                className='flex justify-center items-center rounded-full w-[32px] h-[32px] text-black bg-gray-50 hover:bg-gray-300 hover:bg-opacity-90 active:scale-90 cursor-pointer'>
                <img src={closeImg} alt='' className='w-[20px]' title='Close conversation' />
              </div>
              {/* {!toggleMaximizeBtn ? (
                <div
                  onClick={() => {
                    handleRestoreDown();
                    toggleMaximumBtn();
                  }}
                  className='flex justify-center items-center rounded-full w-[32px] h-[32px] text-black bg-gray-50 hover:bg-gray-300 hover:bg-opacity-90 active:scale-90 cursor-pointer'>
                  <img src={restoreDownImg} alt='' className='w-[20px]' title='Restore down conversation' />
                </div>
              ) : (
                <div
                  onClick={() => {
                    handleRestoreUp();
                    toggleMaximumBtn();
                  }}
                  className='flex justify-center items-center rounded-full w-[32px] h-[32px] text-black bg-gray-50 hover:bg-gray-300 hover:bg-opacity-90 active:scale-90 cursor-pointer'>
                  <img src={maximizeImg} alt='' className='w-[16px]' title='Maximize conversation' />
                </div>
              )} */}
            </div>
          )}
        </div>
      </MessagesHeader>
      <MessagesArea onClick={() => handleOnContainerClick()} ref={messageAreaRef}>
        <GroupChatItems chatItems={chatItems} botName={botName} />
        {isBotTyping && (
          <BotTypingContainer>
            <div className='ml-[3.8rem] text-left'>
              <BotName>{botName || session.botName || 'Primas Bot'}</BotName>
            </div>
            <div className='flex flex-row'>
              <BotAvatar src={session.logoUrl || PrimasIcon} alt='' />
              <div className='w-[50px] h-[34px] flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 self-start'>
                {/* <i className='fa-solid fa-ellipsis text-4xl animate-pulse'></i> */}
                <img src={TypingGIF} alt='' className='w-7 select-none' />
              </div>
            </div>
          </BotTypingContainer>
        )}
      </MessagesArea>
      {enableInputChat ? (
        <MessagePrepareArea onClick={() => handleOnContainerClick()} messageInputRef={messageInputRef} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatWidget;
