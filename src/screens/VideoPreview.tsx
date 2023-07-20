import { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Keyboard,
  KeyboardEvent,
  Animated
} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { StackActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import i18n from 'i18n-js';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// eslint-disable-next-line import/no-cycle
import GroupsListPost from '../modals/GroupsListPost';
import { RootState } from '../redux/appReducer';
// eslint-disable-next-line import/no-cycle
import { RootStackParamList } from '../navigators/Stack';
import { uploadPost } from '../database/postFirebase';
import Colors from '../utils/Colors';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { VideoPreviewProps } from '../../types/typesScreens';
import metrics from '../utils/metrics';
import { mergeVideos, reEncodingVideoList } from '../services/compressVideo';
import Loading from '../components/Loading';
import { InfiniteLoader } from '../components/Loader';
import { GroupData } from '../../types/typesGroup';
type groupListScreenProp = StackNavigationProp<RootStackParamList, 'VideoPreview'>;

const HEADER_HEIGHT = Platform.OS === 'android' ? 60 : 80;

function VideoPreview(props: any) {
  const [showGroupList, setShowGroupList] = useState(false);
  const Theme = useSelector((state: RootState) => state.theme);

  // eslint-disable-next-line react/destructuring-assignment
  const { source, typeSource, videoListOfCamera, originOfSource } = props.route.params;
  const video = useRef<any>(null);
  const navigation = useNavigation<groupListScreenProp>();
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30000);
  const [localSource, setLocalSource] = useState('');
  const [loading, setLoading] = useState(false);
  const postToUpdate = useSelector((state: RootState) => state.posts.postToUpdate);
  const groupList = useSelector((state: RootState) => state.groups.groupList);
  const currentGroup = useSelector((state: RootState) => state.groups.currentGroup);
  const dispatch = useDispatch();
  const descriptionTop = useRef(new Animated.Value(0)).current;

  const Upload = async (currentGroup : GroupData ) => {
    if (currentGroup.id) {
      uploadPost(
        localSource,
        { ...postToUpdate, typePost: typeSource },
        dispatch,
        {
          name: currentGroup.name,
          id: currentGroup.id,
          post: currentGroup.post,
          membersGroup: currentGroup.members,
        },
        description,
        duration
      );
      navigation.replace('GroupFeed', { idGroup: currentGroup.id });
    } else {
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: 'Error!, Group not found, please reload',
        },
      });
    }
  };

  useEffect(() => {
    mergeVideosList();
  }, []);

    const keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        (e : KeyboardEvent) => {
          Animated.timing(descriptionTop, {
            toValue: -(e.endCoordinates.height + metrics.height * 0.065)+120,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
    );
    const keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          Animated.timing(descriptionTop, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
    );

  const mergeVideosList = async () => {
    setLoading(true);
    if (originOfSource == 'camera' && typeSource == 'Video') {
      if (Platform.OS == 'android' && videoListOfCamera.length >= 2) {
        let videosEncodingList = await reEncodingVideoList(videoListOfCamera);
        let videoMerged = await mergeVideos(videosEncodingList);
        setLocalSource(videoMerged);
      } else if (Platform.OS == 'ios' && videoListOfCamera.length >= 2) {
        let videoMerged = await mergeVideos(videoListOfCamera);
        setLocalSource(videoMerged);
      } else if (videoListOfCamera.length == 1) {
        setLocalSource(videoListOfCamera[0]);
      }
    } else {
      setLocalSource(source.uri);
    }
    setLoading(false);
  };

  const postToCurrentGroup = async (currentGroup: GroupData) => {
    Upload(currentGroup);
  };

  const showModalGroup = () => {
    let posibleCurrentGroup = null;
    if(postToUpdate.asker.id === 'matter-questions'){
      posibleCurrentGroup = currentGroup;
    }else{
      posibleCurrentGroup = groupList.filter((item : GroupData)=>item.id == postToUpdate.asker.groupData.id)[0]
    }
    // eslint-disable-next-line no-unused-expressions
    posibleCurrentGroup.id ? Upload(posibleCurrentGroup) : setShowGroupList(true);
  };

  const goBack = () => {
    if (originOfSource == 'camera') {
      navigation.goBack();
    } else {
      navigation.dispatch(
        StackActions.replace('TabNavigator', {
          screen: 'Home',
        })
      );
    }
  };

  return (
      <SafeAreaView style={styles().container}>
        <StatusBar
          style={Theme ? 'light' : 'dark'}
          translucent={false}
          backgroundColor={Colors().topBackground}
        />
        {!loading ?
        <View style={styles().videoContainer}>
          <View style={styles().headerCam}>
            <TouchableOpacity style={styles().iconHeaderCam} onPress={goBack}>
              <Feather color='#FFF' size={25} name='arrow-left' />
            </TouchableOpacity>
          </View>
          {typeSource === 'Video' ? (
            <Video
              ref={video}
              style={[styles().video]}
              source={{
                uri: localSource,
              }}
              resizeMode={ResizeMode.COVER}
              isLooping
              isMuted //! Poner en true si estas trabajndo aqui para no artarte de ti mismo jaja
              onLoad={(data: any) => setDuration(data.durationMillis)}
              onReadyForDisplay={(event) => {
                video.current.playAsync();
              }}
            />
          ) : typeSource === 'Photo' ? (
            <Image
              source={{
                uri: localSource,
              }}
              style={styles().video}
            />
          ) : null}
          <Animated.View style={[styles().inputLittleMoreContainer,{transform: [{ translateY: descriptionTop }]}]}>
            <TextInput
              placeholder={i18n.t('tellALittleMore')}
              placeholderTextColor={Colors().textBtnPrimary}
              style={styles().inputLittleMore}
              onChangeText={setDescription}
              value={description}
            />
            <TouchableOpacity onPress={showModalGroup}>
              <Ionicons
                size={25}
                style={styles().iconSend}
                name='ios-send-sharp'
                color={Colors().textBtnPrimary}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
        :
        <View style={[styles().videoContainer,{height:'100%',width:'100%'}]}>
          <InfiniteLoader />
        </View>
        }
         <GroupsListPost
          SelectGroup={postToCurrentGroup}
          show={showGroupList}
          setShow={setShowGroupList}
        />
      </SafeAreaView>
  );
}

export default VideoPreview;

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors().postBackground,
      height: '100%',
    },
    headerCam: {
      width: '100%',
      height: HEADER_HEIGHT,
      backgroundColor: 'transparent',
      zIndex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    iconHeaderCam: {
      position: 'absolute',
      zIndex: 3,
      left: 27,
    },
    videoContainer: {
      paddingBottom: 40,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor:'red'
    },
    video: {
      width: '100%',
      backgroundColor: Colors().postBackground,
      height: Dimensions.get('window').height - HEADER_HEIGHT / 2,
    },
    text: {
      color: Colors().textBtnPrimary,
      fontSize: 18,
      fontFamily: 'Cabin-Bold',
      textAlign: 'center',
    },
    opcions: {
      position: 'absolute',
      width: '100%',
      bottom: 30,
      flexDirection: 'row',
      justifyContent: 'space-around',
      zIndex: 3,
    },
    back: {
      padding: 10,
      backgroundColor: '#2A2A2AAF',
      width: '45%',
      borderRadius: 12,
    },
    public: {
      padding: 10,
      backgroundColor: Colors().primary,
      width: '45%',
      borderRadius: 12,
    },
    selectGroupBtnContainer: {
      marginVertical: 10,
      width: '90%',
      alignSelf: 'center',
    },
    selectGroupBtnExists: {
      width: '100%',
    },
    selectGroupBtn: {
      width: '100%',
      padding: 15,
      borderRadius: 25,
      backgroundColor: Colors().btnFocusSecondary,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    inputLittleMoreContainer: {
      width: metrics.width * 0.8,
      position: 'absolute',
      bottom: 120,
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconSend: {
      marginRight: 15,
    },
    inputLittleMore: {
      fontSize: 14,
      height: metrics.height * 0.065,
      fontWeight: '200',
      padding: 5,
      paddingHorizontal: 15,
      color: '#fff',
      fontFamily: 'PlusJakartaSans-Medium',
      textAlignVertical: 'center',
    },
  });
