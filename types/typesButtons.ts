import { StyleProp } from "react-native";

export interface PrimaryButtonProps {
  text: string;
  accion: Function;
}

export interface PrimaryButtonProps {
  text: string;
  accion: Function;
  customStyles?: StyleProp<any> ;
  disabled?: boolean;
  rounded?: boolean;
  loading?: boolean;
  double?: boolean;
}

export interface SecondaryButtonProps {
  text: string;
  accion: Function;
  double?: boolean;
  disabled:boolean;
}
export interface RecordButtonProps {
  onPress : Function;
  onLongPress : Function;
  progress : number;
}
export interface TopBarButtonProps {
  text: string;
  accion: Function;
  Primary?: boolean;
}
