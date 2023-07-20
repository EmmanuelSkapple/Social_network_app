import { StackActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import { memo, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, getPostFromQuestion } from '../database/postFirebase';
import { RootStackParamList } from '../navigators/Stack';
import Store from '../redux/Store';
import Colors from '../utils/Colors';
import Header from '../components/Header';
import { Post } from '../components/Post';
import { RootState } from '../redux/appReducer';
import NewPostButton from '../components/buttons/NewPostButton';
import { getQuestionsByMatter } from '../database/stampFirebase';
import QuestionOfTheDay from '../components/QuestionOfTheDay';
import { CarouselElements } from '../components/Carousel';
import { PaginationCarousel } from '../components/PaginationCarousel';
import Typography from '../components/ui/Typography';
import Loading from '../components/Loading';
import { GroupFeedProps } from '../../types/typesScreens';
import { BlurView } from '@react-native-community/blur';
import FastImage from 'react-native-fast-image';
import { validateDateOfQuestion } from '../utils/DateAndTime';
import EmptyFeed from '../components/EmptyFeed';
import { GroupData } from '../../types/typesGroup';

const screenWidth = Dimensions.get('window').width;

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

function GroupFeed({ route }: GroupFeedProps) {
  const listRef = useRef<FlatList>(null);
  const { idGroup, idPost } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation<groupListScreenProp>();
  const Theme = useSelector((state: RootState) => state.theme);
  const [currentPostId, setCurrentPostId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [indexToStart, setIndexToStart] = useState(0);
  const [postsList, setPostsList] = useState([] as Array<object>);
  const isFocused = useIsFocused();

  const uploadVideo = useSelector((state: RootState) => state.posts.uploadVideo);  
  const groupData = useSelector(
    (state: RootState) => state.groups.groupList.filter((group: any) => group.id === idGroup)[0]
  );

  const questionsOfDay = useSelector((state: RootState) => state.questions.questionOfDay);

  useEffect(() => {
    if (isFocused) {
      getData();
      getQuestByMatter();
    }
  }, [groupData]);

  const gettIndexToScroll = (list: Array<any>) => {
    const indexToGo = list.map((e) => e.id).indexOf(idPost);
    setIndexToStart(indexToGo);
  };

  useEffect(() => {
    if (isFocused) {
      if (postsList.length > 0) {
        if (indexToStart >= 0) {
          listRef.current?.scrollToIndex({
            index: indexToStart,
            animated: true,
            viewPosition: 0.2,
          });
        }
      }
    }
  }, [indexToStart, postsList]);

  const getData = async () => {
    setRefreshing(true);
    if (groupData) {
      const list = (await getPost(groupData.id)).postList;
      let filterList = list.filter((item: any) => item.status == 'inList' || !item.status);
      gettIndexToScroll(filterList);
      setPostsList(filterList);
    }
    setRefreshing(false);
  };

  const getQuestByMatter = async () => {
    const reqQuestions = await getQuestionsByMatter();
    let questionForToDay = reqQuestions.questionList.filter((item: any) =>
      validateDateOfQuestion(item.dateToShow.toDate())
    ) as any;

    if (questionForToDay[0]) {
      let postOfQuestion = await getPostFromQuestion(idGroup, questionForToDay[0].id);
      let filterList = postOfQuestion.postList.filter((item: any) => item.status == 'inQuestion');
      dispatch({
        type: 'setQuestionOfDay',
        payload: {
          ...(questionForToDay[0] ? questionForToDay[0] : {}),
          usersWithAnswers: postOfQuestion.usersWithAnswers,
        },
      });
      dispatch({
        type: 'setPostsWithAnswers',
        payload: filterList,
      });
    }
  };

  const refreshData = (event: boolean) => {
    getData();
  };

  return (
    <SafeAreaView edges={['top']} style={styles().container}>
      {uploadVideo.status === 1 && (
        <View style={styles().contentUploadVideo}>
          <Progress.Circle
            progress={
              uploadVideo.status === 1 && uploadVideo.progress === 0 ? 0.05 : uploadVideo.progress
            }
            showsText
            textStyle={{ fontSize: 12 }}
            color={Colors().primary}
          />
          <Text style={styles().textUploadVideo}>{i18n.t('groupFeedMsgUploading')}</Text>
        </View>
      )}

      <ListPost
        groupData={groupData}
        postsList={postsList}
        Theme={Theme}
        listRef={listRef}
        loadMore={() => getData()}
        currentPostId={currentPostId}
        setCurrentPostId={setCurrentPostId}
        refreshing={refreshing}
        setRefreshing={refreshData}
        initialScrollIndex={indexToStart}
      />
      <NewPostButton align='right' marginBottom={50} />
    </SafeAreaView>
  );
}

const ListPost = memo(
  ({
    groupData,
    listRef,
    postsList,
    Theme,
    loadMore,
    currentPostId,
    setCurrentPostId,
    refreshing,
    setRefreshing,
    initialScrollIndex
  }: any) => {
    const getItemLayout = (data :any, index:number) => {
      return({ length: 310, offset: (310 * index), index })
    }
    console.log(groupData);
    
    return (
      <FlatList
        ListHeaderComponent={<PostAnswerOfQuestion groupData={groupData} />}
        data={postsList}
        ref={listRef}
        renderItem={({ item }) => (
          <Post
            key={item.id}
            postData={item}
            theme={Theme}
            currentPostId={currentPostId}
            setCurrentPostId={setCurrentPostId}
          />
        )}
        keyExtractor={(item) => (item.id.toString())}
        initialNumToRender={10}
        initialScrollIndex={initialScrollIndex}
        showsVerticalScrollIndicator={false}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={10}
        refreshing={refreshing}
        onRefresh={() => setRefreshing(true)}
        windowSize={10}
        ListFooterComponent={<></>}
        ListFooterComponentStyle={{ marginTop: 90 }}
        onEndReached={() => {
          loadMore();
        }}
        ListEmptyComponent={()=>(
          <EmptyFeed/>
        )}
      />
    );
  }
);

const PostAnswerOfQuestion = ( {groupData} : any) => {
  const isCarousel = useRef(null);
  const [indexCarousel, setIndexCarousel] = useState(0);
  const [dataAnswers, setDataAnswers] = useState({} as any);
  const [showAvatars, setShowAvatars] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<groupListScreenProp>();

  const questionsOfDay = useSelector((state: RootState) => state.questions.questionOfDay);
  const postsWithAnswers = useSelector((state: RootState) => state.questions.postsWithAnswers);
  const User = useSelector((state: RootState) => state.user);

  useEffect(() => {
    getPostFromQuestionOfTheDay();
  }, [questionsOfDay]);

  const getPostFromQuestionOfTheDay = async () => {
    setDataAnswers({
      idQuestion: questionsOfDay.id,
      questionTitle: questionsOfDay.questionTitle,
      membersWithAnswer: postsWithAnswers.length,
    });
  };
  
  const getCardOfAnwers = () => {
    if (!loading) {
      if (postsWithAnswers.length > 0) {
        if (!questionsOfDay.usersWithAnswers?.includes(User.userData.uid)) {
          return (
            <View style={styles().overFlowBlur}>
              <Typography
                customedStyles={styles().textOverFlow}
                color={Colors().textBtnPrimary}
                variant='b2'>
                {i18n.t('groupFeedShowAnswersMessage')}
              </Typography>
              <FastImage
                style={styles().backGroundAnswers}
                source={{
                  uri: postsWithAnswers[0].uriThumbnails,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <BlurView
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  borderRadius: 12,
                }}
                blurType='light'
                blurAmount={6}
                reducedTransparencyFallbackColor='white'
              />
            </View>
          );
        } else {
          return (
            <View
              style={{
                borderColor: Colors().dividerBackGround,
                borderWidth: 1,
              }}>
              <CarouselElements
                arrayOfAnswers={postsWithAnswers}
                refCarousel={isCarousel}
                setIndexCarousel={setIndexCarousel}
              />
              <PaginationCarousel
                arrayLength={postsWithAnswers.length}
                index={indexCarousel}
                refCarousel={isCarousel}
              />
            </View>
          );
        }
      } else {
        <></>;
      }
    } else {
      return <Loading />;
    }
  };

  return (
    <>
      <Header
        screen={groupData.name}
        onBack={() => {
          navigation.dispatch(
            StackActions.replace('TabNavigator', {
              screen: 'Groups',
            })
          );
        }}
        onPressTitle={() => navigation.navigate('GroupAbout')}
        groupData={groupData}
        setShowAvatars={setShowAvatars}
        showAvatars={showAvatars}
      />
        <View style={{ position: 'relative', marginBottom: 30 }}>
          {questionsOfDay.id && <QuestionOfTheDay navigation={navigation} variant='blue' />}
          {getCardOfAnwers()}
        </View>
    </>
  
  );
};

export default GroupFeed;

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors().BackgroundSecondary,
    },
    overFlowBlur: {
      width: screenWidth * 0.95,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 12,
      height: screenWidth,
      marginBottom: 40,
    },
    backGroundAnswers: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
    textOverFlow: {
      textAlign: 'center',
      position: 'absolute',
      zIndex: 1,
      width: '90%',
      alignSelf: 'center',
    },
    button: {
      position: 'absolute',
      bottom: 0,
      right: -4,
      padding: 15,
      backgroundColor: Colors().primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentUploadVideo: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: 10,
      alignItems: 'center',
      width: '95%',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: Colors().borderCards,
      padding: 10,
      borderRadius: 10,
    },
    textUploadVideo: {
      color: Colors().text,
      marginLeft: 20,
    },
  });
