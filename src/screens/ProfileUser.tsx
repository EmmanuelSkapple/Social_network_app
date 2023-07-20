import React, { useState } from 'react';
import {
  Text, View, StyleSheet, Dimensions, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Feather from 'react-native-vector-icons/Feather';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from 'i18n-js';
import CircleImage from '../components/CircleImage';
import Colors from '../utils/Colors';
// eslint-disable-next-line import/no-cycle
import ProfileOpcions from '../modals/ProfileOpcions';
import { RootState } from '../redux/appReducer';

// eslint-disable-next-line import/no-cycle
import { RootStackParamList } from '../navigators/Stack';
import PostGrid from '../components/ProfielPost';
import Typography from '../components/ui/Typography';
import Divider from '../components/Divider';
import { PostsHeaderProps } from '../../types/typesScreens';
import { getBirthDayFormat } from '../utils/DateAndTime';

type profileScreenProp = StackNavigationProp<RootStackParamList, 'ProfileUser'>;



function ProfileData() {
  const navigation = useNavigation<profileScreenProp>();
  const User = useSelector((state: RootState) => state.user.userData);
  const getName = () => {
    let userName = '';
    if (User.firstname) {
      userName = User.firstname?.length <= 10
        ? User?.firstname
        : User?.firstname.substr(0, 10);
    }

    return userName;
  };

  return (
    <View style={styles().headerContent}>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfileUser')}>
        <View style={styles().headerItem}>
          {User?.photo ? (
               <CircleImage source={{ uri: User?.photo }} size={70} />
          ) : (
            <View style={styles().profileImage}>
              <Feather
                size={Dimensions.get('window').width / 8}
                name="user"
                color={Colors().primary}
              />
            </View>
          )}

          <View style={styles().infoContent}>
            <Typography variant="h2">{getName()}</Typography>
            <Text style={styles().subTituloProfiel}>{getBirthDayFormat(User.birthDay)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfileUser')} style={styles().btnEdit}>
        <Typography variant='b3' color={Colors().placeholder} >Edit</Typography>
      </TouchableOpacity>
    </View>
  );
}

function PostsHeader({ btnActive, callBackViewPost }: PostsHeaderProps) {
  return (
    <>
      <Divider positive />
      <View style={styles().postHeaderContent}>
        <TouchableOpacity
          onPress={() => callBackViewPost('All')}
          style={[styles().postHeaderItem, { backgroundColor: btnActive === 'All' ? Colors().primary : Colors().backgroundInputs }]}
        >
          <Text
            style={
              btnActive === 'All'
                ? styles().textPostHeaderItemActivo
                : styles().textPostHeaderItem
            }
          >
            {i18n.t('profileUserPosts')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => callBackViewPost('Photo')}
          style={[styles().postHeaderItem, { backgroundColor: btnActive === 'Photo' ? Colors().primary : Colors().backgroundInputs }]}
        >
          <Text
            style={
              btnActive === 'Photo'
                ? styles().textPostHeaderItemActivo
                : styles().textPostHeaderItem
            }
          >
            {i18n.t('profileUserPhoto')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => callBackViewPost('Video')}
          style={[styles().postHeaderItem, { backgroundColor: btnActive === 'Video' ? Colors().primary : Colors().backgroundInputs }]}
        >
          <Text
            style={
              btnActive === 'Video'
                ? styles().textPostHeaderItemActivo
                : styles().textPostHeaderItem
            }
          >
            {i18n.t('profileUserVideo')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => callBackViewPost('Q&A')}
          style={[styles().postHeaderItem, { backgroundColor: btnActive === 'Q&A' ? Colors().primary : Colors().backgroundInputs }]}

        >
          <Text
            style={
              btnActive === 'Q&A'
                ? styles().textPostHeaderItemActivo
                : styles().textPostHeaderItem
            }
          >
            {i18n.t('profileUserQA')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default function ProfileUser() {
  const navigation = useNavigation<profileScreenProp>();
  const [btnActive, setBtnActive] = useState('All');
  const [showOptions, setShowOptions] = useState(false);
  const Theme = useSelector((state: RootState) => state.theme);
  const User = useSelector((state: RootState) => state.user.userData);

  return (
    <SafeAreaView style={styles().container}>
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />

      <ProfileData />
      <PostsHeader
        postLength={0}
        btnActive={btnActive}
        callBackViewPost={(type: string) => setBtnActive(type)}
      />
      <PostGrid idUser={User.uid} filter={btnActive} />
      <ProfileOpcions
        show={showOptions}
        edit={() => navigation.navigate('EditProfileUser')}
        setShow={setShowOptions}
      />
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
  },
  btnEdit:{
    borderColor:Colors().borderCards,
    borderWidth:1,
    paddingHorizontal:20,
    borderRadius:5,
    paddingVertical:5
  },
  headerContent: {
    paddingTop: 15,
    paddingBottom: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'relative',
    backgroundColor: Colors().BackgroundPrimary,
  },
  headerItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 10,
  },
  btnEditProfile: {
    backgroundColor: Colors().backgroundInputs,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    right: 0,
  },
  textBtnEdit: {
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
    color: Colors().placeholder,
    fontSize: 12,
  },
  tituloProfiel: {
    color: Colors().text,
    fontSize: 24,
    textAlign: 'left',
    width: '100%',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  titulo2Profiel: {
    color: Colors().placeholderInverted,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  subTituloProfiel: {
    color: Colors().placeholder,
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  text: {
    color: Colors().text,
    fontSize: 14,
    textAlign: 'left',
  },
  iconPositive: {
    color: Colors().primary,
    fontSize: 20,
    textAlign: 'left',
  },
  menu: {
    position: 'absolute',
    right: 20,
    top: 12,
    zIndex: 2,
  },
  postHeaderContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 17,
    paddingHorizontal:6,
    backgroundColor: Colors().backgroundInputs,
  },
  postHeaderItem: {
    paddingVertical: 9,
    width: Dimensions.get('window').width * 0.23,
    backgroundColor: Colors().backgroundInputs,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: Colors().borderInputVariant,
  },
  postHeaderItemActivo: {
    backgroundColor: Colors().primary,
    width: Dimensions.get('window').width * 0.23,
    borderTopWidth: 2,
    paddingVertical: 15,
  },
  textPostHeaderItem: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors().placeholder,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  textPostHeaderItemActivo: {
    fontFamily: 'PlusJakartaSans-Bold',
    textAlign: 'center',
    fontSize: 14,
    color: Colors().textBtnPrimary,
  },
  profileImage: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors().primary,
  },
});
