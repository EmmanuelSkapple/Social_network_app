import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TextInput
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from 'i18n-js';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Colors from '../../utils/Colors';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { createGroup } from '../../database/groupFirebase';
import { RootState } from '../../redux/appReducer';
import { getUser, updateOnBoarding } from '../../database/userFirebase';
import metrics from '../../utils/metrics';
import Images from '../../utils/Images'
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const GROUP_TYPES = [
  {
    title: 'Family',
    img: Images.familyIcon,
  },
  {
    title: 'Community',
    img: Images.communityIcon
  },
  {
    title: 'Friends',
    img: Images.friendsIcon
  },
  {
    title: 'Other',
    img: Images.otherIcon
  },
// eslint-disable-next-line no-use-before-define
] as GroupTypes[];

type GroupTypes = {
  title: string;
  img: any;
};

type GroupTypesProps = {
  groupData: {
    title: string;
    img: any;
  };
  activeBtn : string;
  setActiveBtn : Function;
};
type ContainerSelectGroupProps={
  pressButton:boolean,
  inputWrite:boolean,
  groupName:string,
  setPressButton:Function
}
type HeaderGroupProps={
  groupName:any,
  setGroupName:Function,
  setInputWrite:Function
  
}

function HeaderSelectGroupType({groupName,setGroupName,setInputWrite}:HeaderGroupProps) {


  return (
    <View style={styles().contentHeader}>
        <Text style={styles().title}>{i18n.t('groupHeader')}</Text>
        <View style={styles().contentInput}>
          <TextInput
            placeholder={i18n.t('inputGroup')}
            placeholderTextColor="gray"
            maxLength={30}
            style={[styles().text, styles().input]}
            value={groupName.value}
            onChangeText={async (text) => {
                if (text.length<3) {
                  setInputWrite(false);

                  setGroupName({
                    ...groupName,
                    error: true,
                    errorText: 'invalid name',
                    filled: false,
                    value: text,
                  });
                } else {
                  setInputWrite(true);
                  setGroupName({
                    ...groupName,
                    filled: true,
                    value: text,
                    error: false,
                    errorText: '',
                  });
                }
              }}
              onBlur={async () => {
                if (groupName.error) {
                //  setInputWrite(false);
                  setGroupName({
                    ...groupName,
                    error: true,
                    filled: false,
                    errorText: 'error',
                  });
                }
                 else {
                //  setInputWrite(true);
                  setGroupName({
                    ...groupName,
                    error: false,
                    filled: true,
                    errorText: '',
                  });
                }
              }}
          />
        </View>
    </View>
  );
}

function GroupType({ groupData, activeBtn, setActiveBtn } : GroupTypesProps) {
  const { title,img } = groupData;
  const borderColor = activeBtn === title ? "#2B2A2A" : 'white';
  return (
    // eslint-disable-next-line max-len 
    <TouchableOpacity onPress={() => setActiveBtn(title)} style={[styles().groupTypeContainer,{borderColor}]}>
      <View >
        <Image source={img} style={styles().sticker}></Image>
      </View>
      <Text style={styles().textItemGroup}>{title}</Text>
    </TouchableOpacity>
  );
}

function ContainerSelectGroupType({pressButton,setPressButton,inputWrite,groupName}:ContainerSelectGroupProps) {
  const [activeBtn, setActiveBtn] = useState('');
  const [loading, setLoading] = useState(false);
  const User = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const createFirstGroup = async () => {
    if (activeBtn) {
      setLoading(true);
      const result = await createGroup(
        groupName,
        activeBtn,
        User.userData.uid,
        User.userData.groups ? User.userData.groups : [],
      );
      setLoading(false);
      if (result.status === 200) {
        // eslint-disable-next-line max-len
        await updateOnBoarding({ ...User.userData.onBoarding, AfterHome: true }, User.userData.uid);
        const userStatus = await getUser(User.userData.uid);
        Toast.show({
          type: 'ToastPositive',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: i18n.t('toastGroupCreated'),
          },
        });
        dispatch({
          type: 'setUserData',
          payload: { ...userStatus.userData, uid: User.userData.uid },
        });
      } else {
        Toast.show({
          type: 'ToastError',
          props: {
            hide: () => {
              Toast.hide();
            },
            message: result.message,
          },
        });
      }
    }
  };



  return (
    <View style={styles().container}>
      <Text style={styles().subTitle}>{i18n.t('typeOfGroup')}</Text>
      <View style={styles().grupContainer}>
       <View style={styles().rowContainer}>
          <GroupType key={GROUP_TYPES[0].title} groupData={GROUP_TYPES[0]} activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
          <GroupType key={GROUP_TYPES[1].title} groupData={GROUP_TYPES[1]} activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
       </View>
       <View style={styles().rowContainer}>
          <GroupType key={GROUP_TYPES[2].title} groupData={GROUP_TYPES[2]} activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
          <GroupType key={GROUP_TYPES[3].title} groupData={GROUP_TYPES[3]} activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
        </View>

      </View>
      <View style={styles().buttonsContainer}>
          <PrimaryButton loading={loading}text={'Next'}accion={() => createFirstGroup()} disabled={!inputWrite || activeBtn==''} customStyles={{marginTop:80}} />
        </View>
      
    </View>
  );
}

export default function OnboardingGroup() {
  const [pressButton,setPressButton]=useState(false);
  const [inputWrite,setInputWrite]=useState(false);
  const [groupName, setGroupName] = useState({
    error: false,
    errorText: '',
    value: '',
    filled: false
  });
  return (
    <SafeAreaView style={styles().mainContainer}>
      <HeaderSelectGroupType groupName={groupName} setGroupName={setGroupName} setInputWrite={setInputWrite} />
      <ContainerSelectGroupType setPressButton={setPressButton} pressButton={pressButton}  groupName={groupName.value} inputWrite={inputWrite}/>
    </SafeAreaView>
  );
}

const styles = () => StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  container: {
    marginTop:metrics.height*0.1,
    flex: 2.5,
  },
  contentHeader: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 15,
  },
  dividerContainer: {
    justifyContent: 'flex-end',
    height: 20,
    width: '100%',
    marginBottom: 14,
  },
  groupTypeContainer: {
    flexDirection: "row",
    alignItems:'center',
    backgroundColor:'white',
    borderWidth: 1.5,
    borderRadius:8,
    marginTop:15,
    marginHorizontal: 15,
    marginBottom: 20,
    width: (screenWidth)/2.4,
    height: 70,
  },
  groupTypeLeftContainer: {
    marginLeft: 10,
    width: 200,
  },
  groupTypeSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 26,
    letterSpacing: -0.01,
    color: Colors().TextColorGroupTye,
  },
  groupTypeTitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.01,
    color: Colors().TitleColorGroupTye,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: Colors().BackgroundIconsColorGroupType,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    marginRight: 10,
    width: 50,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  logoHeader: {
    height: screenHeight * 0.09,
    resizeMode: 'contain',
    width: screenHeight * 0.09,
    marginTop: 25,
  },
  logoIcon: {
    height: 25,
    resizeMode: 'contain',
    tintColor: Colors().IconsColorGroupType,
    width: 25,
  },
  mainContainer: {
    backgroundColor: '#F2F6FF',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subTitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.29,
    color: Colors().text,
    textAlign:'left',
    paddingLeft:metrics.width*0.1,
    padding:8

  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '700',
    color: Colors().text,
    marginTop: 39,
  },
  contentInput: {
    width: '90%',
    alignSelf: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors().newBackgroundInput,
    marginHorizontal: 0,
    marginTop:metrics.height*0.1,

  },
  text: {
    color: Colors().text,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    fontSize: 16,
    borderRadius: 10,
    color: Colors().text,
    textAlign: 'left',
  },
  grupContainer:{
    flexDirection:'column',
  },

  rowContainer:{
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  textItemGroup:{
    fontSize:18 ,
    fontWeight:'700'
  },
  sticker:{padding:15,margin:10,width:30,height:30},
  buttonsContainer: { bottom: 0, width: '60%', textAlign: 'center', paddingHorizontal: 24, alignSelf: 'center' },

});