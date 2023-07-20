import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  StyleProp,
} from 'react-native';

import { KeyboardAvoidingWrapperProps } from '../../types/typesComponents';




const KeyboardAvoidingWrapper = ({
  children,
  styleKeyboardAvoiding,
}: KeyboardAvoidingWrapperProps) => {
  return (
    <KeyboardAvoidingView
      style={[styleKeyboardAvoiding, { flex: 1 }]}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;
