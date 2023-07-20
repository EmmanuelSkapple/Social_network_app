import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//* Redux
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import i18n from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/appReducer';

import { RootStackParamList } from '../navigators/Stack';

import Colors from '../utils/Colors';

import FilterItem from '../components/FilterItem';
import Header from '../components/Header';
import NotificationItem from '../components/NotificationItem';
import QuestionOfTheDay from '../components/QuestionOfTheDay';
import { getNotifications } from '../database/notificationsFirebase';
import { getQuestionsByMatter } from '../database/stampFirebase';
import { getNotificationToken} from '../utils/notifications';
import { validateDateOfQuestion } from '../utils/DateAndTime';
import { HeaderHomeProps } from '../../types/typesScreens';
import { FlatList } from 'react-native-gesture-handler';
import { getContactsRandom } from '../utils/Contacts';
import { checkIfExistNewGroups, getDataOfMissingGroups, getGroupsWithActivity } from '../utils/Groups';
import {
  deleteActivity,
  getRecentActivityFilter,
  updateLocalActivity,
} from '../utils/ActivityNotifications';
import { getUrlAsync, handleDeepLink } from '../utils/Invites';
import { getGroups, getGroupWithArrayIds } from '../database/groupFirebase';
import { getMembers } from '../database/memberFirebase'
import { GroupData } from '../../types/typesGroup';
import { removeDuplicatesArray } from '../utils/filterData';

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

const screenWidth = Dimensions.get('window').width;



function EmptyComponent() {
  return (
    <View style={{ marginTop: 40 }}>
      <Text
        style={{
          color: Colors().textLigth,
          fontSize: 20,
          textAlign: 'center',
        }}>
        {i18n.t('homeNotRecentActivity')}
      </Text>
    </View>
  );
}

function Home() {
  const [currentFilter, setCurrentFilter] = useState('All');
  const [notyWithOutFilter, setNotyWithOutFilter] = useState([]);
  const [recentAcivityList, setRecentAcivityList] = useState([]);
  const [groupsArray, setGroupsArray] = useState([]);
  const userData = useSelector((state: RootState) => state.user.userData);
  const Theme = useSelector((state: RootState) => state.theme);
  const recentAcivityListStore = useSelector((state: RootState) => state.posts.recentAcivity);
  const questionsOfDay = useSelector((state: RootState) => state.questions.questionOfDay);
  const Groups = useSelector((state: RootState) => state.groups.groupList);
  const allMembers = useSelector((state: RootState) =>state.members.membersList);
  const dispatch = useDispatch();
  const navigation = useNavigation<groupListScreenProp>();
  const isFocused = useIsFocused();

  useEffect(() => {
    getRecentActivity();
    getQuestByMatter();
    cleanCurrentGroup();
  }, [isFocused]);

  useEffect(() => {
    getActivity();
  }, [currentFilter]);

  useEffect(() => {
    getNotificationToken(userData?.notificationToken,userData?.uid);
    getContacts();
    getGroupsData();
  }, []);

  useEffect(() => {
    getUrlAsync(navigation);
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  const getGroupsData = async () => {
   
    let reqGroupData = await getDataOfMissingGroups(userData,Groups)
      if(reqGroupData){
        await getMembersData(reqGroupData.groupData)
        if(reqGroupData.status ==200){          
          dispatch({ type: 'setGroups', payload: reqGroupData.groupData });
        }else if(reqGroupData.status ==202){
          let optimizatedGroups = removeDuplicatesArray([...reqGroupData.groupData,...Groups ]);
          dispatch({ type: 'setGroups', payload: optimizatedGroups});
        }
      }
  }
  

  const getMembersData = async (groupList : any) => {
     const reqMembers = await getMembers(groupList,allMembers);     
     if (reqMembers.status == 202) {
      dispatch({
        type: 'setMembers',
        payload: reqMembers?.memberData,
      });
     }else if(reqMembers.status == 200){
      let optimizatedMembers = removeDuplicatesArray([...allMembers,...reqMembers?.memberData]);
      dispatch({
        type: 'setMembers',
        payload: optimizatedMembers,
      });
     }
  }

  const getActivity = () => {
    let listActivity = getRecentActivityFilter(notyWithOutFilter, currentFilter);
    setRecentAcivityList(listActivity);
    let groupsArray = getGroupsWithActivity([...recentAcivityListStore]);
    setGroupsArray(groupsArray);
  };

  const getQuestByMatter = async () => {
    const reqQuestions = await getQuestionsByMatter();
    let questionForToDay = reqQuestions.questionList.filter((item: any) =>
      validateDateOfQuestion(item.dateToShow.toDate())
    );
    dispatch({
      type: 'setQuestionOfDay',
      payload: questionForToDay[0] ? questionForToDay[0] : {},
    });
  };

  const cleanCurrentGroup = () => {
    dispatch({ type: 'setCurrentGroup', payload: {} });
  };

  // Function Parent to get groups and post recents
  const getRecentActivity = async () => {
    const allNotifications = await getNotifications(userData.uid);
    const reqRecentActivity = await updateLocalActivity(allNotifications.notifyList, userData.uid);
    let reverseArray = reqRecentActivity.localActivity.reverse();
    setNotyWithOutFilter(reverseArray);
    setRecentAcivityList(reverseArray);
  };
  const deleteNotification = async (idNotificacion: string) => {
    deleteActivity(idNotificacion, userData.uid, recentAcivityList, dispatch);
  };

  const getContacts = async () => {
    let { contacts, contactsInMatter, status } = await getContactsRandom(500);
    dispatch({ type: 'setContactList', payload: contacts });
    dispatch({ type: 'setContactInMatterList', payload: contactsInMatter });
  };


  const itemRenderAcvitivy = ({ item }: any) => (
    <NotificationItem key={item.id} itemData={item} deleteItem={deleteNotification} />
  );
  return (
    <SafeAreaView edges={['top']} style={styles().container}>
      {/* StatusBar */}
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />
      {/* TopBar */}
      <Header screen={`👋 ${i18n.t('homeGreeting')} ${userData.firstname}`} />
      {/* Content */}
      <FlatList
        style={{marginTop:16}}
        data={recentAcivityList}
        renderItem={itemRenderAcvitivy}
        keyExtractor={(item: any, index) => item.id.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        ListEmptyComponent={EmptyComponent}
        ListFooterComponent={<></>}
        ListFooterComponentStyle={{ marginTop: 90 }}
      />
    </SafeAreaView>
  );
}

export default Home;

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors().BackgroundTernary,
      paddingBottom: 50,
    },

    text: {
      color: Colors().text,
      textAlign: 'center',
      fontFamily: 'Cabin-Regular',
      fontSize: 18,
    },
    disabledText: {
      color: '#9e9e9e',
      textAlign: 'left',
      fontFamily: 'PlusJakartaSans-SemiBold',
      fontSize: 14,
    },
    topbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 25,
      paddingHorizontal: 18,
      backgroundColor: Colors().BackgroundPrimary,
    },
    topBarUser: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginLeft: 10,
    },
    contactContainer: {
      width: '95%',
      marginLeft: 20,
    },
    name: {
      fontSize: 16,
      fontFamily: 'Cabin-Bold',
      textAlign: 'left',
    },
    subTitle: {
      color: Colors().HeaderTitle,
      textAlign: 'left',
      // fontFamily: "Cabin-Regular",
      fontSize: 20,
    },
    sectionTitle: {
      color: Colors().placeholder,
      textAlign: 'left',
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 15,
      marginTop: 16,
      marginBottom: 10,
      marginHorizontal: 20,
    },
    shareText: {
      color: Colors().TitleBackGroundSecondary,
      textAlign: 'left',
      fontFamily: 'PlusJakartaSans-SemiBold',
      fontSize: 14,
    },
    menu: {
      position: 'absolute',
      right: 20,
      top: 30,
      zIndex: 2,
    },
    notifications: {
      position: 'absolute',
      width: 46,
      height: 46,
      borderRadius: 25,
      backgroundColor: Colors().NotificationBackground,
      right: 65,
      top: 30,
      zIndex: 3,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    divider: {
      borderTopWidth: 2,
      borderColor: Colors().dividerBackGround,
      width: '90%',
      alignSelf: 'center',
      top: -2,
    },
    content: {
      flex: 1,
      backgroundColor: Colors().BackgroundTernary,
    },
    inviteFriends: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: 20,
      marginHorizontal: 20,
      borderBottomColor: Colors().LineDividerBackground,
      borderBottomWidth: 1,
    },
    shareButton: {},
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
      paddingRight: 55,
      width: '95%',
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
    },
    filterContainer: {
      backgroundColor: Colors().topBackground,
      paddingLeft: 12,
      paddingVertical: 12,
      display: 'flex',
      flexDirection: 'row',
    },
  });
