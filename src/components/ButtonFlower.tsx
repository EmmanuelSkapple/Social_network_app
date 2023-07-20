import { TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../utils/Colors';

type ButtonFlowerProps = {
  accion: Function;
  style?: Object;
  isActive: Boolean;
};

function ButtonFlower(props: ButtonFlowerProps) {
  const { accion, style, isActive } = props;
  return (
    <TouchableOpacity
      style={[styles().button, style]}
      onPress={() => accion()}
      activeOpacity={0.7}
    >
      <Feather
        name={isActive ? 'x' : 'plus'}
        size={35}
        color={Colors().textBtnPrimary}
      />
    </TouchableOpacity>
  );
}

ButtonFlower.defaultProps = {
  style: {},
};

export default ButtonFlower;

const styles = () => StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: '#f74b73',
    margin: 20,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    borderWidth: 3,
    borderColor: Colors().primaryBorder,
  },
  image: {
    width: 30,
    height: 30,
  },
});
