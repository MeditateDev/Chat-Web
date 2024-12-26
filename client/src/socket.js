/* eslint-disable eqeqeq */
import { io } from 'socket.io-client';
import { decrypt, getParamValue } from './utils';
import { session } from './utils/session';
import { BOT_ID, CALL_FLOW_ID, CONNECTOR_SOCKET_VIRTUAL_PATH, CONNECTOR_URL } from './constant';

export const socket = io(session.socketDomain || CONNECTOR_URL, {
  query: { roomName: session.Id, botId: getParamValue('botId') || BOT_ID },
  path: CONNECTOR_SOCKET_VIRTUAL_PATH,
});

export const sendTyping = (val) => {
  if (!socket) return;

  socket.emit(
    'message',
    JSON.stringify({
      userId: session.Id,
      action: 'typing',
      value: val === 'on',
      botId: session.botId || BOT_ID,
    })
  );
};

export const triggerChat = () => {
  socket.emit(
    'message',
    JSON.stringify({
      botId: session.botId || BOT_ID,
      type: 'open-thread',
      user: session.Id,
      callFlowId: (!session.jsonFlow && (decrypt(session.callFlowId) || session.callFlowId || CALL_FLOW_ID)) || '',
      flowJSON: session.jsonFlow || '',
      customData: session.getURLParams(),
    })
  );

  session.useJSONFlow = false;
};

export const triggerOpenThread = () => {
  if (window.parent && session.callFlowTestId) {
    window.parent.postMessage(
      {
        type: 'RESTART_CONVO',
      },
      '*'
    );
    return;
  }
  if (session.triggerChatFlow != 1 || !socket) return;
  setTimeout(() => {
    triggerChat();
  }, 1000);
};

export const sendMessage = (message) => {
  if (!message || message.trim().length === 0 || !socket) return;
  socket.emit(
    'message',
    JSON.stringify({
      botId: session.botId || BOT_ID,
      type: 'message',
      user: session.Id,
      text: message,
      callFlowId: (!session.useJSONFlow && (decrypt(session.callFlowId) || session.callFlowId || CALL_FLOW_ID)) || '',
      flowJSON: (session.useJSONFlow && session.jsonFlow) || '',
      contentUrl: '',
    })
  );

  session.useJSONFlow = false;
};

export const sendCustomData = (data) => {
  if (!data || !socket) return;

  socket.emit(
    'message',
    JSON.stringify({
      botId: session.botId || BOT_ID,
      type: 'customData',
      user: session.Id,
      customData: data,
      callFlowId: (session.callFlowId && decrypt(session.callFlowId)) || session.callFlowId || CALL_FLOW_ID,
      contentUrl: '',
    })
  );
};
