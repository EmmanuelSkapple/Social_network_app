import { ActionComand} from '../../types/typesRedux';
import {GroupData} from '../../types/typesGroup'
const initalState = {
  groupList: [],
  currentGroup: {},
};

export default (state = initalState, action: ActionComand) => {
  switch (action.type) {
    case 'setGroups':
      return {
        ...state,
        groupList: action.payload,
      };
    case 'setCurrentGroup':
      return {
        ...state,
        currentGroup: action.payload,
      };
    case 'cleanGroupReduce':
      return initalState;
    default:
      return state;
  }
};
