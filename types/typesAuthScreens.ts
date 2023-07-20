//index
export interface HeaderProps {
  changeScreen: Function;
  seccionActive: string;
}

export interface LoginAndSingProps {
  route: {
    params: {
      action: string;
    };
  };
}

// Login
export interface SignInProps {
  SignStatus: Function;
  status:number;
  pushedButton:boolean;
  changedScreen:Function;
  blockedNext:Function
}

export interface SignUpProps {
  signUp: Function;
  status:number;
  blockedNext:Function;
}
