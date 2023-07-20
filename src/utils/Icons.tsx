import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { IconProps } from 'react-native-vector-icons/Icon';

interface IconsProps extends IconProps {
  IconFamily?: typeof React.Component;
}

function Icons(props: IconsProps) {
  const IconFamily =
    typeof props?.IconFamily !== 'undefined' ? props.IconFamily : Icon;
  return (
    <IconFamily
      name={props.name}
      size={props.size}
      color={props.color}
      style={props.style}
    />
  );
}

export default Icons;
