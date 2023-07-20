import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { StackActions, useNavigation } from '@react-navigation/native';
// import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { updateEmail } from 'firebase/auth';
import i18n from 'i18n-js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validationEmail, validationPassword } from '../utils/validation';

import CircleImage from '../components/CircleImage';
import Colors from '../utils/Colors';
import { RootState } from '../redux/appReducer';

import { RootStackParamList } from '../navigators/Stack';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { getUser, updatePhotoUser, updateUser } from '../database/userFirebase';

import { auth } from '../database/FirebaseConfig';
import AuthWithPassword from '../modals/AuthWithPassword';
import TopBar from '../components/TopBar';
import Loading from '../components/Loading';

type profileScreenProp = StackNavigationProp<
  RootStackParamList,
  'EditProfileUser'
>;

const screenWidth = Dimensions.get('window').width;

export default function ProfileUser() {
  const navigation = useNavigation<profileScreenProp>();

  return (
    <SafeAreaView style={styles().container}>
      <TopBar
        leftText={i18n.t('editProfileUserTitle')}
        backButton
        backAction={() => {
          navigation.goBack();
        }}
        rightButton
        rightAction={() => {}}
        rightButtonText={i18n.t('editProfileUserSave')}
        rightButtonPrimary={false}
        divider
      />
      <ProfileData />
    </SafeAreaView>
  );
}

function ProfileData() {
  const User = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showPassWordAuth, setShowPassWordAuth] = useState(false);
  const navigation = useNavigation<profileScreenProp>();
  const dispatch = useDispatch();

  const [email, setEmail] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  });

  const [password, setPassword] = useState({
    error: false,
    errorText: '',
    value: '',
    show: false,
    filled: false,
  });

  const [firstname, setFirstname] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: true,
  });
  const [lastname, setLastname] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  });
  const [birthDay, setbirthDay] = useState({
    day: '',
    month: '',
    year: '',
  });
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    setEmail({ ...email, filled: true, value: User.userData.email });
    setFirstname({ ...email, filled: true, value: User.userData.firstname });
    setLastname({ ...email, filled: true, value: User.userData.lastname });
    setbirthDay({ ...getBirthDay() });
    setPhoto(User.userData.photo);
  }, []);

  const getBirthDay = () => {
    const birthDay = new Date(User.userData.birthDay.seconds * 1000);
    const day = birthDay.getDate() <= 9 ? `0${birthDay.getDate()}` : birthDay.getDate();
    const month = birthDay.getMonth() + 1 <= 9
      ? `0${birthDay.getMonth() + 1}`
      : birthDay.getMonth() + 1;
    return {
      day: day.toString(),
      month: month.toString(),
      year: birthDay.getFullYear().toString(),
    };
  };

  const updateInfoUser = async () => {
    try {
      setLoading(true);
      if (isAuth) {
        const status = await updateEmailAuth(User.userData.email, email.value);
        if (status === 200) {
          const req = await updateUser({
            email: email.value,
            birthDay,
            firstname: firstname.value,
            lastname: lastname.value,
            photo,
            uid: User.userData.uid,
          });
          if (req.status === 200) {
            getUserData();
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
        }
      } else {
        setShowPassWordAuth(!showPassWordAuth);
      }
      setLoading(false);
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

  const getUserData = async () => {
    const userStatus = await getUser(User.userData.uid);
    if (userStatus.status === 200) {
      Toast.show({
        type: 'ToastPositive',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: i18n.t('toastProfileUpdate'),
        },
      });
      dispatch({
        type: 'setUserData',
        payload: { ...userStatus.userData, uid: User.userData.uid },
      });
      navigation.dispatch(
        StackActions.replace('TabNavigator', {
          screen: 'Profile',
        }),
      );
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
  };

  const updateEmailAuth = async (oldEmail: string, newEmail: string) => {
    try {
      if (oldEmail !== newEmail) {
        await updateEmail(auth.currentUser as any, newEmail);
      }
      return 200;
    } catch (error) {
      console.log('error al actualizar email', error);
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: i18n.t('toastErrUpdateEmail'),
        },
      });
    }
  };

  const selectImageFromGalley = async () => {
    // setLoading(true);
    // const image = (await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 0.2,
    // })) as any;

    // const req = await updatePhotoUser({
    //   photo: image.uri,
    //   uid: User.userData.uid,
    // });
    // if (req.status === 200) {
    //   const userStatus = await getUser(User.userData.uid);
    //   if (userStatus.status === 200) {
    //     Toast.show({
    //       type: 'ToastPositive',
    //       props: {
    //         hide: () => {
    //           Toast.hide();
    //         },
    //         message: i18n.t('toastProfileUpdate'),
    //       },
    //     });
    //     dispatch({
    //       type: 'setUserData',
    //       payload: { ...userStatus.userData, uid: User.userData.uid },
    //     });
    //     getUserData();
    //   } else {
    //     Toast.show({
    //       type: 'ToastError',
    //       props: {
    //         hide: () => {
    //           Toast.hide();
    //         },
    //         message: i18n.t('toastTryLater'),
    //       },
    //     });
    //   }
    // } else {
    //   Toast.show({
    //     type: 'ToastError',
    //     props: {
    //       hide: () => {
    //         Toast.hide();
    //       },
    //     },
    //   });
    // }
    // setLoading(false);
  };

  return (
    <View style={styles().headerContent}>
      {loading ? (
        <Loading />
      ) : (
        <View style={styles().headerItem}>
          {photo ? (
            <TouchableOpacity onPress={selectImageFromGalley}>
              <CircleImage source={{ uri: photo }} size={100} />
              {/* <View style={styles().iconEdit}>
                <Ionicons
                  size={20}
                  name="camera"
                  color={Colors().placeholder}
                />
              </View> */}
              <Text style={styles().headerEditText}>Tap to Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={selectImageFromGalley}>
              <View style={styles().profileImage}>
                <Feather
                  size={Dimensions.get('window').width / 10}
                  name="user"
                  color={Colors().primary}
                />
              </View>
              {/* <View style={styles().iconEdit}>
                <Ionicons
                  size={20}
                  name="camera"
                  color={Colors().placeholder}
                />
              </View> */}
            </TouchableOpacity>
          )}
        </View>
      )}
      <KeyboardAvoidingWrapper>
        <View style={styles().formEditContainer}>
          <View>
            <TextInput
              placeholder={i18n.t('editProfileUserFirstName')}
              placeholderTextColor={
                firstname.error ? '#DC3030' : Colors().placeholder
              }
              style={styles().textInput}
              value={firstname.value}
              onChangeText={(text) => {
                setFirstname({ ...firstname, value: text });
                if (!(text.length < 1)) {
                  setFirstname({
                    ...firstname,
                    error: false,
                    errorText: '',
                    filled: true,
                    value: text,
                  });
                } else {
                  setFirstname({
                    ...firstname,
                    filled: false,
                    value: text,
                  });
                }
              }}
            />
            <Text style={styles().errorText}>{firstname.errorText}</Text>
            <TextInput
              placeholder={i18n.t('editProfileUserLastName')}
              placeholderTextColor={
                lastname.error ? '#DC3030' : Colors().placeholder
              }
              style={styles().textInput}
              value={lastname.value}
              onChangeText={(text) => {
                setLastname({ ...lastname, value: text });
                if (!(text.length < 1)) {
                  setLastname({
                    ...lastname,
                    error: false,
                    errorText: '',
                    filled: true,
                    value: text,
                  });
                } else {
                  setLastname({
                    ...lastname,
                    filled: false,
                    value: text,
                  });
                }
              }}
            />
            <Text style={styles().errorText}>{lastname.errorText}</Text>
            <TextInput
              placeholder={i18n.t('editProfileUserEmail')}
              placeholderTextColor={
                email.error ? '#DC3030' : Colors().placeholder
              }
              style={styles().textInput}
              value={email.value}
              onChangeText={(text) => {
                setEmail({ ...email, value: text });
                if (!validationEmail(text)) {
                  setEmail({
                    ...email,
                    error: false,
                    errorText: '',
                    filled: true,
                    value: text,
                  });
                } else {
                  setEmail({
                    ...email,
                    filled: false,
                    value: text,
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
            <View style={[styles().textInput, { marginBottom: 15 }]}>
              <View style={styles().contentInputCalendar}>
                <TextInput
                  placeholder="DD"
                  placeholderTextColor={Colors().placeholder}
                  style={styles().textInputSmall}
                  maxLength={2}
                  keyboardType="numeric"
                  value={birthDay.day}
                  onChangeText={(text) => {
                    setbirthDay({
                      ...birthDay,
                      day: text,
                    });
                  }}
                />
                <TextInput
                  placeholder="MM"
                  placeholderTextColor={Colors().placeholder}
                  maxLength={2}
                  keyboardType="numeric"
                  style={styles().textInputSmall}
                  value={birthDay.month}
                  onChangeText={(text) => {
                    setbirthDay({
                      ...birthDay,
                      month: text,
                    });
                  }}
                />
                <TextInput
                  placeholder="YYYY"
                  placeholderTextColor={Colors().placeholder}
                  maxLength={4}
                  keyboardType="numeric"
                  style={styles().textInputSmall}
                  value={birthDay.year}
                  onChangeText={(text) => {
                    setbirthDay({
                      ...birthDay,
                      year: text,
                    });
                  }}
                />
              </View>
            </View>
            <View style={styles().contentInputIcon}>
              <TextInput
                placeholder={i18n.t('editProfileUserPassword')}
                placeholderTextColor={
                  email.error ? '#DC3030' : Colors().placeholder
                }
                style={styles().textInput}
                value={password.value}
                editable={false}
                secureTextEntry={!password.show}
                onChangeText={(text) => {
                  setPassword({ ...password, value: text });
                  if (!validationPassword(text)) {
                    setPassword({
                      ...password,
                      error: false,
                      errorText: '',
                      filled: true,
                      value: text,
                    });
                  } else {
                    setPassword({
                      ...password,
                      filled: false,
                      value: text,
                    });
                  }
                }}
                onBlur={() => {
                  // Validate password
                  const error = validationPassword(password.value);
                  if (error) {
                    setPassword({
                      ...password,
                      error: true,
                      errorText: error,
                    });
                  } else {
                    setPassword({
                      ...password,
                      error: false,
                      errorText: '',
                    });
                  }
                }}
              />
              <TouchableOpacity
                style={styles().iconTextInput}
                onPress={() => setPassword({ ...password, show: !password.show })}
              >
                <Feather
                  name={password.show ? 'eye-off' : 'eye'}
                  size={25}
                  color="#B3B9C5"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: '100%' }}>
            <View style={styles().btnContainer}>
              <PrimaryButton
                text={i18n.t('editProfileUserSave')}
                disabled={
                  !email.filled
                  || !firstname.filled
                  || !lastname.filled
                  || birthDay.day.length <= 1
                  || birthDay.month.length <= 1
                  || birthDay.year.length <= 3
                }
                accion={() => updateInfoUser()}
                rounded={false}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
      <AuthWithPassword
        show={showPassWordAuth}
        setShow={setShowPassWordAuth}
        setIsAuth={setIsAuth}
      />
    </View>
  );
}

const styles = () => StyleSheet.create({
  textHeader: {
    fontSize: 20,
    fontWeight: Platform.OS === 'android' ? 'normal' : '600',
    textAlign: 'center',
    color: Colors().text,
  },
  container: {
    flex: 1,
    backgroundColor: Colors().background,
  },
  headerEditText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    textAlign: 'center',
  },
  headerContent: {
    paddingTop: 30,
    backgroundColor: Colors().BackgroundSecondary,
    flex: 1,
  },
  headerItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 130,
  },

  iconEdit: {
    backgroundColor: Colors().btnFocusSecondary,
    borderWidth: 1,
    borderColor: Colors().placeholder,
    position: 'absolute',
    padding: 5,
    borderRadius: 50,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth / 8.8,
    height: screenWidth / 8.8,
  },

  navigationHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '95%',
    backgroundColor: Colors().background,
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
  iconTextInput: {
    position: 'absolute',
    right: 30,
    top: -35,
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
    borderWidth: 1,
    borderColor: Colors().borderInputVariant,
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
    borderColor: Colors().borderInputVariant,
  },
  errorText: {
    textAlign: 'right',
    color: '#DC3030',
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
  },
});
