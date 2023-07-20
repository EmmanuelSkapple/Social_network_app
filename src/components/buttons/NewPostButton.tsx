import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import GalleryPostModal from '../../modals/GalleryPost';
import NewAudioRecord from '../../modals/NewAudioRecord';
import NewPostOpcions from '../../modals/NewPostsOpcions';
import { RootStackParamList } from '../../navigators/Stack';
import { RootState } from '../../redux/appReducer';
import Colors from '../../utils/Colors';
import ButtonFlower from '../ButtonFlower';

type homeScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

interface NewPostButtonProps {
  align: string;
  marginBottom: number;
}
function NewPostButton({ align, marginBottom }: NewPostButtonProps) {
  const [opcionPost, setOpcionPost] = useState(false);
  const [openAudioRecord, setOpenAudioRecord] = useState(false);
  const [openGalleryPost, setOpenGalleryPost] = useState(false);
  const userData = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const navigation = useNavigation<homeScreenProp>();

  
  return (
    <View
      style={[styles().container, { backgroundColor: '#000', marginBottom }]}
    >
      <ButtonFlower
        accion={() => navigation.navigate('MatterStamp')}
        isActive={false}
        style={[
          styles().button,
          {
            alignSelf:
              align === 'center'
                ? 'center'
                : align === 'right'
                  ? 'flex-end'
                  : 'flex-start',
          },
        ]}
      />
    </View>
  );
}

export default NewPostButton;

const styles = () => StyleSheet.create({
  container: {
    position: 'absolute',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: -40,
  },
  button: {
    padding: 10,
    backgroundColor: Colors().primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
