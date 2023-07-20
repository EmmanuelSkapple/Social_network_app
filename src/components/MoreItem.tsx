import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';
import { MoreItemProps } from '../../types/typesComponents';



export default function MoreItem({ cant, action }: MoreItemProps) {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center' }}
      onPress={() => (action ? action() : null)}
    >
      <View
        style={{
          backgroundColor: Colors().moreBackground,
          borderRadius: 22,
          width: 44,
          height: 44,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
          +
          {cant}
        </Text>
      </View>
      <Text
        style={{
          marginLeft: 16,
          color: Colors().moreBackground,
          fontWeight: 'bold',
        }}
      >
        Show all
      </Text>
    </TouchableOpacity>
  );
}
