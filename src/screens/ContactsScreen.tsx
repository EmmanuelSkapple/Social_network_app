import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../utils/Colors';
import TopBar from '../components/TopBar';
import AvatarListView from '../components/AvatarListView';
import Icons from '../utils/Icons';
import { RootStackParamList } from '../navigators/Stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getContactsRandom } from '../utils/Contacts';
import Typography from '../components/ui/Typography';
import Loading from '../components/Loading';
import Divider from '../components/Divider';
import ShareToNumberPhone from '../modals/ShareToNumberPhone';
import Store from '../redux/Store';
import i18n from 'i18n-js';
import { SenderObjectProps } from '../../types/typesScreens';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/appReducer';
type groupListScreenProp = StackNavigationProp<RootStackParamList, 'GroupList'>;

export default function ContactsScreen() {
  const navigation = useNavigation<groupListScreenProp>();
  const [isFetching, setIsFetching] = useState(false);
  const [newArray, setNewArray] = useState([] as any);
  const [contactInMatter, setContactInMatter] = useState([] as any);
  const [contactWithoutMatter, setContactWithoutMatter] = useState([] as any);
  const [contactInMatterFilter, setContactInMatterFilter] = useState([] as any);
  const [contactWithoutMatterFilter, setContactWithoutMatterFilter] = useState(
    [] as any
  );
  const contactsList = useSelector((state: RootState) =>state.members.contactsList);
  const contactsInMatterList = useSelector((state: RootState) =>state.members.contactsInMatterList);
  const [showModalShare, setShowModalShare] = useState(false);
  const [sendObj, setSendObj] = useState({} as SenderObjectProps);

  let isMounted = true;

  useEffect(() => {}, []);

  useEffect(() => {
    if (isMounted) {
      getContacts();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const aux = [] as any;
    contactWithoutMatterFilter.map((item: any) => {
      aux.push(item.name.toUpperCase()[0]);
      const dataArr = new Set(aux);
      const result = [...dataArr];
      setNewArray(result.sort());
    });
  }, [contactWithoutMatterFilter]);
 
  const getContacts = async () => {
    setIsFetching(true);
    setContactWithoutMatter(contactsList);
    setContactInMatter(contactsInMatterList);
    setContactWithoutMatterFilter(contactsList);
    setContactInMatterFilter(contactsInMatterList);
    setIsFetching(false);
  };

  const filterContacts = (text: string) => {
    if (text) {
      let contacts = [...contactWithoutMatter].filter((item: any) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      let contactsIn = [...contactInMatter].filter((item: any) =>
        item.firstname.toLowerCase().includes(text.toLowerCase())
      );
      setContactWithoutMatterFilter(contacts);
      setContactInMatterFilter(contactsIn);
    } else {
      setContactWithoutMatterFilter([...contactWithoutMatter]);
      setContactInMatterFilter([...contactInMatter]);
    }
  };

  const avatarImage = (photo: string) => {
    if (photo) {
      return { uri: photo };
    } else {
      return require('../../assets/images/circleLogo.png');
    }
  };

  const shareLink = (phone: string, name: string) => {
    setSendObj({
      phone: phone,
      message:i18n.t('messageInvitationToShare') ,
      contactName: name,
    });
    setShowModalShare(true)
  };

  const btnShare = () => {
    Share.share({
      message: `${
        Store.getState().user.userData.firstname
      }${i18n.t('homeMessageGeneral')}`,
    });
  };

  const listContactsInMatter = () => {
    return contactInMatterFilter.length > 0 ? (
      <>
        <Typography variant='b2' customedStyles={{ marginBottom: 10 }}>
          {i18n.t('friendsInMatter')}
        </Typography>
        {contactInMatterFilter.map((user: any, key: number) => (
          <View key={key}>
            <AvatarListView
              text={user.firstname}
              withDescription
              description={user.email}
              source={avatarImage(user.photo)}
              onPress={() => shareLink(user.phone, user.firstname)}
              showDescription
            />
            <View style={{ marginBottom: 10 }} />
          </View>
        ))}
        <Divider />
        <View style={{ marginBottom: 15 }} />
        <Typography variant='b2' customedStyles={{ marginBottom: 10 }}>
          {i18n.t('contacts')}
        </Typography>
      </>
    ) : (
      <></>
    );
  };

  const itemAvatarRender = ({ item }: any) => {
    return (
      <View>
        <Text style={styles().letra}>{item}</Text>

        {contactWithoutMatterFilter
          .filter((user: any) => user.name.toUpperCase().startsWith(item))
          .map((user: any, key: number) => (
            <View key={key}>
              <AvatarListView
                text={user.name}
                withDescription
                description={user.phoneNumbers[0].number}
                source={avatarImage(user.photo)}
                onPress={() =>
                  shareLink(user.phoneNumbers[0].number, user.name)
                }
                showDescription
              />
              <View style={{ marginBottom: 10 }} />
            </View>
          ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles().container}>
      <TopBar
        backButton
        backAction={() => {
          navigation.goBack();
        }}
        centerText={i18n.t('invitesMatter')}
        divider>
        {/* SearchBar Section */}
        <View style={styles().searchSection}>
          <Icons name='search' size={20} color='#BFBFC0' />
          <TextInput
            placeholder={i18n.t('searchFriends')}
            placeholderTextColor={Colors().TextInputPlaceholder}
            style={styles().textInput}
            onChangeText={filterContacts}
            onBlur={() => {}}
          />
        </View>
      </TopBar>
      {/* Invite Button Section */}
      <View style={styles().inviteSection}>
        <View style={styles().inviteCard}>
          <View>
            <Text style={styles().inviteTitle}>{i18n.t('invitesFriends')}</Text>
            <Text style={styles().inviteSubTitle}>https://www.mtter.io/</Text>
          </View>
          <TouchableOpacity style={styles().inviteButton} onPress={btnShare}>
            <Icon name='share' color={Colors().white} size={18} />
            <Text style={styles().inviteButtonText}>{i18n.t('share')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Contacts Display Section */}
      <View style={styles().content}>
        {contactWithoutMatterFilter.length > 0 ? (
          <>
            <View style={{ marginTop: 15 }} />
            <FlatList
              data={newArray}
              refreshing={isFetching}
              onRefresh={getContacts}
              ListHeaderComponent={listContactsInMatter}
              renderItem={itemAvatarRender}
              keyExtractor={(item) => item.toString()}
            />
          </>
        ) 
        : contactWithoutMatterFilter.length == 0  || !isFetching ?
        (
          <View style={styles().contentEmpty}>
            <Text style={styles().inviteTitle}>{i18n.t('notContacts')}</Text>
          </View>
        ):
        (
          <Loading />
        )}
      </View>
      <ShareToNumberPhone
        show={showModalShare}
        setShow={setShowModalShare}
        numberContact={sendObj.phone}
        message={sendObj.message}
        nameContact={sendObj.contactName}
      />
    </SafeAreaView>
  );
}


const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors().BackgroundSecondary,
    },
    content: {
      backgroundColor: Colors().CardGroupsBackground,
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
    inviteSection: {
      backgroundColor: Colors().BackgroundTernary,
    },
    inviteCard: {
      backgroundColor: Colors().CardRightRoundedBackground,
      marginHorizontal: 16,
      marginVertical: 22,
      paddingVertical: 18,
      paddingLeft: 16,
      paddingRight: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomRightRadius: 35,
      borderTopRightRadius: 35,
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    inviteTitle: {
      fontSize: 14,
      color: Colors().CardRightRoundedTitle,
      fontFamily: 'PlusJakartaSans-Bold',
    },
    inviteSubTitle: {
      fontSize: 14,
      color: Colors().CardRightRoundedSubTitle,
      fontFamily: 'PlusJakartaSans-Medium',
    },
    inviteButton: {
      backgroundColor: Colors().primary,
      height: 34,
      borderRadius: 17,
      paddingHorizontal:8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inviteButtonText: {
      fontSize: 14,
      color: Colors().white,
      fontFamily: 'PlusJakartaSans-Medium',
      marginLeft: 5,
    },
    contentEmpty:{
      width:'100%',
      height:'100%',
      flex:1,
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
    }
  });
