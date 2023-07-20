import * as React from 'react';
import {
  Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import Colors from '../../utils/Colors';
import { SecondaryButtonProps } from '../../../types/typesButtons';

const { height } = Dimensions.get('screen');

function SecondaryButton(props: SecondaryButtonProps) {
  const { text, accion, double,disabled } = props;
  return (
    <TouchableOpacity
      style={[styles().container, double ? { width: '41%' } : {}]}
      onPress={() => (disabled ? null : accion())}
    >
      <Text style={styles().text}>{text}</Text>
    </TouchableOpacity>
  );
} 

SecondaryButton.defaultProps = {
  double: false,
};

export default SecondaryButton;

const styles = () => StyleSheet.create({
  container: {
    borderRadius: 8,
    width: '90%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors().backgroundInputs,
  },
  text: {
    fontSize: 16,
    color: Colors().placeholder,
    textAlign: 'center',
    borderColor: '#ccc',
  },
});
