import { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { Audio } from 'expo-av';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import Colors from '../utils/Colors';
import { AudioReproCircleProps } from '../../types/typesComponents';


function AudioReproductorCircle({ audioUri }: AudioReproCircleProps) {
  const [timeToShow, setTimeToShow] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackObject, setPlaybackObject] = useState(new Audio.Sound());
  const [playbackStatus, setPlaybackStatus] = useState(null as any);
  const [progress, setProgress] = useState(0);
  const mountedRef = useRef(true);

  function getDurationFormatted(secondsInt: any) {
    const minutes = secondsInt / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  useEffect(() => {
    uploadAudio();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (playbackStatus != null) {
      setTimeToShow(getDurationFormatted(playbackStatus.durationMillis));
    }
  }, [playbackStatus]);

  const uploadAudio = async () => {
    if (playbackObject !== null && playbackStatus === null) {
      const status = await playbackObject.loadAsync(
        { uri: audioUri },
        { shouldPlay: false }
      );
      if (!mountedRef.current) return null;
      return setPlaybackStatus(status);
    }
  };

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
        // setSliderValue(playbackStatus.positionMillis);
        setIsPlaying(true);
        return setPlaybackStatus(status);
      }
    } catch (error) {
      console.log('error in play/pause ', error);
    }
  };

  return (
    <View style={styles().container}>
      <Progress.Circle
        progress={progress}
        size={80}
        thickness={4}
        color={Colors().primary}
        style={styles().progressCircle}
      />
      <TouchableOpacity
        onPress={handleAudioPlayPause}
        style={styles().containerBtnPlay}>
        <MIcons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={50}
          color={Colors().PostAudioBackGroundButtonBackground}
        />
      </TouchableOpacity>
      <Text style={styles().textDuration}>{timeToShow}</Text>
    </View>
  );
}

export default AudioReproductorCircle;

const styles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 7,
      backgroundColor: Colors().PostAudioBackGroundButtonBackground,
    },

    containerBtnPlay: {
      width: 70,
      height: 70,
      borderRadius: 70,
      backgroundColor: Colors().primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: Colors().text,
      fontSize: 14,
      fontWeight: '500',
      fontStyle: 'normal',
    },
    progressCircle: {
      position: 'absolute',
      alignSelf: 'center',
    },
    textDuration: {
      position: 'absolute',
      bottom: 0,
      right: 5,
      color: Colors().text,
    },
  });
