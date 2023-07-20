import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import {PrimaryButtonProps} from '../../../types/typesButtons'

function PrimaryButton(props: PrimaryButtonProps) {
  const { text, accion } = props;
  return (
    <TouchableOpacity style={styles().container} onPress={() => accion()}>
      <Text style={styles().text}>{text}</Text>
    </TouchableOpacity>
  );
}

export default PrimaryButton;

const styles = () => StyleSheet.create({
  container: {
    backgroundColor: '#f74b73',
    borderRadius: 10,
    padding: 15,
  },
  text: {
    color: '#fafafa',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
