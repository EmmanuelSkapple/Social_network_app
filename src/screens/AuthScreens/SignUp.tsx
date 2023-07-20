import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import {
  validationBirthdayDD,
  validationBirthdayMM,
  validationBirthdayYYYY,
  validationEmail,
  validationNickname,
  validationPassword,
} from '../../utils/validation';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import TermsAndCondicion from '../TermsAndCoditions';
import Colors from '../../utils/Colors';
import { createUser } from '../../database/userFirebase';
import { RootStackAuthParamList } from '../../navigators/StackAuth';
import { SignUpProps } from '../../../types/typesAuthScreens';
import { RootState } from '../../redux/appReducer';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '../../components/ui/Typography';
import { signOut } from 'firebase/auth';
import auth, { FirebaseAuthTypes, firebase } from '@react-native-firebase/auth';
import { Loader } from '../../components/Loader';

type initialScreenProp = StackNavigationProp<RootStackAuthParamList, 'InitialScreen'>;

function SignUp({ signUp, status, blockedNext }: SignUpProps) {
  const [userName, setUserName] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  });

  const [firstname, setFirstname] = useState({
    error: false,
    errorText: '',
    value: '',
    show: false,
    filled: false,
  });
  const [lastname, setLastname] = useState({
    error: false,
    errorText: '',
    value: '',
    show: false,
    filled: false,
  });
  const [email, setEmail] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  });

  const [birthDay, setbirthDay] = useState({
    error: false,
    errorText: '',
    day: '',
    month: '',
    year: '',
    filled: false,
  });
  const [loadingValidation, setLoadingValidation] = useState(false);
  const dayBthRef = useRef(null as any);
  const monthBthRef = useRef(null as any);
  const yearBthRef = useRef(null as any);
  const userPhone = useSelector((state: RootState) => state.user.preRegister.phone);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewCalendarInput, setViewCalendarInput] = useState(false);
  const navigation = useNavigation<initialScreenProp>();
  useEffect(() => {
    if (status === 8) {
      if (userName.value && firstname.value && lastname.value && email.value) {
        signUp({
          userName: userName.value,
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          birthDay: birthDay,
          phone: userPhone,
        });
      }
    }

    return () => {
      false;
    };
  }, [status]);

  return (
    <View style={styles().container}>
      <View style={{ flex: 1 }}>
        {status === 4 ? (
          <>
            <Typography
              variant='h1'
              children={'Create your username'}
              customedStyles={styles().typography}
            />
            <TextInput
              placeholder={'@username'}
              placeholderTextColor={userName.error ? '#DC3030' : Colors().placeholder}
              autoCapitalize='none'
              style={styles().textInputName}
              value={userName.value}
              onChangeText={async (text) => {
                blockedNext(true);
                //setUserName({ ...userName, value: text });
                if (await validationNickname(text)) {
                  setUserName({
                    ...userName,
                    error: true,
                    errorText: 'invalid nickname',
                    filled: false,
                    value: text,
                  });
                } else {
                  setUserName({
                    ...userName,
                    filled: true,
                    value: text,
                    error: false,
                    errorText: '',
                  });
                }
              }}
              onBlur={async () => {
                // Validate email
                setLoadingValidation(true);
                const error = await validationNickname(userName.value, true);

                if (error) {
                  blockedNext(true);
                  setUserName({
                    ...userName,
                    error: true,
                    filled: false,
                    errorText: error,
                  });
                } else {
                  blockedNext(false);
                  setUserName({
                    ...userName,
                    error: false,
                    filled: true,
                    errorText: '',
                  });
                }
                setLoadingValidation(false);
              }}
            />
            {loadingValidation ? (
              <ActivityIndicator size={30} style={{ marginTop: 10 }} />
            ) : (
              <Text style={styles().errorText}>{userName.errorText}</Text>
            )}
          </>
        ) : status === 5 ? (
          <>
            <Typography
              variant='h1'
              children={'What is your name?'}
              customedStyles={styles().typography}
            />
            <View style={styles().containerName}>
              <View style={styles().containerInput}>
                <TextInput
                  placeholder={'Matter name'}
                  placeholderTextColor={firstname.error ? '#DC3030' : Colors().placeholder}
                  style={styles().textInputName}
                  value={firstname.value}
                  onChangeText={(text) => {
                    setFirstname({ ...firstname, value: text });
                    if (text.length > 0 && lastname.value.length > 0) {
                      blockedNext(false);
                      setFirstname({
                        ...firstname,
                        error: false,
                        errorText: '',
                        filled: true,
                        value: text,
                      });
                    } else {
                      blockedNext(true);
                      setFirstname({
                        ...firstname,
                        filled: false,
                        value: text,
                        error: true,
                        errorText: '',
                      });
                    }
                  }}
                />

                <Text style={styles().errorText}>{firstname.errorText}</Text>
              </View>
              <View style={styles().containerInput}>
                <TextInput
                  placeholder={'last name'}
                  placeholderTextColor={firstname.error ? '#DC3030' : Colors().placeholder}
                  style={styles().textInputName2}
                  value={lastname.value}
                  onChangeText={(text) => {
                    setLastname({ ...lastname, value: text });
                    if (text.length > 0 && firstname.value.length > 0) {
                      blockedNext(false);
                      setLastname({
                        ...lastname,
                        error: false,
                        errorText: '',
                        filled: true,
                        value: text,
                      });
                    } else {
                      blockedNext(true);
                      setLastname({
                        ...lastname,
                        filled: false,
                        value: text,
                        error: true,
                        errorText: '',
                      });
                    }
                  }}
                />
                <Text style={styles().errorText}>{firstname.errorText}</Text>
              </View>
            </View>
          </>
        ) : status === 6 ? (
          <>
            <Typography
              variant='h1'
              children={'What is your email address?'}
              customedStyles={styles().typography}
            />
            <TextInput
              placeholder={'matter@mail.com'}
              placeholderTextColor={email.error ? '#DC3030' : Colors().placeholder}
              keyboardType='email-address'
              textContentType='emailAddress'
              autoCapitalize='none'
              style={styles().textInput}
              value={email.value}
              onChangeText={(text) => {
                setEmail({ ...email, value: text });
                if (!validationEmail(text)) {
                  blockedNext(false);
                  setEmail({
                    ...email,
                    error: false,
                    errorText: '',
                    filled: true,
                    value: text,
                  });
                } else {
                  blockedNext(true);
                  setEmail({
                    ...email,
                    filled: false,
                    value: text,
                    error: true,
                    errorText: 'invalid email',
                  });
                }
              }}
              onBlur={() => {
                // Validate email
                const error = validationEmail(email.value);
                if (error) {
                  setEmail({
                    ...email,
                    error: true,
                    errorText: error,
                  });
                } else {
                  setEmail({
                    ...email,
                    error: false,
                    errorText: '',
                  });
                }
              }}
            />
            <Text style={styles().errorText}>{email.errorText}</Text>
          </>
        ) : status === 7 ? (
          <>
            <Typography
              variant='h1'
              children={'Date of your birthday'}
              customedStyles={styles().typography}
            />

            <View style={styles().textInput}>
              {!viewCalendarInput ? (
                <TouchableOpacity onPress={() => setViewCalendarInput(!viewCalendarInput)}>
                  <Text style={{ color: Colors().placeholder, fontSize: 18 }}>
                    {i18n.t('signUpScreenBirthday')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles().contentInputCalendar}>
                  <TextInput
                    placeholder='DD'
                    ref={dayBthRef}
                    placeholderTextColor={Colors().placeholder}
                    style={styles().textInputSmall}
                    maxLength={2}
                    keyboardType='numeric'
                    value={birthDay.day}
                    onChangeText={(text) => {
                      setbirthDay({
                        ...birthDay,
                        day: text,
                      });
                      if (!validationBirthdayDD(text)) {
                        setbirthDay({
                          ...birthDay,
                          error: false,
                          errorText: '',
                          filled: true,
                          day: text,
                        });
                      } else {
                        setbirthDay({
                          ...birthDay,
                          filled: false,
                          day: text,
                        });
                      }
                      text.length === 2 && monthBthRef.current.focus();
                    }}
                    onBlur={() => {
                      // Validate birthday DD
                      const error = validationBirthdayDD(birthDay.day);
                      if (error) {
                        blockedNext(true);
                        setbirthDay({
                          ...birthDay,
                          error: true,
                          errorText: error,
                        });
                      } else {
                        blockedNext(false);

                        setbirthDay({
                          ...birthDay,
                          error: false,
                          errorText: '',
                        });
                      }
                    }}
                  />
                  <TextInput
                    placeholder='MM'
                    ref={monthBthRef}
                    placeholderTextColor={Colors().placeholder}
                    maxLength={2}
                    keyboardType='numeric'
                    style={styles().textInputSmall}
                    value={birthDay.month}
                    onChangeText={(text) => {
                      setbirthDay({
                        ...birthDay,
                        month: text,
                      });
                      if (!validationBirthdayMM(text)) {
                        setbirthDay({
                          ...birthDay,
                          error: false,
                          errorText: '',
                          filled: true,
                          month: text,
                        });
                      } else {
                        setbirthDay({
                          ...birthDay,
                          filled: false,
                          month: text,
                        });
                      }
                      text.length === 2 && yearBthRef.current.focus();
                      text.length === 0 && dayBthRef.current.focus();
                    }}
                    onBlur={() => {
                      // Validate birthday MM
                      const error = validationBirthdayMM(birthDay.month);
                      if (error) {
                        setbirthDay({
                          ...birthDay,
                          error: true,
                          errorText: error,
                        });
                      } else {
                        setbirthDay({
                          ...birthDay,
                          error: false,
                          errorText: '',
                        });
                      }
                    }}
                  />
                  <TextInput
                    placeholder='YYYY'
                    ref={yearBthRef}
                    placeholderTextColor={Colors().placeholder}
                    maxLength={4}
                    keyboardType='numeric'
                    style={styles().textInputSmall}
                    value={birthDay.year}
                    onChangeText={(text) => {
                      setbirthDay({
                        ...birthDay,
                        year: text,
                      });
                      if (!validationBirthdayYYYY(text)) {
                        setbirthDay({
                          ...birthDay,
                          error: false,
                          errorText: '',
                          filled: true,
                          year: text,
                        });
                      } else {
                        setbirthDay({
                          ...birthDay,
                          filled: false,
                          year: text,
                        });
                      }
                      text.length === 0 && monthBthRef.current.focus();
                    }}
                    onBlur={() => {
                      // Validate birthday YYYY
                      const error = validationBirthdayYYYY(birthDay.year);
                      if (error) {
                        setbirthDay({
                          ...birthDay,
                          error: true,
                          errorText: error,
                        });
                      } else {
                        setbirthDay({
                          ...birthDay,
                          error: false,
                          errorText: '',
                        });
                      }
                    }}
                  />
                </View>
              )}
            </View>
            <Text style={styles().errorText}>{birthDay.errorText}</Text>
          </>
        ) : status === 8 ? (
          <Loader text='Creating user' progress={1}  />
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

export default SignUp;

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors().background,
      justifyContent: 'space-between',
      paddingBottom: 20,
      marginTop: 30,
    },

    contentInputCalendar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },

    textInput: {
      backgroundColor: Colors().backgroundInputs,
      width: '90%',
      alignSelf: 'center',
      padding: 15,
      fontSize: 18,
      borderRadius: 10,
      marginBottom: 0,
      color: Colors().text,
      marginTop: 50,
    },
    textInputName: {
      backgroundColor: Colors().backgroundInputs,
      width: '95%',
      alignSelf: 'center',
      padding: 15,
      fontSize: 18,
      borderRadius: 10,
      marginBottom: 0,
      color: Colors().text,
      marginTop: 50,
    },
    textInputName2: {
      backgroundColor: Colors().backgroundInputs,
      width: '95%',
      alignSelf: 'center',
      padding: 15,
      fontSize: 18,
      borderRadius: 10,
      marginBottom: 0,
      color: Colors().text,
      marginTop: 50,
    },
    containerInput: {
      flex: 1,
      justifyContent: 'center',
    },
    containerName: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '90%',
      alignSelf: 'center',
    },
    textInputSmall: {
      backgroundColor: Colors().backgroundInputs,
      width: '30%',
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 18,
      borderRadius: 10,
      marginBottom: 0,
      color: Colors().text,
    },
    errorText: {
      textAlign: 'right',
      color: '#DC3030',
      width: '95%',
      marginBottom: 5,
    },
    termsLinkContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginTop: 20,
    },
    termText: {
      fontSize: 12,
      color: Colors().text,
      marginRight: 5,
    },
    termLink: {
      fontSize: 12,
      color: Colors().primary,
      textDecorationLine: 'underline',
    },
    btnContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
    },
    typography: { textAlign: 'center' },
  });
