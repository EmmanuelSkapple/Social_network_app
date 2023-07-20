export interface CreateUserProps {
  userName:string;
  firstname: string;
  lastname:string;
  email: string;
  phone:string;
  birthDay: { day: string; month: string; year: string };
}

export interface UpdateUserProps {
  email: string;
  birthDay: { day: string; month: string; year: string };
  firstname: string;
  lastname: string;
  photo: string;
  uid: string;
}
export interface UpdatePhotoUserProps {
  photo: string;
  uid: string;
  onBoardinList?: any;
}
  
export interface UpdatePhoneUserProps {
  phone: string;
  countryCode: string;
  uid: string;
}
  
export interface UpdateNotificationTokenUserProps {
  notificationToken: string | undefined;
  uid: string | undefined;
}