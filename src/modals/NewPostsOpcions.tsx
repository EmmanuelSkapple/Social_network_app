import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { RootStackParamList } from '../navigators/Stack';
import Svg, { Path } from 'react-native-svg';

import Colors from '../utils/Colors';
import MatterStampIcon from '../components/ui/MatterStampIcon';

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

import { NewPostOpcionsProps } from '../../types/typesModals';


function NewPostOpcions({
  show,
  setShow,
  goToCameraPost,
  goToMatterStamp,
  goToGalleryPost,
  goToAudioPost,
}: NewPostOpcionsProps) {
  const [activeItem, setActiveItem] = useState(null as any);

  return (
    <Modal
      animationType='fade'
      visible={show}
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        setShow(!show);
      }}>
      <TouchableOpacity
        style={styles().ModalBack}
        activeOpacity={1}
        onPress={() => {
          setShow(!show);
          setActiveItem(null);
        }}>
        <View style={styles().opcionsContainer}>
          <View style={styles().opcions}>
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  position: 'absolute',
                  width: 1,
                  height: '100%',
                  backgroundColor: Colors().dividerBackGround,
                  zIndex: 3,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 1,
                  backgroundColor: Colors().dividerBackGround,
                  zIndex: 3,
                }}
              />
            </View>
            <View
              style={[
                styles().rowItems,
                { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
              ]}>
              <TouchableOpacity
                activeOpacity={1.0}
                style={[
                  styles().opcion,
                  activeItem === 'camera' && styles().optionActive,
                  { borderTopLeftRadius: 12 },
                ]}
                onPress={() => goToCameraPost()}
                onPressIn={() => setActiveItem('camera')}
                onPressOut={() => setActiveItem(null)}>
               <Feather
                  name="camera"
                  color={
                    activeItem === 'camera'
                      ? Colors().textBtnPrimary
                      : Colors().placeholder
                  }
                  size={35}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1.0}
                style={[
                  styles().opcion,
                  activeItem === 'image' && styles().optionActive,
                  { borderTopRightRadius: 12 },
                ]}
                onPress={() => {
                  setShow(false);
                  goToGalleryPost();
                }}
                onPressIn={() => setActiveItem('image')}
                onPressOut={() => setActiveItem(null)}>
                <Feather
                  name="image"
                  color={
                    activeItem === 'image'
                      ? Colors().textBtnPrimary
                      : Colors().placeholder
                  }
                  size={35}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles().rowItems,
                { borderBottomRightRadius: 12, borderBottomLeftRadius: 12 },
              ]}>
              <TouchableOpacity
                activeOpacity={1.0}
                style={[
                  styles().opcion,
                  activeItem === 'audio' && styles().optionActive,
                  { borderBottomLeftRadius: 12 },
                ]}
                onPress={() => {
                  setShow(false);
                  goToAudioPost();
                }}
                onPressIn={() => setActiveItem('audio')}
                onPressOut={() => setActiveItem(null)}>
                  <MIcons
                  name="microphone-outline"
                  color={
                    activeItem === 'audio'
                      ? Colors().textBtnPrimary
                      : Colors().placeholder
                  }
                  size={35}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1.0}
                style={[
                  styles().opcion,
                  activeItem === 'stamp' && styles().optionActive,
                  { borderBottomRightRadius: 12 },
                ]}
                onPress={() => {
                  setShow(false);
                  goToMatterStamp();
                }}
                onPressIn={() => setActiveItem('stamp')}
                onPressOut={() => setActiveItem(null)}>
                <MatterStampIcon
                  size={35}
                  color={
                    activeItem === 'stamp'
                      ? Colors().textBtnPrimary
                      : Colors().NewPostButtonIcon
                  }
                  stroke={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default NewPostOpcions;

const styles = () =>
  StyleSheet.create({
    container: {},
    ModalBack: {
      flex: 1,
    },
    text: {
      color: Colors().text,
      fontSize: 16,
      marginLeft: 20,
    },
    opcionsContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      bottom: 150,
    },
    opcions: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: Colors().background,
      shadowColor: '#000000',
      shadowOffset: {
        width: 1,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 2,
      elevation: 5,
      width: '50%',
    },
    rowItems: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderWidth: 1,
      borderColor: Colors().dividerBackGround,
    },
    optionActive: {
      paddingVertical: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors().primary,
      width: '50%',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: Colors().primary,
      marginLeft: 10,
    },
    opcion: {
      width: '50%',
      paddingVertical: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors().CardRightRoundedBackground,
    },
  });
