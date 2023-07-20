import React, { useEffect, useState } from 'react';
import {
  Image, Modal, StyleSheet, Text, View,
} from 'react-native';
import Animated, { EasingNode } from 'react-native-reanimated';
import { runTiming } from 'react-native-redash';
import { useSelector } from 'react-redux';
import Colors from '../utils/Colors';
import CircularProgress from './CircularProgress';
import Images from '../utils/Images';
//* Redux
import { RootState } from '../redux/appReducer';
import { LoaderProps,InfiniteLoaderProps } from '../../types/typesComponents';

const { Clock } = Animated;


const clock = new Clock();

export function Loader({ progress, text }: LoaderProps) {
  const Theme = useSelector((state: RootState) => state.theme);

  const config = {
    duration: 10 * 1000,
    toValue: progress,
    easing: EasingNode.linear,
  };
  return (
    <View style={styles(Theme).container}>
      <CircularProgress progress={runTiming(clock, 0, config as any)} />
      <Image source={Images.logoLoader} style={styles(Theme).logo} />
      <Text style={styles(Theme).text}>{text}</Text>
    </View>
  );
}

export function InfiniteLoader() {
  const Theme = useSelector((state: RootState) => state.theme);

  const [showModal, setShowModal] = useState(true);
  useEffect(() => {
    const timerId = setTimeout(() => setShowModal(false), 20000);
    return () => {
      clearTimeout(timerId);
    };
  }, []);
  const config = {
    duration: 10 * 30000,
    toValue: 100,
    easing: EasingNode.linear,
  };

  return (
    <Modal animationType="fade" visible={showModal}>
      <View style={styles(Theme).container}>
        <CircularProgress progress={runTiming(clock, 0, config as any)} />
        <Image source={Images.logoLoader} style={styles(Theme).logoInfinite} />
      </View>
    </Modal>
  );
}

const styles = (Theme: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme ? '#121212' : '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    color: Colors().TextLoader,
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    position: 'absolute',
    top: '40.5%',
  },
  logoInfinite: {
    position: 'absolute',
  },
});
