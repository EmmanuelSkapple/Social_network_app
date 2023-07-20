import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../utils/Colors';
import { ModalComments } from '../modals/ModalComments';
import { GalleryAlbumsProps } from '../../types/typesComponents';


const GalleryAlbums = ({
  setShow,
  show,
  title,
  data,
  setAlbum,
  loadPhotos,
  loadCamRoll,
}: GalleryAlbumsProps) => {
  const onPressItem = (album : {title:string}) => {
    setShow(!show);
    setAlbum(album.title);
    if(album.title == 'Video'){
      loadCamRoll('video');
    }else if(album.title == 'Recents'){
      loadCamRoll('photo')
    }
    else{
      loadPhotos!(album);
    }
  }
  return (
    <ModalComments showModal={show} setShowModal={setShow} title={title}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setShow(!show);
        }}>
        <View style={styles().container}>
          <ScrollView style={styles().auxContainer}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles().buttons}
                onPress={() => onPressItem(item)}>
                <Text style={styles().text}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </ModalComments>
  );
};

export default GalleryAlbums;

const styles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginBottom: 20,
      marginHorizontal: 20,
      maxHeight: 200,
    },
    auxContainer: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      width: '100%',
    },
    buttons: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      width: '100%'
    },
    text: {
      color: Colors().text,
      fontFamily: 'PlusJakartaSans-Bold',
      textAlign: 'center',
    },
  });
