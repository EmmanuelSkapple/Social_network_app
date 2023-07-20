import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../navigators/Stack';
import { RootState } from '../redux/appReducer';
import Colors from '../utils/Colors';
import metrics from '../utils/metrics';
import AvatarListView from './AvatarListView';
import { ListMembersProps } from '../../types/typesComponents';



type listMemberScreen = StackNavigationProp<RootStackParamList, 'GroupList'>;


const screenWidth = metrics.width;
const paddingHorizontal = 9;
const circleSize = 124;
const space = 2;

const calculateSpace = (screenWidth - paddingHorizontal) / circleSize + space;

const ListMembers = ({ currentGroup, onAbout }: ListMembersProps) => {
  const totalMembers = useSelector((state: RootState) =>
    state.members.membersList.filter((member: any) =>
      currentGroup.members?.includes(member.id)
    )
  );
  const user = useSelector((state: RootState) => state.user.userData);
  const navigation = useNavigation<listMemberScreen>();

  const sortMembers = useMemo(() => {
    const memberIndex = totalMembers.findIndex(
      (member: any) => user.uid === member.id
    );
    totalMembers.push(...totalMembers.splice(0, memberIndex));

    let auxTotalMembers = [...totalMembers];

    return auxTotalMembers;
  }, [totalMembers]);

  return (
    <View
      style={[
        styles().container,
        { backgroundColor: Colors().listMembersAvatar },
      ]}>
      <View style={styles().containerMembers}>
        {sortMembers &&
          sortMembers.map((member: any, index: number) => {            
            if (index >= Math.floor(calculateSpace) * 2 - 1) {
              return undefined;
            }
            return (
              <View key={index} style={styles().circleMembers}>
                <AvatarListView
                  source={member.photo}
                  showDescription={false}
                  avatarSize={62}
                  avatarStyle={{
                    borderColor:
                      user.uid === member.id
                        ? Colors().primary
                        : Colors().borderAvatar,
                    borderWidth: 2,
                  }}
                  onPress={() =>
                    navigation.navigate('ProfileFriend', { idUser: member.id })
                  }
                />
              </View>
            );
          })}

        {sortMembers && sortMembers.length >= Math.floor(calculateSpace) ? (
          <TouchableOpacity
            style={[styles().moreView, styles().circleMembers]}
            onPress={onAbout}>
            <Text style={styles().more}>
              +{sortMembers.length - Math.floor(calculateSpace) * 2 - 1}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    containerMembers: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: 3,
      marginVertical: 20,
      width: '100%',
    },
    circleMembers: {
      marginHorizontal: 9,
      marginVertical: 5,
    },
    moreView: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: 62,
      height: 62,
      backgroundColor: Colors().primary,
      borderRadius: 62 / 2,
    },
    more: {
      textAlign: 'center',
      color: 'white',
      fontSize: 16,
    },
  });

export default ListMembers;
