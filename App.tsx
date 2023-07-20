import { useEffect, useState } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { ToastType } from './src/components/ToastTypes';

//* Redux
import Container from './src/navigators/Container';
import Store from './src/redux/Store';
import linking from './src/utils/linking';
import { InfiniteLoader } from './src/components/Loader';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['EventEmitter.removeListener']);
LogBox.ignoreLogs(['AsyncStorage']);
LogBox.ignoreLogs(["ViewPropTypes will be removed"]);

LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);
function App() {
  let [fontsLoaded] = useFonts({
    'Cabin-Regular': require('./assets/fonts/cabin/Cabin-Regular.ttf'),
    'Cabin-Bold': require('./assets/fonts/cabin/Cabin-Bold.ttf'),
    // Plus Jakarta Sans
    'PlusJakartaSans-Bold': require('./assets/fonts/jakarta/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-BoldItalic': require('./assets/fonts/jakarta/PlusJakartaSans-BoldItalic.ttf'),
    'PlusJakartaSans-ExtraBold': require('./assets/fonts/jakarta/PlusJakartaSans-ExtraBold.ttf'),
    'PlusJakartaSans-ExtraBoldItalic': require('./assets/fonts/jakarta/PlusJakartaSans-ExtraBoldItalic.ttf'),
    'PlusJakartaSans-ExtraLight': require('./assets/fonts/jakarta/PlusJakartaSans-ExtraLight.ttf'),
    'PlusJakartaSans-ExtraLightItalic': require('./assets/fonts/jakarta/PlusJakartaSans-ExtraLightItalic.ttf'),
    'PlusJakartaSans-Italic': require('./assets/fonts/jakarta/PlusJakartaSans-Italic.ttf'),
    'PlusJakartaSans-Light': require('./assets/fonts/jakarta/PlusJakartaSans-Light.ttf'),
    'PlusJakartaSans-LightItalic': require('./assets/fonts/jakarta/PlusJakartaSans-LightItalic.ttf'),
    'PlusJakartaSans-Medium': require('./assets/fonts/jakarta/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-MediumItalic': require('./assets/fonts/jakarta/PlusJakartaSans-MediumItalic.ttf'),
    'PlusJakartaSans-Regular': require('./assets/fonts/jakarta/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-SemiBold': require('./assets/fonts/jakarta/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-SemiBoldItalic': require('./assets/fonts/jakarta/PlusJakartaSans-SemiBoldItalic.ttf'),
  });

  const Theme = useColorScheme();

  return (
    <SafeAreaProvider
      style={{ backgroundColor: Theme === 'dark' ? '#212121' : '#FAFAFA' }}>
      <NavigationContainer linking={linking}>
        <Provider store={Store}>
          {fontsLoaded ? <Container /> : <InfiniteLoader />}
          <Toast config={ToastType as any} />
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;