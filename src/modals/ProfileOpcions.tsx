import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../utils/Colors';

import { RootStackParamList } from '../navigators/Stack';
import {ProfileOptionsProps} from '../../types/typesModals';


export default function ProfileOptions({ show, setShow, edit }: ProfileOptionsProps) {
  return (
    <Modal
      animationType="fade"
      visible={show}
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        setShow(!show);
      }}
    >
      <TouchableOpacity
        style={styles().ModalBack}
        activeOpacity={1}
        onPress={() => {
          setShow(!show);
        }}
      >
        <View style={styles().Modal}>
          <TouchableOpacity style={styles().ModalOpcion} onPress={()=>edit()}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              color={Colors().text}
              size={25}
            />
            <Text style={styles().ModalText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}


const styles = () => StyleSheet.create({
  ModalBack: {
    flex: 1,
    backgroundColor: '#00000069',
  },
  Modal: {
    backgroundColor: Colors().background,
    borderWidth: 1,
    borderColor: Colors().border,
    alignSelf: 'flex-end',
    marginTop: 60,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 5,

    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  ModalOpcion: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ModalText: {
    color: Colors().text,
    marginLeft: 5,
    marginRight: 15,
  },
  ModalImage: { width: 23, height: 23 },
});
