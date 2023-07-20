import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import Typography from '../../components/ui/Typography';
import auth, { FirebaseAuthTypes, firebase } from '@react-native-firebase/auth';
import PhoneInput from 'react-native-phone-number-input';
import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import Divider from '../../components/Divider';
import { singInUser } from '../../database/userFirebase';
import Colors from '../../utils/Colors';
import { validationEmail, validationPassword } from '../../utils/validation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/appReducer';
import { RootStackAuthParamList } from '../../navigators/StackAuth';
import Loading from '../../components/Loading';

import { SignInProps } from '../../../types/typesAuthScreens';
type LoginAndSignScreenProp = StackNavigationProp<
  RootStackAuthParamList,
  'LoginAndSign'
>;

function SignIn({ status, pushedButton, changedScreen, blockedNext }: SignInProps) {
  const [mounted, setMounted] = useState(false);
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const [phone, setPhone] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  });
  const [verificationCode, setVerificationCode] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  })


  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginAndSignScreenProp>();
  const phoneInputRef = useRef<PhoneInput>(null);
  const Theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(65);

  useEffect(() => {
    blockedNext(phone.value.length >= 10 && phone.value.length < 13 ? false : true);
    if (!mounted) {
      setMounted(true);
      return;
    }
    if(status===1){ //reset phone input
      setPhone({
        error: false,
        errorText: '',
        value: '',
        filled: false,
      })
    }
    if (status === 2) {
      setLoading(true)
      signInWithPhoneNumber();

    }
    else if (status === 3) {
      setLoading(true);
      confirmCode();
    }
  }, [status]);


  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const resendSms = () => {
    setConfirm(null);
    setLoading(true)
    signInWithPhoneNumber();
    setCounter(65);
  }

  async function signInWithPhoneNumber() {
    const confirmation = await auth().signInWithPhoneNumber(phone.value);
    setConfirm(confirmation);
    setLoading(true);

  }

  async function confirmCode() {
    try {
      const ingreso = await confirm?.confirm(verificationCode.value);
      const user = firebase.auth().currentUser?.uid;
      dispatch({ type: 'setPreRegister', payload: { uid: user, phone: phone.value, screenLogin: status } })
      changedScreen();
      setLoading(false);

    } catch (error) {
      setVerificationCode({
        ...verificationCode,
        filled: false,
        error: true,
        errorText: 'Invalid code.'
      })
      changedScreen(status - 1)
    }
  }
  const tittles = ['What is your phone number?', 'verification code'];

  return (
    <View style={styles().container}>
      <Typography variant='h1' children={tittles[status - 1]} customedStyles={styles().typography} />
      {
        status === 1 ?
          <>

            <PhoneInput
              placeholder={i18n.t('formPhoneScreenInput')}
              ref={phoneInputRef}
              withDarkTheme={Theme}
              withShadow
              textInputStyle={styles().textInput}
              textInputProps={{
                placeholderTextColor: Colors().placeholder,
              }}
              defaultCode='MX'
              textContainerStyle={{ backgroundColor: Colors().backgroundInputs, }}
              codeTextStyle={{ color: Colors().placeholder }}
              containerStyle={styles().contentInput}
              value={phone.value}
              onChangeFormattedText={(text) => {
                
                if (phone.value.length >= 10 && phone.value.length < 13) {
                  blockedNext(false)
                  setPhone({
                    ...phone,
                    filled: true,
                    value: text,
                    error: false,
                    errorText: ''
                  });
                } else {
                  setPhone({
                    ...phone,
                    filled: false,
                    value: text,
                    error: true,
                    errorText: 'Phone number is not valid.'
                  });
                  blockedNext(true)

                }
              }}
            />
            <Text style={styles().errorText}>{phone.errorText}</Text>
          </>
          :
          status === 2 && confirm ?
            <View>
              <TextInput
                placeholder={'000000'}
                placeholderTextColor={phone.error ? '#DC3030' : Colors().placeholder}
                style={styles().textInputCode}
                keyboardType='number-pad'
                maxLength={6}
                value={verificationCode.value}
                onChangeText={(text) => {
                  setVerificationCode({ ...verificationCode, value: text });
                  if (verificationCode.value.length >= 5) {
                    blockedNext(false)
                    setVerificationCode({
                      ...verificationCode,
                      error: false,
                      errorText: '',
                      filled: true,
                      value: text,
                    });
                  } else {
                    blockedNext(true)
                    setVerificationCode({
                      ...verificationCode,
                      filled: false,
                      value: text,
                      error: true,
                      errorText: 'Verification code must be 6 characters'
                    });
                  }
                }}
              />
              <Text style={styles().errorText}>{verificationCode.errorText}</Text>
              <View style={styles().descriptionHeader}>
                {counter != 0
                  ? <Text style={styles().counter}>{'00:' + (counter>=10?counter:'0'+counter)}</Text>
                  : <Text onPress={resendSms} style={styles().resend}>{"Resend"}</Text>}



              </View>
            </View>

            :
            status === 2 && loading ?
              <View style={styles().loadingContainer}>
                <Loading background='rgba(0,0,0,0)' />
              </View>
              : <>
                <View style={styles().loadingContainer}>
                  <Loading background='rgba(0,0,0,0)' />
                </View></>
      }


    </View >
  );
}

export default SignIn;

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors().background,
      justifyContent: 'flex-start',
      paddingBottom: 20,
      marginTop: '30%',
      width: '100%'
    },

    contentInput: {
      backgroundColor: Colors().backgroundInputs,
      width: '90%',
      marginTop: 30,
      alignSelf: 'center'
    },
    textInput: {
      backgroundColor: Colors().backgroundInputs,
      width: '90%',
      alignSelf: 'center',
      padding: 15,
      fontSize: 18,
      borderRadius: 10,
      marginTop: 0,
      color: Colors().text
    },


    textInputCode: {
      backgroundColor: Colors().backgroundInputs,
      width: '90%',
      alignSelf: 'center',
      padding: 15,
      fontSize: 18,
      borderRadius: 10,
      marginTop: 30,
      color: Colors().text,
    },
    errorText: {

      textAlign: 'right',
      color: '#DC3030',
      width: '95%',
      marginBottom: '20%',
      marginTop:5

    },
    textReset: {
      textAlign: 'center',
      width: '100%',
      color: Colors().text,
      marginTop: 50,
      fontWeight: Platform.OS === 'android' ? 'bold' : '600',
      marginBottom: 10,
    },
    btnContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
    },
    descriptionHeader: {
      fontSize: 16,
      fontWeight: '500',
      fontStyle: 'normal',
      letterSpacing: 0.29,
      color: Colors().text,
      textAlign: 'center',
      width: '75%',
      alignSelf: 'center',
    },
    loadingContainer: {
      marginTop: 1,
      alignSelf: 'center',
    },
    counter: {
      textAlign: 'center',
      color: Colors().text,
      fontWeight: Platform.OS === 'android' ? 'bold' : '600',
      marginTop: -10
    },

    resend: {
      textAlign: 'center',
      color: Colors().text,
      marginTop: '45%',
      fontWeight: Platform.OS === 'android' ? 'bold' : '600',
    },
    typography:{textAlign: 'center', width: '80%', alignSelf: 'center' }
  });
