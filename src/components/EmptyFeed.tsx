import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import I18n from 'i18n-js';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleImageProps } from '../../types/typesComponents';
import { RootStackParamList } from '../navigators/Stack';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import metrics from '../utils/metrics';
import PrimaryButton from './buttons/PrimaryButton';
import Typography from './ui/Typography';
type homeScreenProp = StackNavigationProp<RootStackParamList, 'GroupFeed'>;

export default function EmptyFeed() {
  const navigation = useNavigation<homeScreenProp>();
  return (
    <View style={styles().container}>
      <FastImage
        style={styles().image}
        source={Images.emptyFeed}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Typography variant='paragraphLarge'>
      {I18n.t('emptyFeedTitle')}
      </Typography>
      <PrimaryButton accion={()=>navigation.navigate('MatterStamp')} customStyles={styles().btnAsk} text={I18n.t('askSomething')}/>
    </View>
  
  );
}

const styles = () =>
  StyleSheet.create({
    container:{
      flexDirection:'column',
      justifyContent:'space-between',
      alignItems:'center',
      height:'90%'
    },
    image: {
      width:134,
      height:153
    },
    btnAsk:{
      width:'50%',
    }
  });