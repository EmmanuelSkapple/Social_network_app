import { memo, useState } from 'react';

import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';

const screenWidth = Dimensions.get('screen').width;

const imageItem = ({ item, setImage, activeItem }: any) => {
  const [imageSelect, setImageSelect] = useState({} as any);
  return (
    <TouchableOpacity
      onPress={async () => {
   
        if (Platform.OS === 'ios') {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(item.id);
          setImageSelect(assetInfo.localUri);
          setImage(assetInfo.localUri,item.height,item.width);
        } else {
          setImageSelect(item.uri);
          setImage(item.uri,item.height,item.width);
        }
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={
          imageSelect === activeItem
            ? styles().gridItemActive
            : styles().gridItem
        }
      />
      {imageSelect === activeItem ? (
        <View style={styles().itemActiveCheck}>
          <Ionicons
            style={{ marginTop: 5, marginRight: 10 }}
            color="#FFF"
            size={25}
            name="md-checkmark-sharp"
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = () => StyleSheet.create({
  gridItem: {
    width: (screenWidth - 50) / 3,
    height: (screenWidth - 50) / 3,
    resizeMode: 'cover',
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#c1c1c1',
  },
  gridItemActive: {
    borderColor: Colors().primary,
    borderWidth: 3,
    width: (screenWidth - 50) / 3,
    height: (screenWidth - 50) / 3,
    resizeMode: 'cover',
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 8,
    position: 'relative',
  },
  itemActiveCheck: {
    backgroundColor: Colors().primary,
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 0,
    left: 10,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const ImageGalleryItem = memo(imageItem);
