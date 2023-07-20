import * as React from 'react';
import { useRef, useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  CameraDeviceFormat,
  CameraRuntimeError,
  FrameProcessorPerformanceSuggestion,
  PhotoFile,
  sortFormats,
  useCameraDevices,
  useFrameProcessor,
  VideoFile,
} from 'react-native-vision-camera';
import { Camera, frameRateIncluded } from 'react-native-vision-camera';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/core';
import { useIsForeground } from '../../hooks/useIsForeground';
import { CaptureButton } from '../components/buttons/RecordButton';
import metrics from '../utils/metrics';
import * as MediaLibrary from 'expo-media-library';
import GalleryPostModal from '../modals/GalleryPost';
import Toast from 'react-native-toast-message';
import { compressAndFlipImage } from '../utils/Camera';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/appReducer';
import Colors from '../utils/Colors';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;
const HEADER_HEIGHT = Platform.OS === 'android' ? 60 : 80;

export default function CameraPost({ navigation }: any): React.ReactElement {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [imageIconGallery, setImageIconGallery] = useState<string | null>(null);
  const [openGalleryPost, setOpenGalleryPost] = useState(false);

  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const [enableHdr, setEnableHdr] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false);
  const [videoList,setVideoList] = useState([] as any);
  const [loading,setLoading] = useState(false);

  const userData = useSelector((state: RootState) => state.user.userData);

  const dispatch = useDispatch();


  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front]
  );
  const supportsFlash = device?.hasFlash ?? false;

  useEffect(() => {
    getLastImageGallery();
  }, []);

  useEffect(() => {
    isFocussed && setVideoList([])
  }, [isFocussed])
  

  const getPermissionOfGallery = async () => {
    // Check Permission for android
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: 'Storage Permission Denied. Please allow Matter to access photos.',
        },
      });
    }
    return true;
  };

  const getLastImageGallery = async () => {
    await getPermissionOfGallery();
    const photosRoll = await MediaLibrary.getAssetsAsync({
      first: 1,
      sortBy: MediaLibrary.SortBy.creationTime,
    });
    setImageIconGallery(photosRoll.assets[0].uri);
  };

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, 20);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton]
  );
  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);
  const onMediaCaptured = async(media: PhotoFile | VideoFile, type: 'photo' | 'video')  => {
      type == 'photo'? compressAndSendPhoto(media.path):setVideoList([...videoList,media.path]);
    }
 

  const mergeAndSendVideo = async () => {
    if(videoList.length>0){
      navigation.navigate('VideoPreview', {
        source: {uri: "",height:1080,width:720},
        videoListOfCamera:videoList,
        typeSource: 'Video',
        originOfSource: 'camera',
      });
    }
  };
  
  const compressAndSendPhoto = async (uri : string) => {
    navigation.navigate('VideoPreview', {
      source: await  compressAndFlipImage(uri,cameraPosition),
      typeSource: 'Photo',
      originOfSource: 'camera',
    });
  };

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  }, []);
  //#endregion

  //#region Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  //#endregion

  //#region Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useEffect(() => {
    Camera.getMicrophonePermissionStatus().then((status) =>
      setHasMicrophonePermission(status === 'authorized')
    );
  }, []);
  //#endregion

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startZoom?: number }
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP
      );
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });
  //#endregion

  const goToGalleryPost = () => {
    setOpenGalleryPost(!openGalleryPost);
  };

  return (
    <View style={styles().container}>
       <View style={styles().headerCam}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <Feather color='#FFF' size={35} name='x' />
        </TouchableOpacity>
      </View>
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                hdr={enableHdr}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                isActive={isActive}
                onInitialized={onInitialized}
                onError={onError}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={true}
                video={true}
                audio={hasMicrophonePermission}
                orientation='portrait'
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}
      <View style={styles().footerCam}>
        <CaptureButton
          style={styles().captureButton}
          camera={camera}
          onMediaCaptured={onMediaCaptured}
          cameraZoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          flash={supportsFlash ? flash : 'off'}
          enabled={isCameraInitialized && isActive}
          setIsPressingButton={setIsPressingButton}
        />
        <View style={styles().buttonsContainer}>
          <View style={styles().leftButtons}>
            <TouchableOpacity onPress={goToGalleryPost}>
              {imageIconGallery != null && (
                <Image
                  style={styles().iconGallery}
                  source={{
                    uri: imageIconGallery,
                  }}
                />
              )}
            </TouchableOpacity>
            {supportsFlash && (
              <TouchableOpacity style={styles().button} onPress={onFlashPressed}>
                <IonIcon name={flash === 'on' ? 'flash' : 'flash-off'} color='white' size={24} />
              </TouchableOpacity>
            )}
          
          </View>
          <View style={styles().rightButtonRow}>
          {supportsCameraFlipping && (
              <TouchableOpacity style={styles().button} onPress={onFlipCameraPressed}>
                <IonIcon name='camera-reverse' color='white' size={24} />
              </TouchableOpacity>
            )}
            {videoList.length > 0  && !loading &&
              <TouchableOpacity style={styles().checkButton} onPress={()=>mergeAndSendVideo()}>
                <Feather
                  style={{ opacity: videoList.length == 0 ? 0 : 1 }}
                  color='#FFF'
                  size={30}
                  name='check'
                />
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
      <GalleryPostModal fromCamera={true} show={openGalleryPost} setShow={setOpenGalleryPost} />
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    captureButton: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: 10,
    },
    headerCam: {
      width: '100%',
      height: HEADER_HEIGHT+20,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 3,
      top:0,
      paddingTop:60,
      paddingLeft:30

    },
    footerCam: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: 'transparent',
      borderRadius: 20,
      width: '80%',
      height: metrics.height / 9,
      marginBottom: metrics.height * 0.1,
      alignSelf: 'center',
      position: 'relative',
    },
    button: {
      marginBottom: 10,
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: BUTTON_SIZE / 2,
      backgroundColor: 'rgba(140, 140, 140, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonsContainer: {
      position: 'absolute',
      zIndex: -1,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
    },
    leftButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      width: '30%',
    },
    rightButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      width: '30%',
    },
   

    text: {
      color: 'white',
      fontSize: 11,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    iconGallery: {
      width: 34,
      height: 34,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#FEFEFE',
    },
    checkButton:{
      backgroundColor:Colors().primary,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:50,
      width:36,
      height:36
    },
  });
