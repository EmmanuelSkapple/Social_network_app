import i18n from 'i18n-js';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

//* Redux
import { useSelector } from 'react-redux';

import { StackActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList } from '../navigators/Stack';
import { RootState } from '../redux/appReducer';
import Colors from '../utils/Colors';
import Icons from '../utils/Icons';
import CircleImage from './CircleImage';
import NewDivider from './NewDivider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListMembers from './ListMembers';

import { HeaderProps } from '../../types/typesComponents';
import Typography from './ui/Typography';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';


type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;


export default function Header({
  screen,
  onBack,
  onPressTitle,
  groupData,
  showAvatars,
  setShowAvatars
}: HeaderProps) {
  const user = useSelector((state: RootState) => state.user);

  const currentGroup = useSelector(
    (state: RootState) => state.groups.currentGroup
  );

  const navigation = useNavigation<groupListScreenProp>();


  return (
    <>
      <View style={styles().container}>
        <View style={styles().left}>
         {onBack &&
          <TouchableOpacity style={styles().iconBack} onPress={()=>onBack()}>
            <Feather name="arrow-left" size={35} color={Colors().text} />
          </TouchableOpacity>
         }
        <TouchableWithoutFeedback onPress={()=>onPressTitle?onPressTitle():null}>
          <Typography variant="h2" >
            {screen}
          </Typography>
        </TouchableWithoutFeedback>
        
        </View>
     
        <View style={styles().right}>
          {screen === 'group' && (
            <TouchableOpacity
              style={styles().notifications}
              onPress={btnNotifications}
            >
              <Icon
                name="notifications"
                color={Colors().NotificationIcon}
                size={25}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showAvatars && <ListMembers currentGroup={currentGroup} onAbout={() => onAbout!()}/>}
    </>
  );
}

Header.defaultProps = {
  onBack: null,
  onAbout: null,
  groupData: null,
};

const styles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingLeft:16,
      paddingTop: 10,
      position: 'relative',
    },
    text: {
      color: Colors().TextTopBar,
      fontSize: 16,
    },
    left: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBack:{
      marginRight:16
    },
    center: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    right: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    UserInfo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    name: {
      fontSize: 17,
      fontFamily: 'PlusJakartaSans-Bold',
      color: Colors().CardInputTitle,
    },
    subTitle: {
      color: Colors().CardInputTitle,
      textAlign: 'left',
      fontSize: 14,
      fontFamily: 'PlusJakartaSans-Bold',
    },
    menu: {
      zIndex: 2,
      marginLeft: 10,
    },
    notifications: {
      zIndex: 3,
      width: 46,
      height: 46,
      borderRadius: 25,
      backgroundColor: Colors().NotificationBackground,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    groupContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    groupLeftContainer: {
      flexDirection: 'row',
      marginLeft: -20,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors().LineDividerBackground,
    },

    // styles for Home Header
    homeHeaderContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexDirection: 'row',
      width: '100%',
    },
    homeHeaderTitle: {
      fontSize: 20,
      fontFamily: 'PlusJakartaSans-Regular',
      color: Colors().TextBlackWhite,
    },
    homeHeaderSubTitle: {
      fontSize: 20,
      fontFamily: 'PlusJakartaSans-Bold',
      color: Colors().TextBlackWhite,
    },
    homeHeaderIcon: {
      color: Colors().TextBlackWhite,
      position: 'absolute',
      right: 10,
      top: 10,
    },
    groupRightContainer: {
      alignSelf: 'center',
      marginTop: 10,
    },
  });
