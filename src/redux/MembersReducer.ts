import { ActionComand} from '../../types/typesRedux';
const initalState = {
  membersList: [],
  contactsList:[],
  contactsInMatterList:[],
};

//* reducer
export default (state = initalState, action: ActionComand) => {
  switch (action.type) {
    case 'setMembers':
      return {
        ...state,
        membersList: action.payload?action.payload:[],
      };
    case 'setContactList':
      return {
        ...state,
        contactsList: action.payload?action.payload:[],
      };
      case 'setContactInMatterList':
        return {
          ...state,
          contactsInMatterList: action.payload?action.payload:[],
        };
    case 'cleanMembersReduce':
      return initalState;
    default:
      return state;
  }
};
