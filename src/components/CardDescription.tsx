import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Audio } from 'expo-av';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../navigators/Stack';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import AvatarListView from './AvatarListView';
import { CardDescriptionProps } from '../../types/typesComponents';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type cardDescriptionComponent = StackNavigationProp<RootStackParamList, 'GroupList'>;

export default function CardDescription({
  posterData,
  typePost,
  description = '',
  inverted,
  videoUri,
  setViewPostModal,
}: CardDescriptionProps) {
  const color: StyleProp<any> = inverted ? Colors().ColorTextCard : Colors().white;
  const navigation = useNavigation<cardDescriptionComponent>();
  const [duration, setDuration] = useState();

  const getDuation = useCallback(async () => {
    try {
      if (videoUri && typeof videoUri == 'string') {
        const response = await Audio.Sound.createAsync(
          { uri: videoUri },
          { shouldPlay: false, isLooping: false }
        );

        if (response?.sound) {
          const status = await response.sound.getStatusAsync() as any;
          setDuration(status?.durationMillis);
        }
      }
    } catch (error) {
      console.error('[getDuration] Error: ', error);
    }
  }, [videoUri, setDuration]);

  useEffect(() => {
    if (typePost === 'Video') {
      getDuation();
    }
  }, [videoUri, getDuation]);

  const formatDuration = function (millis: number | undefined) {
    if (millis) {
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
    <TouchableOpacity onPress={()=> setViewPostModal && setViewPostModal(true)} style={styles().mainContainer}>
      <View style={styles().leftContainer}>
        <AvatarListView
          source={posterData.photo ? { uri: posterData.photo } : Images.user}
          showDescription={false}
          avatarSize={40}
          avatarStyle={styles().avatar}
          onPress={() => navigation.navigate('ProfileFriend', { idUser: posterData.id })}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ProfileFriend', { idUser: posterData.id })} style={styles().description}>
          <Text style={[styles().text, { color }]}>{posterData?.name}</Text>
        </TouchableOpacity>
      </View>
      {duration && (
        <View style={styles().rightContainer}>
          <View style={styles().durationTextContainer}>
            <Text style={styles().durationText}>{formatDuration(duration)}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = () =>
  StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    leftContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    rightContainer: {
      alignItems: 'flex-end',
      width: '20%',
    },
    durationTextContainer: {
      backgroundColor: 'rgba(25, 29, 33, 0.65)',
      borderRadius: 16,
      paddingVertical: 2,
      width: 48,
    },
    durationText: {
      color: Colors().white,
      textAlign: 'center',
    },
    containerTop: {
      width: '100%',
    },
    description: {
      marginLeft: 10,
    },
    text: {
      fontFamily: 'PlusJakartaSans-Regular',
      fontWeight: 'bold',
      fontSize: 17,
    },
    question: {
      fontFamily: 'PlusJakartaSans-Regular',
      textAlign: 'left',
    },
    avatar: {
      borderWidth: 2,
      borderColor: Colors().white,
    },
  });
