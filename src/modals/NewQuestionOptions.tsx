import { useEffect, useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import images from '../utils/Images';
import Colors from '../utils/Colors';
import Store from '../redux/Store';
import { RootState } from '../redux/appReducer';
import CircleImage from '../components/CircleImage';
import { addQuestion } from '../database/stampFirebase';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Divider from '../components/Divider';
import GroupsListPost from './GroupsListPost';
import { sendNotification } from '../utils/notifications';
import { NewQuestionOptionsProps} from '../../types/typesModals';




function NewQuestionOptions({show, setShow,updateQuestions}: NewQuestionOptionsProps) {
  const [questionText, setQuestionText] = useState({
    error: false,
    value: '',
    errorText: '',
    filled: false,
  });
  const [idsList, setIdsList] = useState<string[]>([]);
  const [showGroupList, setShowGroupList] = useState(false);
  const [currentGroup, setCurrentGroup] = useState({} as any);
  const posibleCurrentGroup = useSelector(
    (state: RootState) => state.groups.currentGroup,
  );
  const membersList = useSelector(
    (state: RootState) => state.members.membersList,
  );
  const user = useSelector((state: RootState) => state.user.userData);
console.log("00000000000",membersList.length);

  useEffect(() => {
    setCurrentGroup(posibleCurrentGroup);
  }, []);

  const updateQuestion = async () => {
    if (idsList.length > 0) {
      if (currentGroup.id) {
        const reqQuestion = await addQuestion({
          poster: {
            id: Store.getState().user.userData.uid,
            name: Store.getState().user.userData.firstname,
            photo: Store.getState().user.userData.photo,
          },
          membersSelected: idsList,
          question: questionText.value,
          group: {
            id: currentGroup.id,
            name: currentGroup.name,
          },
        });
        if (reqQuestion.status === 200) {
          Toast.show({
            type: 'ToastPositive',
            props: {
              message: 'Success!, Question sent !',
            },
          });
          NotifyNewQuestion();
          updateQuestions();
          setShow(false);
          setQuestionText((data) => ({ ...data, value: '' }));
          setIdsList([]);
        } else {
          Toast.show({
            type: 'ToastError',
            props: {
              message: 'Error!, try later :/',
            },
          });
        }
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            message: 'Error!, Select a group',
          },
        });
      }
    } else {
      Toast.show({
        type: 'ToastError',
        props: {
          message: 'Error!, Select a member',
        },
      });
    }
  };

  const NotifyNewQuestion = async () => {
    try {
      const arrayTokens = membersList.filter((member: any) => idsList.includes(member.id));
      console.log(arrayTokens);
      console.log(user.firstname);
      console.log(currentGroup.name);
      await sendNotification(
        'newQuestion',
        false,
        arrayTokens,
        user.firstname,
        currentGroup.name,
      );
    } catch (error) {
      console.log('error en NotifyNewQuestion -> ', error);
    }
  };

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
              <Text style={styles().titleModal}>Q&A</Text>
            </View>
            <Divider />
            <TouchableOpacity
              onPress={() => setShow(false)}
              style={styles().closeBtn}
            >
              <Feather
                name="x"
                color={Colors().placeholderInverted}
                size={20}
              />
            </TouchableOpacity>
            <View style={styles().selectGroupBtnContainer}>
              <TouchableOpacity
                onPress={() => setShowGroupList(!showGroupList)}
                style={styles().selectGroupBtn}
              >
                {currentGroup.name ? (
                  <Text style={{ color: Colors().text, textAlign: 'left' }}>
                    Ask in
                    {' '}
                    {currentGroup.name}
                  </Text>
                ) : (
                  <Text style={{ color: Colors().text, textAlign: 'left' }}>
                    Select a Group
                  </Text>
                )}
                <Feather
                  size={25}
                  name="chevron-down"
                  color={Colors().primary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles().contentInputIcon}>
              <TextInput
                placeholder="Types ..."
                placeholderTextColor={
                  questionText.error ? '#DC3030' : Colors().placeholder
                }
                style={styles().textInput}
                value={questionText.value}
                onChangeText={(text) => {
                  setQuestionText({ ...questionText, value: text });
                  if (!(text.length < 5)) {
                    setQuestionText({
                      ...questionText,
                      error: false,
                      errorText: '',
                      filled: true,
                      value: text,
                    });
                  } else {
                    setQuestionText({
                      ...questionText,
                      filled: false,
                      value: text,
                    });
                  }
                }}
                onBlur={() => {
                  // Validate password
                  if (questionText.value.length < 5) {
                    setQuestionText({
                      ...questionText,
                      error: true,
                      errorText: 'ask a question with more than 4 letters',
                    });
                  } else {
                    setQuestionText({
                      ...questionText,
                      error: false,
                      errorText: '',
                    });
                  }
                }}
              />
            </View>
            {currentGroup.id && (
              <MembersOfCurrentGroup
                currentGroup={currentGroup}
                idsList={idsList}
                setIdsList={setIdsList}
              />
            )}
            <View style={styles().btnContainer}>
              <PrimaryButton
                text="Send now"
                disabled={!questionText.filled}
                rounded
                accion={updateQuestion}
                customStyles={{marginTop:40}}

              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
      <GroupsListPost
        SelectGroup={setCurrentGroup}
        show={showGroupList}
        setShow={setShowGroupList}
      />
    </Modal>
  );
}

function MembersOfCurrentGroup({
  idsList,
  setIdsList,
  currentGroup,
}: {
  idsList: string[];
  setIdsList: Function;
  currentGroup: any;
}) {
  const members = useSelector((state: RootState) => state.members.membersList.filter((member: any) => currentGroup.members.includes(member.id)));

  const getPhotos = () => members.map((member: any) => ({
    photo: member.photo,
    name: member.firstname,
    id: member.id,
  }));

  const dataList = getPhotos();
  console.log("local members",members.length);
  
  return (
    <View style={styles().membersContainer}>
      <Text style={styles().membersTitle}>Your loved ones.</Text>
      <FlatList
        horizontal
        data={dataList}
        ListHeaderComponent={() => (
          <TouchableOpacity
            style={{
              ...styles().memberItemContainer,
              borderRadius: 90,
              borderWidth: dataList.length === idsList.length ? 2 : 0,
              borderColor: Colors().primary,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setIdsList((list: string[]) => {
              if (list.length === 0) {
                return dataList.map((value: any) => value.id);
              }
              return [];
            })}
          >
            <Feather
              name="users"
              color={Colors().placeholderInverted}
              size={30}
            />
          </TouchableOpacity>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setIdsList((list: string[]) => (list.includes(item.id)
              ? list.filter((value) => value !== item.id)
              : [...list, item.id]))}
            style={styles().memberItemContainer}
          >
            {item.photo ? (
              <CircleImage
                source={item.photo ? { uri: item.photo } : images.user}
                size={50}
                style={
                  idsList.includes(item.id)
                    ? { borderWidth: 2, borderColor: Colors().primary }
                    : {}
                }
              />
            ) : (
              <View style={styles().profileImage}>
                <Feather size={25} name="user" color={Colors().primary} />
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

export default NewQuestionOptions;

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
  opcions: {
    width: '100%',
    borderRadius: 10,
    padding: 15,

    backgroundColor: Colors().background,
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
  selectGroupBtnContainer: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
  },
  selectGroupBtnExists: {
    width: '100%',
  },
  selectGroupBtn: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    backgroundColor: Colors().btnFocusSecondary,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerFormModal: {
    marginBottom: 10,
  },
  subTitleModal: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors().newPlaceHolder,
  },
  titleModal: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 32,
    letterSpacing: 0.72,
    textAlign: 'left',
    color: Colors().text,
  },
  closeBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  contentInputIcon: {
    width: '100%',
    position: 'relative',
    marginTop: 15,
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
    marginBottom: 20,
  },
});
