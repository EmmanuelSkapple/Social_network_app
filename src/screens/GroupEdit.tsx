import {
  View, Text, StyleSheet, TextInput, Switch,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import i18n from 'i18n-js';
import Colors from '../utils/Colors';
import TopBar from '../components/TopBar';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { RootStackParamList } from '../navigators/Stack';
import { RootState } from '../redux/appReducer';
import { editGroup } from '../database/groupFirebase';
import { SafeAreaView } from 'react-native-safe-area-context';

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

export default function GroupEdit() {
  const navigation = useNavigation<groupListScreenProp>();
  const currentGroup = useSelector(
    (state: RootState) => state.groups.currentGroup,
  );
  const [groupName, setGroupName] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false,
  });

  const [acceptNewMembers, setAcceptNewMembers] = useState(true);
  const [btnSaveDisabled, setBtnSaveDisabled] = useState(true);

  useEffect(() => {
    setGroupName({ ...groupName, filled: true, value: currentGroup.name });
    setAcceptNewMembers(currentGroup.acceptNewMembers);
  }, []);

  // console.log("currentGroup:",currentGroup);

  const updateGroupName = async () => {
    try {
      const req = await editGroup(
        currentGroup.id,
        groupName.value,
        acceptNewMembers,
      );
      if (req.status === 200) {
        Toast.show({
          type: 'ToastPositive',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastGroupNameUpdated'),
          },
        });
        navigation.dispatch(
          StackActions.replace('TabNavigator', {
            screen: 'Groups',
          }),
        );
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'ToastError',
        props: {
          hide: () => {
            Toast.hide();
          },
        },
      });
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles().container}>
      <TopBar
        backButton
        backAction={() => {
          navigation.goBack();
        }}
        leftText={i18n.t('groupEditTitle')}
        divider
      />
      <View style={styles().content}>
        <Text style={styles().titleSection}>{i18n.t('groupEditAbout')}</Text>
        <View style={styles().card}>
          <Text style={styles().titleCard}>{i18n.t('groupEditGroupName')}</Text>
          <TextInput
            placeholder={currentGroup.name}
            placeholderTextColor={Colors().TextInputPlaceholder}
            style={styles().textInput}
            value={groupName.value}
            onChangeText={(text) => {
              setGroupName({ ...groupName, value: text });
              if (!(text.length < 1)) {
                setGroupName({
                  ...groupName,
                  error: false,
                  errorText: '',
                  filled: true,
                  value: text,
                });
              } else {
                setGroupName({
                  ...groupName,
                  filled: false,
                  value: text,
                });
              }
              if (text !== currentGroup.name) {
                setBtnSaveDisabled(false);
              } else {
                setBtnSaveDisabled(true);
              }
            }}
          />
          <View style={styles().divider} />
          <View style={styles().row}>
            <View style={styles().inviteLeft}>
              <Text style={styles().titleInvite}>
                {i18n.t('groupEditInviteTitle')}
              </Text>
              <Text style={styles().descriptionInvite}>
                {i18n.t('groupEditInviteDesc')}
              </Text>
            </View>
            {/* Switch */}
            <Switch
              trackColor={{ false: Colors().background, true: '#F5F6F7' }}
              thumbColor={acceptNewMembers ? '#F74B73' : '#f4f3f4'}
              onValueChange={(valor) => {
                setAcceptNewMembers(valor);
                if (currentGroup.acceptNewMembers !== valor) {
                  setBtnSaveDisabled(false);
                } else {
                  setBtnSaveDisabled(true);
                }
              }}
              value={acceptNewMembers}
            />
          </View>
        </View>
      </View>
      <View style={styles().bottom}>
        <PrimaryButton
          text={i18n.t('groupEditSave')}
          accion={() => updateGroupName()}
          disabled={btnSaveDisabled}
        />
        {/* <TouchableOpacity>
          <Text style={styles().textBottom}>Report group</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors().BackgroundSecondary,
  },
  content: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleSection: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 14,
    color: Colors().TitleBackGroundSecondary,
    fontWeight: 'bold',
  },
  titleCard: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 14,
    color: Colors().TitleBackGroundSecondary,
  },
  card: {
    backgroundColor: Colors().CardGroupsBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  textInput: {
    backgroundColor: Colors().backgroundInputs,
    width: '100%',
    alignSelf: 'center',
    padding: 18,
    fontSize: 16,
    borderRadius: 10,
    color: Colors().text,
    borderWidth: 1,
    borderColor: Colors().CardBorder,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors().CardBorder,
    marginVertical: 20,
  },
  inviteLeft: {},
  titleInvite: {
    color: Colors().TitleBackGroundSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionInvite: {
    color: Colors().TitleBackGroundSecondary,
    fontSize: 12,
    maxWidth: '90%',
  },
  bottom: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 50,
    // backgroundColor: "red",
  },
});
