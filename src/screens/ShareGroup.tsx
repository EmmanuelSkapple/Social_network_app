import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Colors from '../utils/Colors';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Images from '../utils/Images';

function ShareGroup() {
  return (
    <View style={styles().container}>
      <Text style={[styles().text, styles().title]}>Nombre del Grupo</Text>
      <Text style={styles().text}>Código del grupo</Text>
      <View style={styles().copyView}>
        <Text style={styles().text}>HYHK345</Text>
        <TouchableOpacity style={styles().touchCopy}>
          <Image source={Images.copy} style={styles().image} />
        </TouchableOpacity>
      </View>
      <QRCode
        value='LinkDeEjemplo'
        logo={Images.qrLogo}
        logoBackgroundColor={Colors().background}
        color={Colors().primary}
        size={250}
        backgroundColor={Colors().background}
      />
      <View style={styles().space} />
      <PrimaryButton disabled={false} text='Compartir código' accion={() => console.log('Hola')} />
    </View>
  );
}

export default ShareGroup;

const styles = () =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors().background,
      flex: 1,
      alignItems: 'center',
    },
    text: {
      color: Colors().text,
      marginVertical: 15,
      fontSize: 18,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 25,
      marginVertical: 20,
    },
    copyView: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderColor: Colors().textLigth,
      width: '75%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    touchCopy: {
      position: 'absolute',
      right: 0,
      height: '100%',
      justifyContent: 'center',
    },
    image: {
      width: 30,
      height: 30,
    },
    space: {
      marginVertical: 10,
    },
  });
