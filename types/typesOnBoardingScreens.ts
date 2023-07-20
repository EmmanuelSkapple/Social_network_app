export interface FormPhoneProps {
  onChangeText: Function;
  phone: {
    value: string;
    filled: boolean;
  };
  phoneInputRef: any;
}
export interface FormCodePhoneProps {
  onChangeText: Function;
  resendCode: Function;
  phone: {
    value: string;
    filled: boolean;
  };
  codeSms: {
    value: string;
    filled: boolean;
    errorText: string;
  };
}
