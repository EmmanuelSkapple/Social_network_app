import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import { TopBarButtonProps } from '../../../types/typesButtons';
import SecondaryButton from './SecondaryButton';

export default function TopBarButton({ text, accion, Primary }: TopBarButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => accion()}
      style={Primary ? stylesPrimary().container : styles().container}
    >
      <Text style={Primary ? stylesPrimary().text : styles().text}>{text}</Text>
    </TouchableOpacity>
  );
}

TopBarButton.defaultProps = {
  Primary: false,
};

const styles = () => StyleSheet.create({
  container: {
    backgroundColor: Colors().BackgroundButtonTopBar,
    minWidth: 88,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors().TextButtonTopBar,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontFamily: 'PlusJakartaSans-Bold',
  },
});

const stylesPrimary = () => StyleSheet.create({
  container: {
    backgroundColor: Colors().primary,
    width: 88,
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors().white,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
