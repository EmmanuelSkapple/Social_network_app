import React, { useEffect, useState } from 'react';
import {
  Text, View, StyleSheet, Dimensions, Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from 'i18n-js';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import CircleImage from '../../components/CircleImage';

import Colors from '../../utils/Colors';
import { RootState } from '../../redux/appReducer';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import { getUser, updatePhotoUser } from '../../database/userFirebase';

import CustomImagePicker from '../../components/ImagePicker';
// eslint-disable-next-line import/no-cycle
import { RootStackOnBoarding } from '../../navigators/StackOnBoarding';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

type onBoardingPhotoProps = StackNavigationProp<
  RootStackOnBoarding,
  'OnboardingPhone'
>;

function OnBoardingPhoto() {
  const User = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const Theme = useSelector((state: RootState) => state.theme);
  const navigation = useNavigation<onBoardingPhotoProps>();

  const [photo, setPhoto] = useState('');
  
  const updateInfoUser = async () => {
    try {
      if (photo) {
        setLoading(true);
        const req = await updatePhotoUser({
          photo,
          onBoardinList: User.userData.onBoarding,
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
            navigation.navigate('OnboardingGroup');
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
            message: i18n.t('toastChoosePhoto'),
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

  return (
    <View style={styles().headerContent}>
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />
      <View style={styles().headerItem}>
        {photo ? (
          <View>
            <CircleImage source={{ uri: photo }} size={screenWidth / 3} />
          </View>
        ) : (
          <TouchableOpacity>
            <View style={styles().profileImage}>
              <Feather
                size={Dimensions.get('window').width / 8}
                name="user"
                color={Colors().primary}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <CustomImagePicker
        setImageCallback={(source: {uri:string;height:number;width:number,typeSource:string}) => {
          setPhoto(source.uri);
        }}
        showVideos={false}
        uploadCallback={()=>null}
        setShow={()=>auth().signOut()}
      />
      <View style={styles().btnContainer}>
        <PrimaryButton
          text={i18n.t('formPhotoScreenSave')}
          disabled={false}
          loading={loading}
          accion={() => updateInfoUser()}
        />
      </View>
    </View>
  );
}

export default function OnBoardingContainer() {
  const Theme = useSelector((state: RootState) => state.theme);
  const navigation = useNavigation<onBoardingPhotoProps>();
  const User = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (User.userData.photo) {
      navigation.navigate('OnboardingGroup');
    }
  }, [User.userData]);

  return (
    <SafeAreaView style={styles().container}>
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />
      <View style={styles().navigationHeader}>
        <Text style={styles().textHeader}>
          {i18n.t('formPhotoScreenTitle')}
        </Text>
      </View>
      <OnBoardingPhoto />
    </SafeAreaView>
  );
}

const styles = () => StyleSheet.create({
  textHeader: {
    fontSize: 20,
    fontWeight: Platform.OS === 'android' ? 'normal' : '600',
    textAlign: 'center',
    color: Colors().text,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: Colors().background,
    paddingTop: 20,
  },

  headerContent: {
    marginTop: 15,
    paddingTop: 30,
    backgroundColor: Colors().backgroundInputs,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
});
