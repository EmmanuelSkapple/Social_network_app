import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';

import { StatusBar } from 'expo-status-bar';
import PhoneInput from 'react-native-phone-number-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from 'i18n-js';
import { login, verify } from '../../services/AuthSMS';
import {
  getUser,
  updatePhoneUser,
  validateNumberPhone,
} from '../../database/userFirebase';
// eslint-disable-next-line import/no-cycle
import { RootStackOnBoarding } from '../../navigators/StackOnBoarding';
import { RootState } from '../../redux/appReducer';
import Loading from '../../components/Loading';
import Colors from '../../utils/Colors';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {
  FormPhoneProps,
  FormCodePhoneProps,
} from '../../../types/typesOnBoardingScreens';

type onBoardingPhoneProps = StackNavigationProp<
  RootStackOnBoarding,
  'OnboardingPhone'
>;

function FormPhone({ onChangeText, phone, phoneInputRef }: FormPhoneProps) {
  const Theme = useSelector((state: RootState) => state.theme);

  return (
    <View style={styles().headerContent}>
      <View style={styles().headerItem}>
        <Text style={styles().titleHeader}>
          {i18n.t('formPhoneScreenTitle')}
        </Text>
        <Text style={styles().descriptionHeader}>
          {i18n.t('formPhoneScreenDescription')}
        </Text>
      </View>
      <View>
        <View style={styles().divider} />
        <PhoneInput
          placeholder={i18n.t('formPhoneScreenInput')}
          ref={phoneInputRef}
          withDarkTheme={Theme}
          withShadow
          textInputStyle={styles().textInput}
          textInputProps={{
            placeholderTextColor: Colors().placeholder,
          }}
          defaultCode='US'
          textContainerStyle={{ backgroundColor: Colors().backgroundInputs }}
          codeTextStyle={{ color: Colors().placeholder }}
          containerStyle={styles().contentInput}
          value={phone.value}
          onChangeText={(text) => {
            onChangeText({ ...phone, value: text });
            if (phone.value.length >= 8) {
              onChangeText({
                ...phone,
                filled: true,
                value: text,
              });
            } else {
              onChangeText({
                ...phone,
                filled: false,
                value: text,
              });
            }
          }}
          onChangeFormattedText={(text) => {
            onChangeText({ ...phone, value: text });
            if (phone.value.length >= 8) {
              onChangeText({
                ...phone,
                filled: true,
                value: text,
              });
            } else {
              onChangeText({
                ...phone,
                filled: false,
                value: text,
              });
            }
          }}
        />
      </View>
    </View>
  );
}

function FormCodePhone({
  onChangeText,
  phone,
  codeSms,
  resendCode,
}: FormCodePhoneProps) {
  const [counter, setCounter] = useState(60);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return (
    <View style={styles().headerContent}>
      <View style={styles().headerItem}>
        <Text style={styles().titleHeader}>{phone.value}</Text>
        <Text style={styles().descriptionHeader}>
          {i18n.t('formCodePhoneScreenDesc')}
        </Text>
      </View>
      <View>
        <View style={styles().divider} />
        <TextInput
          placeholder='Sms Code'
          placeholderTextColor={Colors().placeholder}
          style={styles().textInputCode}
          keyboardType='number-pad'
          value={codeSms.value}
          onChangeText={(text) => {
            onChangeText({ ...codeSms, value: text });
            if (codeSms.value.length >= 5) {
              onChangeText({
                ...codeSms,
                error: false,
                errorText: '',
                filled: true,
                value: text,
              });
            } else {
              onChangeText({
                ...codeSms,
                filled: false,
                value: text,
              });
            }
          }}
        />
        <Text style={styles().errorText}>{codeSms.errorText}</Text>
        <Text style={styles().descriptionHeader}>
          {counter != 0
            ? i18n.t('formCodePhoneScreenSend')
            : i18n.t('formCodePhoneScreenResendReady')}
          {counter != 0 && ` ${counter} `}
          {counter != 0 && i18n.t('formCodePhoneScreenSeconds')}
        </Text>
      </View>
      <View style={styles().btnContainer}>
        <PrimaryButton
          accion={() => {
            setCounter(60);
            resendCode(phone.value);
          }}
          text={i18n.t('formCodePhoneScreenReSendCode')}
          disabled={counter != 0}
        />
      </View>
    </View>
  );
}

export default function ProfileUser() {
  const User = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(0);
  const [phone, setPhone] = useState({
    value: '',
    filled: false,
  });
  const [codeSms, setCodeSms] = useState({
    value: '',
    filled: false,
    errorText: '',
  });
  const [phoneIsReady, setPhoneIsReady] = useState(false);
  const [countryCode, setCountryCode] = useState('' as any);
  const [phoneFormatted, setPhoneFormatted] = useState('');
  const Theme = useSelector((state: RootState) => state.theme);
  const navigation = useNavigation<onBoardingPhoneProps>();
  const dispatch = useDispatch();
  const phoneInputRef = useRef<PhoneInput>(null);

  useEffect(() => {
    setLoading(true);
    checkUserPhone();
    if (phoneIsReady) {
      navigation.navigate('OnboardingPhoto');
    } else {
      setLoading(false);
    }
  }, [phoneIsReady]);

  const checkUserPhone = () => {
    if (User.userData.phone) {
      setPhoneIsReady(true);
    }
  };

  const validPhoneFromDB = async () => {
    let { isValid } = await validateNumberPhone(phone.value);
    return isValid;
  };

  const validatePhone = async () => {
    setLoading(true);
    const checkValid = phoneInputRef.current?.isValidNumber(phone.value);
    if (await validPhoneFromDB()) {
      if (checkValid) {
        setCountryCode(phoneInputRef.current?.getCountryCode());
        setForm(1);
        const phoneNumber = phone.value.replace('+', '');
        setPhoneFormatted(phoneNumber);
        try {
          const res = await login(phoneNumber);
          if (res?.status === 200) {
            console.log('verification sended +++');
          } else {
            console.log('verification not sended +++');
          }
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastNumberPhoneIsNotValid'),
          },
        });
        setLoading(false);
      }
    } else {
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: i18n.t('toastNumberPhoneIsReadyUsed'),
        },
      });
      setLoading(false);
    }
  };

  const btnSingOur = () => {
    auth().signOut();
    dispatch({ type: 'setUserData', payload: {} });
  };

  const updateUserPhone = async () => {
    try {
      const res = await verify(phoneFormatted, codeSms.value);
      if (res?.status === 200) {
        Toast.show({
          type: 'ToastPositive',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastPhoneVerified'),
          },
        });
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastPhoneInvalidCode'),
          },
        });
      }

      if (codeSms.value.length >= 5) {
        setLoading(true);
        const req = await updatePhoneUser({
          phone: phone.value,
          countryCode,
          uid: User.userData.uid,
        });
        if (req.status === 200) {
          const userStatus = await getUser(User.userData.uid);
          if (userStatus.status === 200) {
            navigation.navigate('OnboardingPhoto');
            dispatch({
              type: 'setUserData',
              payload: { ...userStatus.userData, uid: User.userData.uid },
            });
          } else {
            Toast.show({
              type: 'ToastError',
              props: {
                hide: () => {
                  Toast.hide();
                },
                message: i18n.t('toastTryLater'),
              },
            });
          }
        } else {
          Toast.show({
            type: 'ToastError',
            props: {
              hide: () => {
                Toast.hide();
              },
            },
          });
        }
        setLoading(false);
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastCodeIncorrect'),
          },
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
        },
      });
    }
  };

  const resendCode = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const res = await login(phoneNumber);
      if (res?.status === 200) {
        console.log('verification sended +++');
      } else {
        console.log('verification not sended +++');
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles().container}>
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />
      <View style={styles().navigationHeader}>
        <TouchableOpacity
          onPress={() => (form === 1 ? setForm(0) : btnSingOur())}>
          <Feather color={Colors().text} size={40} name='chevron-left' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            loading ? null : form === 1 ? updateUserPhone() : validatePhone()
          }
          style={[
            styles().botonNext,
            phone.filled ? { backgroundColor: Colors().primary } : {},
          ]}>
          {loading ? (
            <Loading background='rgba(0,0,0,0)' />
          ) : (
            <Text style={styles().textBotonNext}>
              {i18n.t('formPhoneScreenButton')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {form === 0 ? (
        <FormPhone
          onChangeText={setPhone}
          phone={phone}
          phoneInputRef={phoneInputRef}
        />
      ) : form === 1 ? (
        <FormCodePhone
          onChangeText={setCodeSms}
          phone={phone}
          codeSms={codeSms}
          resendCode={resendCode}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = () =>
  StyleSheet.create({
    textHeader: {
      fontSize: 20,
      fontWeight: Platform.OS === 'android' ? 'normal' : '600',
      textAlign: 'center',
      color: Colors().text,
      width: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: Colors().BackgroundTernary,
      paddingTop: 20,
    },

    headerContent: {
      marginTop: 15,
      paddingTop: 30,
      backgroundColor: Colors().BackgroundTernary,
      flex: 1,
    },
    headerItem: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInputCode: {
      backgroundColor: Colors().backgroundInputs,
      width: '90%',
      alignSelf: 'center',
      padding: 15,
      fontSize: 18,
      borderRadius: 10,
      marginTop: 24,
      color: Colors().text,
    },
    titleHeader: {
      fontSize: 20,
      fontWeight: '600',
      fontStyle: 'normal',
      letterSpacing: 0,
      color: Colors().text,
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
      marginTop: 10,
      marginBottom: 30,
    },
    botonNext: {
      width: 88,
      height: 35,
      borderRadius: 5,
      backgroundColor: Colors().placeholder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textBotonNext: {
      fontSize: 16,
      fontWeight: '600',
      fontStyle: 'normal',
      letterSpacing: 0,
      textAlign: 'center',
      color: Colors().textBtnPrimary,
    },

    navigationHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      width: '95%',
      backgroundColor: Colors().BackgroundTernary,
    },
    formEditContainer: {
      flex: 1,
      marginTop: 29,
    },
    contentInputIcon: {
      width: '100%',
      position: 'relative',
    },
    contentInputCalendar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    contentInput: {
      backgroundColor: Colors().backgroundInputs,
      width: '90%',
      alignSelf: 'center',
    },
    textInput: {
      backgroundColor: Colors().backgroundInputs,
      fontSize: 18,
      color: Colors().text,
      borderColor: Colors().borderInputVariant,
    },

    errorText: {
      textAlign: 'right',
      color: Colors().text,
      width: '95%',
    },
    profileImage: {
      width: Dimensions.get('window').width / 3,
      height: Dimensions.get('window').width / 3,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      borderWidth: 2,
      borderColor: Colors().primary,
    },
    btnContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    divider: {
      backgroundColor: Colors().dividerBackGround,
      width: '90%',
      height: 1,
      alignSelf: 'center',
    },
  });
