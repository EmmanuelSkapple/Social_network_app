export type FirebaseDate = {
  nanoseconds: number;
  seconds: number;
};

export interface GroupData {
  acceptNewMembers: boolean;
  admins: string[];
  created: FirebaseDate;
  id: string;
  lastUpdate: FirebaseDate;
  members: string[];
  name: string;
  password: null;
  post: string[];
  tag: string;
}

export type MemberGroup = {
  [index: number]: string;
};

export type Onboarding = {
  AfterHome: boolean;
  GroupFeed: boolean;
  GroupList: boolean;
  Home: boolean;
  Questions: false;
};

export interface MemberData {
  birthDay: FirebaseDate;
  country: string;
  created: FirebaseDate;
  email: string;
  firstTime: boolean;
  firstname: string;
  groups: MemberGroup[];
  id: string;
  lastname: string;
  nickname: string;
  notification: boolean;
  notificationToken: string;
  onBoarding: Onboarding;
  phone: string;
  photo: string;
  questionCount: number;
}

export interface GroupDataResponse {
  status: number;
  groupData: GroupData[];
  membersData?: {
    status: number;
    memberData: MemberData[];
  };
}
