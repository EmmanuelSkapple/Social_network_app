import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import i18n from 'i18n-js';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Colors from '../utils/Colors';

//* Redux
import { RootStackParamList } from '../navigators/Stack';

import Images from '../utils/Images';
import TopBar from '../components/TopBar';

type profileScreenProp = StackNavigationProp<
  RootStackParamList,
  'EditProfileUser'
>;

function AboutMatter() {
  const navigation = useNavigation<profileScreenProp>();

  return (
    <SafeAreaView style={styles().container}>
      <TopBar
        divider
        centerText={i18n.t('aboutMatterTitle')}
        backButton
        backAction={() => navigation.goBack()}
      />
      <View style={styles().content}>
        <View style={styles().header}>
          <View>
            <Image source={Images.logoAbout} />
            <Text style={styles().appname}>Matter</Text>
            <Text style={styles().version}>v1.0.0</Text>
          </View>
        </View>
        <ScrollView style={styles().changelog}>
          <Text style={styles().title}>{i18n.t('aboutMatterChangelog')}</Text>
          <Text style={styles().subtitle}>{i18n.t('aboutMatterFeatures')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFeature1')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFeature2')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFeature3')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFeature4')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFeature5')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFeature6')}</Text>
          <Text style={styles().subtitle}>{i18n.t('aboutMatterFixes')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFix1')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFix2')}</Text>
          <Text style={styles().item}>{i18n.t('aboutMatterFix3')}</Text>
          <Text style={styles().item}>{/* Espacio en Blaco */}</Text>
        </ScrollView>
        <View style={styles().bottom}>
          <PrimaryButton
            text={i18n.t('aboutMatterSearchUpdates')}
            disabled={false}
            accion={() => {}}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('TermsAndCondicion')}
          >
            <Text style={styles().terms}>
              {i18n.t('aboutMatterTermsAndConditions')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AboutMatter;

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors().BackgroundTernary,
  },
  content: {
    flex: 1,
    backgroundColor: Colors().BackgroundPrimary,
    margin: 20,
    borderRadius: 15,
  },
  header: {
    height: 180,
    width: '100%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors().AboutCardBackground,
  },
  appname: {
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: Colors().TextAppnameAboutCard,
  },
  version: {
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Light',
    fontSize: 12,
    color: Colors().TextVersionAboutCard,
  },
  changelog: {
    height: 0,
    padding: 12,
  },
  title: {
    textAlign: 'left',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: Colors().TextTitleAboutCard,
  },
  subtitle: {
    textAlign: 'left',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
    color: Colors().TextSubTitleAboutCard,
  },
  item: {
    textAlign: 'justify',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: Colors().TextItemsAboutCard,
    paddingHorizontal: 5,
    marginBottom: 2,
  },
  bottom: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  terms: {
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    marginTop: 10,
    color: Colors().TextTermsAboutCard,
  },
});
