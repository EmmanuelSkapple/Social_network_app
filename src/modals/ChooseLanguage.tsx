import { useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';

import { StackActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js';
import { RootStackParamList } from '../navigators/Stack';
import { RootState } from '../redux/appReducer';

import Colors from '../utils/Colors';
import Divider from '../components/Divider';
import PrimaryButton from '../components/buttons/EditProfielButton';
import { ChooseLanguageProps } from '../../types/typesModals';

type groupFeedScreenProp = StackNavigationProp<RootStackParamList, 'GroupFeed'>;

const screenWidth = Dimensions.get('window').width;



function ChooseLanguage({ show, setShow }: ChooseLanguageProps) {
  const navigation = useNavigation<groupFeedScreenProp>();
  const dispatch = useDispatch();
  const Language = useSelector((state: RootState) => state.language);
  const [currentLanguage, setCurrentLanguage] = useState(
    Language.currentLanguage,
  );

  const currLangStyle = {
    color: Colors().primary,
    fontFamily: 'PlusJakartaSans-Bold',
  };

  const LangStyle = {
    color: Colors().TextLabel,
  };

  const changeLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem('currentLanguage', language);
      dispatch({
        type: 'setCurrentLanguage',
        payload: language,
      });
      setCurrentLanguage(language);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={show}
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        navigation.dispatch(
          StackActions.replace('TabNavigator', {
            screen: 'Home',
          }),
        );
        setShow(!show);
      }}
    >
      <TouchableOpacity style={styles().ModalBack} activeOpacity={1}>
        <KeyboardAvoidingView
          behavior="height"
          enabled
          style={styles().contentForm}
        >
          <View style={styles().opcions}>
            <View style={styles().headerFormModal}>
              <Text style={styles().titleModal}>
                {i18n.t('settingsChangeLanguage')}
              </Text>
            </View>
            <Divider />

            <TouchableOpacity
              onPress={() => {
                setShow(false);
                navigation.dispatch(
                  StackActions.replace('TabNavigator', {
                    screen: 'Home',
                  }),
                );
              }}
              style={styles().closeBtn}
            >
              <Feather
                name="x"
                color={Colors().placeholderInverted}
                size={20}
              />
            </TouchableOpacity>
            {/* English */}
            <TouchableOpacity
              style={styles().selectGroupBtnContainer}
              onPress={() => changeLanguage('en')}
            >
              <Text
                style={[
                  styles().textLanguage,
                  currentLanguage === 'en' ? currLangStyle : LangStyle,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
            {/* Spanish */}
            <TouchableOpacity
              style={styles().selectGroupBtnContainer}
              onPress={() => changeLanguage('es')}
            >
              <Text
                style={[
                  styles().textLanguage,
                  currentLanguage === 'es' ? currLangStyle : LangStyle,
                ]}
              >
                Spanish
              </Text>
            </TouchableOpacity>
            {/* Chinese */}
            {/* <TouchableOpacity
              style={styles().selectGroupBtnContainer}
              onPress={() => {
                dispatch({
                  type: 'setCurrentLanguage',
                  payload: 'cn',
                });
                setCurrentLanguage('cn');
              }}
            >
              <Text
                style={[
                  styles().textLanguage,
                  currentLanguage === 'cn' ? currLangStyle : LangStyle,
                ]}
              >
                Chinese
              </Text>
            </TouchableOpacity> */}
            {/* Portugues */}
            {/* <TouchableOpacity
              style={styles().selectGroupBtnContainer}
              onPress={() => {
                dispatch({
                  type: 'setCurrentLanguage',
                  payload: 'pt',
                });
                setCurrentLanguage('pt');
              }}
            >
              <Text
                style={[
                  styles().textLanguage,
                  currentLanguage === 'pt' ? currLangStyle : LangStyle,
                ]}
              >
                Portugues
              </Text>
            </TouchableOpacity> */}
            {/* Korean */}
            {/* <TouchableOpacity
              style={styles().selectGroupBtnContainer}
              onPress={() => {
                dispatch({
                  type: 'setCurrentLanguage',
                  payload: 'kr',
                });
                setCurrentLanguage('kr');
              }}
            >
              <Text
                style={[
                  styles().textLanguage,
                  currentLanguage === 'kr' ? currLangStyle : LangStyle,
                ]}
              >
                Korean
              </Text>
            </TouchableOpacity> */}
            {/* French */}
            {/* <TouchableOpacity
              style={styles().selectGroupBtnContainer}
              onPress={() => {
                dispatch({
                  type: 'setCurrentLanguage',
                  payload: 'fr',
                });
                setCurrentLanguage('fr');
              }}
            >
              <Text
                style={[
                  styles().textLanguage,
                  currentLanguage === 'fr' ? currLangStyle : LangStyle,
                ]}
              >
                French
              </Text>
            </TouchableOpacity> */}
            {/* Russian */}
            {/* <TouchableOpacity
              style={styles().selectGroupBtnContainer}
              onPress={() => {
                dispatch({
                  type: 'setCurrentLanguage',
                  payload: 'ru',
                });
                setCurrentLanguage('ru');
              }}
            >
              <Text
                style={[
                  styles().textLanguage,
                  currentLanguage === 'ru' ? currLangStyle : LangStyle,
                ]}
              >
                Russian
              </Text>
            </TouchableOpacity> */}
            {/* Hindi */}
            {/* <TouchableOpacity
              style={styles().selectGroupBtnContainer}
              onPress={() => {
                dispatch({
                  type: 'setCurrentLanguage',
                  payload: 'hi',
                });
                setCurrentLanguage('hi');
              }}
            >
            <Text
                style={[
                  styles().textLanguage,
                  currentLanguage === 'hi' ? currLangStyle : LangStyle,
                ]}
              >
              Hindi
              </Text>
            </TouchableOpacity> */}
            <View style={styles().selectGroupBtnContainer}>
              <PrimaryButton
                text={i18n.t('groupEditSave')}
                accion={() => {
                  setShow(false);
                  navigation.dispatch(
                    StackActions.replace('TabNavigator', {
                      screen: 'Home',
                    }),
                  );
                }}
              />
            </View>
            <View style={{ height: 20 }} />
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

export default ChooseLanguage;

const styles = () => StyleSheet.create({
  container: {},
  ModalBack: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentForm: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    color: Colors().text,
    fontSize: 16,
    marginLeft: 20,
  },
  textBtn: {
    color: Colors().text,
    fontSize: 16,
    marginLeft: 20,
    textAlign: 'center',
  },
  headerFormModal: {
    marginBottom: 10,
  },
  opcions: {
    width: '100%',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    padding: 15,
    backgroundColor: Colors().background,
  },
  progressCircle: {
    position: 'absolute',
    top: 0,
  },
  contentAudioPreview: {
    width: '100%',
    marginTop: 20,
  },
  contentAudioBtn: {
    width: screenWidth / 3.5,
    height: screenWidth / 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative',
    marginTop: 15,
    marginBottom: 15,
  },
  audioBtn: {
    borderRadius: 44,
    backgroundColor: Colors().primary,
    width: screenWidth / 4,
    height: screenWidth / 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 35,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors().text,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors().primary,
    marginLeft: 10,
  },
  opcion: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    position: 'relative',
  },
  titleModal: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors().text,
  },
  subTitleModal: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors().newPlaceHolder,
  },

  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  back: {
    padding: 10,
    backgroundColor: '#2A2A2AAF',
    width: '45%',
    borderRadius: 12,
  },
  public: {
    padding: 10,
    backgroundColor: Colors().primary,
    width: '45%',
    borderRadius: 12,
  },
  textInput: {
    backgroundColor: Colors().backgroundInputs,
    width: '90%',
    alignSelf: 'center',
    padding: 15,
    fontSize: 18,
    borderRadius: 10,
    color: Colors().text,
  },
  membersContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  selectGroupBtnContainer: {
    marginTop: 10,
    paddingVertical: 5,
    width: '90%',
    alignSelf: 'center',
    // backgroundColor: "green",
  },
  selectGroupBtnExists: {
    width: '100%',
  },
  selectGroupBtn: {
    borderWidth: 1,
    width: '100%',
    padding: 10,
    borderRadius: 3,
    borderColor: Colors().borderInputVariant,
  },
  membersTitle: {
    color: Colors().placeholderInverted,
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    marginBottom: 15,
  },

  memberItemContainer: {
    position: 'relative',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors().primary,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  textLanguage: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    textAlign: 'center',
  },
});
