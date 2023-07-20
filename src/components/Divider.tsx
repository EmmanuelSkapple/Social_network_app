import { View, StyleSheet } from 'react-native';

import Colors from '../utils/Colors';
import { DividerProp } from '../../types/typesComponents';

function Divider({ positive = false }: DividerProp) {
  return positive ? (
    <View style={styles().divPositive} />
  ) : (
    <View style={styles().div} />
  );
}

Divider.defaultProps = {
  positive: false,
};

export default Divider;

const styles = () => StyleSheet.create({
  divPositive: {
    width: '30%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors().primary,
    alignSelf: 'center',
  },
  div: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors().borderInputVariant,
    alignSelf: 'center',
    opacity: 0.4,
  },
});
