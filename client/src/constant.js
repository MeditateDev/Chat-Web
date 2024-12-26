//URL
export const CONNECTOR_URL = '';
// export const CONNECTOR_URL = 'https://uw-avaya-lab.primas.net:7460';

//Virtual path
export const CONNECTOR_VIRTUAL_PATH = '/botconnector';
export const CONNECTOR_SOCKET_VIRTUAL_PATH = '/botconnector/socket.io';

/**
 * IF USING BOT CONNECTOR
 *  WEB_CHAT_VIRTUAL_PATH = '/botconnector/callflow-chatbox'
 * IF USING WEB CHAT
 *  WEB_CHAT_VIRTUAL_PATH = '/webchat'
 *
 * IMPORTANT NOTE: Set homepage same as this value on package.json
 */

export const WEB_CHAT_VIRTUAL_PATH = '/botconnector/callflow-chatbox';

export const CALL_FLOW_ID = '';
export const BOT_ID = 'PRIMAS_BOT';

export const ENCRYPT_KEY = 'CallFlowChatBotHotNew';

export const MY_PARAMS = ['botId', 'name', 'displayControl', 'callFlowId', 'userId'];

// export const PAGE_VIRTUAL_PATH = '/react-app';
