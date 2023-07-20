import { ActionComand} from '../../types/typesRedux';

const initalState = {
  userData: {},
  preRegister:{
    uid:'',
    phone:'',
    screen:''
  }
};

//* reducer
export default (state = initalState, action: ActionComand) => {
  switch (action.type) {
    case 'setUserData':
      return { ...state, userData: action.payload };
    case 'cleanUserReduce':
      return initalState;
      case 'setPreRegister':
        return { ...state, preRegister: action.payload };
    default:
      return state;
  }
};
