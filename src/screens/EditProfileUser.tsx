import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser, updateEmail } from 'firebase/auth';
import Toast from 'react-native-toast-message';
// import * as ImagePicker from 'expo-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import { StackActions, useNavigation } from '@react-navigation/native';
import Colors from '../utils/Colors';
import TopBar from '../components/TopBar';
import { RootStackParamList } from '../navigators/Stack';
import CircleImage from '../components/CircleImage';
import { RootState } from '../redux/appReducer';
import {
  deleteUserFromDB,
  getUser,
  updatePhotoUser,
  updateUser,
  validateNickname,
} from '../database/userFirebase';
import { auth } from '../database/FirebaseConfig';
import AuthWithPassword from '../modals/AuthWithPassword';
import Loading from '../components/Loading';
import { validationEmail } from '../utils/validation';
import Icons from '../utils/Icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';

type profileScreenProp = StackNavigationProp<
  RootStackParamList,
  'EditProfileUser'
>;

export default function EditProfileUser() {
  const User = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showPassWordAuth, setShowPassWordAuth] = useState(false);
  const navigation = useNavigation<profileScreenProp>();
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  });

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
    setNickname({ ...nickname, filled: true, value: User.userData.nickname });
    setEmail({ ...email, filled: true, value: User.userData.email });
    setFirstname({ ...email, filled: true, value: User.userData.firstname });
    setLastname({ ...email, filled: true, value: User.userData.lastname });
    setbirthDay({ ...getBirthDay() });
    setPhoto(User.userData.photo);
  }, []);

  const getBirthDay = () => {
    const birthDay = new Date(User.userData.birthDay.seconds * 1000);
    const day =
      birthDay.getDate() <= 9 ? `0${birthDay.getDate()}` : birthDay.getDate();
    const month =
      birthDay.getMonth() + 1 <= 9
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
        })
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
     const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.1,
          videoQuality: 'low',
        });
    if (!result.didCancel) {
      let videoSrc = result.assets?result.assets[0]:{}
      const req = await updatePhotoUser({
        photo: videoSrc.uri?videoSrc.uri:'',
        uid: User.userData.uid,
      });
      if (req.status === 200) {
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
          getUserData();
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
    }
    setLoading(false);
  };

  const eliminateAccount = async() => {
    if(isAuth){
      let groups = User.userData.groups?User.userData.groups:[]
      if (groups.length==0) {
        if(auth.currentUser != null) {
          await deleteUser(auth.currentUser);
          await deleteUserFromDB(User.userData.uid);
        }
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastErrDeleteAccountGroups'),
          },
        });
      }
    } else {
      setShowPassWordAuth(!showPassWordAuth);
    }
  }

  return (
    <SafeAreaView style={styles().container}>
      <TopBar
        leftText={i18n.t('editProfileUserTitle')}
        rightButton
        rightButtonText={i18n.t('editProfileUserSave')}
        divider
        backButton
        backAction={() => {
          navigation.goBack();
        }}
        rightAction={updateInfoUser}
      />
      <ScrollView style={styles().content}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* TopCard */}
            <View style={[styles().card, styles().topCard]}>
              <TouchableOpacity style={styles().profilePic}>
                {/* ProfilePic */}
                {photo ? (
                  <TouchableOpacity onPress={selectImageFromGalley}>
                    <CircleImage source={{ uri: photo }} size={100} />
                    <Text style={styles().profilePicText}>
                      {i18n.t('editProfileUserTapToEdit')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={selectImageFromGalley}>
                    <View>
                      <Feather
                        size={Dimensions.get('window').width / 10}
                        name='user'
                        color={Colors().primary}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              <View style={styles().userInfo}>
                {/* User Info */}
                <Text style={styles().inputTitle}>{i18n.t('editProfileUserNickname')}</Text>
                {/* //! Cambiar por input de nickname */}
                <TextInput
                  placeholder={i18n.t('editProfileUserNickname')}
                  placeholderTextColor={Colors().placeholder}
                  editable={false}
                  style={[styles().textInput,{color:Colors().placeholder}]}
                  value={nickname.value}
                />
              </View>
            </View>
            {/* BottomCard */}
            <View style={[styles().card, styles().cardBottom]}>
              <Text style={styles().inputTitle}>
                {i18n.t('editProfileUserFirstName')}
              </Text>
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
              <Text style={styles().inputTitle}>
                {i18n.t('editProfileUserLastName')}
              </Text>
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
              <Text style={styles().inputTitle}>
                {i18n.t('editProfileUserEmail')}
              </Text>
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
              {/*
              <Text style={styles().inputTitle}>
                {i18n.t('editProfileUserPhoneNumber')}
              </Text>
               //! Agregar input de phone */}
              <Text style={styles().inputTitle}>
                {i18n.t('editProfileUserDateOfBirth')}
              </Text>
              <View style={[styles().textInput, { marginBottom: 15 }]}>
                <View style={styles().contentInputCalendar}>
                  <TextInput
                    placeholder='DD'
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
                    }}
                  />
                  <TextInput
                    placeholder='MM'
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
                    }}
                  />
                  <TextInput
                    placeholder='YYYY'
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
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[styles().option, styles().spaceBetween]}>
                <Text style={styles().optionText}>
                  {i18n.t('editProfileUserChangePassword')}
                </Text>
                <Icons
                  name='chevron-right'
                  color={Colors().placeholder}
                  size={30}
                />
              </TouchableOpacity>
              <View style={styles().divider} />
              <TouchableOpacity onPress={eliminateAccount} style={styles().outlineButton}>
                  <Text style={styles().textOutlineButton}>
                    {i18n.t('editProfileUserDeleteUserProfile')}
                  </Text>
                </TouchableOpacity>
            </View>
          </>
        )}
        <AuthWithPassword
          show={showPassWordAuth}
          setShow={setShowPassWordAuth}
          setIsAuth={setIsAuth}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors().BackgroundTernary,
    },
    content: {
      flex: 1,
      marginTop: 17,
      marginHorizontal: 10,
    },
    card: {
      backgroundColor: Colors().CardBackground,
      borderWidth: 1,
      borderColor: Colors().CardBorder,
      borderRadius: 8,
      marginBottom: 12,
    },
    spaceBetween: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    topCard: {
      flexDirection: 'row',
      paddingLeft: 20,
      paddingTop: 20,
      paddingBottom: 16,
      paddingRight: 15,
    },
    profilePicText: {
      textAlign: 'center',
      fontSize: 12,
      fontFamily: 'PlusJakartaSans-Bold',
      color: Colors().CardInputTitle,
      marginTop: 16,
    },
    profilePic: {
      alignItems: 'center',
    },
    userInfo: {
      flex: 1,
      marginLeft: 15,
    },
    inputTitle: {
      fontSize: 12,
      fontFamily: 'PlusJakartaSans-Bold',
      color: Colors().CardInputTitle,
      marginBottom: 10,
    },
    textInput: {
      backgroundColor: Colors().CardInputBackground,
      width: '100%',
      padding: 15,
      fontSize: 16,
      borderRadius: 8,
      color: Colors().CardInputText,
      borderWidth: 1,
      borderColor: Colors().CardBorder,
      fontFamily: 'PlusJakartaSans-Medium',
    },
    outlineButton: {
      borderRadius: 18,
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: '#e76a83',
      marginTop: 15,
      height: 36,
      justifyContent: 'center',
    },
    textOutlineButton: {
      fontSize: 13,
      fontFamily: 'PlusJakartaSans-Bold',
      color: '#e45975',
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    cardBottom: {
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    errorText: {
      textAlign: 'right',
      color: '#DC3030',
      width: '95%',
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
    contentInputCalendar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    divider: {
      borderBottomColor: Colors().CardBorder,
      borderBottomWidth: 1,
      marginVertical: 10,
    },
    option: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionText: {
      fontSize: 14,
      fontFamily: 'PlusJakartaSans-Bold',
      color: Colors().CardInputTitle,
    },
  });
