import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../utils/Colors';
import CardDescription from './CardDescription';
import { RightCardIcons } from './CardIcons';

import { PostVideoOrImageProps } from '../../types/typesComponents';
import AvatarListView from './AvatarListView';
import Images from '../utils/Images';
import { useNavigation } from '@react-navigation/native';

const PostVideoOrImage = ({
  postData,
  typePost,
  posterData,
  comments,
  shareOption,
  downloadOption,
  setShowComments,
  setViewPostModal,
  children,
}: PostVideoOrImageProps) => {
  const navigation = useNavigation<any>();
  const goToFriendProfile = () => {
    if(postData.asker.id !==  'matter-questions'){
      navigation.navigate('ProfileFriend', { idUser: postData.asker.id })
    }
  }
  return (
    <View style={styles().mainContainerVideo}>
      <View style={styles().topContainerVideo}>
        <LinearGradient
          // Background Linear Gradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles().backgroundTop}
        />
        <CardDescription
          videoUri={postData?.uriSource}
          description={postData.description}
          posterData={posterData}
          typePost={typePost}
          setViewPostModal={setViewPostModal}
        />
      </View>
      <View>{children as any}</View>
      <TouchableOpacity onPress={()=> setViewPostModal && setViewPostModal(true)} style={styles().bottomContainerVideo}>
        <LinearGradient
          // Background Linear Gradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles().backgroundBottom}
        />

        <View style={styles().footerPost}>
          <AvatarListView
            source={postData.asker != null ? { uri: postData.asker.photo } : Images.user}
            showDescription={false}
            avatarSize={40}
            avatarStyle={styles().avatar}
            onPress={goToFriendProfile}
          />
          <Text numberOfLines={2} style={styles().question}>
            {postData.ask}
          </Text>
        </View>
        <RightCardIcons
          styleContainer={[styles().bottomIconsVideo]}
          iconSize={28}
          typePost={typePost}
          comments={comments}
          onPressDownload={downloadOption}
          onPressShare={shareOption}
          progressLoading={0}
          onPressComment={() => setShowComments(true)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    textBottomVideoImage: {
      alignSelf: 'flex-end',
      color: Colors().white,
      fontFamily: 'PlusJakartaSans-Regular',
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 10,
      width: '85%',
    },
    backgroundVideo: {
      backgroundColor: '#000',
      borderRadius: 12,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
    iconsCard: {
      padding: 7,
    },
    mainContainerVideo: {
      position: 'relative',
    },
    topContainerVideo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      position: 'absolute',
      width: '100%',
      zIndex: 10,
    },
    bottomContainerVideo: {
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: 10,
      position: 'absolute',
      width: '100%',
      zIndex: 10,
    },
    bottomIconsVideo: {
      alignSelf: 'flex-end',
      justifyContent: 'space-between',
    },
    backgroundTop: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      height: 80,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    backgroundBottom: {
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      bottom: 0,
      height: 100,
      left: 0,
      position: 'absolute',
      right: 0,
    },
    footerPost: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    question: {
      marginLeft: 10,
      width: '72%',
      color: Colors().white,
    },
    avatar: {
      borderWidth: 2,
      borderColor: Colors().white,
    },
  });

export default PostVideoOrImage;
