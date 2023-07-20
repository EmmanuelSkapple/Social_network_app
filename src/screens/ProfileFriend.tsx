import React, { useEffect, useState } from 'react';
import {
  Text, View, StyleSheet, Dimensions, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Feather from 'react-native-vector-icons/Feather';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CircleImage from '../components/CircleImage';
import PostGrid from '../components/ProfielPost';
import Colors from '../utils/Colors';
import { RootState } from '../redux/appReducer';

import { RootStackParamList } from '../navigators/Stack';
import TopBar from '../components/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostsHeaderProps,ProfileUserProps } from '../../types/typesScreens';
import { getBirthDayFormat } from '../utils/DateAndTime';

type profileFriendScreenProp = StackNavigationProp<
  RootStackParamList,
  'ProfileFriend'
>;

const screenWidth = Dimensions.get('window').width;

export default function ProfileUser({ route }: ProfileUserProps) {
  const [btnActive, setBtnActive] = useState('All');
  const [user, setUser] = useState({} as any);
  const Theme = useSelector((state: RootState) => state.theme);
  const membersList = useSelector(
    (state: RootState) => state.members.membersList,
  );
  const navigation = useNavigation<profileFriendScreenProp>();

  useEffect(() => {
    const userFilter = membersList.filter(
      (member: any) => member.id === route.params.idUser,
    )[0];
    setUser(userFilter);
  }, []);

  return (
    <SafeAreaView style={styles().container}>
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />
      <TopBar
        backButton
        backAction={() => {
          navigation.goBack();
        }}
        centerText="Profile"
      />
      <ProfileData userData={user} />
      <PostsHeader
        postLength={3}
        btnActive={btnActive}
        callBackViewPost={(type : string) => setBtnActive(type)}
      />
      {user.id && <PostGrid idUser={user.id} filter={btnActive} />}
    </SafeAreaView>
  );
}
// falta mandar idUSer y sacarlo del array de miembros
function ProfileData({ userData }: any) {

  return (
    <View style={styles().headerContent}>
      <View style={styles().headerItem}>
        {userData.photo ? (
          <CircleImage
            source={{ uri: userData.photo }}
            size={screenWidth / 4.1}
          />
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
          <Text style={styles().tituloProfiel}>
            {`${
              userData?.firstname?.length <= 15
                ? userData.firstname
                : userData.firstname?.substr(0, 15)
            }`}
          </Text>
          <Text numberOfLines={2} style={styles().titulo2Profiel}>
            {`${
              userData?.email?.length <= 32
                ? userData.email
                : `${userData.email?.substr(0, 32)}...`
            }`}
          </Text>
          <Text style={styles().subTituloProfiel}>{getBirthDayFormat(userData.birthDay)}</Text>
        </View>
      </View>
    </View>
  );
}

function PostsHeader({ btnActive, callBackViewPost }: PostsHeaderProps) {
  return (
    <View style={styles().postHeaderContent}>
      <TouchableOpacity
        onPress={() => callBackViewPost('All')}
        style={
          btnActive === 'All'
            ? styles().postHeaderItemActivo
            : styles().postHeaderItem
        }
      >
        <Text
          style={
            btnActive === 'All'
              ? styles().textPostHeaderItemActivo
              : styles().textPostHeaderItem
          }
        >
          Posts
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => callBackViewPost('Photo')}
        style={
          btnActive === 'Photo'
            ? styles().postHeaderItemActivo
            : styles().postHeaderItem
        }
      >
        <Text
          style={
            btnActive === 'Photo'
              ? styles().textPostHeaderItemActivo
              : styles().textPostHeaderItem
          }
        >
          Photo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => callBackViewPost('Video')}
        style={
          btnActive === 'Video'
            ? styles().postHeaderItemActivo
            : styles().postHeaderItem
        }
      >
        <Text
          style={
            btnActive === 'Video'
              ? styles().textPostHeaderItemActivo
              : styles().textPostHeaderItem
          }
        >
          Video
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => callBackViewPost('Stamp')}
        style={
          btnActive === 'Stamp'
            ? styles().postHeaderItemActivo
            : styles().postHeaderItem
        }
      >
        <Text
          style={
            btnActive === 'Stamp'
              ? styles().textPostHeaderItemActivo
              : styles().textPostHeaderItem
          }
        >
          Stamp
        </Text>
      </TouchableOpacity>
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
    backgroundColor: Colors().BackgroundSecondary,
  },
  headerContent: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  headerItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 10,
    // backgroundColor: "red"
  },
  btnEditProfile: {
    position: 'relative',
    backgroundColor: Colors().backgroundInputs,
    borderRadius: 5,
    paddingHorizontal: 15,
    left: -40,
    paddingVertical: 10,
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
  },
  titulo2Profiel: {
    color: Colors().placeholderInverted,
    fontSize: 14,
    textAlign: 'left',
  },
  subTituloProfiel: {
    color: Colors().placeholder,
    fontSize: 12,
    textAlign: 'left',
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
    marginTop: 20,
    backgroundColor: Colors().backgroundInputs,
  },
  postHeaderItem: {
    paddingVertical: 15,
    width: Dimensions.get('window').width / 4,
  },
  postHeaderItemActivo: {
    borderTopColor: Colors().primary,
    width: Dimensions.get('window').width / 4,
    borderTopWidth: 2,
    paddingVertical: 15,
  },
  textPostHeaderItem: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
    color: Colors().placeholder,
  },
  textPostHeaderItemActivo: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
    color: Colors().primary,
  },
  profileImage: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors().primary,
  },
});
