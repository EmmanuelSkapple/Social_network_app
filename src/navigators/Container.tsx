import { useState, useEffect } from 'react';
import { I18nManager, View } from 'react-native';
import auth from '@react-native-firebase/auth';

import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../utils/Colors';
import Loading from '../components/Loading';
import { getUser,getUserLogin } from '../database/userFirebase';

import StackAuth from './StackAuth';
import StackOnBoarding from './StackOnBoarding';
import { RootState } from '../redux/appReducer';
import Stack from './Stack';
import { en, es } from '../services/i18n/localizations';
import { InfiniteLoader } from '../components/Loader';
import { UserStatusProps } from '../../types/typesNavigators';
import LoginAndSign from '../screens/AuthScreens';

export default function Main() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState({} as any);
  const [existUserDB, setExistUserDB] = useState(0);
  const [firstTime, setFirstTime] = useState(false);
  const dispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);
  const Language = useSelector((state: RootState) => state.language);

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);


  useEffect(() => {
    InitialiceApp();
  }, []);

  const InitialiceApp = async () => {
    i18n.defaultLocale = 'en';
    await setTheme();
    setLanguage();
  };

  useEffect(() => {
    i18n.fallbacks = true;
    i18n.translations = {
      en,
      es,
    };
    i18n.locale = Language.currentLanguage;
  }, [Language.currentLanguage]);

  useEffect(() => {
    getUserData();
  }, [user]);


  const getUserData = async () => {
    if (user.uid) {
      const userStatus: UserStatusProps = await getUser(user.uid);
      switch (userStatus.status){
        case 200:
          userStatus.userData.uid = user.uid;
          setFirstTime(!userStatus.userData.onBoarding.AfterHome);
          setExistUserDB(1);
          
          dispatch({ type: 'setUserData', payload: userStatus.userData });

          break;
         case 404:
           setFirstTime(false);
           setExistUserDB(2);
          break;
        default:
          break;
      }
    }
  };


  const setLanguage = async () => {
    const cacheLanguage = await AsyncStorage.getItem('currentLanguage');
    i18n.fallbacks = true;
    i18n.translations = {
      en,
      'en-US': en,
      es,
    };
    i18n.locale = cacheLanguage != null ? cacheLanguage : Language.currentLanguage;
    setInitializing(false);
    I18nManager.forceRTL(Language.currentLanguage === 'ar');
  };
  const setTheme = async () => {
    const cacheTheme = await AsyncStorage.getItem('theme');
    dispatch({ type: cacheTheme != null ? cacheTheme : 'light' });
  };

  return !initializing ? (
   auth().currentUser?.uid? (
        existUserDB==1 && !firstTime? (
          <Stack />
        ) : existUserDB==1  && firstTime ? (
          <StackOnBoarding />
        ) : existUserDB ==2 ? (
          <LoginAndSign route={{
            params: { action: 'string' }
          }} />
        )
          : (
            <View
              style={{
                flex: 1,
                backgroundColor: Colors().background,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loading />
            </View>
          )
      ) : (
        <StackAuth />
      )
  ) : (
    <View>

    </View>
  );
}