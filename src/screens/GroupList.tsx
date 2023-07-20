import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//* Redux
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'i18n-js';
import { RootState } from '../redux/appReducer';

import { RootStackParamList } from '../navigators/Stack';
import PrimaryButton from '../components/buttons/PrimaryButton';

import Colors from '../utils/Colors';
import CardGroup from '../components/CardGroup';
import { getGroups } from '../database/groupFirebase';
import Header from '../components/Header';
import { getDataOfMissingGroups } from '../utils/Groups';
import { getMembers } from '../database/memberFirebase';
import { removeDuplicatesArray } from '../utils/filterData';
import Loading from '../components/Loading';

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

function GroupList() {
  const [loading, setLoading] = useState(false)
  const Theme = useSelector((state: RootState) => state.theme);
  const User = useSelector((state: RootState) => state.user);
  const Groups = useSelector((state: RootState) => state.groups.groupList);
  const userData = useSelector((state: RootState) => state.user.userData);
  const allMembers = useSelector((state: RootState) =>state.members.membersList);
  const [darkMode] = useState(Theme);
  const navigation = useNavigation<groupListScreenProp>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const btnCreateGroup = () => {
    navigation.navigate('CreateNewGroup');
  };

  useEffect(() => {
    console.log("seguimos en las mismas");
    getGroupsData();
    if(isFocused){
      cleanCurrentGroup();
    }
  }, [isFocused,userData]);

  const cleanCurrentGroup = () => {
    dispatch({ type: 'setCurrentGroup', payload: {} });
  };

  const getGroupsData = async () => {
    
    setLoading(true)
    let reqGroupData = await getDataOfMissingGroups(userData,Groups)
      if(reqGroupData){
        await getMembersData(reqGroupData.groupData)
        if(reqGroupData.status ==200){
          dispatch({ type: 'setGroups', payload: reqGroupData.groupData });
        }else if(reqGroupData.status ==202){
          let optimizatedGroups = removeDuplicatesArray([...reqGroupData.groupData,...Groups ]);
          dispatch({ type: 'setGroups', payload:optimizatedGroups });
        }
      }
    setLoading(false)
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
  return (
    <SafeAreaView style={styles().container}>
      {/* StatusBar */}
      <StatusBar
        style={Theme ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={Colors().topBackground}
      />

      {/* Header */}
      <Header screen="Groups" />
      <View style={styles().btnContainer}>
        <PrimaryButton
          text={i18n.t('groupListCreateGroup')}
          disabled={false}
          accion={btnCreateGroup}
        />
      </View>
      {/* Content */}
      {loading?
        <Loading/>
        :
        <FlatList
          data={Groups}
          renderItem={({ item }) => (
            <CardGroup groupData={item}/>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <Text style={styles().noItems}>{i18n.t('groupListNotGroups')}</Text>
          }
        />
      }
    
      <View style={{ height: 100 }} />
    </SafeAreaView>
  );
}

export default GroupList;

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:16,
    backgroundColor: Colors().BackgroundTernary,
  },
  text: {
    color: Colors().text,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 18,
  },
  noItems: {
    color: Colors().text,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    height: 100,
  },
  btnContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '60%',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop:56
  },
  closer: {
    marginVertical: 10,
    color: Colors().text,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    marginHorizontal: 20,
  },
});
