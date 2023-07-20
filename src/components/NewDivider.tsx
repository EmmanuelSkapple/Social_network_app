import { View, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';
import metrics from '../utils/metrics';

export default function NewDivider() {
  return (
    <View style={styles().newDividerContainer}>
      <View style={styles().front} />
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    front: {
      width: metrics.width * 0.26,
      height: 2,
      backgroundColor: Colors().LineDividerBackgroundSpan,
      alignSelf: 'center',
    },
    newDividerContainer: {
      height: 2,
      width: '100%',
      backgroundColor: Colors().LineDividerBackground,
    },
  });
