import {
  Text,
  View,
  StyleSheet,
  Switch,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as Linking from 'expo-linking';

import { StatusBar } from 'expo-status-bar';

//* Redux
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ChooseLanguage from '../modals/ChooseLanguage';
import { RootStackParamList } from '../navigators/Stack';
import TopBar from '../components/TopBar';
import { RootState } from '../redux/appReducer';
import Divider from '../components/Divider';
import Colors from '../utils/Colors';
import Icons from '../utils/Icons';
import { ButtonProps, SwitchOpcionProps} from '../../types/typesScreens';


function Button({ title, image, accion }: ButtonProps) {
  return (
    <TouchableOpacity style={styles().opcionStyle} onPress={accion}>
      <Image source={image} style={styles().icons} resizeMode="contain" />
      <Text style={styles().buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}


function SwitchOpcion({
  toggleSwitch = () => {},
  value,
  title,
  image,
}: SwitchOpcionProps) {
  return (
    <View style={styles().opcionStyle}>
      <Image source={image} style={styles().icons} resizeMode="contain" />
      <Text style={styles().buttonText}>{title}</Text>
      <Switch
        trackColor={{ false: '#F5F6F7', true: '#F5F6F7' }}
        thumbColor={true ? '#F74B73' : '#f4f3f4'}
        onValueChange={() => toggleSwitch(value)}
        value={value}
      />
    </View>
  );
}

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

function Settings() {
  const Theme = useSelector((state: RootState) => state.theme);
  const navigation = useNavigation<groupListScreenProp>();
  const [darkMode, setdarkMode] = useState(Theme);
  const [openChooseLanguage, setOpenChooseLanguage] = useState(false);
  const dispatch = useDispatch();

  const toggleSwitchDark = async () => {
    dispatch({ type: darkMode ? 'light' : 'dark' });
    await AsyncStorage.setItem('theme', darkMode ? 'light' : 'dark');
    setdarkMode(!darkMode);
  };

  // Links
  const goToDiscord = () => Linking.openURL('https://discord.gg/DYVrw4455N');
  const goToFeedback = () => Linking.openURL('https://i5dfnxozhgq.typeform.com/to/ueM8fMCr');
  const goToReportError = () => Linking.openURL('https://i5dfnxozhgq.typeform.com/to/Xc8CkpYp');

  const btnSingOut = () => {
    auth().signOut();
    dispatch({ type: 'cleanGroupReduce', payload: {} });
    dispatch({ type: 'cleanLenguageReduce', payload: {} });
    dispatch({ type: 'cleanMembersReduce', payload: {} });
    dispatch({ type: 'cleanPostReduce', payload: {} });
    dispatch({ type: 'cleanQuestionsReduce', payload: {} });
    dispatch({ type: 'cleanThemeReduce', payload: {} });
    dispatch({ type: 'cleanUserReduce', payload: {} });
  };

  return (
    <SafeAreaView style={styles().container}>
      {/* StatusBar */}
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />
      {/* TopBar */}
      <TopBar
        leftText={i18n.t('settingsTitle')}
        rightButton
        rightButtonText={i18n.t('settingsSignOut')}
        rightAction={btnSingOut}
        divider
        backButton={false}
      />
      {/* Content */}
      <ChooseLanguage
        show={openChooseLanguage}
        setShow={setOpenChooseLanguage}
      />
      <View style={styles().content}>
        <View style={styles().options}>
          <Text style={styles().titleSection}>{i18n.t('settingsGeneral')}</Text>
          <TouchableOpacity style={styles().optionItem}>
            <Text style={styles().optionItemText}>
              {i18n.t('settingsDarkMode')}
            </Text>
            <Switch
              trackColor={{ false: '#595959', true: '#F5F6F7' }}
              thumbColor={true ? '#F74B73' : '#f5f5f5'}
              onValueChange={toggleSwitchDark}
              value={darkMode}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles().optionItem}>
            <Text style={styles().optionItemText}>
              {i18n.t('settingsNotifications')}
            </Text>
            <Switch
              trackColor={{ false: '#595959', true: '#F5F6F7' }}
              thumbColor={true ? '#F74B73' : '#f5f5f5'}
              onValueChange={() => {}}
              value
            />
          </TouchableOpacity>
          <Divider />
          {/* <TouchableOpacity onPress={onChangeLanguage}> */}
          <TouchableOpacity
            onPress={() => setOpenChooseLanguage(!openChooseLanguage)}
            style={styles().spaceBetween}
          >
            <Text style={styles().optionItemText}>
              {i18n.t('settingsChangeLanguage')}
            </Text>
            <Icons
              name="chevron-right"
              color={Colors().placeholder}
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View style={styles().options}>
          <Text style={styles().titleSection}>{i18n.t('settingsCommunity')}</Text>
          <TouchableOpacity onPress={goToDiscord} style={styles().spaceBetween}>
            <Text style={styles().optionItemText}>
              {i18n.t('settingsDiscord')}
            </Text>
            <Icons
              name="chevron-right"
              color={Colors().placeholder}
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View style={styles().options}>
          <Text style={styles().titleSection}>{i18n.t('settingsHelpUs')}</Text>
          <TouchableOpacity onPress={goToFeedback} style={styles().spaceBetween}>
            <Text style={styles().optionItemText}>
              {i18n.t('settingsFeedback')}
            </Text>
            <Icons
              name="chevron-right"
              color={Colors().placeholder}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToReportError} style={styles().spaceBetween}>
            <Text style={styles().optionItemText}>
              {i18n.t('settingsReportError')}
            </Text>
            <Icons
              name="chevron-right"
              color={Colors().placeholder}
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View style={styles().options}>
          <Text style={styles().titleSection}>{i18n.t('settingsAbout')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AboutMatter')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={styles().optionItemText}>Matter</Text>
            <Icons
              name="chevron-right"
              color={Colors().placeholder}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Settings;

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors().BackgroundTernary,
  },
  options: {
    backgroundColor: Colors().CardBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors().CardBorder,
    marginTop: 12,
  },
  optionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  optionItemText: {
    paddingVertical: 14,
    color: Colors().TitleBackGroundSecondary,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  disabledText: {
    color: '#9e9e9e',
    textAlign: 'left',
    fontFamily: 'Cabin-Regular',
    fontSize: 14,
    // marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors().BackgroundTernary,
  },
  titleSection: {
    marginTop: 14,
    marginBottom: 0,
    fontSize: 12,
    color: Colors().TitleBackGroundSecondary,
    fontFamily: 'PlusJakartaSans-ExtraBold',
  },
  opcionStyle: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 0,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  icons: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: Colors().text,
    flex: 1,
  },
  spaceBetween: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
