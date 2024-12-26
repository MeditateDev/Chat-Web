import { v4 as uuidv4 } from 'uuid';
import { BOT_ID, CALL_FLOW_ID } from '../constant';

class Session {
  constructor() {
    this.keepSessionParam = JSON.parse(this.getParamValue('keepSession'));

    this.Id =
      this.getParamValue('userId') ||
      (this.keepSessionParam && localStorage.getItem('userId')) ||
      this.getParamValue('callFlowTestId') ||
      uuidv4().replace(/-/g, '');

    this.storage = !!(this.keepSessionParam || this.getParamValue('userId')) ? localStorage : sessionStorage;

    this.conversationKey = this.keepSessionParam ? 'keepSession' : this.Id;

    this.applySession();

    this.botId = this.getParamValue('botId') || BOT_ID;
    this.socketDomain = this.getParamValue('socketDomain');
    this.botName = this.getParamValue('name') || this.getParamValue('botName');
    this.displayControl = this.getParamValue('displayControl');
    this.callFlowId = this.getParamValue('callFlowId') || CALL_FLOW_ID;
    this.restartConv = this.getParamValue('restartConv') || 1;
    this.notLoadConv = this.getParamValue('notLoadConv');
    this.triggerChatFlow = this.getParamValue('triggerChatFlow') || 1;
    this.logoChatBoxUrl = this.getParamValue('logoChatBoxUrl');
    this.chatColor = this.getParamValue('color');
    this.greetingMessage = this.getParamValue('greetingMessage');
    this.logoUrl = this.getParamValue('logoUrl');
    this.callFlowTestId = this.getParamValue('callFlowTestId');
    this.useJSONFlow = false;
    this.jsonFlow = null;
    this.isOpenedChatWindow = false;

    if (this.botName) {
      document.title = this.botName;
    }
  }

  applySession() {
    let conversation = [];

    // if this.Id NOT MATCH local storage 'userId' in userId param => CLEAR history conversation
    if (this.Id !== this.storage.getItem('userId')) {
      this.storage.setItem(this.conversationKey, JSON.stringify({ conversation }));
      this.storage.setItem('userId', this.Id);
    }

    const sessionData = this.storage.getItem(this.conversationKey);

    if (sessionData != null && this.keepSessionParam) return;

    let greetingMessage = this.getParamValue('greetingMessage');

    if (greetingMessage)
      conversation = [
        {
          key: uuidv4(),
          type: 'message',
          isOther: true,
          msg: greetingMessage,
        },
      ];

    this.storage.setItem(this.conversationKey, JSON.stringify({ conversation }));
    this.storage.setItem('userId', this.Id);
  }

  getParamValue(param) {
    return new URLSearchParams(window.location.search).get(param);
  }

  getConversation() {
    try {
      const { conversation } = JSON.parse(this.storage.getItem(this.conversationKey)) || {};

      return conversation || [];
    } catch (e) {
      return [];
    }
  }

  getSessionData() {
    try {
      const data = this.storage.getItem(this.conversationKey) || {};

      return JSON.parse(data) || {};
    } catch (e) {
      return {};
    }
  }

  appendContent(content) {
    const data = this.getSessionData();

    const { conversation } = data;

    data.conversation = [...conversation, content];

    this.storage.setItem(this.conversationKey, JSON.stringify(data));

    return data.conversation;
  }

  updateConversation(conversation) {
    const data = this.getSessionData();

    data.conversation = conversation;

    this.storage.setItem(this.conversationKey, JSON.stringify(data));
  }

  cleanConversation() {
    const data = this.getSessionData();

    data.conversation = [];

    this.storage.setItem(this.conversationKey, JSON.stringify(data));

    return [];
  }

  setDefaultVariables({
    logoUrl,
    botName,
    botId,
    userId,
    restartConv,
    notloadConv,
    triggerChatFlow,
    callFlowId,
    displayControl,
    greeting,
    chatColor,
    socketDomain,
  }) {
    this.botId = botId || BOT_ID;
    this.socketDomain = socketDomain;
    if (botName) {
      this.botName = botName;
      document.title = botName;
    }
    this.Id = userId;
    this.displayControl = displayControl;
    this.callFlowId = callFlowId || CALL_FLOW_ID;
    this.restartConv = restartConv;
    this.notLoadConv = notloadConv;
    this.triggerChatFlow = triggerChatFlow;
    this.logoChatBoxUrl = this.getParamValue('logoChatBoxUrl');
    this.chatColor = chatColor;
    this.greetingMessage = greeting;
    this.logoUrl = logoUrl;
  }

  getURLParams() {
    try {
      const params = new URLSearchParams(window.location.search).entries();
      return Object.fromEntries(params);
    } catch (e) {
      return {};
    }
  }
}

export const session = new Session();
