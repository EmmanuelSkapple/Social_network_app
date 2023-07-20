import { ActionComand} from '../../types/typesRedux';

const initalState = {
  currentLanguage: 'en-US',
};

//* reducer
export default (state = initalState, action: ActionComand) => {
  switch (action.type) {
    case 'setCurrentLanguage':
      return {
        ...state,
        currentLanguage: action.payload,
      };
    case 'cleanLenguageReduce':
      return initalState;
    default:
      return state;
  }
};
