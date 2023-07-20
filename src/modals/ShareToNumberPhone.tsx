import { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as SMS from 'expo-sms';
import Toast from 'react-native-toast-message';
import Colors from '../utils/Colors';
import Divider from '../components/Divider';

const screenWidth = Dimensions.get('window').width;
import { ShareToNumberPhoneProps} from '../../types/typesModals';



function ShareToNumberPhone({
  numberContact,
  nameContact,
  message,
  show,
  setShow,
}: ShareToNumberPhoneProps) {
  const shareWithWhatsapp = async () => {
    const urlWA = `https://wa.me/${numberContact.replace(
      /\s/g,
      ''
    )}?text=${message}`;
    const supported = await Linking.canOpenURL(urlWA);
    if (supported) {
      await Linking.openURL(urlWA);
    } else {
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: "We can't send this url by WhatsApp",
        },
      });
    }
  };

  const shareWithSms = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync([numberContact], message);
    } else {
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: "We can't send this url by SMS",
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
        <KeyboardAvoidingView
          behavior='height'
          enabled
          style={styles().contentForm}>
          <View style={styles().opcions}>
            <View style={styles().headerFormModal}>
              <Text style={styles().subTitleModal}>
                Invite <Text style={styles().titleModal}>{nameContact}</Text>{' '}
                via...
              </Text>
            </View>
            <Divider />
            <View style={styles().contentSharing}>
              <Divider />
              <TouchableOpacity
                style={styles().btnShare}
                onPress={() => shareWithSms()}>
                <Text style={styles().textBtnShare}>Messages</Text>
              </TouchableOpacity>
              <Divider />

              <TouchableOpacity
                style={styles().btnShare}
                onPress={() => shareWithWhatsapp()}>
                <Text style={styles().textBtnShare}>WhatsApp</Text>
              </TouchableOpacity>
              <Divider />

              <TouchableOpacity
                style={styles().btnShare}
                onPress={() => setShow(false)}>
                <Text
                  style={[styles().textBtnShare, { color: Colors().primary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

export default ShareToNumberPhone;

const styles = () =>
  StyleSheet.create({
    container: {},
    ModalBack: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    btnShare: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    textBtnShare: {
      color: Colors().text,
      textAlign: 'center',
      fontFamily: 'PlusJakartaSans-Bold',
    },
    headerFormModal: {
      marginVertical: 20,
    },
    contentSharing: {
      justifyContent: 'space-around',
      flexDirection: 'column',
      alignItems: 'center',
    },
    opcions: {
      width: '100%',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      padding: 15,
      paddingTop: 0,
      backgroundColor: Colors().background,
    },
    titleModal: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Bold',
      textAlign: 'center',
      color: Colors().PostTitle,
    },
    subTitleModal: {
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'center',
      color: Colors().PostTitle,
    },

    closeBtn: {
      position: 'absolute',
      right: 20,
      top: 20,
    },
  });
