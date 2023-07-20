import { Linking, Platform } from 'react-native';

const firtsPosition = Platform.OS === 'ios' ? 2 : 3;
const secondPosition = Platform.OS === 'ios' ? 3 : 4;
let urlInitial = '';
// Function to get the deep link used to open the app
export const handleDeepLink = (e?: any, navigation?: any) => {

  if (e.url !== urlInitial) {
    const parts = e.url.split('/');
    if (parts[firtsPosition] && parts[secondPosition]) {
      if (
        parts[firtsPosition] === 'invite' &&
        parts[secondPosition].length > 3
      ) {
        urlInitial = e.url;
        console.log("first",parts[secondPosition])
        console.log("-ror",parts)
        navigation.navigate('Invite', {
          id: parts[secondPosition],
        });
      }
    }
  }
};

// Function to get the deep link used to open the app
export const getUrlAsync = async (navigation: any) => {
  Linking.addEventListener('url', (e) => handleDeepLink(e, navigation));
  const urlComing = await Linking.getInitialURL();
  if (urlComing !== urlInitial) {
    if (urlComing != null) {
      const parts = urlComing.split('/');
      if (parts[firtsPosition] && parts[secondPosition]) {
        if (
          parts[firtsPosition] === 'invite' &&
          parts[secondPosition].length > 3
        ) {
          urlInitial = urlComing;
          navigation.navigate('Invite', {
            id: parts[secondPosition],
          });
        }
      }
    }
  }
};
