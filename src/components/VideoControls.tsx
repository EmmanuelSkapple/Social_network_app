import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import MaterialIcon  from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../utils/Colors';
import { VideoControlProps } from '../../types/typesComponents';

const VideoControls = ({
  playbackInstance,
  playbackInstanceInfo,
  togglePlay,
}: VideoControlProps) => {
  const formatDuration = function (millis: number | undefined) {
    if (millis !== undefined) {
      let minutes = Math.floor(millis / 60000);
      let seconds = parseFloat(((millis % 60000) / 1000).toFixed(0));
      return seconds == 60
        ? String(minutes + 1).padStart(2, '0') + ':00'
        : String(minutes).padStart(2, '0') + ':' + (seconds < 10 ? '0' : '') + seconds;
    } else {
      return '00:00';
    }
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.endText}>{formatDuration(playbackInstanceInfo.position)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumTrackTintColor={Colors().primary}
          maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
          thumbTintColor={Colors().white}
          thumbImage={require('../../assets/images/Knob.png')}
          value={
            playbackInstanceInfo.duration
              ? playbackInstanceInfo.position / playbackInstanceInfo.duration
              : 0
          }
          onSlidingStart={() => {
            if (playbackInstanceInfo.state === 'Playing') {
              togglePlay();
            }
          }}
          onSlidingComplete={async (value: number | undefined) => {
            if (value) {
              const position = value * playbackInstanceInfo.duration;
              if (playbackInstance) {
                await playbackInstance.setStatusAsync({
                  positionMillis: position,
                  shouldPlay: true,
                });
              }
            }
          }}
        />
        <View>
          <Text style={styles.endText}>{formatDuration(playbackInstanceInfo.duration)}</Text>
        </View>
      </View>
    </View>
  );
};

export default VideoControls;

const styles = StyleSheet.create({
  endText: {
    color: '#FFF',
    fontSize: 12,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  slider: {
    flex: 1,
  },
});
