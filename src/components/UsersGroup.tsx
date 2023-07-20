import {
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Share,
  View,
} from 'react-native';

import { StackActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import CircleImage from './CircleImage';

import Colors from '../utils/Colors';
import images from '../utils/Images';
import Icons from '../utils/Icons';
import Store from '../redux/Store';
import { RootStackParamList } from '../navigators/Stack';
import { RootState } from '../redux/appReducer';
import { UsersGroupProps } from '../../types/typesComponents';

type profielFriendScreenProp = StackNavigationProp<
  RootStackParamList,
  'ProfileFriend'
>;



function UsersGroup({ membersProp, groupData }: UsersGroupProps) {
  const navigation = useNavigation<profielFriendScreenProp>();
  const members = useSelector((state: RootState) =>
    state.members.membersList.filter((member: any) =>
      membersProp.includes(member.id)
    )
  );
  const User = useSelector((state: RootState) => state.user);

  const getPhotos = () =>
    members.map((member: any) => ({
      photo: member.photo,
      name: member.firstname,
      id: member.id,
    }));

  const btnShare = () => {
    Share.share({
      message: `${
        Store.getState().user.userData.firstname
      } has invited you to join the ${
        groupData.name
      } group on Matter. \n https://mtter.io/invite/${groupData.id}`,
    });
  };

  function AddUser() {
    return (
      <TouchableOpacity style={styles().add} onPress={btnShare}>
        <Icons color={Colors().textLigth} name='user-plus' size={30} />
        <Text />
      </TouchableOpacity>
    );
  }

  const navigateToProfile = (item: any) => {
    if (item.id === User.userData.uid) {
      navigation.dispatch(
        StackActions.replace('TabNavigator', {
          screen: 'Profile',
        })
      );
    } else {
      navigation.navigate('ProfileFriend', { idUser: item.id });
    }
  };

  return (
    <FlatList
      horizontal
      data={getPhotos()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigateToProfile(item)}
          style={styles().container}>
          {item.photo ? (
            <CircleImage
              source={item.photo ? { uri: item.photo } : images.user}
              size={50}
            />
          ) : (
            <View style={styles().profileImage}>
              <Feather size={25} name='user' color={Colors().primary} />
            </View>
          )}
          <Text style={styles().text}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(value, index) => index.toString()}
      style={styles().flatList}
      ListFooterComponent={AddUser}
    />
  );
}

export default UsersGroup;

const styles = () =>
  StyleSheet.create({
    container: { alignItems: 'center', marginHorizontal: 5 },
    text: {
      color: Colors().textLigth,
      textAlign: 'center',
      fontFamily: 'Cabin-Regular',
      marginTop: 8,
    },
    flatList: {
      backgroundColor: Colors().topBackground,
    },
    add: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 20,
      alignItems: 'center',
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
  });
