import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import i18n from 'i18n-js';
import images from '../utils/Images';
import Colors from '../utils/Colors';

const Width = Dimensions.get('window').width;


function TermsAndCondicion() {
  const navigation = useNavigation();
  return (
    <View style={styles().container}>
      <View style={styles().LogoContent}>
        <Image
          source={images.matterText}
          style={styles().MatterLogo}
          resizeMode="contain"
        />
        <Text style={styles().Beta}>
          {i18n.t('termsAndConditionsScreenTitle')}
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles().textContent}>
          <Text style={styles().txtBold}>
            {i18n.t('termsAndConditionsScreenSubtitle1')}
          </Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc1_1')}</Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc1_2')}</Text>
          <Text style={styles().txtBold}>
            {i18n.t('termsAndConditionsScreenSubtitle2')}
          </Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc2')}</Text>
          <Text style={styles().txtBold}>
            {i18n.t('termsAndConditionsScreenSubtitle3')}
          </Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc3_1')}</Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc3_2')}</Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc3_3')}</Text>
          <Text style={styles().txtBold}>
            {i18n.t('termsAndConditionsScreenSubtitle4')}
          </Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc4_1')}</Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc4_2')}</Text>
          <Text style={styles().txtBold}>
            {i18n.t('termsAndConditionsScreenSubtitle5')}
          </Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc5_1')}</Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc5_2')}</Text>
          <Text style={styles().txtBold}>
            {i18n.t('termsAndConditionsScreenSubtitle6')}
          </Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc6')}</Text>
          <Text style={styles().txtBold}>
            {i18n.t('termsAndConditionsScreenSubtitle7')}
          </Text>
          <Text style={styles().text}>{i18n.t('termsAndConditionsScreenDesc7')}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles().buttonStyle2}
      >
        <Text style={styles().buttonText2}>
          {i18n.t('termsAndConditionsScreenReturn')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors().BackgroundTernary,
  },
  MatterLogo: {
    width: '80%',
    height: 60,
    marginBottom: 10,
  },
  LogoContent: {
    position: 'relative',
    width: '60%',
    marginBottom: 10,
    marginTop: 40,
    alignSelf: 'flex-start',
  },
  Beta: {
    position: 'absolute',
    textAlign: 'center',
    bottom: 0,
    left: '30%',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
  buttonStyle2: {
    borderRadius: 10,
    width: Width * 0.4,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors().primary,
    borderColor: Colors().primaryBorder,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  buttonText2: {
    fontSize: 16,
    color: Colors().text,
    fontFamily: 'PlusJakartaSans-SemiBold',
    textAlign: 'center',
  },
  textContent: {
    width: '90%',
    alignSelf: 'center',
    color: Colors().text,
  },
  txtBold: {
    color: Colors().text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: -10,
    marginBottom: 5,
    marginTop: 10,
  },
  text: {
    color: Colors().CardInputTitle,
  },
});

export default TermsAndCondicion;
