import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Images from '../../utils/Images';
import { RootStackParamList } from '../../navigators/Stack';

const { width, height } = Dimensions.get('screen');

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

export default function Tutorial03() {
  const navigation = useNavigation<groupListScreenProp>();

  const goNext = () => {
    navigation.navigate('Tutorial04');
  };

  return (
    <TouchableWithoutFeedback onPress={goNext}>
      <Image style={styles().container} source={Images.Tutorial03} />
    </TouchableWithoutFeedback>
  );
}

const styles = () => StyleSheet.create({
  container: {
    width,
    height,
    resizeMode: 'stretch',
  },
});
