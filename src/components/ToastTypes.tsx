import {
  View, Text, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../utils/Colors';
import Images from '../utils/Images';

// eslint-disable-next-line import/prefer-default-export
export const ToastType = {
  ToastPositive: ({ props }: any) => (
    <View style={styles().mainContainer}>
      <View style={styles().secondaryContainer}>
        <View style={styles().avatarContainer}>
          <Image source={Images.logoPink} style={styles().avatar} />
        </View>
        <Text style={styles().profileStatement}>{props.message}</Text>
      </View>
      <TouchableOpacity onPress={() => props.hide()}>
        <Feather name="x" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  ),
  ToastError: ({ props } : any) => (
    <View style={styles().mainContainerError}>
      <View style={styles().secondaryContainer}>
        <View style={styles().avatarContainer}>
          <Image source={Images.logoPink} style={styles().avatar} />
        </View>
        <Text style={styles().profileStatement}>
          {props.message || 'Something went wrong!'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => props.hide()}>
        <Feather name="x" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  ),
};

const styles = () => StyleSheet.create({
  mainContainer: {
    width: '90%',
    backgroundColor: Colors().primary,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#d4586b',
  },
  mainContainerError: {
    width: '90%',
    backgroundColor: Colors().error,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#d4586b',
  },
  secondaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatarContainer: {
    height: 35,
    width: 35,
    borderRadius: 50,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatar: {
    height: 25,
    width: 25,
  },
  innerContainer: {
    marginLeft: 12,
    marginTop: 5,
  },
  imgClose: {
    height: 24,
    width: 24,
  },
  profileStatement: {
    fontSize: 17,
    color: '#fff',
    marginLeft: 18,
    width: '70%',
  },
});
