import { ENCRYPT_KEY } from '../constant';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeItem from '../components/ChatItemComponents/CodeItem';

export const base64UrlDecode = (base64Url) => {
  try {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  } catch (e) {}
};

export const decrypt = (encryptedText) => {
  try {
    const keyBytes = new TextEncoder().encode(ENCRYPT_KEY);
    const encryptedBytes = new Uint8Array([...base64UrlDecode(encryptedText)].map((c) => c.charCodeAt(0)));
    for (let i = 0; i < encryptedBytes.length; i++) {
      encryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    const decryptedText = new TextDecoder().decode(encryptedBytes);

    if (decryptedText && /[^a-zA-Z0-9]/.test(decryptedText)) return;

    return decryptedText;
  } catch (e) {}
};

export const getConversation = () => {
  try {
    return JSON.parse(localStorage.getItem('conversationMessage'));
  } catch (e) {
    console.log(`Get conversation failed - err: ${e.message}`);
    return [];
  }
};

export const getParamValue = (param) => {
  return new URLSearchParams(window.location.search).get(param);
};

export const isMobile = () => {
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
};

export const isUrl = (urlString) => {
  try {
    // Create a new URL object to validate the format and components
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
};

export const extractUrl = (text) => {
  const urlRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;

  const match = urlRegex.exec(text);

  return match ? match[0] : null;
};

export const isWithinMinutes = (firstDateTime, secondDateTime, minutes) => {
  const firstDate = new Date(firstDateTime);
  const secondDate = new Date(secondDateTime);

  const differenceInMilliseconds = secondDate - firstDate;

  const minutesInMilliseconds = minutes * 60 * 1000;

  return differenceInMilliseconds <= minutesInMilliseconds && differenceInMilliseconds >= 0;
};

export const groupMessage = (items) => {
  const result = [];
  try {
    let group = [];
    let lastedHandleMsgTime = items[0]?.time;

    for (let [i, msg] of items.entries()) {
      const { isOther, time, type } = msg;

      if (!lastedHandleMsgTime) {
        lastedHandleMsgTime = time;
      }

      if (i === 0) {
        group.push(msg);
        continue;
      }

      if (items[i - 1].isOther !== isOther || !isWithinMinutes(lastedHandleMsgTime, time, 5)) {
        result.push(group);
        group = [msg];
        lastedHandleMsgTime = '';
        continue;
      }

      if (type === 'event') {
        result.push(group);
        result.push([msg]);
        group = [];
        lastedHandleMsgTime = '';
        continue;
      }

      group.push(msg);
    }

    result.push(group);
  } catch (e) {
    return items;
  }

  return result;
};

export const sendEventRedirect = (url) => {
  window.open(url, '_blank');
};
export const handleFormat = (inputText, isOther) => {
  if (!inputText || typeof inputText != 'string' || !isOther) return inputText;
  // if (!inputText || typeof inputText != 'string') return inputText
  // const linkMarkupPattern = /\*(.*?)\|(.*?)\*/g;
  // const linkPattern = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
  // const localhostPattern = /(http:\/\/localhost(?::\d+)?(?:\/\S*)?|localhost\/\S+)/g;

  // let splittedMarkup = inputText.split(localhostPattern).filter(Boolean);

  // splittedMarkup = [
  //   ...splittedMarkup.flatMap((str) => [...str.split(/(\*.*?\|.*?\*)|(https?:\/\/[\w-]+(?:\.[\w-]+)+[^\s]*)/g)]),
  // ].filter(Boolean);

  // return splittedMarkup.map((e) => {
  // const markupLink = linkMarkupPattern.exec(e);
  // if (markupLink) {
  //   return (
  //     <span key={markupLink[1]} onClick={() => sendEventRedirect(markupLink[2])} className={`font-bold cursor-pointer`}>
  //       {markupLink[1]}
  //     </span>
  //   );
  // }

  // const localhostLink = localhostPattern.exec(e);

  // if (localhostLink) {
  //   return (
  //     <a
  //       key={localhostLink[1]}
  //       href={localhostLink[0]}
  //       className={isOther ? 'underline text-blue-500' : `underline`}
  //       target='_blank'
  //       rel='noreferrer'>
  //       {localhostLink[0]}
  //     </a>
  //   );
  // }

  // const link = linkPattern.exec(e);

  // if (link) {
  //   return (
  //     <a
  //       key={link[1]}
  //       href={link[0]}
  //       className={isOther ? 'underline text-blue-500' : `underline`}
  //       target='_blank'
  //       rel='noreferrer'>
  //       {link[0]}
  //     </a>
  //   );
  // }
  return (
    <Markdown
      className={'markdown-wrapper'}
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          return <CodeItem {...props} />;
        },
        a(props) {
          const { children, ...rest } = props;
          return (
            <a {...rest} target='_blank'>
              {children}
            </a>
          );
        },
        table(props) {
          const { children, ...rest } = props;
          return (
            <div className='overflow-auto'>
              <table {...rest}>{children}</table>
            </div>
          );
        },
      }}>
      {inputText}
    </Markdown>
  );
  // });
};

export const toggleChat = () => {
  if (window.parent) {
    window.parent.postMessage(
      {
        type: 'TOGGLE_CHAT',
      },
      '*'
    );
  }
};

export const openPopChat = () => {
  if (window.parent) {
    window.parent.postMessage(
      {
        type: 'OPEN_POP_CHAT',
      },
      '*'
    );
  }
};

export const showChatIcon = () => {
  if (window.parent) {
    window.parent.postMessage(
      {
        type: 'SHOW_CHAT_ICON',
      },
      '*'
    );
  }
};

export const sendBubbleMsg = (msg) => {
  window.parent.postMessage(
    {
      type: 'BUBBLE_MSG',
      msg,
    },
    '*'
  );
};

export const formatFormMessage = (data, form) => {
  let message = `User submit form\n`;
  if (!data || !Array.isArray(data.Questions) || !form || typeof form !== 'object') return message;

  data.Questions.forEach((q) => {
    if (!q.answerVariable || !q.label || !form[q.answerVariable]) return;
    message += `${q.label}: ${String(form[q.answerVariable])} \n`;
  });

  return message.trim();
};

export const formatForm = (data, form) => {
  if (!data || !Array.isArray(data.Questions) || !form || typeof form !== 'object') return {};

  Object.keys(form).forEach((key) => {
    //Phone number format
    if (form[key + 'NumberCode']) {
      form[key] = `${form[key + 'NumberCode']} ${form[key]}`;
      delete form[key + 'NumberCode'];
    }
  });
  return form;
};
