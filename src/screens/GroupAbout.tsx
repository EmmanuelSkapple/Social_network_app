import { View, Text, StyleSheet, TouchableOpacity, Image, Share } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import i18n from 'i18n-js';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../utils/Colors';
import LeaveButton from '../components/buttons/LeaveButton';
import AvatarListView from '../components/AvatarListView';
import MoreItem from '../components/MoreItem';
import { RootStackParamList } from '../navigators/Stack';
import { RootState } from '../redux/appReducer';
import { getGroups, removeUserOfGroup } from '../database/groupFirebase';
import Store from '../redux/Store';
import { getUser, removeGroupOfUser } from '../database/userFirebase';
import { getPostsNotLiberate } from '../database/postFirebase';
import Icons from '../utils/Icons';
import Typography from '../components/ui/Typography';
import Header from '../components/Header';

type groupFeedScreenProp = StackNavigationProp<RootStackParamList, 'GroupFeed'>;

const MEMBERS_TO_SHOW = 3;

export default function GroupAbout() {
  const [membersToShow, setMembersToShow] = useState([] as any);
  const [moreMembers, setMoreMembers] = useState(null as any);
  const navigation = useNavigation<groupFeedScreenProp>();
  const dispatch = useDispatch();
  const currentGroup = useSelector((state: RootState) => state.groups.currentGroup);
  const totalMembers = useSelector((state: RootState) =>
    state.members.membersList.filter((member: any) => currentGroup.members?.includes(member.id))
  );
  const user = useSelector((state: RootState) => state.user.userData);

  const btnShare = () => {
    Share.share({
      message: `${Store.getState().user.userData.firstname} ${i18n.t('groupAboutInvite1')} ${
        currentGroup.name
      } ${i18n.t('groupAboutInvite2')} \n https://mtter.io/invite/${currentGroup.id}`,
    });
  };

  useEffect(() => {
    if (totalMembers.length >= MEMBERS_TO_SHOW) {
      const moreMembersNumber = totalMembers.length - MEMBERS_TO_SHOW;
      setMoreMembers(moreMembersNumber <= 99 ? moreMembersNumber : 99);
      setMembersToShow(
        totalMembers.sort(() => Math.random() - Math.random()).slice(0, MEMBERS_TO_SHOW)
      );
    } else {
      setMembersToShow(totalMembers);
    }
    getPost();
  }, []);

  const getPost = async () => {
    if (currentGroup.id) {
      let reqPost = await getPostsNotLiberate(currentGroup.id);
      if (reqPost.status == 200) {
        console.log('reqPost', reqPost);
      }
    }
  };

  const leaveGroup = async () => {
    navigation.replace('TabNavigator');
    const reqLeave = await removeUserOfGroup(user.uid, currentGroup);
    const reqRemoveGroup = await removeGroupOfUser(user.uid, currentGroup.id);

    if (reqLeave.status === 200 && reqRemoveGroup.status == 200) {
      Toast.show({
        type: 'ToastPositive',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: `${i18n.t('toastGroupLeft')} ${currentGroup.name}`,
        },
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
    cleanCurrentGroup();
    const userStatus = await getUser(user.uid);
    dispatch({
      type: 'setUserData',
      payload: { ...userStatus.userData, uid: user.uid },
    });
  };

  const cleanCurrentGroup = () => {
    dispatch({ type: 'setCurrentGroup', payload: {} });
  };

  const getAdminName = () => {
    let adminName = '';
    if (currentGroup) {
      let adminObj = totalMembers.filter((member: any) => member.id === currentGroup?.admins[0]);
      adminObj.length > 0 ? adminObj[0].firstname : 'none';
    }
    return adminName;
  };

  return (
    <SafeAreaView style={styles().container}>
      <Header
        screen={'Group details'}
        onBack={()=>navigation.goBack()}
      />

      <View style={styles().content}>
        <View style={styles().cardMain}>
         <TouchableOpacity style={styles().groupName} onPress={()=>navigation.navigate('GroupEdit')}>
            <Typography variant='textBtnSmall'>
             {currentGroup?.name}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles().row} onPress={btnShare}>
            <Typography variant='textBtnSmall'>
            {i18n.t('addFriends')}
            </Typography>
            <Icons
              name='chevron-right'
              color={Colors().placeholder}
              size={22}
              style={styles().titleSection}
            />
          </TouchableOpacity>
          <View>
            {membersToShow.length
              ? membersToShow.map((item: any, index: number) => (
                  <View key={index}>
                    <AvatarListView
                      key={item.id.toString()}
                      text={item.firstname}
                      withDescription={false}
                      source={{ uri: item.photo }}
                      onPress={() => navigation.navigate('ProfileFriend', { idUser: item.id })}
                      button={false}
                      showDescription
                    />

                    <View style={{ marginBottom: 10 }} />
                  </View>
                ))
              : null}
            {moreMembers != null && (
              <MoreItem
                cant={moreMembers}
                action={() => {
                  navigation.navigate('GroupMembers', {
                    members: currentGroup.members,
                  });
                }}
              />
            )}
          </View>
        </View>
      </View>
      <View style={styles().bottom}>
        <LeaveButton text={i18n.t('groupAboutLeave')} accion={() => leaveGroup()} />
      </View>
    </SafeAreaView>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F2F6FF',
    },
    content: {
      paddingHorizontal: 16,
    },
    groupName:{
      marginVertical: 16,
    },
    row: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    titleSection: {
      marginBottom: 24,
      color: Colors().TitleBackGroundSecondary,
    },
    cardAbout: {
      backgroundColor: Colors().CardGroupsBackground,
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 17,
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardAboutInfo: {
      marginLeft: 20,
    },
    cardAboutTitle: {
      fontSize: 16,
      color: Colors().TextTopBar,
      fontFamily: 'PlusJakartaSans-Bold',
    },
    cardAboutRow: {
      flexDirection: 'row',
    },
    cardAboutLabel: {
      fontSize: 14,
      color: Colors().TextLabel,
      fontFamily: 'PlusJakartaSans-Regular',
    },
    cardAboutDesc: {
      fontSize: 14,
      color: Colors().TextTopBar,
      fontFamily: 'PlusJakartaSans-SemiBold',
    },
    cardMain: {
      backgroundColor: Colors().CardGroupsBackground,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginTop: 50,
    },
    inviteText: {
      fontSize: 14,
      color: Colors().CardGroupsSubTitle,
      fontFamily: 'PlusJakartaSans-SemiBold',
      marginBottom: 5,
    },
    inviteLinkText: {
      fontSize: 14,
      color: '#9E9E9E',
    },
    inviteBtnText: {
      fontSize: 14,
      color: Colors().CardGroupsSubTitle,
      fontFamily: 'PlusJakartaSans-Bold',
    },
    bottom: {
      height: 90,
      bottom: 0,
      position: 'absolute',
      width: '100%',
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      alignItems: 'center',
      marginBottom: 90,
      // backgroundColor: "red",
    },
    textBottom: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#F04A73',
      marginVertical: 20,
    },
  });
