import notification_sound from '../assets/notification_sound.mp3';
import { session } from './session';
const noti_sound = new Audio(notification_sound);

let notiTimeOut = false;
export const playNotificationSound = () => {
  if (notiTimeOut || session.isOpenedChatWindow || !document.hidden) return;

  notiTimeOut = true;

  noti_sound
    .play()
    .then(() => {
      setTimeout(() => {
        notiTimeOut = false;
      }, 1500);

      noti_sound.opened = () => {
        setTimeout(() => {
          notiTimeOut = false;
        }, 1500);
      };
    })
    .catch((e) => {
      notiTimeOut = false;
      if (window.parent && e.message.includes('interact')) {
        window.parent.postMessage(
          {
            type: 'PLAY_SOUND',
            value: window.location.origin + notification_sound,
          },
          '*'
        );
      }
    });
};
