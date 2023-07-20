import { Appearance } from 'react-native';
import { ActionComand } from '../../types/typesRedux'; 


const initalState = Appearance.getColorScheme() === 'dark';

//* reducer
export default (state = initalState, action: ActionComand) => {
  switch (action.type) {
    case 'light':
      return false;
    case 'dark':
      return true;
    case 'cleanThemeReduce':
      return initalState;
    default:
      return state;
  }
};
