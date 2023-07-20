import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import PrimaryButton from '../components/buttons/PrimaryButton';

import Colors from '../utils/Colors';

import { RootStackParamList } from '../navigators/Stack';
import { getGroup, joinGroup } from '../database/groupFirebase';
import Images from '../utils/Images';
import { Loader } from '../components/Loader';
import { RootState } from '../redux/appReducer';
import { getTokenUsers, getUser } from '../database/userFirebase';
import { sendNotification } from '../utils/notifications';

type inviteScreenProp = StackNavigationProp<RootStackParamList, 'Invite'>;

function JoinGroup() {
  const route = useRoute();
  const user = useSelector((state: RootState) => state.user.userData);

  const [group, setGroup] = useState(route?.params as any);
  const [progress, setProgress] = useState(0);
  const [textLoader, setTextLoader] = useState('knocking on the door...');

  const [accesDenied, setAccesDenied] = useState(false);
  const [groupData, setGroupData] = useState(null as any);
  const navigation = useNavigation<inviteScreenProp>();
  const dispatch = useDispatch();

  useEffect(() => {
    getDataOfGroup();
  }, []);

  const getDataOfGroup = async () => {
    setProgress(0.1);
    const reqGroup = await getGroup(group.id);
    setProgress(0.2);

    setTimeout(() => {
      ValidateAccessGroup(reqGroup);
    }, 2000);
  };

  const ValidateAccessGroup = async (reqGroup: any) => {
    if (reqGroup.status === 200) {
      if (reqGroup.groupData.acceptNewMembers) {
        if (!reqGroup.groupData.members.some((item: any) => item === user.uid)) {
          setProgress(0.5);
          setTextLoader('The door is opening');
          const status = await joinGroupFromInvitation(group.id, reqGroup.groupData.members);
          if (status === 200) {
            setProgress(0);
            sendNotificationJoin(reqGroup.groupData.name, user.firstname, group.id);
            Toast.show({
              type: 'ToastPositive',
              props: {
                hide: () => {
                  Toast.hide();
                },
                message: `Welcome to ${reqGroup.groupData.name} group`,
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
              message: 'Group already joined!',
            },
          });
          setAccesDenied(true);
        }
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: 'Group not accept new members',
          },
        });
        setAccesDenied(true);
      }
      setGroupData(reqGroup.groupData);
    } else {
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: 'Group not found',
        },
      });
      setAccesDenied(true);
    }
  };

  const joinGroupFromInvitation = async (idGroup: string, members: Array<string>) => {
    const reqStatus = await joinGroup(idGroup, members, user.groups ? user.groups : [], user.uid);
    setProgress(0.7);
    if (reqStatus.status === 200) {
      const userStatus = await getUser(user.uid);
      dispatch({
        type: 'setUserData',
        payload: { ...userStatus.userData, uid: user.uid },
      });

      setTextLoader('We celebrate your arrival');
      setTimeout(() => {
        setProgress(0.9);
        navigation.dispatch(
          StackActions.replace('TabNavigator', {
            screen: 'Groups',
          })
        );
      }, 2000);
      return 200;
    }
    Toast.show({
      type: 'ToastError',
      props: {
        hide: () => {
          Toast.hide();
        },
        message: 'Try again later',
      },
    });
  };

  const sendNotificationJoin = async (groupName: string, userName: string, idGroup: string) => {
    const reqTokens = (await getTokenUsers(idGroup)) as any;
    sendNotification('joinGroup', true, reqTokens.tokensArray, userName, groupName);
  };

  return (
    <View style={styles().container}>
      <View style={styles().topbar}>
        <Text style={[styles().text, styles().title]}>Join Group</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        {groupData != null && <GroupCard groupData={groupData} />}
      </View>
      {progress !== 0 && <Loader progress={progress} text={textLoader} />}
      <View style={styles().btnContainer}>
        {accesDenied && (
          <PrimaryButton
            text='Go home 😞'
            disabled={false}
            accion={() => navigation.navigate('TabNavigator')}
          />
        )}
      </View>
    </View>
  );
}

function GroupCard({ groupData }: any) {
  return (
    <View style={styles().card}>
      <View style={styles().dataGroup}>
        <Image source={Images.circleLogo} style={styles().logo} />
        <View>
          <Text style={styles().titleCard} numberOfLines={1} ellipsizeMode='tail'>
            {groupData.name}
          </Text>
          <View style={styles().numMembers}>
            <Text style={styles().SubTitleText}>{groupData.members?.length}</Text>
            <Text style={styles().memberText}>
              {groupData.members?.length > 1 ? ' Members' : ' Member'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default JoinGroup;

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors().background,
    },
    text: {
      color: Colors().text,
      textAlign: 'center',
    },
    title: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
    },
    topbar: {
      padding: 10,
      borderBottomWidth: 2,
      borderColor: Colors().border,
      marginBottom: 10,
    },

    card: {
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 20,
      marginHorizontal: 40,
      width: '90%',
      alignSelf: 'center',
      borderColor: Colors().CardGroupsBorderPrimary,
      backgroundColor: Colors().CardGroupsBackground,
    },
    titleCard: {
      fontSize: 16,
      color: Colors().CardGroupsTitle,
      marginLeft: 0,
    },
    dataGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    SubTitleText: {
      fontSize: 16,
      color: Colors().CardGroupsSubTitle,
      fontFamily: 'Cabin-Bold',
    },
    numMembers: {
      flexDirection: 'row',
    },
    memberText: {
      fontSize: 16,
      color: Colors().CardGroupsSubTitle,
      fontFamily: 'Cabin-Bold',
    },
    buttons: {
      flex: 1,
      flexDirection: 'column-reverse',
      marginBottom: 30,
      marginHorizontal: 30,
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 100,
      marginRight: 20,
    },
    btnContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
  });
