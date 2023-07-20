import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//* Screens
// eslint-disable-next-line import/no-cycle
import GroupList from '../screens/GroupList';
// eslint-disable-next-line import/no-cycle
import CreateNewGroup from '../screens/CreateNewGroup';
import GroupFeed from '../screens/GroupFeed';
import ProfileUser from '../screens/ProfileUser';
import EditProfileUser from '../screens/EditProfileUser';

import ProfileFriend from '../screens/ProfileFriend';
import CameraPost from '../screens/CameraPost';
import GroupInfo from '../screens/GroupInfo';
import VideoPreview from '../screens/VideoPreview';
import ShareGroup from '../screens/ShareGroup';
import Settings from '../screens/Settings';
import TermsAndCondicion from '../screens/TermsAndCoditions';
import MatterStamp from '../screens/MatterStamp';
import Invite from '../screens/InviteScreen';
import NewJoinGroup from '../screens/NewJoinGroup';
import Tutorial01 from '../screens/TutorialOverlay/Tutorial01';
import Tutorial02 from '../screens/TutorialOverlay/Tutorial02';
import Tutorial03 from '../screens/TutorialOverlay/Tutorial03';
import Tutorial04 from '../screens/TutorialOverlay/Tutorial04';
import GroupAbout from '../screens/GroupAbout';
import GroupEdit from '../screens/GroupEdit';
import GroupMembers from '../screens/GroupMembers';
import AboutMatter from '../screens/AboutMatter';
import TabNavigator from './TabNavigator';
import ContactsScreen from '../screens/ContactsScreen';

export type RootStackParamList = {
  TabNavigator: undefined;
  GroupList: undefined;
  CreateNewGroup: undefined;
  JoinGroup: undefined;
  GroupFeed: {
    idGroup: string;
    idPost?:string;
  };
  ProfileUser: undefined;
  EditProfileUser: undefined;
  ProfileFriend: {
    idUser: string;
  };
  GroupInfo: undefined;
  GroupAbout: undefined;
  GroupEdit: undefined;
  GroupMembers: {
    members: Array<string>;
  };
  CameraPost: undefined;
  VideoPreview: any;
  ShareGroup: undefined;
  Settings: undefined;
  AboutMatter: undefined;
  TermsAndCondicion: undefined;
  MatterStamp: undefined;
  GalleryPost: undefined;
  Invite: {
    id: string;
  };
  Loader: undefined;
  Notifications: undefined;
  Tutorial01: undefined;
  Tutorial02: undefined;
  Tutorial03: undefined;
  Tutorial04: undefined;
  ContactsScreen: undefined;
};

const StackComponent = createStackNavigator<RootStackParamList>();

function Stack() {
  return (
    <StackComponent.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="TabNavigator"
    >
      {/* Tutorial Overlay */}
      <StackComponent.Screen name="Tutorial01" component={Tutorial01} />
      <StackComponent.Screen name="Tutorial02" component={Tutorial02} />
      <StackComponent.Screen name="Tutorial03" component={Tutorial03} />
      <StackComponent.Screen name="Tutorial04" component={Tutorial04} />

      <StackComponent.Screen name="TabNavigator" component={TabNavigator} />
      <StackComponent.Screen name="ContactsScreen" component={ContactsScreen} />
      <StackComponent.Screen name="GroupList" component={GroupList} />
      <StackComponent.Screen name="CreateNewGroup" component={CreateNewGroup} />
      <StackComponent.Screen name="JoinGroup" component={NewJoinGroup} />
      <StackComponent.Screen name="GroupFeed" component={GroupFeed} />
      <StackComponent.Screen name="GroupAbout" component={GroupAbout} />
      <StackComponent.Screen name="GroupEdit" component={GroupEdit} />
      <StackComponent.Screen name="GroupMembers" component={GroupMembers} />
      <StackComponent.Screen name="ProfileUser" component={ProfileUser} />
      <StackComponent.Screen
        name="EditProfileUser"
        component={EditProfileUser}
      />
      <StackComponent.Screen name="ProfileFriend" component={ProfileFriend} />
      <StackComponent.Screen name="GroupInfo" component={GroupInfo} />
      <StackComponent.Screen name="CameraPost" component={CameraPost} />
      <StackComponent.Screen name="VideoPreview" component={VideoPreview} />
      <StackComponent.Screen name="ShareGroup" component={ShareGroup} />
      <StackComponent.Screen name="Settings" component={Settings} />
      <StackComponent.Screen name="MatterStamp" component={MatterStamp} />
      <StackComponent.Screen name="Invite" component={Invite} />

      {/* Agregados */}
      <StackComponent.Screen name="AboutMatter" component={AboutMatter} />

      <StackComponent.Screen
        name="TermsAndCondicion"
        component={TermsAndCondicion}
      />
    </StackComponent.Navigator>
  );
}

export default Stack;
