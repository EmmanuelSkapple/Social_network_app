import {
  View, Text, StyleSheet, FlatList, TextInput, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../navigators/Stack';
import Colors from '../utils/Colors';
import TopBar from '../components/TopBar';
import AvatarListView from '../components/AvatarListView';
import Icons from '../utils/Icons';
import { RootState } from '../redux/appReducer';
import { GroupMembersProps } from '../../types/typesScreens';

type groupMemberscreenProp = StackNavigationProp<
  RootStackParamList,
  'GroupMembers'
>;

export default function GroupMembers(props: GroupMembersProps) {
  const navigation = useNavigation<groupMemberscreenProp>();
  const [newArray, setNewArray] = useState([] as any);
  const totalMembes = props.route.params.members;
  const members = useSelector((state: RootState) => state.members.membersList.filter((member: any) => totalMembes?.includes(member.id)));

  const [data, setData] = useState(members);

  useEffect(() => {
    const aux = [] as any;
    members.map((item: any) => {
      aux.push(item.firstname.toUpperCase()[0]);
      const dataArr = new Set(aux);
      const result = [...dataArr];
      setNewArray(result.sort());
    });
  }, []);

  return (
    <SafeAreaView style={styles().container}>
      <TopBar
        backButton
        backAction={() => {
          navigation.goBack();
        }}
        centerText="Group members"
        divider
      >
        <View style={styles().searchSection}>
          <Icons name="search" size={20} color="#BFBFC0" />
          <TextInput
            placeholder="Search"
            placeholderTextColor={Colors().TextInputPlaceholder}
            style={styles().textInput}
            onChangeText={(text) => {
              setData(
                members.filter((item: any) => item.firstname
                  .toLowerCase()
                  .includes(text.toLowerCase())),
              );
            }}
            onBlur={() => {}}
          />
        </View>
        {/* <View style={styles().searchSection}>
          <Icons name="search" size={20} color="#000" />
          <TextInput
            style={styles().input}
            placeholder="User Nickname"
            onChangeText={() => {}}
            underlineColorAndroid="transparent"
          />
        </View> */}
      </TopBar>
      <View style={styles().content}>
        <View style={{ marginTop: 15 }} />
        <FlatList
          data={newArray}
          renderItem={({ item }) => (
            <View>
              <Text style={styles().letra}>{item}</Text>

              {data
                .filter((user: any) => user.firstname.toUpperCase().startsWith(item))
                .map((user: any, key: number) => (
                  <View key={key}>
                    <AvatarListView
                      text={user.firstname}
                      withDescription
                      description={user.email}
                      source={{ uri: user.photo }}
                      onPress={() => navigation.navigate('ProfileFriend', {
                        idUser: user.id,
                      })}
                      showDescription
                    />
                    <View style={{ marginBottom: 10 }} />
                  </View>
                ))}
            </View>
          )}
          keyExtractor={(item) => item.toString()}
        />
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
    flex: 1,
  },
  letra: {
    fontSize: 16,
    color: Colors().TitleBackGroundSecondary,
    marginBottom: 10,
  },
  textInput: {
    width: '80%',
    alignSelf: 'center',
    padding: 13,
    fontSize: 14,
    color: Colors().text,
  },
  searchSection: {
    backgroundColor: Colors().backgroundInputs,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors().CardBorder,
    marginBottom: 15,
    width: '90%',
    alignSelf: 'center',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
});
