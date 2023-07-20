import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../utils/Colors';

import { FilterItemProps } from '../../types/typesComponents';


export default function FilterItem({
  isActive,
  text,
  flag,
  onPress,
}: FilterItemProps) {
  return (
    <View style={styles().filterContainer}>
       {flag && 
          <View style={styles().flagContainer}>
            <Text style={styles().flagText}>{parseInt(flag)>99?'99+':flag}</Text>
          </View>
        }
      <TouchableOpacity
        style={isActive ? styles().filterItemActive : styles().filterItem}
        onPress={onPress}>
        <Text style={isActive ? styles().filterTextActive : styles().filterText}>
          {text}
        </Text>
       
      </TouchableOpacity>
    </View>
  );
}

FilterItem.defaultProps = {
  isActive: false,
  text: '',
  onPress: () => {},
};

const styles = () =>
  StyleSheet.create({
    filterContainer: {
      flex:1,
      paddingVertical:10,
    },
    filterItem: {
      borderRadius: 16.5,
      height: 33,
      backgroundColor: Colors().FilterBackgroundColor,
      borderColor: Colors().FilterBorderColor,
      borderWidth: 1,
      justifyContent: 'center',
      marginRight: 10,
    },
    filterItemActive: {
      borderRadius: 16.5,
      height: 33,
      backgroundColor: '#e45975',
      borderColor: '#e76a83',
      borderWidth: 1,
      justifyContent: 'center',
      marginRight: 10,
    },
    filterText: {
      color: Colors().FilterTextColor,
      fontSize: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
      fontFamily: 'PlusJakartaSans-Bold',
    },
    filterTextActive: {
      color: Colors().white,
      fontSize: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
      fontFamily: 'PlusJakartaSans-Bold',
    },
    flagContainer:{
      position:'absolute',
      paddingHorizontal:6,
      paddingVertical:3,
      borderRadius:50,
      right:5,
      top:5,
      zIndex:2,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:Colors().primary
    },
    flagText:{
      color:Colors().white,
      fontSize:10
    }
  });
