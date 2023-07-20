import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Text,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import i18n from 'i18n-js';
import { RootStackParamList } from '../navigators/Stack';

import Colors from '../utils/Colors';
import { RootState } from '../redux/appReducer';
import { uploadPost } from '../database/postFirebase';
import GroupsListPost from './GroupsListPost';
import CustomImagePicker from '../components/ImagePicker';
import Store from '../redux/Store';
import {manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import { GalleryPostProps } from '../../types/typesModals';
type galleryPostScreenProp = StackNavigationProp<
  RootStackParamList,
  'GalleryPost'
>;

type groupFeedScreenProp = StackNavigationProp<RootStackParamList, 'GroupFeed'>;



export default function GalleryPostModal({fromCamera, show, setShow }: GalleryPostProps) {
  const [source, setSource] = useState(null as any);
  const [showGroupList, setShowGroupList] = useState(false);
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation<galleryPostScreenProp>();
  const Theme = useSelector((state: RootState) => state.theme);
  const postToUpdate = useSelector(
    (state: RootState) => state.posts.postToUpdate
  );
  const posibleCurrentGroup = useSelector(
    (state: RootState) => state.groups.currentGroup
  );

  const dispatch = useDispatch();
  const UploadSource = async () => {
    setShow(false);
    let compressSource = await compressAndFlipImage(source)
    navigation.navigate('VideoPreview', {
        source: {
          uri:compressSource.uri,
          height:compressSource.height,
          width:compressSource.width,
        },
        typeSource: source.typeSource,
        originOfSource: 'gallery',
      });
  };


const compressAndFlipImage = async (source : {uri: string; width:number;height:number;typeSource :string}) => {
  let compressSource = source as any;
    if (source.typeSource === 'Photo') {
      const compressReq = await manipulateAsync(
        source.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.4, format: SaveFormat.JPEG },
      );
      compressSource = compressReq;
    }
    return compressSource;
  }


  const refreshPostInfoToUpdate = () => {
    Store.dispatch({
      type: 'setPostToUpdate',
      payload: {
        poster: {
          id: '',
          name: '',
          photo: '',
        },
        status: '',
        ask: '',
        typePost: '',
      },
    });
  };

  const cerrarModal = (visible:boolean) => {
    setSource(null);
    setErrorMessage('');
    setShow(visible);
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
      <View style={styles().ModalBack}>
        <KeyboardAvoidingView
          behavior='height'
          enabled
          style={styles().contentForm}>
          <View style={styles().content}>
             <CustomImagePicker
                setImageCallback={(source: {uri:string;height:number;width:number,typeSource:string}) => {
                  setSource(source);
                }}
                uploadCallback={UploadSource}
                showVideos
                setShow={cerrarModal}
              />
              {errorMessage.length>0 &&
                <View style={styles().messageErrorContainer}>
                 <Text style={styles().messageErrorText}>{errorMessage}</Text>
               </View>
              }
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = () =>
  StyleSheet.create({
    ModalBack: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
    },
   
    contentForm: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    text: {
      color: Colors().text,
      fontSize: 16,
    },
    content: {
      backgroundColor: Colors().background,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      height: '95%',
      width: '100%',
    },
    messageErrorContainer:{
      position:'absolute',
      width:'100%',
      bottom:30
    },
    messageErrorText:{
      textAlign:'center',
      color:Colors().error,
      backgroundColor:'rgba(255,255,255,0.8)',
      width:'80%',
      alignSelf:'center',
      padding:5,
      borderRadius:10
    },
  });
