import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../utils/Colors';

import { convertTime } from '../utils/DateAndTime';
import { CancelPromise } from '../modals/PostViewer';
import metrics from '../utils/metrics';

import { AudioReproProps, AudioOperation } from '../../types/typesComponents';

const screenWidth = Dimensions.get('screen').width;


function AudioReproductor({ audioUri }: AudioReproProps) {
  const [timeToShow, setTimeToShow] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackObject, setPlaybackObject] = useState(new Audio.Sound());
  const [playbackStatus, setPlaybackStatus] = useState(null as any);
  const slideCircle = useRef(new Animated.Value(0)).current;
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isActiveCrono, setIsActiveCrono] = useState(false);

  function getDurationFormatted(secondsInt: any) {
    const minutes = secondsInt / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  useEffect(() => {
    let cancel: CancelPromise;
    const operation = uploadAudio();
    operation.start();
    cancel = operation.cancel;
  }, []);

  const uploadAudio = (): AudioOperation => {
    let cancel: CancelPromise;
    const start = (): Promise<any> =>
      new Promise<any>((resolve, reject) => {
        cancel = reject;
        if (playbackObject !== null && playbackStatus === null) {
          playbackObject
            .loadAsync({ uri: audioUri }, { shouldPlay: false })
            .then((res) => {
              cancel = undefined;
              setPlaybackStatus(res);
              resolve(res);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }
      });

    return { start, cancel };
  };

  useEffect(() => {
    if (playbackStatus != null) {
      setTimeToShow(getDurationFormatted(playbackStatus.durationMillis));
      setDuration(playbackStatus.durationMillis);
    }
  }, [playbackStatus]);

  // useEffect(() => {
  //   setCurrentPosition(0)
  // },[])

  useEffect(() => {
    let interval = null as any;
    clearInterval(interval);
    if (isActiveCrono) {
      interval = setInterval(() => {
        if (currentPosition < duration) {
          setCurrentPosition((currentPosition) => currentPosition + 1000);
          setSliderValue(currentPosition / duration);
          setTimeToShow(getDurationFormatted(currentPosition));
        } else {
          setIsActiveCrono(false);
          setIsPlaying(false);
          setSliderValue(0);
          setCurrentPosition(0);
          setTimeToShow(getDurationFormatted(duration));
          clearInterval(interval);
        }
      }, 1000);
    } else if (!isActiveCrono) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [currentPosition, duration, isActiveCrono]);

  const handleAudioPlayPause = async () => {
    try {
      // It will pause our audio
      if (playbackStatus.durationMillis === playbackStatus.positionMillis) {
        setIsPlaying(false);
      }
      if (playbackStatus.isPlaying) {
        const status = await playbackObject.pauseAsync();
        setIsPlaying(false);
        return setPlaybackStatus(status);
      }

      // It will resume our audio
      if (!playbackStatus.isPlaying) {
        await playbackObject.setPositionAsync(0);
        const status = await playbackObject.playAsync();
        if (status.isLoaded) {
          // setSliderValue(playbackStatus.positionMillis);
          setIsPlaying(true);
          setIsActiveCrono(true);
          return setPlaybackStatus(status);
        }
        throw Error;
      }
    } catch (error) {
      console.log('error in play/pause ', error);
    }
  };

  // console.log(playbackStatus);

  const pauseAudio = async () => {
    try {
      const status = await playbackObject.setStatusAsync({
        shouldPlay: false,
      });
      setIsPlaying(false);
      return setPlaybackStatus(status);
    } catch (error) {
      console.log('error in pause ', error);
    }
  };

  const moveAudio = async (value: any) => {
    try {
      const status = await playbackObject.setPositionAsync(
        Math.floor(duration * value)
      );
      setCurrentPosition(Math.floor(duration * value));
      // setSliderValue(value);
      return setPlaybackStatus(status);
    } catch (error) {
      console.log('error moving audio', error);
    }
  };

  return (
    <View style={styles().container}>
      <TouchableOpacity onPress={handleAudioPlayPause} style={styles().onPlay}>
        <View style={styles().audioIcon}>
          <FontAwesome5
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color='#E45975'
          />
        </View>
      </TouchableOpacity>
      <View style={styles().containerProgress}>
        {/* <View style={styles().barProgress}>
          <Animated.View style={styles().circleProgress} />
        </View> */}
        <Slider
          style={{ width: metrics.width * 0.41, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={Colors().minimumTrackTintColor}
          maximumTrackTintColor={Colors().maximumTrackTintColor}
          thumbTintColor={Colors().primary}
          onValueChange={(value) => {
            setTimeToShow(
              convertTime(value * Math.trunc(duration / 1000)) as any
            );
          }}
          onSlidingStart={async () => {
            if (isPlaying) return;

            try {
              await pauseAudio();
            } catch (error) {
              console.log('error inside onSlidingStart callback', error);
            }
          }}
          onSlidingComplete={async (value) => {
            await moveAudio(value);
            setTimeToShow(
              convertTime(value * Math.trunc(duration / 1000)) as any
            );
          }}
          value={sliderValue}
        />
      </View>
      <View>
        <Text style={styles().text}>{timeToShow}</Text>
      </View>
    </View>
  );
}

export default AudioReproductor;

const styles = () =>
  StyleSheet.create({
    container: {
      width: screenWidth * 0.7,
      backgroundColor: Colors().PostAudioBackground,
      flexDirection: 'row',
      paddingHorizontal: 5,
      borderRadius: 26,
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 15,
      height: 52,
    },
    containerProgress: {
      width: '65%',
      position: 'relative',
    },
    barProgress: {
      height: 2,
      width: '100%',
      backgroundColor: Colors().PostAudioBackGroundLine,
    },
    circleProgress: {
      width: 20,
      height: 20,
      borderRadius: 50,
      backgroundColor: Colors().primary,
      position: 'absolute',
      left: 0,
      top: -10,
    },
    containerBtnPlay: {
      width: 45,
      height: 45,
      borderRadius: 23,
      backgroundColor: Colors().PostAudioBackGroundButtonBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: Colors().colorTextAudio,
      fontSize: 14,
      fontFamily: 'PlusJakartaSans-Regular',
    },
    onPlay: {
      marginLeft: 3,
    },
    audioIcon: {
      alignItems: 'center',
      backgroundColor: Colors().audioIconColor,
      borderRadius: 21.5,
      height: 43,
      justifyContent: 'center',
      width: 43,
    },
  });
