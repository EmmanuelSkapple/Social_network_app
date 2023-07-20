import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { LinearGradient } from 'expo-linear-gradient';
import convertToProxyURL from 'react-native-video-cache';

import Colors from '../utils/Colors';
import { RootState } from '../redux/appReducer';
import { PostViewerProps } from '../../types/typesModals';
import { RightCardIcons } from '../components/CardIcons';
import AvatarListView from '../components/AvatarListView';
import VideoControls from '../components/VideoControls';
import Images from '../utils/Images';
import { SafeAreaView } from 'react-native-safe-area-context';
import metrics from '../utils/metrics';
import { addComment } from '../database/commentsFirebase';
import Store from '../redux/Store';
import { PostComment } from '../components/PostComment';
import { useNavigation } from '@react-navigation/native';

export type CancelPromise = ((reason?: Error) => void) | undefined;

export type ImageSize = { width: number; height: number };

function PostViewer({
  comments = 0,
  description = '',
  posterData,
  setShow,
  show,
  type,
  uri,
  shareOption,
  downloadOption,
  postData
}: PostViewerProps) {
  const video = useRef<any>(null);
  const Theme = useSelector((state: RootState) => state.theme);
  const mountedRef = useRef(true);
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.user.userData);
  const [currentHeight, setVideoHeight] = useState(Dimensions.get('window').width / (16 / 9));
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [refreshComments, setRefreshComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [progressLoading, setProgressLoading] = useState(0);
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: 'Buffering',
  });

  const handleVideo = async () => {
    if (playbackInstanceInfo.state === 'Playing') {
      console.log('/*********** Pause *************/');
      await video.current.pauseAsync();
    } else if (playbackInstanceInfo.state === 'Ended') {
      console.log('/*********** Replay *************/');
      await video.current.replayAsync();
    } else {
      console.log('/*********** Play *************/');
      await video.current.playAsync();
    }
  };
  console.log(postData)
  const title =
  postData.asker != null && postData.asker.id != 'matter-questions'
    ? `Answered question of ${postData.asker.name}`
    : `Answered question of the day`;

  const sendNewComment = async () => {
    setLoadingComments(true);
    if (commentText.length > 1) {
      const currentGroup = Store.getState().groups.currentGroup;
      const membersData = Store.getState().members.membersList.filter((member: any) =>
        currentGroup.members.includes(member.id)
      );
      let posterComment = {
        id: user.uid,
        name: user.firstname,
        photo: user.photo,
      };
      let reqCommetn = await addComment({
        idPost: postData.id,
        group: postData.group,
        comment: commentText,
        poster: posterComment,
        membersData: membersData,
      });
      setCommentText('');
      if (reqCommetn.status == 200) {
        setRefreshComments(!refreshComments);
      }
    }
    setLoadingComments(false);
  };

  

  const updatePlaybackCallback = (status: AVPlaybackStatus) => {
    // console.log('[updatePlaybackCallback] Status: ', status);
    if (status.isLoaded) {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state: status.isBuffering
          ? 'Buffering'
          : status.didJustFinish
          ? 'Ended'
          : status.isPlaying
          ? 'Playing'
          : 'Paused',
      });
    } else if (status.isLoaded === false && status.error) {
      console.log(
        `[updatePlaybackCallback] Encountered a fatal error during playback: ${status.error}`
      );
    }
  };

  const goToFriendProfile = () => {
    if(postData.asker.id !==  'matter-questions'){
      navigation.navigate('ProfileFriend', { idUser: postData.asker.id })
      setShow(false)
    }
  }

  return (
    <Modal
      animationType='slide'
      visible={show}
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        setShow(!show);
      }}>
      <View  style={{ flex: 1 }}>
        <StatusBar
          style={Theme ? 'light' : 'dark'}
          translucent={false}
          backgroundColor={Colors().topBackground}
        />
        <View style={styles().mainContainer}>
          <LinearGradient
            colors={['rgba(65, 65, 69, 1)', 'rgba(29, 29, 31, 0)']}
            style={styles().backgroundTop}
          />
          <View style={styles().navigationContainer}>
            <TouchableOpacity onPress={() => setShow(false)} style={styles().btnBack}>
              <Feather name='arrow-left' color={Colors().white} size={24} />
            </TouchableOpacity>
              <View style={styles().row}>
                {posterData && (
                  <AvatarListView
                    source={posterData.photo ? { uri: posterData.photo } : Images.user}
                    showDescription={false}
                    avatarSize={32}
                    avatarStyle={styles().avatar}
                  />
                )}
                <View style={styles().descriptionText}>
                    <Text numberOfLines={1} style={[styles().question]}>
                      {title}
                    </Text>
                  <Text numberOfLines={1} style={[styles().question]}>
                    {description}
                  </Text>
                </View>
              </View>
             
            
          </View>
          {type === 'Video' ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleVideo}
              style={styles().videoContainer}>
              
              <Video
                ref={video}
                style={styles().element}
                source={{ uri: convertToProxyURL(uri) }}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                onPlaybackStatusUpdate={updatePlaybackCallback}
              />
              
            </TouchableOpacity>
          ) : (
            <FastImage
              style={styles().element}
              source={{
                uri: uri,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
           <View style={styles().footerPost}>
            <AvatarListView
              source={postData.asker != null ? { uri: postData.asker.photo } : Images.user}
              showDescription={false}
              avatarSize={36}
              avatarStyle={styles().avatar}
              onPress={goToFriendProfile}
            />
            <Text numberOfLines={2} style={styles().question}>
              {postData.ask}
            </Text>
          </View>
            <RightCardIcons
              styleContainer={[styles().bottomIcons]}
              iconSize={22}
              typePost={type}
              comments={comments}
              onPressDownload={downloadOption}
              onPressShare={shareOption}
              progressLoading={progressLoading}
              onPressComment={() => setShowComments(true)}
              
            />

          {type === 'Video' && (
            <View style={styles().videoControl}>
              <VideoControls
                playbackInstance={video.current}
                playbackInstanceInfo={playbackInstanceInfo}
                togglePlay={handleVideo}
              />
            </View>
          )}
        </View>
      </View>
        <PostComment
          setShowComments={setShowComments}
          showComments={showComments}
          commentText={commentText}
          setCommentText={setCommentText}
          sendNewComment={sendNewComment}
          idPost={postData.id}
          loading={loadingComments}
          refreshComments={refreshComments}
        />
    </Modal>
  );
}

export default PostViewer;

const styles = () =>
  StyleSheet.create({
    avatar: {
      borderWidth: 2,
      borderColor: Colors().white,
      marginHorizontal: 6,
    },
    bottomIcons: {
      bottom: 140,
      position: 'absolute',
      right: 20,
      zIndex: 3,
    },
    navigationContainer: {
      position: 'absolute',
      top: 40,
      paddingHorizontal:16,
      width: '100%',
      zIndex: 3,
    },
    row:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center'
    },
    backgroundTop: {
      height: 100,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 2,
    },
    btnBack: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 20,
    },
    descriptionText:{
      marginLeft:8
    },
    question: {
      color: Colors().white,
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
    },
    mainContainer: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 1)',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      width: '100%',
    },
    element: {
      width:'100%',
      height:metrics.height * 0.9
    },
    videoContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flex: 1,
      width: '100%',
    },
    footerPost: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      bottom: 100,
      left: 16,
      position: 'absolute',
      width: '80%',
    },
    videoControl: {
      bottom: 30,
      left: 0,
      position: 'absolute',
      right: 0,
      width: '100%',
      paddingHorizontal:8
    },
  });
