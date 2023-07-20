import React from 'react';
import {KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Platform,StyleProp} from 'react-native';

import { KeyboardSimpleWrapperProps } from '../../types/typesComponents';

  
  const KeyboardSimpleWrapper = ({
    children,
    styleKeyboardAvoiding,
  }: KeyboardSimpleWrapperProps) => {
  return(
    <KeyboardAvoidingView  style={{width:'100%'}}  behavior={Platform.OS === 'ios'? "padding" : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default KeyboardSimpleWrapper;