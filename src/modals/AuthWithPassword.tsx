import { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  EmailAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
} from 'firebase/auth';
import i18n from 'i18n-js';
import { RootStackParamList } from '../navigators/Stack';

import Colors from '../utils/Colors';
import { RootState } from '../redux/appReducer';

import Divider from '../components/Divider';

import { validationPassword } from '../utils/validation';
import { auth } from '../database/FirebaseConfig';
import SecondaryButton from '../components/buttons/SecondaryButton';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Loading from '../components/Loading';
import KeyboardSimpleWrapper from '../components/KeyboardSimpleWrapper';

import { AuthWithPasswordProps } from '../../types/typesModals';

function AuthWithPassword({ show, setShow, setIsAuth }: AuthWithPasswordProps) {
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState({
    error: false,
    errorText: '',
    value: '',
    show: false,
    filled: false,
  });

  const user = useSelector((state: RootState) => state.user.userData);

  const SigInWithPassword = async () => {
    try {
      setLoading(true);
      const cred = EmailAuthProvider.credential(user.email, password.value);
      const reauthenticate = await signInWithCredential(auth, cred);
      if (reauthenticate) {
        setIsAuth(true);
        setShow(false);
        Toast.show({
          type: 'ToastPositive',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastItsYou'),
          },
        });
      }
      setLoading(false);
    } catch (error) {
      const { message } = error as Error;
      console.log('error al autentificar con password', message);

      if (message.includes('wrong-password')) {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastWrongPassword'),
          },
        });
      }
      setLoading(false);
    }
  };

  const sendPasswordByEmail = async () => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, user.email);
      Toast.show({
        type: 'ToastPositive',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: i18n.t('toastSendEmailCheckSpam'),
        },
      });
      setLoading(false);
    } catch (error) {
      console.log('error al enviar email de password', error);
      Toast.show({
        type: 'ToastPositive',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: i18n.t('toastErrSomethingWrong'),
        },
      });
    }
  };

  return (
    <Modal
      animationType='slide'
      visible={show}
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        setShow(!show);
      }}>
      <TouchableOpacity
        style={styles().ModalBack}
        activeOpacity={1}
        onPress={() => {
          setShow(!show);
        }}>
        <KeyboardSimpleWrapper>
          <View style={styles().opcions}>
            <>
              <View style={styles().headerFormModal}>
                <Text style={styles().subTitleModal}>
                  {i18n.t('authWithPasswordModalSubTitle')}
                </Text>
                <Text style={styles().titleModal}>
                  {i18n.t('authWithPasswordModalTitle')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShow(false)}
                style={styles().closeBtn}>
                <Feather
                  name='x'
                  color={Colors().placeholderInverted}
                  size={20}
                />
              </TouchableOpacity>
              <Divider />
              <View style={styles().contentInputIcon}>
                <TextInput
                  placeholder={i18n.t('authWithPasswordModalPassword')}
                  placeholderTextColor={
                    password.error ? '#DC3030' : Colors().placeholder
                  }
                  style={styles().textInput}
                  value={password.value}
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
                  onPress={() =>
                    setPassword({ ...password, show: !password.show })
                  }>
                  <Feather
                    name={password.show ? 'eye-off' : 'eye'}
                    size={25}
                    color='#B3B9C5'
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendPasswordByEmail()}
                  style={{
                    width: '50%',
                    alignSelf: 'flex-end',
                    marginRight: 20,
                  }}>
                  <Text
                    style={{
                      color: Colors().text,
                      textAlign: 'right',
                      textDecorationLine: 'underline',
                    }}>
                    {i18n.t('authWithPasswordModalRecover')}
                  </Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <View style={styles().btnContainer}>
                  <Loading />
                </View>
              ) : (
                <View style={styles().btnContainer}>
                  <SecondaryButton
                    text={i18n.t('authWithPasswordModalButtonCancel')}
                    accion={() => {
                      setShow(false);
                      setPassword({
                        error: false,
                        errorText: '',
                        value: '',
                        show: false,
                        filled: false,
                      });
                    }}
                    double
                  />
                  <PrimaryButton
                    text={i18n.t('authWithPasswordModalButtonValidate')}
                    disabled={!password.filled}
                    accion={() => SigInWithPassword()}
                    rounded={false}
                    loading={loading}
                    double
                  />
                </View>
              )}
            </>
          </View>
        </KeyboardSimpleWrapper>
      </TouchableOpacity>
    </Modal>
  );
}

export default AuthWithPassword;

const styles = () =>
  StyleSheet.create({
    container: {},
    ModalBack: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    contentForm: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    text: {
      color: Colors().text,
      fontSize: 16,
      marginLeft: 20,
    },
    textBtn: {
      color: Colors().textBtnPrimary,
      fontSize: 16,
      marginLeft: 20,
      textAlign: 'center',
    },
    headerFormModal: {
      marginBottom: 10,
    },
    contentInputIcon: {
      width: '100%',
      position: 'relative',
      marginVertical: 20,
    },
    iconTextInput: {
      position: 'absolute',
      right: 30,
      top: 15,
    },
    opcions: {
      width: '100%',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      padding: 15,
      backgroundColor: Colors().background,
    },

    titleModal: {
      fontSize: 20,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: Colors().text,
    },
    subTitleModal: {
      fontSize: 12,
      fontWeight: '600',
      fontStyle: 'normal',
      textAlign: 'left',
      color: Colors().newPlaceHolder,
    },

    closeBtn: {
      position: 'absolute',
      right: 20,
      top: 20,
    },

    public: {
      padding: 10,
      backgroundColor: Colors().primary,
      width: '45%',
      borderRadius: 12,
    },
    textInput: {
      backgroundColor: Colors().backgroundInputs,
      width: '90%',
      alignSelf: 'center',
      padding: 15,
      fontSize: 18,
      borderRadius: 10,
      color: Colors().text,
    },
    membersContainer: {
      width: '90%',
      alignSelf: 'center',
      marginTop: 10,
    },
    selectGroupBtnContainer: {
      marginTop: 10,
      width: '90%',
      alignSelf: 'center',
    },
    selectGroupBtnExists: {
      width: '100%',
    },
    selectGroupBtn: {
      borderWidth: 1,
      width: '100%',
      padding: 10,
      borderRadius: 3,
      borderColor: Colors().borderInputVariant,
    },
    membersTitle: {
      color: Colors().placeholderInverted,
      fontSize: 16,
      fontWeight: '600',
      fontStyle: 'normal',
      lineHeight: 24,
      letterSpacing: 0,
      marginBottom: 15,
    },

    memberItemContainer: {
      position: 'relative',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    profileImage: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      borderWidth: 2,
      borderColor: Colors().primary,
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
  });
