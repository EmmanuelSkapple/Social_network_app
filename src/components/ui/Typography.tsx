import React from 'react';
import { Text } from 'react-native';
import Colors from '../../utils/Colors';

// Utils
import fontSizeNormalize from '../../utils/fontSizeNormalize';

import { TypographyProps } from '../../../types/typesUI';


export default function Typography({
  variant,
  color = Colors().text,
  customedStyles,
  children,
} : TypographyProps) {
  const stylesText = { color, ...customedStyles };
  switch (variant) {
    case 'h1':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: fontSizeNormalize(24),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'h2':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: fontSizeNormalize(25),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'cardTitle':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: fontSizeNormalize(16),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'cardSubtitle':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Light',
            fontSize: fontSizeNormalize(12),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
      case 'paragraphLarge':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Light',
            fontSize: fontSizeNormalize(18),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'b1':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: fontSizeNormalize(20),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'b2':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Regular',
            fontSize: fontSizeNormalize(20),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'b3':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: fontSizeNormalize(14),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'b4':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: fontSizeNormalize(15),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'textBtnLarge':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: fontSizeNormalize(20),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
    case 'textBtnSmall':
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Bold',
            fontSize: fontSizeNormalize(16),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );

    default:
      return (
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-Medium',
            fontSize: fontSizeNormalize(20),
            ...stylesText,
          }}
        >
          {children}
        </Text>
      );
  }
}
