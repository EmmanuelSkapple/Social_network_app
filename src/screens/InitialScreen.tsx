import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import Images from '../utils/Images';
import Colors from '../utils/Colors';
import { RootStackAuthParamList } from '../navigators/StackAuth';
import Slider from '../components/Slider';

const screenHeight = Dimensions.get('screen').height;

type initialScreenProp = StackNavigationProp<RootStackAuthParamList, 'InitialScreen'>;
const dataSlider = [
  {
    id: 1,
    title: 'Welcome to Matter',
    subtitle: 'A group based safe-space where you can be who you are, with who you want',
    img: require('../../assets/images/welcome/1.png'),
  },
  {
    id: 2,
    title: 'Family or friends we’ve got you covered',
    subtitle: 'Capture who you truly are, and connect with those who Matter',
    img: require('../../assets/images/welcome/2.png'),
  },
  {
    id: 3,
    title: 'Express your humanity today rebember it forever',
    subtitle: 'Capture who you truly are, and connect with those who Matter',
    img: require('../../assets/images/welcome/3.png'),
  },
  {
    id: 4,
    title: 'Your legacy starts here',
    subtitle: '',
    img: require('../../assets/images/welcome/4.png'),
  },
];

function AuthMain() {
  const navigation = useNavigation<initialScreenProp>();

  return (
    <SafeAreaView style={styles().container}>
      <View style={styles().screen}>
        <Slider dataSlider={dataSlider} />
      </View>
    </SafeAreaView>
  );
}

export default AuthMain;

const styles = () =>
  StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: Colors().BackgroundTernary,
    },
    screen: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      height: '100%',
      justifyContent: 'center',
    },
    barItemViewActive: {
      width: '50%',
      borderBottomColor: Colors().primary,
      borderBottomWidth: StyleSheet.hairlineWidth * 3,
      paddingBottom: 10,
    },
    groupImageView: {
      flexDirection: 'row',
      justifyContent: 'center',
      resizeMode: 'cover',
    },
    groupImage: {
      height: screenHeight > 900 ? 350 : screenHeight > 800 ? 220 : screenHeight > 700 ? 200 : 180,
      width: '100%',
      resizeMode: 'contain',
    },
    welcomeText: {
      fontSize: Platform.OS === 'ios' ? 22 : 18,
      color: Colors().TextBlackWhite,
      fontFamily: 'PlusJakartaSans-SemiBold',
      textAlign: 'center',
    },
    matterView: {
      flexDirection: 'row',
      marginTop: 0,
      marginBottom: 10,
      justifyContent: 'center',
      width: '100%',
    },
    matterLogo: {
      resizeMode: 'contain',
      height: 50,
      width: 50,
      alignSelf: 'center',
      marginVertical: screenHeight / 16,
    },
    matterText: {
      fontSize: 34,
      color: Colors().primary,
      fontFamily: 'PlusJakartaSans-Bold',
      textAlign: 'center',
    },
    divider: {
      width: 200,
      height: 1,
      backgroundColor: Colors().dividerBackGround,
      alignSelf: 'center',
      marginVertical: 12,
    },
    matterDescription: {
      fontSize: screenHeight > 800 ? 20 : 16,
      fontFamily: 'PlusJakartaSans-Regular',
      marginHorizontal: 50,
      textAlign: 'center',
      color: Colors().TextBlackWhite,
    },
    btn: {
      width: 200,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#f04a73',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 50,
    },
    btnText: {
      fontSize: 20,
      fontFamily: 'PlusJakartaSans-SemiBold',
      color: '#fefefe',
      textAlign: 'center',
    },
  });
