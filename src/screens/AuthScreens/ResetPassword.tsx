import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TextInput,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { sendPasswordResetEmail } from 'firebase/auth';
import i18n from 'i18n-js';
import { validationEmail } from '../../utils/validation';
import { auth } from '../../database/FirebaseConfig';

import Colors from '../../utils/Colors';
import images from '../../utils/Images';
import { RootState } from '../../redux/appReducer';

import { RootStackAuthParamList } from '../../navigators/StackAuth';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import TopBar from '../../components/TopBar';

type resetPasswordScreenProp = StackNavigationProp<
  RootStackAuthParamList,
  'ResetPassword'
>;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// interface PostsHeader {
//   postLength: number;
//   btnActive: string;
//   callBackViewPost: (type: string) => void;
// }

export default function ProfileUser() {
  return (
    <SafeAreaView style={styles().container}>
      <TopBar
        css={{ paddingBottom: 30 }}
        centerText={i18n.t('resetPasswordScreenTitle')}
        divider
      />
      <ResetPassword />
    </SafeAreaView>
  );
}

function ResetPassword() {
  // const User = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<resetPasswordScreenProp>();

  const [email, setEmail] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  });

  const sendResetPassword = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email.value)
      .then(() => {
        setLoading(false);
        navigation.goBack();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: i18n.t('toastWeSendEmail'),
        });
      })
      .catch((error: any) => {
        console.log(error);
        setLoading(false);
        if (error.toString().includes('user-not-found')) {
          Toast.show({
            type: 'error',
            text1: 'Success',
            text2: i18n.t('toastUserNotFound'),
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Success',
            text2: i18n.t('toastTryLater'),
          });
        }
      });
  };

  return (
    <SafeAreaView style={styles().headerContent}>
      <View style={styles().headerItem}>
        <Image style={styles().imageReset} source={images.logo} />
      </View>
      <KeyboardAvoidingWrapper>
        <View style={styles().formEditContainer}>
          <Text style={styles().textReset}>
            {i18n.t('resetPasswordScreenDescription1')}
          </Text>
          <Text style={[styles().textReset, { marginBottom: 25 }]}>
            {i18n.t('resetPasswordScreenDescription2')}
          </Text>
          <View>
            <TextInput
              placeholder={i18n.t('resetPasswordScreenEmail')}
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
          </View>
          <View style={styles().groupBtns}>
            <SecondaryButton
              text={i18n.t('resetPasswordScreenCancelButton')}
              accion={() => navigation.goBack()}
              double
            />
            <PrimaryButton
              text={i18n.t('resetPasswordScreenButton')}
              disabled={!email.filled}
              accion={() => sendResetPassword()}
              rounded={false}
              loading={loading}
              double
            />
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
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
    paddingTop: 20,
  },
  imageReset: {
    width: screenWidth / 4.2,
    height: screenWidth / 4.2,
    resizeMode: 'contain',
  },
  textReset: {
    fontSize: 16,
    fontWeight: Platform.OS === 'android' ? 'normal' : '600',
    textAlign: 'center',
    color: Colors().text,
  },
  headerContent: {
    marginTop: 15,
    paddingTop: 10,
    backgroundColor: Colors().background,
    flex: 1,
  },
  headerItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenHeight / 8,
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
    position: 'relative',
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
    top: 15,
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
  groupBtns: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  errorText: {
    textAlign: 'right',
    color: '#DC3030',
    width: '95%',
  },
});
