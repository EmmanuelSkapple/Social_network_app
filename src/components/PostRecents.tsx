import { memo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import CircleImage from './CircleImage';

import Colors from '../utils/Colors';
import Images from '../utils/Images';
import PostViewer from '../modals/PostViewer';
import { PostProps } from '../../types/typesComponents';

const screenWidth = Dimensions.get('window').width;

const itemPost = ({ postData }: PostProps) => {
  const newDate = new Date(
    postData.created?.seconds * 1000 + postData.created?.nanoseconds / 1000000,
  );
  const postDateFormat = (datePost: string) => {
    const initDate = datePost.split(' ');
    return `${initDate[2]} ${initDate[1]}`;
  };

  const getName = () => {
    let userName = '';
    if (postData.poster.name) {
      userName = postData.poster.name?.length <= 15
        ? postData.poster?.name
        : postData.poster?.name.substr(0, 15);
    }
    return userName;
  };

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
        description = 'posted a new update';
        break;
    }
    return description;
  };

  return (
    <TouchableOpacity style={styles().container}>
      <View style={styles().viewDataUser}>
        <Text style={styles().datePost}>
          {postDateFormat(newDate.toDateString())}
        </Text>
      </View>
      <View style={styles().descriptionContainer}>
        <CircleImage
          source={
            postData.poster.photo ? { uri: postData.poster.photo } : Images.user
          }
          size={50}
        />
        <View style={styles().description}>
          <Text style={styles().messengeText}>{getName()}</Text>
          <Text numberOfLines={1} style={styles().question}>
            {getDescription(postData.typeNotification)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const PostRecents = memo(itemPost);

const styles = () => StyleSheet.create({
  container: {
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 4.5,
    borderTopRightRadius: 4.5,
    borderBottomRightRadius: 4.5,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: Colors().backgroundInputs,
    position: 'relative',
    padding: 5,
    borderWidth: 1,
    borderColor: Colors().borderInputVariant,
  },

  question: {
    color: 'gray',
    textAlign: 'left',
    width: '90%',
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
    color: Colors().PostDate,
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
    fontFamily: 'PlusJakartaSans-Medium',
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
