import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';

import {launchImageLibrary} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import Colors from '../utils/Colors';
import { ImageGalleryItem } from './ImageGalleryItem';
import { RootStackParamList } from '../navigators/Stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { FlatList, GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Loading from './Loading';
import GalleryAlbums from './GalleryAlbums';
import { CustomImagePickerProps } from '../../types/typesComponents';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const ITEM_HEIGHT = (screenWidth - 50) / 3; // fixed height of item component

type groupFeedScreenProp = StackNavigationProp<RootStackParamList, 'GroupFeed'>;


function CustomImagePicker({
  showVideos = false,
  uploadCallback,
  setShow,
  setImageCallback,
}: CustomImagePickerProps) {
  const [albums, setAlbums] = useState(null as any);
  const [photos, setPhotos] = useState({} as any);
  const [activeAlbum, setActiveAlbum] = useState({ title: 'Recents' });
  const [endCursor, setEndCursor] = useState('');
  const [typeOfSorce, setTypeOfSorce] = useState('photo');
  const [imageSelect, setImageSelect] = useState({} as any);
  const [showModal, setShowModal] = useState<boolean>(false);
  const positionGallery = useSharedValue(0);

  const navigation = useNavigation<groupFeedScreenProp>();

  useEffect(() => {
    loadCameraRoll();
  }, []);


  const getPermissionOfCamera = async() => {
        // Check Permission for android
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Toast.show({
            type: 'ToastError',
            props: {
              hide: () => {
                Toast.hide();
              },
              message:
                'Storage Permission Denied. Please allow Matter to access photos.',
            },
          });
        }
  }

  const loadCameraRoll = async (type = "photo") => {
    setTypeOfSorce(type);
    type == 'video'? setActiveAlbum({title:'Video'}) :  setActiveAlbum({title:'Recents'})
    try {
      getPermissionOfCamera();
      const albums = await MediaLibrary.getAlbumsAsync();
      const albumsFilter = albums.filter(
        (item, index, self) =>
          item.assetCount > 1 &&
          index === self.findIndex((t) => t.title === item.title)
      );
      const photosRoll = await MediaLibrary.getAssetsAsync({
        mediaType: type == 'video'? [MediaLibrary.MediaType.video] : [MediaLibrary.MediaType.photo],
        first: 100,
        sortBy: MediaLibrary.SortBy.creationTime,
      });
      setEndCursor(photosRoll.endCursor);      
      setPhotos( type == 'video'?{ Video: photosRoll.assets }:{ Recents: photosRoll.assets });
    
      setAlbums([{ title: 'Video' },{ title: 'Recents' }, ...albumsFilter]);
    } catch (error) {
      console.log(error);
    }
  };

  const loadPhotos = async (activeAlbum: any) => {    
    setTypeOfSorce('photo');
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message:
              'Storage Permission Denied. Please allow Matter to access photos.',
          },
        });
      }

      let photosRoll;

      if (endCursor != null) {
        photosRoll = await MediaLibrary.getAssetsAsync({
          mediaType: [MediaLibrary.MediaType.photo],
          first: 100,
          album: activeAlbum || 'Recents',
        });
      } else {
        photosRoll = await MediaLibrary.getAssetsAsync({
          mediaType: [MediaLibrary.MediaType.photo],
          first: 100,
          album: activeAlbum || 'Recents',
          after: endCursor,
        });
      }

      setEndCursor(photosRoll.endCursor);
      if (photos[activeAlbum.title || 'Recents']) {
        setPhotos({
          ...photos,
          [activeAlbum.title || 'Recents']: [
            ...photos[activeAlbum.title || 'Recents'],
            ...photosRoll.assets,
          ],
        });
      } else {
        setPhotos({ ...photos, [activeAlbum.title]: photosRoll.assets });
      }
    } catch (error) {
      console.log('error al cargar photos', error);
    }
  };

  const onPressItem = ( uri : string,height : number, width: number) => {
    if(typeOfSorce == 'photo'){
        setImageCallback({
          uri,
          height,
          width,
          typeSource : 'Photo'
        });
        setImageSelect(uri);
        positionGallery.value = 400;
    }else{
      setImageCallback({
        uri,
        height,
        width,
        typeSource : 'Video'
      });
      setImageSelect(uri);
      positionGallery.value = 400;
    }
  };
 
  
  const getItemLayout = (data: any, index: any) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * data.length,
    index,
  });

  return (
      <View style={styles().pickerView}>
        <View style={styles().headerGallery}>
        <TouchableOpacity
          style={styles().itemMenu}
          onPress={() => setShow(false)}>
          <Feather
            name='arrow-left'
            color={Colors().text}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles().itemMenu}
          onPress={() => setShowModal(!showModal)}>
          <Text
            style={styles().textAlbumActive}>
            {activeAlbum.title}
          </Text>
          <AntDesign
            name='down'
            color={Colors().text}
            style={styles().iconAlbumDown}
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles().itemMenu}
          onPress={() => uploadCallback()}>
          <Text
            style={styles().textAlbumActive}>
            Select
          </Text>
        </TouchableOpacity>
        </View>
       

        {showModal && (
          <GalleryAlbums
            data={albums}
            show={showModal}
            title={'Gallery albums'}
            setAlbum={setActiveAlbum}
            setShow={setShowModal}
            loadPhotos={loadPhotos}
            loadCamRoll={(type : string)=>loadCameraRoll(type)}
          />
        )}

        {!photos[activeAlbum.title] ? (
          <View style={styles().loadingView}>
            <Loading background={Colors().background} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={
                photos[activeAlbum.title].length &&
                photos[activeAlbum.title].length > 0
                  ? photos[activeAlbum.title]
                  : []
              }
              style={styles().gridContainer}
              renderItem={({ item, index }: any) => (
                <ImageGalleryItem
                  key={`${index}${item.id.toString()}${activeAlbum}`}
                  item={item}
                  activeItem={imageSelect}
                  setImage={(uri: string,height:number,width:number) => onPressItem(uri,height,width)}
                />
              )}
              numColumns={3}
              initialNumToRender={100}
              maxToRenderPerBatch={100}
              windowSize={100}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              getItemLayout={getItemLayout}
              ListEmptyComponent={
                <View style={styles().emptyView}>
                  <Text style={styles().emptyText}>Album empty.</Text>
                </View>
              }
              keyExtractor={(item, index) =>
                `${index}${item.id.toString()}${activeAlbum}`
              }
            />
          </View>
        )}
      </View>
  );
}

const styles = () =>
  StyleSheet.create({
    gridContainer: {
      height: screenHeight * 0.6,
      width: '100%',
    },
    headerGallery:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      width:'90%',
      alignSelf:'center'
    },
    emptyView: {
      flex: 1,
      alignItems: 'center',
      marginTop: 30,
    },
    emptyText: {
      fontSize: 18,
      color: '#A0A7B6',
    },
    loadingView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listAlbums: {
      height: 40,
      width: '90%',
    },
    itemMenu: {
      flexDirection: 'row',
      marginVertical: 10,
      paddingHorizontal: 30,
    },
    pickerView: {
      backgroundColor: Colors().background,
      marginTop: 10,
      position: 'absolute',
      width: '100%',
      height:'100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textAlbumActive: {
      color: Colors().text,
      fontSize: 16,
      fontFamily:'PlusJakartaSans-Medium',
      marginRight: 10,
    },
    iconAlbumDown: {
      alignSelf: 'flex-end',
    },
  });

export default CustomImagePicker;