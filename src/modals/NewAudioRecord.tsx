import { useEffect, useRef, useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { Audio } from 'expo-av';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import I18n from 'i18n-js';
import { RootStackParamList } from '../navigators/Stack';

import Colors from '../utils/Colors';
import { RootState } from '../redux/appReducer';
import Divider from '../components/Divider';
import { uploadPost } from '../database/postFirebase';
import AudioReproductor from '../components/AudioReproductor';
import GroupsListPost from './GroupsListPost';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';

type groupFeedScreenProp = StackNavigationProp<RootStackParamList, 'GroupFeed'>;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import { NewAudioRecordProps, HeaderPostModalProps} from '../../types/typesModals';


function NewAudioRecord({ show, setShow }: NewAudioRecordProps) {
  const navigation = useNavigation<groupFeedScreenProp>();
  const [recording, setRecording] = useState(null as any);
  const [showGroupList, setShowGroupList] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [objAudio, setObjAudio] = useState(
    {} as {
      file: string;
      sound: any;
      duration: number;
    }
  );
  const [message, setMessage] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isActiveCrono, setIsActiveCrono] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const user = useSelector((state: RootState) => state.user.userData);
  const posibleCurrentGroup = useSelector(
    (state: RootState) => state.groups.currentGroup
  );
  const dispatch = useDispatch();
  const animation = useRef(null);

  const LIMIT_PER_AUDIO = 60;

  const checkPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    return status;
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    let interval = null as any;
    if (isActiveCrono) {
      interval = setInterval(() => {
        if (seconds < LIMIT_PER_AUDIO) {
          setSeconds((seconds) => seconds + 1);
          setProgress(seconds / LIMIT_PER_AUDIO);
        }
      }, 1000);
    } else if (!isActiveCrono && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActiveCrono, seconds]);

  async function startRecording() {
    try {
      setShowPreview(false);
      setSeconds(0);
      setProgress(0);
      setIsActiveCrono(true);
      Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      if (seconds < LIMIT_PER_AUDIO) {
        const permission = await Audio.getPermissionsAsync();
        if (permission.status === 'granted') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );

          setRecording(recording);
        } else {
          setMessage('Please grant permission to app to access microphone');
        }
      } else {
        stopRecording();
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      setSeconds(0);
      setIsActiveCrono(false);
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const { sound, status } = await recording.createNewLoadedSoundAsync();
      setObjAudio({
        sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      });
      setShowPreview(true);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  function getDurationFormatted(millis: any) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    return seconds;
  }

  const postAudio = (currentGroup: any) => {
    if (currentGroup.id) {
      const dataPost = {
        poster: {
          id: user.uid,
          name: user.firstname,
          photo: user.photo,
        },
        status:'inList',
        ask: 'Posted an Update',
        typePost: 'Audio',
      };
      uploadPost(objAudio.file, dataPost, dispatch, {
        name: currentGroup.name,
        id: currentGroup.id,
        post: currentGroup.post,
        membersGroup: currentGroup.members,
      },
      ''
      );
      navigation.navigate('GroupFeed', { idGroup: currentGroup.id });
      setShow(!show);
    } else {
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
          message: 'Error!, Select a group',
        },
      });
    }
  };

  const postToCurrentGroup = async (currentGroup: Object) => {
    postAudio(currentGroup);
  };

  const showModalGroup = () => {
    posibleCurrentGroup.id
      ? postAudio(posibleCurrentGroup)
      : setShowGroupList(true);
  };

  return (
    <Modal
      animationType='slide'
      visible={show}
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        setShow(!show);
        setSeconds(0);
        setIsActiveCrono(false);
        setRecording(undefined);
        setShowPreview(false);
      }}>
      <TouchableOpacity
        style={styles().ModalBack}
        activeOpacity={1}
        onPress={() => {
          setShow(!show);
          setSeconds(0);
          setIsActiveCrono(false);
          setRecording(undefined);
          setShowPreview(false);
        }}>
        <KeyboardAvoidingView
          behavior='height'
          enabled
          style={styles().contentForm}>
          <View style={styles().opcions}>
            <HeaderPostModal
              objAudio={objAudio}
              setShowGroupList={() => showModalGroup()}
            />
            {isActiveCrono ? (
              <Text
                style={[
                  styles().subTitleModal,
                  { textAlign: 'center', fontSize: 20, marginTop: 20 },
                ]}>
                Listening...
              </Text>
            ) : showPreview ? (
              <Text
                style={[
                  styles().subTitleModal,
                  { textAlign: 'center', fontSize: 20, marginTop: 20 },
                ]}>
                Hold to new record
              </Text>
            ) : (
              <Text
                style={[
                  styles().subTitleModal,
                  { textAlign: 'center', fontSize: 20, marginTop: 20 },
                ]}>
                Hold to record
              </Text>
            )}
            <View>
              {isActiveCrono && (
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: screenWidth - 50,
                    alignSelf: 'center',
                  }}
                  speed={0.5}
                  loop
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require('../../assets/animations/soundWaves.json')}
                />
              )}
            </View>
            {showPreview && (
              <View style={styles().contentAudioPreview}>
                <AudioReproductor audioUri={objAudio.file} />
              </View>
            )}
            <View style={styles().contentAudioBtn}>
              <TouchableOpacity
                activeOpacity={1}
                onPressOut={() => stopRecording()}
                onPressIn={() => startRecording()}
                style={[
                  styles().audioBtn,
                  isActiveCrono && {
                    backgroundColor: '#4FC0D5',
                  },
                ]}>
                <MIcons
                  name='microphone-outline'
                  color={Colors().textBtnPrimary}
                  size={screenWidth / 12}
                />
              </TouchableOpacity>
            </View>
            <View style={styles().inputLittleMoreContainer}>
              <TextInput
                placeholder={I18n.t('tellALittleMore')}
                numberOfLines={4}
                style={styles().inputLittleMore}
                onChangeText={setDescription}
                value={description}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
      <GroupsListPost
        SelectGroup={postToCurrentGroup}
        show={showGroupList}
        setShow={setShowGroupList}
      />
    </Modal>
  );
}

function HeaderPostModal({ objAudio, setShowGroupList }: HeaderPostModalProps) {
  return (
    <View style={styles().headerContainer}>
      <View style={styles().headerFormModal}>
        <Text style={styles().subTitleModal}>POST</Text>
        <Text style={styles().titleModal}>Audio</Text>
      </View>
      <Divider />

      <TouchableOpacity
        onPress={() => (objAudio ? setShowGroupList(true) : null)}
        style={styles().closeBtn}>
        <MIcons name='send-circle' color={Colors().primary} size={40} />
      </TouchableOpacity>
    </View>
  );
}

export default NewAudioRecord;

const styles = () =>
  StyleSheet.create({
    container: {},
    ModalBack: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    headerContainer: {
      position: 'relative',
    },
    contentForm: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    text: {
      color: Colors().text,
      fontSize: 16,
      marginLeft: 20,
    },
    textBtn: {
      color: Colors().text,
      fontSize: 16,
      marginLeft: 20,
      textAlign: 'center',
    },
    headerFormModal: {
      marginBottom: 10,
    },
    opcions: {
      width: '100%',
      height: screenHeight * 0.6,
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      padding: 15,
      backgroundColor: Colors().background,
    },
    progressCircle: {
      position: 'absolute',
      top: 0,
    },
    contentAudioPreview: {
      width: '100%',
      marginTop: 20,
    },
    contentAudioBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: screenHeight * 0.05,
    },
    audioBtn: {
      borderRadius: 90,
      backgroundColor: Colors().primary,
      width: screenWidth / 6,
      height: screenWidth / 6,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 35,
      marginBottom: 20,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: Colors().primary,
      marginLeft: 10,
    },
    opcion: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 10,
      position: 'relative',
    },
    titleModal: {
      fontSize: 20,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: Colors().text,
    },
    subTitleModal: {
      fontSize: 12,
      fontWeight: '600',
      fontStyle: 'normal',
      textAlign: 'left',
      color: Colors().newPlaceHolder,
    },

    closeBtn: {
      position: 'absolute',
      right: 5,
      top: 5,
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
    textInput: {
      backgroundColor: Colors().backgroundInputs,
      width: '90%',
      alignSelf: 'center',
      padding: 15,
      fontSize: 18,
      borderRadius: 10,
      color: Colors().text,
    },
    membersContainer: {
      width: '90%',
      alignSelf: 'center',
      marginTop: 10,
    },
    selectGroupBtnContainer: {
      marginTop: 10,
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
    membersTitle: {
      color: Colors().placeholderInverted,
      fontSize: 16,
      fontWeight: '600',
      fontStyle: 'normal',
      lineHeight: 24,
      letterSpacing: 0,
      marginBottom: 15,
    },

    memberItemContainer: {
      position: 'relative',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    profileImage: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      borderWidth: 2,
      borderColor: Colors().primary,
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    inputLittleMoreContainer: {
      padding: 10,
      paddingTop: 20,
      width: '100%',
    },
    inputLittleMore: {
      backgroundColor: Colors().inputTellLittleMore,
      borderRadius: 5,
      fontSize: 14,
      fontWeight: '200',
      padding: 5,
      textAlignVertical: 'top',
    },
  });
