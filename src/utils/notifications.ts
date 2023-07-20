import axios from 'axios';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { updateNotificationTokenUser } from '../database/userFirebase';

const serverUrl = 'https://lyfelab.org';
// const serverUrl = "http://192.168.1.66:4000";

export const sendNotification = async (
  typeNotification: string,
  isTokensData:boolean, // esto en caso de que arrayReceiver sean los tokens y no los uid de los miembros
  arrayReceiver: Array<string>,
  posterName: string,
  groupName: string,
) => {
  let tokensReceiver = [] as any;
  if (isTokensData) {
    tokensReceiver = arrayReceiver;
  } else {
    tokensReceiver = await getTokensFromUsers(arrayReceiver);
  }

  try {
    let objMessage = {};
    switch (typeNotification) {
      case 'newQuestion':
        objMessage = {
          title: 'You have new question',
          body: posterName
            ? `${posterName} asked you a question`
            : 'Someone asked you a question',
          channel: 'newQuestion',
          data: { type: 'newQuestion' },
          tag: `newQuestion~${posterName}`,
          arrayTokens: tokensReceiver,
        };
        break;
      case 'newResponse':
        objMessage = {
          title: 'You have new response',
          body: posterName
            ? `${posterName} responded your question`
            : 'Someone responded your question',
          channel: 'newResponse',
          data: { type: 'newResponse' },
          tag: `newResponse~${posterName}`,
          arrayTokens: tokensReceiver,
        };
        break;
      case 'newUpdate':
        objMessage = {
          title: `New update in ${groupName}`,
          body: posterName
            ? `${posterName} has made a new update`
            : 'Someone has made a new update',
          channel: 'newUpdate',
          data: { type: 'newUpdate' },
          tag: `newUpdate~${posterName}`,
          arrayTokens: tokensReceiver,
        };
        break;
      case 'joinGroup':
        objMessage = {
          title: `New member in ${groupName}`,
          body: posterName
            ? `${posterName} has joined your group`
            : 'Someone has joined your group',
          channel: 'newMember',
          data: { type: `newMember~${groupName}` },
          tag: `newMember~${posterName || 'Someone'}`,
          arrayTokens: tokensReceiver,
        };
        break;
      case 'leaveGroup':
        objMessage = {
          title: `New member in ${groupName}`,
          body: posterName
            ? `${posterName} has joined your group`
            : 'Someone has joined your group',
          channel: 'newMember',
          data: { type: `newMember~${groupName}` },
          tag: `newMember~${posterName || 'Someone'}`,
          arrayTokens: tokensReceiver,
        };
        break;
      case 'leaveGroup':
        objMessage = {
          title: `A member has leave the group ${groupName}`,
          body: posterName
            ? `${posterName} has leave your group`
            : 'Someone has leave your group',
          channel: 'leaveMember',
          data: { type: `leaveMember~${groupName}` },
          tag: `leaveMember~${posterName || 'Someone'}`,
          arrayTokens: tokensReceiver,
        };
        break;

      default:
        break;
    }
    console.log('Enviamos notificacion');
    console.log(objMessage);

    // const req = await axios.post(`${serverUrl}/send-notification-push-expo`, {
    //   objMessage,
    // });
    // console.log(req.data);
  } catch (error) {
    console.log(error);
  }
};

export const getTokensFromUsers = async (membersArray: any) => {
  const arrayTokens = [] as any;
  membersArray.map((user: any) => {
    user.notificationToken ? arrayTokens.push(user.notificationToken) : null;
  });
  return arrayTokens;
};

export const registerForNotifications = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      if (Platform.OS === 'ios') {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message:
              'It is necessary to enable notification permissions for the correct use of the app, you can also enable them manually by going to Settings -> Matter -> Notifications -> Allow',
          },
        });
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: 'You need to enable notification permissions manually',
          },
        });
      }
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Toast.show({
      type: 'ToastError',
      props: {
        hide: () => {
          Toast.hide();
        },
        message: 'This device cannot receive notifications',
      },
    });
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};


export const getNotificationToken = async (notificationToken: string | undefined | null, idUser: string | undefined) => {
  const newToken = await registerForNotifications();
  if (newToken) {
    notificationToken != newToken
      ? updateNotificationTokenUser({
          notificationToken: newToken,
          uid: idUser,
        })
      : null;
  }
};