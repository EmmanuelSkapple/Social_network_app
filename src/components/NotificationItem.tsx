import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated from 'react-native-reanimated';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import CircleImage from './CircleImage';
import { NotificationItemProps } from '../../types/typesComponents';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/appReducer';
import { getGroupData } from '../redux/actions/groupActions';
import { getGroup } from '../database/groupFirebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigators/Stack';

const screenWidth = Dimensions.get('window').width;
type homeScreenProp = StackNavigationProp<RootStackParamList, 'TabNavigator'>;

const getDescription = (typeNotification: string) => {
  let description = '';
  switch (typeNotification) {
    case 'newPost-Video':
      description = 'posted a new video';
      break;
    case 'newPost-Photo':
      description = 'posted a new photo';
      break;
    case 'newPost-Audio':
      description = 'posted a new audio';
      break;
    case 'newComment':
      description = 'write a comment';
      break;
    case 'newQuestion':
      description = 'posted a new question';
      break;
    case 'newRespond':
      description = 'answered you question';
      break;
    case 'newRespondMatter':
      description = 'answered matter question of the day';
      break;
    case 'newJoin':
      description = 'joined the group';
      break;
    case 'newLeft':
      description = 'left the group';
      break;
    default:
      description = '';
      break;
  }
  return description;
};

function RenderLeft() {
  return (
    <View
      style={{
        width: '100%',
        height: 50,
        backgroundColor: '#E11F5D',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 100,
        marginLeft: 20,
      }}>
      <Animated.Text
        style={[
          {
            color: '#FAFAFA',
            fontWeight: 'bold',
            paddingHorizontal: 20,
          },
        ]}>
        Delete
      </Animated.Text>
    </View>
  );
}

export default function NotificationItem({
  itemData,
  deleteItem,
}: NotificationItemProps) {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  const navigation = useNavigation<homeScreenProp>();
  
  const newDate = new Date(
    itemData.created?.seconds * 1000 + itemData.created?.nanoseconds / 1000000
  );
  const postDateFormat = (datePost: string) => {
    const initDate = datePost.split(' ');
    return `${initDate[2]} ${initDate[1]}`;
  };

  const getName = () => {
    let userName = '';
    if (itemData.poster.name) {
      userName =
        itemData.poster.name?.length <= 15
          ? itemData.poster?.name
          : itemData.poster?.name.substr(0, 15);
    }
    return userName;
  };

  const sendToGroupAndPost = async() => {
    if (itemData.typeNotification.includes('newPost')) {
      let groupData = await getGroup(itemData.group.id)
      if(groupData){
        dispatch({ type: 'setCurrentGroup', payload: groupData });
        navigation.navigate('GroupFeed', {
          idGroup: itemData.group.id,
          idPost:itemData.trackingId
        });
      }
    }
  }

  return (
    <Swipeable
      useNativeAnimations
      overshootLeft={false}
      onSwipeableLeftOpen={() => deleteItem(itemData.id)}
      renderLeftActions={RenderLeft}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles().container}
        onPress={sendToGroupAndPost}>
        <View style={styles().viewDataUser}>
          <Text style={styles().datePost}>
            {postDateFormat(newDate.toDateString())}
          </Text>
        </View>
        <View style={styles().descriptionContainer}>
          <CircleImage
            source={
              itemData.poster.photo
                ? { uri: itemData.poster.photo }
                : Images.user
            }
            size={50}
          />
          <View style={styles().description}>
            <Text style={styles().messengeText}>{getName()}</Text>
            <Text numberOfLines={1} style={styles().question}>
              {getDescription(itemData.typeNotification)} in{' '}
              {itemData.group.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      borderBottomLeftRadius: 100,
      borderTopLeftRadius: 100,
      borderTopRightRadius: 4.5,
      borderBottomRightRadius: 4.5,
      marginVertical: 6,
      marginHorizontal: 16,
      backgroundColor: Colors().NotificationBackground,
      position: 'relative',
      padding: 5,
      borderWidth: 1,
      borderColor: Colors().borderInputVariant,
    },

    question: {
      color: 'gray',
      textAlign: 'left',
      width: '100%',
      fontFamily: 'PlusJakartaSans-Medium',
      fontSize: 12,
    },
    viewQuestion: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingBottom: 10,
    },
    viewDataUser: {
      position: 'absolute',
      top: 5,
      right: 10,
    },
    groupText: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    groupPost: {
      alignItems: 'flex-start',
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 14,
      justifyContent: 'center',
      marginLeft: 10,
      color: Colors().PostDate,
    },
    datePost: {
      flex: 1,
      textAlign: 'right',
      color: Colors().placeholder,
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 12,
    },
    videoContainer: {
      position: 'relative',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      width: '100%',
      height: Dimensions.get('window').width / (16 / 9),
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
    },
    image: {
      width: '100%',
      height: screenWidth * 0.8,
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
    },
    playBtn: {
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 2,
      opacity: 0.8,
    },
    opcions: {
      justifyContent: 'space-around',
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 10,
      width: '25%',
    },
    opcionsFull: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      paddingVertical: 8,
    },
    imageQuestion: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    touchImage: {
      marginHorizontal: 10,
    },

    footerPost: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingBottom: 5,
      marginLeft: 10,
    },
    Gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
    },
    messengeText: {
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 15,
      color: Colors().text,
    },
    likesView: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
      marginRight: 20,
    },
    likesImage: {
      width: 30,
      height: 30,
    },
    likesCount: {
      marginLeft: 10,
      fontSize: 20,
    },
    profileImage: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      borderWidth: 2,
      borderColor: Colors().primary,
    },
    descriptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '75%',
    },
    description: {
      marginLeft: 10,
      width: '80%',
    },
  });
