import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Circle,
} from 'react-native-svg';
import Animated from 'react-native-reanimated';

//* Redux
import { useSelector } from 'react-redux';
import { RootState } from '../redux/appReducer';

import { CircularPogressProps } from '../../types/typesComponents';


const { interpolateNode, multiply } = Animated;
const { width } = Dimensions.get('window');
const size = width - 150;
const strokeWidth = 15;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { PI } = Math;
const r = (size - strokeWidth) / 2;
const cx = size / 2;
const cy = size / 2;



export default function CircularPogress({ progress }: CircularPogressProps) {
  const Theme = useSelector((state: RootState) => state.theme);
  const circumference = r * 2 * PI;
  const α = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [PI * 2, 0],
  });
  const strokeDashoffset = multiply(α, r);
  return (
    <Svg width={size} height={size} style={styles.container}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor="#f04a73" />
          <Stop offset="1" stopColor="#f04a73" />
        </LinearGradient>
      </Defs>
      <Circle
        stroke={Theme ? '#212121' : '#fff'}
        fill="none"
        {...{
          strokeWidth,
          cx,
          cy,
          r,
        }}
      />
      <AnimatedCircle
        stroke="url(#grad)"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{
          strokeDashoffset,
          strokeWidth,
          cx,
          cy,
          r,
        }}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    transform: [{ rotateZ: '270deg' }],
  },
  line: {
    borderRadius: 999,
  },
});
