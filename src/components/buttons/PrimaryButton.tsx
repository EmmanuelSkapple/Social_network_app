import * as React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Colors from '../../utils/Colors';
import { PrimaryButtonProps } from '../../../types/typesButtons';



function PrimaryButton(props: PrimaryButtonProps) {
  const {
    text, accion, disabled, rounded, loading, double,customStyles
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles().container,
        disabled && styles().containerDisabled,
        rounded && { borderRadius: 35 },
        double && { width: '41%' },
        customStyles,
      ]}
      onPress={() => (disabled ? null : accion())}
    >
      {loading ? (
        <ActivityIndicator
          size={Platform.OS === 'ios' ? 'small' : 'large'}
          color={Colors().textBtnPrimary}
        />
      ) : (
        <Text style={disabled ? styles().textDisabled : styles().text}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

PrimaryButton.defaultProps = {
  disabled: false,
  rounded: false,
  loading: false,
  double: false,
};

export default PrimaryButton;

const styles = () => StyleSheet.create({
  container: {
    borderRadius: 12,
    width: '90%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors().text,
  },
  text: {
    fontSize: 17,
    color: Colors().textBtnPrimary,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  containerDisabled: {
    borderRadius: 10,
    width: '94%',
    marginHorizontal: '3%',
    marginTop: 20,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    // marginBottom: 30,
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
  },
  textDisabled: {
    fontSize: 20,
    color: Colors().placeholder,
    textAlign: 'center',
  },
});
