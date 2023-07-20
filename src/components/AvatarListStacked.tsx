import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AvatarListStackedProps } from '../../types/typesComponents';
import { MemberData } from '../../types/typesGroup';
import Colors from '../utils/Colors';
import CircleImage from './CircleImage';

const DEFAULT_MAX_AVATARS = 5;
const DISTANCE_BTW_AVATAR = 3

function renderRemaining(props: AvatarListStackedProps) {
  const { members = [], maxAvatars = DEFAULT_MAX_AVATARS, size = 35 } = props;
  const remaining = members.length - maxAvatars;
  const styleMode = styles();
  if (remaining < 1) return null;

  return (
    <View key={-1} style={[styleMode.moreView, { width: size, height: size, borderRadius: size / 2,marginLeft: -(size / DISTANCE_BTW_AVATAR) }]}>
      <Text style={styleMode.more}>{`+${remaining}`}</Text>
    </View>
  );
}

export default function AvatarListStacked(props: AvatarListStackedProps) {
  const { members = [], maxAvatars = DEFAULT_MAX_AVATARS, size = 35 } = props;
  const styleMode = styles();
    
  return (
    <View style={[styleMode.container,{marginLeft:(size / DISTANCE_BTW_AVATAR)}]}>
      {members.slice(0, maxAvatars).map((member: MemberData, idx: number) => (
        <View key={idx} style={{ marginLeft:idx -(size / DISTANCE_BTW_AVATAR) }}>
          <CircleImage key={idx} border source={{ uri: member.photo }} size={size} />
        </View>
      ))}
      {renderRemaining({ ...props })}
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    more: {
      textAlign: 'center',
      color: '#f74b73',
    },
    moreView: {
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
    },
  });
