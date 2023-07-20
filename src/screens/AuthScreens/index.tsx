import i18n from 'i18n-js';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import Colors from '../../utils/Colors';
import { useSelector, useDispatch } from 'react-redux';
import Images from '../../utils/Images';
import Login from './Login';
import { RootState } from '../../redux/appReducer';
import SignUp from './SignUp';
import { StatusBar } from 'expo-status-bar';

import {
  HeaderProps,
  LoginAndSingProps,
} from '../../../types/typesAuthScreens';
import Typography from '../../components/ui/Typography';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import { firebase } from '@react-native-firebase/auth';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { createUser, getUser } from '../../database/userFirebase';
import { CreateUserProps } from '../../../types/typesUserFirebase';

const screenWidth = Dimensions.get('window').width;
const screenHeigth = Dimensions.get('window').height;

interface HeaderLoginProps {
  backScreenCallback(): void,
  screen: number
}

export default function LoginAndSign({ route }: LoginAndSingProps) {
  const screenInitial = useSelector((state: RootState) => state.user.preRegister.screen);
  const [screen, setScreen] = useState(firebase.auth().currentUser?.uid ? 4 : 1);
  const [pushedButton, setPushedButton] = useState(false);
  const [dataLogin, setDataLogin] = useState({})
  const [loading, setLoading] = useState(false);
  const [buttonBloqued, setButtonBloqued] = useState(true);
  const Theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  const SignStatus = (req: { status: number; message: string } | undefined) => {
    if (req?.status === 200) {
      Toast.show({
        type: 'ToastPositive',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: req?.message,
        },
      });
      updateUserInfo()
    } else {
      Toast.show({
        text1: 'Error!',
        text2: req?.message,
        type: 'error',
        position: 'top',
        bottomOffset: 40,
      });
    }
  };

  const signUp = async (userData : CreateUserProps) => {
    setLoading(true);
    const req = await createUser({
      userName: userData.userName,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      birthDay: userData.birthDay,
      phone: userData.phone,
    });
    setLoading(false);
    SignStatus(req);
  };

  const updateUserInfo = async() => {
    const uid = firebase.auth().currentUser?.uid;
    const userStatus = await getUser(uid?uid:'');
    if(userStatus.status == 200){
      console.log('====================================');
      console.log("Vamos actualizar ");
      console.log('====================================');
      dispatch({
        type: 'setUserData',
        payload: { ...userStatus.userData, uid: uid?uid:'' },
      });
    }
  }
  const nextScreen = () => setPushedButton(!pushedButton);
  const prevScreen = () => {
    if(screen==4){
      setScreen(1);
      auth().signOut();
    }
    if (screen > 1 && screen !== 4) {
      setScreen(screen - 1)
    }
    
  };
  const blockedNext = (value: boolean) => {
    setButtonBloqued(value)
  }
  const changedScreen = (screenNumber?: number) => {
    if (!screenNumber) {
      if(screen<=8){
        setScreen(screen + 1)
        setButtonBloqued(true);
      }
    }
    else { setScreen(screenNumber) }
  };
  return (
    <KeyboardAvoidingWrapper
      styleKeyboardAvoiding={styles().backgroundKeyboardAvoiding}>
      <SafeAreaView style={styles().container}>
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />
        <HeaderLogin backScreenCallback={prevScreen} screen={screen} />
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Image source={Images.logo} style={styles().logoHeader} />
        </View>

        {screen === 1 || screen === 2 || screen === 3 ? (
          <Login SignStatus={SignStatus} status={screen} pushedButton={pushedButton} changedScreen={changedScreen} blockedNext={blockedNext} />
        ) : screen === 4 || screen === 5 || screen === 6 || screen === 7 || screen === 8 ? (
          <SignUp signUp={signUp} status={screen} blockedNext={blockedNext} />
        ) : null}
        <View style={styles().buttonsContainer}>
          <PrimaryButton loading={loading} text={screen != 8 ? 'Next' : 'Register'} accion={changedScreen} disabled={buttonBloqued} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}

function HeaderLogin({ backScreenCallback, screen }: HeaderLoginProps) {


  return (
    <View style={styles().contentHeader}>
      {
        screen === 1 ?
          (<></>) :
          <TouchableOpacity style={styles().backButtonContainer} onPress={backScreenCallback}>
            <Feather
              size={Dimensions.get('window').width / 12}
              name='arrow-left'
              color={Colors().CardInputText}
            />
          </TouchableOpacity>
      }
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      alignSelf: 'center',
      backgroundColor: Colors().background,
      flex: 1,
      width: '95%',
      marginTop: 20,
      height: screenHeigth,
      
    },
    contentHeader: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    logoHeader: {
      height: screenWidth / 9,
      marginTop: 30,
      marginBottom: 20,
      resizeMode: 'contain',
      width: screenWidth / 6,
    },
    title: {
      color: Colors().text,
      fontSize: 24,
      fontWeight: '600',
      marginTop: 20,
    },

    activeBtn: {
      backgroundColor: Colors().btnFocusSecondary,
      borderRadius: 50,
      padding: 15,
      width: '50%',
    },
    noActiveBtn: {
      backgroundColor: Colors().backgroundInputs,
      borderRadius: 50,
      padding: 15,
      width: '50%',
    },
    placeholder: {
      color: Colors().placeholder,
    },

    backgroundKeyboardAvoiding: {
      backgroundColor: Colors().background,
    },
    buttonsContainer: { bottom: 70, width: '60%', textAlign: 'center', paddingHorizontal: 24, alignSelf: 'center' },
    backButtonContainer: {
      position:'absolute',
      alignSelf: 'flex-start',
      paddingLeft: 20,
      zIndex:1
    }

  });