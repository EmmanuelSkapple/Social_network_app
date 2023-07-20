import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';
import CircleImage from './CircleImage';
import {AvatarListViewProps }  from '../../types/typesComponents';
import i18n from 'i18n-js';

export default function AvatarListView(props: AvatarListViewProps) {
  const {
    text,
    withDescription,
    description,
    source,
    onPress,
    showDescription,
    avatarSize,
    avatarStyle,
    button,
    acctionButton
  } = props;
  return (
    <TouchableOpacity
      style={styles().container}
      onPress={() => (onPress ? onPress() : null)}>
      <CircleImage
        source={source}
        size={avatarSize ? avatarSize : withDescription ? 59 : 48}
        style={{ ...avatarStyle, backgroundColor: Colors().TextInfoAvatar }}
      />
      
      
      {showDescription && (
        <View style={{ marginLeft: withDescription ? 20 : 15 }}>
          <Text style={styles().text}>{text}</Text>
          {withDescription && (
            <Text style={styles().textInfo}>{description}</Text>
          )}
          
        </View>
      )}
      {
        button?
        <TouchableOpacity style={styles().button}>
          <Text style={styles().textButton}>{i18n.t('removeButton')}</Text>
        </TouchableOpacity>
        :<></>

      }
    </TouchableOpacity>
  );
}

AvatarListView.defaultProps = {
  description: '',
};

const styles = () =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    text: {
      color: Colors().CardGroupsSubTitle,
      fontFamily: 'PlusJakartaSans-SemiBold',
      fontSize: 16,
    },
    textButton: {
      color: 'white',
      textAlign:'center',
      fontFamily: 'PlusJakartaSans-SemiBold',
      fontSize: 10,
    },
    textInfo: {
      color: Colors().TextInfoAvatar,
      fontFamily: 'PlusJakartaSans-SemiBold',
      fontSize: 12,
    },
    button:{
      marginLeft: 'auto',
      backgroundColor:'#1D1D1F',
      borderRadius:12,
      padding:12,
      height: 40,
      width:'30%'
    }
  });
