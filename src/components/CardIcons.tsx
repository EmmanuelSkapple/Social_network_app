import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';

import Colors from '../utils/Colors';
import { CardIconsProps } from '../../types/typesComponents';

export function RightCardIcons({
  styleContainer,
  iconSize,
  typePost = '',
  iconColor,
  comments = 0,
  onPressShare,
  onPressComment,
  onPressDownload,
  progressLoading,
}: CardIconsProps) {
  return (
    <View style={styleContainer}>
      <TouchableOpacity style={[styles().iconsCard, { backgroundColor: typePost !== 'Audio' ? 'rgba(25, 29, 33, 0.65)' : '' }]} onPress={onPressComment}>
        {comments > 0 && (
          <View style={styles().badge}>
            <Text style={styles().textBadge}>{comments}</Text>
          </View>
        )}
        <Feather name='message-circle' size={iconSize} color={iconColor || Colors().white} />
      </TouchableOpacity>

      {progressLoading > 0 && progressLoading < 1 ? (
        <Progress.Circle
          progress={progressLoading}
          size={iconSize}
          thickness={2}
          color={Colors().white}
        />
      ) : (
        <TouchableOpacity style={[styles().iconsCard, { backgroundColor: typePost !== 'Audio' ? 'rgba(25, 29, 33, 0.65)' : '' }]} onPress={onPressDownload}>
          <Feather name='download-cloud' size={iconSize} color={iconColor || Colors().white} />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles().iconsCard, { backgroundColor: typePost !== 'Audio' ? 'rgba(25, 29, 33, 0.65)' : '' }]} onPress={onPressShare}>
        <FontAwesome name='share' size={iconSize} color={iconColor || Colors().white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    iconsCard: {
      alignItems: 'center',
      borderRadius: 36,
      height: 36,
      justifyContent: 'center',
      marginBottom: 10,
      width: 36,
    },
    badge: {
      alignSelf: 'flex-end',
      backgroundColor: Colors().primary,
      borderRadius: 50,
      height: 17,
      position: 'absolute',
      right: -2,
      top: -6,
      width: 17,
      zIndex: 1,
    },
    textBadge: {
      color: 'white',
      textAlign: 'center',
      fontSize: 12,
    },
  });
