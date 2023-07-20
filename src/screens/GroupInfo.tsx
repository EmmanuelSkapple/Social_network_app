import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../utils/Colors';
import Divider from '../components/Divider';
import Images from '../utils/Images';
import { InfoProps, UserProps } from '../../types/typesScreens';


function Info({ title, data }: InfoProps) {
  return (
    <>
      <View style={styles().info}>
        <Text style={styles().text}>{title}</Text>
        <Text style={styles().text}>{data}</Text>
      </View>
      <Divider />
    </>
  );
}



function User({ name }: UserProps) {
  return (
    <TouchableOpacity style={styles().user}>
      <Image source={Images.placeHolder} style={styles().photo} />
      <Text style={[styles().text, styles().name]}>{name}</Text>
    </TouchableOpacity>
  );
}

function GroupInfo() {
  return (
    <ScrollView style={styles().container}>
      <Text style={[styles().text, styles().title]}>Nombre del grupo</Text>
      <Divider />
      <Info title="Miembros" data={8} />
      <Info title="Post" data={15} />
      <Info title="Preguntas" data={10} />
      <Info title="Actualizaciones" data={20} />
      <Text style={[styles().text, styles().subTitle]}>Miembros</Text>
    </ScrollView>
  );
}

export default GroupInfo;

const styles = () => StyleSheet.create({
  container: {
    backgroundColor: Colors().background,
    flex: 1,
  },
  text: {
    color: Colors().text,
    fontSize: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    margin: 10,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginVertical: 15,
  },
  userList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  user: {
    width: '25%',
    margin: 10,
    alignItems: 'center',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    textAlign: 'center',
  },
});
