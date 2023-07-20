import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { memo, useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { donwloadFile } from '../utils/DownloadFile';

import * as Progress from 'react-native-progress';
import { deletePost } from '../database/postFirebase';
import { RootState } from '../redux/appReducer';
// eslint-disable-next-line import/no-cycle
import { addComment } from '../database/commentsFirebase';
import PostViewer from '../modals/PostViewer';
import Store from '../redux/Store';
import Colors from '../utils/Colors';
import { getPosterData } from '../utils/GetPosterData';
import metrics from '../utils/metrics';
import AudioReproductor from './AudioReproductor';
import CardDescription from './CardDescription';
import { RightCardIcons } from './CardIcons';
import { PostComment } from './PostComment';
import PostVideoOrImage from './PostVideoOrImage';

import { PostProps } from '../../types/typesComponents';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;

const itemPost = ({ postData, stylePost, currentPostId, setCurrentPostId }: PostProps) => {
  const [status, setStatus] = useState<any>(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [viewPostModal, setViewPostModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [posterData, setPosterData] = useState({ name: '', id: '', photo: '' });
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentText, setCommentText] = useState('');
  const [refreshComments, setRefreshComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [progressLoading, setProgressLoading] = useState(0);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    if (!postData?.answerArray?.length) setPosterData(getPosterData(postData.poster));
  }, []);

  const downloadOpcion = async () => {
    setLoadingShare(true);

    const res = await MediaLibrary.requestPermissionsAsync();
    if (res.status !== 'granted') {
      return;
    }

    const uriFile = (await donwloadFile(postData.uriSource, postData.id, postData.typePost)) as any;
    await MediaLibrary.saveToLibraryAsync(uriFile);
    Toast.show({
      type: 'ToastPositive',
      props: {
        hide: () => {
          Toast.hide();
        },
        message: 'your post has been downloaded',
      },
    });
    setLoadingShare(false);
    setShowOptions(false);
  };
  const shareOption = async () => {
    setLoadingShare(true);
    const reqSaharing = await Sharing.isAvailableAsync();
    if (reqSaharing) {
      const uriFile = (await donwloadFile(
        postData.uriSource,
        postData.id,
        postData.typePost
      )) as any;
      setLoadingShare(false);
      Sharing.shareAsync(uriFile);
    }
    setShowOptions(false);
    setLoadingShare(false);
  };

  const eliminatePost = async () => {
    setLoadingShare(true);
    const reqEliminate = await deletePost(
      postData.poster.id,
      postData.id,
      postData.group.id,
      dispatch
    );
    if (reqEliminate.status === 200) {
      Toast.show({
        type: 'ToastPositive',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: 'Your post no longer exists :(',
        },
      });
      setShowOptions(false);
      setLoadingShare(false);
    } else {
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: 'Try again later',
        },
      });
      setShowOptions(false);
      setLoadingShare(false);
    }
  };

 

  const setProgressBar = () => status.positionMillis / status.durationMillis;

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

  const colorBackground =
    postData.typePost !== 'Audio' ? Colors().backgroundPost : Colors().postBackground;

  return (
    <>
      <View style={[styles().container, { backgroundColor: colorBackground, ...stylePost }]}>
        {postData.typePost !== 'Audio' ? (
          <PostVideoOrImage
            downloadOption={downloadOpcion}
            setShowComments={setShowComments}
            typePost={postData.typePost}
            comments={postData.comments?.length}
            postData={postData}
            posterData={posterData}
            shareOption={shareOption}
            setViewPostModal={setViewPostModal}
          >
            <TouchableOpacity onPress={() => setViewPostModal(!viewPostModal)}>
              <FastImage
                style={styles().image}
                onProgress={(e: any) =>
                  setProgressLoading(e.nativeEvent.loaded / e.nativeEvent.total)
                }
                source={{
                  uri: postData.typePost === 'Video' ? postData?.uriThumbnails : postData.uriSource,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          </PostVideoOrImage>
        ) : (
          <View style={styles().audioReproductorContainer}>
            <View style={styles().leftCardPost}>
              <CardDescription
                posterData={posterData}
                description={postData.description}
                typePost={postData.typePost}
                inverted
              />
              <AudioReproductor audioUri={postData.uriSource} />
            </View>
            <RightCardIcons
              styleContainer={styles().rightCardPost}
              iconSize={28}
              typePost={postData.typePost}
              iconColor={Colors().PlayBtn}
              comments={postData.comments?.length}
              onPressDownload={downloadOpcion}
              onPressShare={shareOption}
              progressLoading={progressLoading}
              onPressComment={() => setShowComments(true)}
            />
          </View>
        )}
        <Progress.Bar
          progress={status.durationMillis ? setProgressBar() : 0}
          width={null}
          color={Colors().primary}
          height={1.5}
          borderColor='transparent'
          animationType='timing'
          indeterminateAnimationDuration={500}
        />

        <PostViewer
          comments={postData.comments?.length}
          description={postData.description}
          posterData={posterData}
          setShow={setViewPostModal}
          show={viewPostModal}
          type={postData.typePost}
          uri={postData.uriSource}
          downloadOption={downloadOpcion}
          postData={postData}
          shareOption={shareOption}
        />
      </View>
      {showComments && (
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
      )}
    </>
  );
};

// eslint-disable-next-line import/prefer-default-export
export const Post = memo(itemPost);

const styles = () =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
      margin: 10,
    },
    image: {
      borderRadius: 12,
      height: screenWidth * 1.15,
      width: '100%',
    },
    playBtn: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: 'rgba(224, 224, 224, 0.4)',
      borderRadius: metrics.width * 0.13,
      height: metrics.width * 0.26,
      justifyContent: 'center',
      position: 'absolute',
      width: metrics.width * 0.26,
      zIndex: 2,
    },
    audioReproductorContainer: {
      flexDirection: 'row',
      height: 140,
      paddingHorizontal: 10,
      paddingVertical: 13,
      width: '100%',
    },
    leftCardPost: {
      height: '100%',
      justifyContent: 'space-between',
      width: '80%',
    },
    rightCardPost: {
      alignItems: 'flex-end',
      height: '100%',
      justifyContent: 'space-between',
      width: '20%',
    },
  });
