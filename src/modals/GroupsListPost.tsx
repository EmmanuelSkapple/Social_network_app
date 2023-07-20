import { useEffect, useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  FlatList,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootStackParamList } from '../navigators/Stack';

import Colors from '../utils/Colors';
import { RootState } from '../redux/appReducer';
import Divider from '../components/Divider';
import CardGroup from '../components/CardGroup';
import { getGroups } from '../database/groupFirebase';
import {GroupsListPostProps} from '../../types/typesModals';

type groupFeedScreenProp = StackNavigationProp<RootStackParamList, 'GroupFeed'>;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function GroupsListPost({ show, setShow, SelectGroup }: GroupsListPostProps) {
  const Theme = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.user.userData);
  const groupList = useSelector((state: RootState) => state.groups.groupList);
  const dispatch = useDispatch();

  useEffect(() => {
    const getGroupData = async () => {
      const result: any = await getGroups(user.uid);
      switch (result.status) {
        case 200:
          dispatch({ type: 'setGroups', payload: result.groupData });
          break;

        default:
          break;
      }
    };

    getGroupData();
  }, []);

  return (
    <Modal
      animationType="slide"
      visible={show}
      transparent
      statusBarTranslucent
      onRequestClose={() => {
        setShow(!show);
      }}
    >
      <TouchableOpacity
        style={styles().ModalBack}
        activeOpacity={1}
        onPress={() => {
          setShow(!show);
        }}
      >
        <KeyboardAvoidingView
          behavior="height"
          enabled
          style={styles().contentForm}
        >
          <View style={styles().opcions}>
            <View style={styles().headerFormModal}>
              <Text style={styles().subTitleModal}>POST</Text>
              <Text style={styles().titleModal}>Select Group</Text>
            </View>
            <Divider />
            <View>
              <FlatList
                data={groupList}
                renderItem={({ item }) => (
                  <ItemGroup
                    groupData={item}
                    darkMode={Theme}
                    SelectGroup={(group: any) => {
                      SelectGroup(group);
                      setShow(false);
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={(
                  <Text style={styles().noItems}>
                    Todavia no estas en ningun grupo
                  </Text>
                )}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

function ItemGroup({ groupData, SelectGroup }: any) {
  return (
    <TouchableOpacity
      onPress={() => SelectGroup(groupData)}
      style={styles().itemContainer}
    >
      <Text style={styles().textBold}>{groupData.name}</Text>
      <Text style={styles().text}>{groupData.members.length}</Text>
    </TouchableOpacity>
  );
}

export default GroupsListPost;

const styles = () => StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors().backgroundInputs,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
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
  textBold: {
    color: Colors().text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: Colors().text,
    fontSize: 16,
  },
  headerFormModal: {
    marginBottom: 10,
  },
  opcions: {
    width: '100%',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    padding: 15,
    height: screenHeight / 1.5,
    backgroundColor: Colors().background,
  },
  progressCircle: {
    position: 'absolute',
    top: 0,
  },
  contentAudioPreview: {
    width: '100%',
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
  noItems: {
    color: Colors().text,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
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
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 40,
  },
});
