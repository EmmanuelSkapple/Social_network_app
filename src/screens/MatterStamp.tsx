import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../utils/Colors';
import { RootState } from '../redux/appReducer';
// eslint-disable-next-line import/no-cycle
import NewQuestionOptions from '../modals/NewQuestionOptions';
import TopBar from '../components/TopBar';
import { getQuestionsByGroup, getQuestionsByUser } from '../database/stampFirebase';

// eslint-disable-next-line import/no-cycle
import { RootStackParamList } from '../navigators/Stack';

// eslint-disable-next-line import/no-cycle
import GroupsListPost from '../modals/GroupsListPost';
import QuestionOfTheDay from '../components/QuestionOfTheDay';
import { FlatList } from 'react-native-gesture-handler';
import { QuestionByGroup } from '../../types/typesQuestions';

const screenWidth = Dimensions.get('window').width;

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

function QuestionGroupItem({ data, btnQuestion }: { data: any; btnQuestion: Function }) {
  const newDate = new Date(
    // eslint-disable-next-line no-unsafe-optional-chaining
    data.dateUpdate?.seconds * 1000 + data.dateUpdate?.nanoseconds / 1000000
  );
  const postDateFormat = (datePost: string) => {
    const initDate = datePost.split(' ');
    return `${initDate[2]} ${initDate[1]}`;
  };

  return (
    <TouchableOpacity
      style={styles().itemQuestion}
      onPress={() => btnQuestion(data.poster, data.question, data.id,data.group)}>
      <Image style={styles().iconQuestion} source={{ uri: data.poster.photo }} />
      <View style={styles().questionContent}>
        <View style={styles().viewDataUser}>
          <Text style={styles().questionPoster}>{data.poster.name}</Text>
          <Text style={styles().questionDate}>{postDateFormat(newDate.toDateString())}</Text>
        </View>
        <Text style={styles().questionTitle}>{data.question}</Text>
      </View>
    </TouchableOpacity>
  );
}

function MatterStamp() {
  const navigation = useNavigation<groupListScreenProp>();
  const dispatch = useDispatch();
  const Theme = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.user.userData);
  const [showModalNewQuestion, setShowModalNewQuestion] = useState(false);
  const [showGroupList, setShowGroupList] = useState(false);
  const [currentGroup, setCurrentGroup] = useState({} as any);
  const [questionsGroup, setQuestionsGroup] = useState([] as any);
  const posibleCurrentGroup = useSelector((state: RootState) => state.groups.currentGroup);

  const questionsOfDay = useSelector((state: RootState) => state.questions.questionOfDay);

  const userData = useSelector((state: RootState) => state.user.userData);

  const getQuestionGroup = async (groupID: string) => {
    if (user.uid) {
      const result = await getQuestionsByUser({
        userID: user.uid,
      });
      setQuestionsGroup(result);
    }
  };

  useEffect(() => {
    setCurrentGroup(posibleCurrentGroup);
    getQuestionGroup(posibleCurrentGroup.id);
  }, []);

  useEffect(() => {
    if (currentGroup.id) getQuestionGroup(currentGroup.id);
    dispatch({ type: 'setCurrentGroup', payload: currentGroup });
  }, [currentGroup]);

  const btnQuestion = (asker: Object, ask: string, idQuestion: string, groupData: {id:string; name: string}) => {
    dispatch({
      type: 'setPostToUpdate',
      payload: {
        poster: {
          id: userData.uid,
          name: userData.firstname,
          photo: userData.photo,
        },
        status: 'inList',
        asker: { ...asker, idQuestion, groupData},
        ask,
      },
    });
    navigation.navigate('CameraPost');
  };
  const renderItemQuestion: ListRenderItem<QuestionByGroup> = ({ item }) => (
    <QuestionGroupItem key={item.id} data={item} btnQuestion={btnQuestion} />
  );
  return (
    <SafeAreaView style={styles().container}>
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().background}
      />
      <TopBar
        divider
        leftText='Q&A'
        backButton
        backAction={() => {
          navigation.goBack();
        }}
        rightButton
        rightButtonText='Ask'
        rightAction={() => setShowModalNewQuestion(true)}
        rightButtonPrimary
      />
      <View style={styles().listContent}>
        {questionsOfDay.id && <Text style={styles().titleList}>Question of the day</Text>}
        {questionsOfDay.id && <QuestionOfTheDay navigation={navigation} variant='white' />}
        {questionsOfDay.id && <View style={styles().divider} />}
      </View>
      <FlatList
        style={styles().listContainer}
        data={questionsGroup}
        renderItem={renderItemQuestion}
        keyExtractor={(item, index) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles().emptyContainer}>
            <Text style={styles().emptyText}>No one asked, be the first</Text>
          </View>
        }
      />
      <NewQuestionOptions
        show={showModalNewQuestion}
        setShow={setShowModalNewQuestion}
        updateQuestions={getQuestionGroup}
      />
      <GroupsListPost
        SelectGroup={setCurrentGroup}
        show={showGroupList}
        setShow={setShowGroupList}
      />
    </SafeAreaView>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      backgroundColor: Colors().BackgroundPrimary,
    },
    listContainer: {
      paddingHorizontal: 16,
    },
    titleList: {
      fontSize: 15,
      fontFamily: 'PlusJakartaSans-Bold',
      letterSpacing: 0.48,
      textAlign: 'left',
      color: Colors().QandATitle,
      marginTop: 20,
      marginBottom: 10,
      marginLeft: 16,
    },
    divider: {
      height: 1,
      backgroundColor: Colors().borderInputVariant,
      marginTop: 10,
      marginHorizontal: 16,
    },
    groupTitleContainer: {
      flexDirection: 'row',
    },
    groupBtnContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    iconDown: {
      top: 5,
    },
    questionsList: {
      width: '90%',
      alignSelf: 'center',
    },
    namePoster: {},
    listContent: {
      width: '100%',
      alignSelf: 'center',
      paddingHorizontal: 16,
    },
    viewDataUser: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '85%',
    },
    itemQuestion: {
      backgroundColor: Colors().CardRightRoundedBackground,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginVertical: 8,
      borderRadius: 50,
      paddingHorizontal: 5,
      paddingVertical: 5,
      // borderWidth: 1,
      // borderColor: Colors().borderCards,
      width: '100%',
      alignSelf: 'center',
    },
    iconQuestion: {
      width: screenWidth / 7.8,
      height: screenWidth / 7.8,
      resizeMode: 'contain',
      borderRadius: 100,
      borderWidth: 2,
      borderColor: '#f5f5f5',
    },
    questionContent: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingLeft: 10,
      width: '100%',
    },
    questionPoster: {
      color: Colors().text,
      fontSize: 14,
      fontWeight: '400',
      fontStyle: 'normal',
      textAlign: 'left',
    },
    questionTitle: {
      color: Colors().text,
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'PlusJakartaSans-Medium',
      lineHeight: 21,
      textAlign: 'left',
      width:'80%',
      marginTop:4
    },
    questionDate: {
      color: Colors().textLigth,
      fontSize: 13,
      fontWeight: '500',
      fontStyle: 'normal',
      textAlign: 'left',
      position: 'absolute',
      right: 15,
      top: 0,
    },
    btnContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      marginBottom: 40,
    },
    emptyContainer: {
      marginVertical: 180,
    },
    emptyText: {
      textAlign: 'center',
      color: Colors().TextLabel,
    },
  });

export default MatterStamp;
