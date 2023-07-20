import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import i18n from 'i18n-js';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import ShareToNumberPhone from '../modals/ShareToNumberPhone';

import { ItemsContactSmallProps } from '../../types/typesComponents';


const screenWidth = Dimensions.get('window').width;


export default function ItemsContactSmall({ contactData }: ItemsContactSmallProps) {
  const [phoneNumer, setPhoneNumer] = useState('');

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (contactData?.phoneNumbers?.length > 0) {
      setPhoneNumer(contactData.phoneNumbers[0].number);
    }
  }, []);

  return (
    <View style={styles().container}>
      <Image source={Images.logoLoader} style={styles().contactIcon} />
      <Text numberOfLines={2} style={styles().textContactSmall}>
        {contactData.name}
      </Text>
      <TouchableOpacity
        onPress={() => setShow(!show)}
        style={styles().btnInvite}
      >
        <Text style={styles().textBtn}>{i18n.t('homeInvite')}</Text>
      </TouchableOpacity>
      <ShareToNumberPhone
        message={i18n.t('homeMessageFriend')}
        setShow={setShow}
        show={show}
        numberContact={phoneNumer}
        nameContact={contactData.name}
      />
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    width: screenWidth / 3.8,
    height: 130,
    marginHorizontal: 2.5,
    backgroundColor: Colors().ContactItemBackground,
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactIcon: {
    width: '34%',
    height: '34%',
    resizeMode: 'contain',
  },
  textContactSmall: {
    fontSize: 14,
    color: Colors().text,
    width: '90%',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  textBtn: {
    color: Colors().textBtnPrimary,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  btnInvite: {
    backgroundColor: Colors().primary,
    width: '90%',
    borderRadius: 20,
    padding: 6,
  },
});
