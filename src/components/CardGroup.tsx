import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18n-js';
import Colors from '../utils/Colors';
import AvatarListStacked from './AvatarListStacked';
import { RootStackParamList } from '../navigators/Stack';
import { RootState } from '../redux/appReducer';
import { CardGroupprops } from '../../types/typesComponents';
import Typography from './ui/Typography';
import Images from '../utils/Images';
import FastImage from 'react-native-fast-image';

type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

function CardGroup(props: CardGroupprops) {
  const { groupData } = props;
  const navigation = useNavigation<groupListScreenProp>();
  const allMembers = useSelector((state: RootState) => state.members.membersList);
  let memberGroup = groupData
    ? allMembers.filter((member: any) => groupData.members.includes(member.id))
    : [];

  const styleMode = styles();
  const dispatch = useDispatch();

  const getImageGroup = () => {
    return groupData.tag == 'Family'
      ? Images.familyIcon
      : groupData.tag == 'Friends'
      ? Images.friendsIcon
      : groupData.tag == 'Community'
      ? Images.communityIcon
      : Images.otherIcon;
  };
  console.log('avomos');

  return (
    <TouchableOpacity
      style={styleMode.card}
      onPress={() => {
        dispatch({ type: 'setCurrentGroup', payload: groupData });
        navigation.navigate('GroupFeed', { idGroup: groupData.id });
      }}>
      <View>
        <FastImage source={getImageGroup()} style={styleMode.iconGroup} />
      </View>
      <View style={styleMode.dataGroup}>
        <View>
          <Typography variant='cardTitle'>{groupData.name}</Typography>
          <Typography variant='cardSubtitle'>
            {`${memberGroup.length} ${
              memberGroup.length > 1 ? i18n.t('groupListMembers') : i18n.t('groupListMember')
            }`}
          </Typography>
        </View>
        <View style={styleMode.memberList}>
          <AvatarListStacked members={memberGroup} maxAvatars={7} size={35} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardGroup;

const styles = () =>
  StyleSheet.create({
    card: {
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal:12,
      width: '100%',
      alignSelf: 'center',
      borderColor: Colors().CardGroupsBorderPrimary,
      backgroundColor: Colors().CardGroupsBackground,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    iconGroup: {
      width: 53,
      height: 25,
    },
    dataGroup: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    memberList: {
      marginVertical: 12,
    },
  });
