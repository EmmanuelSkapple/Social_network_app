import { Dimensions, PixelRatio } from 'react-native';

const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

export default function fontSizeNormalize(size : number) {
  const scale = screenWidth / 390;
  const newSize = size * scale;
  const calculatedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
  if (PixelRatio.get() < 3) return calculatedSize - 2;
  return calculatedSize;
}
