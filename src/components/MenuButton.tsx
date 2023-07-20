import { TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigators/Drawer';
import Icons from '../utils/Icons';
import Colors from '../utils/Colors';

type DrawerScreenProp = DrawerNavigationProp<RootDrawerParamList, 'Stack'>;

function MenuButton() {
  const drawer = useNavigation<DrawerScreenProp>();

  return (
    <TouchableOpacity onPress={() => drawer.openDrawer()}>
      <Icons color={Colors().text} size={38} name="menu" />
    </TouchableOpacity>
  );
}

export default MenuButton;
