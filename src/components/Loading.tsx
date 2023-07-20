import React from 'react';
import {
  View, ActivityIndicator, StyleSheet, Platform,
} from 'react-native';
import Colors from '../utils/Colors';

import { LoadingProps } from '../../types/typesComponents'; 

export default function Loading({ background, color }: LoadingProps) {
  return (
    <View
      style={[
        styles().loadingContainer,
        background ? { backgroundColor: background } : {},
      ]}
    >
      {Platform.OS === 'ios' ? (
        <ActivityIndicator
          style={[
            { backgroundColor: Colors().background },
            background ? { backgroundColor: background } : {},
          ]}
          size="small"
          color={color ? color : Colors().primary}
        />
      ) : (
        <ActivityIndicator
          style={[
            { backgroundColor: Colors().background },
            background ? { backgroundColor: background } : {},
          ]}
          size="large"
          color={color ? color : Colors().primary}
        />
      )}
    </View>
  );
}

const styles = () => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors().background,
    borderRadius: 50,
  },
  loading: {
    height: 30,
    width: 30,
  },
});
