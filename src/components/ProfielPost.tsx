import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import { getPostUser } from '../database/postFirebase';
// eslint-disable-next-line import/no-cycle
import PostViewer from '../modals/PostViewer';
import { RootState } from '../redux/appReducer';

import Colors from '../utils/Colors';
import AudioReproductorCircle from './AudioReproductorCircle';
import Loading from './Loading';
// eslint-disable-next-line import/no-cycle
import { Post } from './Post';
import { PostGridProps } from '../../types/typesComponents';
import FastImage from 'react-native-fast-image';
import { donwloadFile } from '../utils/DownloadFile';
import Toast from 'react-native-toast-message';
import { getPosterData } from '../utils/GetPosterData';

const Width = Dimensions.get('window').width;

function PostProfile({ filter, postData }: any) {
  const [viewPostModal, setViewPostModal] = useState(false);
  const [currentPostId, setCurrentPostId] = useState('');

  const downloadOpcion = async () => {
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
  };
  const shareOption = async () => {
    const reqSaharing = await Sharing.isAvailableAsync();
    if (reqSaharing) {
      const uriFile = (await donwloadFile(
        postData.uriSource,
        postData.id,
        postData.typePost
      )) as any;
      Sharing.shareAsync(uriFile);
    }
  };

  const getSizePost =
    filter === 'All'
      ? (Width - 20) / 3
      : filter === 'Photo'
      ? (Width - 20) / 2
      : Width - 5;

  const getIcon = () => {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    let icon = <></>;
    if (filter === 'All') {
      switch (postData.typePost) {
        case 'Photo':
          icon = (
            <Feather
              style={styles().iconItem}
              size={20}
              color='#fff'
              name='image'
            />
          );
          break;
        case 'Video':
          icon = postData.asker ? (
            <MIcons
              style={styles().iconItem}
              name='check-decagram-outline'
              color='#fff'
              size={20}
            />
          ) : (
            <Feather
              style={styles().iconItem}
              size={20}
              color='#fff'
              name='camera'
            />
          );
          break;
        case 'Audio':
          icon = (
            <MIcons
              style={styles().iconItem}
              name='microphone-outline'
              color={Colors().text}
              size={20}
            />
          );
          break;
        default:
          break;
      }
    }
    return icon;
  };

  return (
    <View style={styles().postItemContent}  >
      {postData.typePost === 'Photo' ? (
        <TouchableOpacity onPress={() => setViewPostModal(true)} >
          <FastImage
            style={[
              styles().postItem,
              { width: getSizePost, height: getSizePost},
            ]}
            source={{
              uri: postData.uriSource,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          {getIcon()}
        </TouchableOpacity>
      ) : postData.typePost === 'Video' ? (
        <>
          {filter === 'All' ? (
            <TouchableOpacity onPress={() => setViewPostModal(true)} style={{backgroundColor:'red'}}>
              <FastImage
              style={[
                styles().postItem,
                { width: getSizePost, height: getSizePost },
              ]}
              source={{
                uri: postData.uriThumbnails,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          ) : (
            <Post
              currentPostId={currentPostId}
              setCurrentPostId={setCurrentPostId}
              key={postData.id}
              postData={postData}
            />
          )}
          {getIcon()}
        </>
      ) : postData.typePost === 'Audio' ? (
        <View>
          <View
            style={[
              styles().postItem,
              { width: getSizePost, height: getSizePost },
            ]}>
            <AudioReproductorCircle audioUri={postData.uriSource} />
          </View>
          {getIcon()}
        </View>
      ) : null}
      <PostViewer
          comments={postData.comments?.length}
          description={postData.description}
          posterData={getPosterData(postData.poster)}
          setShow={setViewPostModal}
          show={viewPostModal}
          type={postData.typePost}
          uri={postData.uriSource}
          downloadOption={downloadOpcion}
          postData={postData}
          shareOption={shareOption}
        />
    </View>
  );
}

// falta agregar el tipado
export default function PostGrid({ filter, idUser }: PostGridProps) {
  const [loading, setLoading] = useState(false);
  const [postsList, setPostsList] = useState([] as any);
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    getPostList();
  }, [filter]);

  const getPostList = async () => {
    setLoading(true);
    let { postList } = await getPostUser(idUser);

    postList = postList.filter((post: any) => {
      return user.userData.groups.indexOf(post.group.id) != -1;
    });

    const newPostFilter = () => {
      let arrayPost = [];
      switch (filter) {
        case 'All':
          arrayPost = postList;
          break;
        case 'Q&A':
          arrayPost = postList.filter(
            (post: any) => post.typePost === 'Video' && post.asker
          );
          break;
        default:
          arrayPost = postList.filter((post: any) => post.typePost === filter);
          break;
      }
      return arrayPost;
    };

    setPostsList(newPostFilter);
    setLoading(false);
  };

  const renderItem = ({ item }: any) => (
    <PostProfile filter={filter} postData={item} />
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  function ListOfPost() {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    let currentList = <></>;

    switch (filter) {
      case 'Photo':
        currentList = (
          <FlatList
            data={postsList}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(_value, index) => index.toString()}
            ListFooterComponent={null}
            ListFooterComponentStyle={{ marginTop: 90 }}
          />
        );
        break;
      case 'Video':
        currentList = (
          <FlatList
            data={postsList}
            numColumns={1}
            renderItem={renderItem}
            keyExtractor={(_value, index) => index.toString()}
            ListFooterComponent={null}
            ListFooterComponentStyle={{ marginTop: 90 }}
          />
        );
        break;
      case 'Q&A':
        currentList = (
          <FlatList
            data={postsList}
            numColumns={1}
            renderItem={renderItem}
            keyExtractor={(_value, index) => index.toString()}
            ListFooterComponent={null}
            ListFooterComponentStyle={{ marginTop: 90 }}
          />
        );
        break;
      default:
        currentList = (
          <FlatList
            data={postsList}
            numColumns={3}
            renderItem={renderItem}
            keyExtractor={(_value, index) => index.toString()}
            ListFooterComponent={null}
            ListFooterComponentStyle={{ marginTop: 90 }}
          />
        );
        break;
    }
    return currentList;
  }

  return loading ? <Loading /> : <ListOfPost />;
}

const styles = () =>
  StyleSheet.create({
    postItemContent: {
      marginHorizontal: 3,
      marginTop: 10,
      borderRadius: 8,
      backgroundColor: Colors().background,
    },
    postItem: {
      width: (Width - 20) / 3,
      height: (Width - 20) / 3,
      borderRadius: 8,
    },
    contentSkeleton: {
      width: (Width - 20) / 3,
      height: (Width - 20) / 3,
      marginLeft: 10,
      marginTop: 10,
      borderRadius: 8,
      backgroundColor: Colors().backgroundInputs,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgSkeleton: {
      width: '40%',
      resizeMode: 'contain',
    },
    iconItem: {
      position: 'absolute',
      bottom: 10,
      left: 9,
    },
  });
