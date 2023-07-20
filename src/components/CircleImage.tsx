import FastImage from 'react-native-fast-image';
import { CircleImageProps } from '../../types/typesComponents';
import Colors from '../utils/Colors';

export default function CircleImage(props: CircleImageProps) {
  const { source, size,border } = props;
  const borderStyle = border?{borderWidth:1,borderColor:Colors().text}:{}
  return (
    <FastImage
      style={[{ height: size, width: size, borderRadius: size / 2},borderStyle]}
      source={{ uri: source.uri }}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
}
