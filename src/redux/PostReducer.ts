import { ActionComand} from '../../types/typesRedux';


const initalState = {
  postsList: [],
  recentAcivity: [],
  uploadVideo: {
    status: 0,
    progress: 0,
  },
  postToUpdate: {
    poster: {
      id: '',
      name: '',
      photo: '',
    },
    status:'',
    asker: {
      id: '',
      name: '',
      photo: '',
      idQuestion: '',
      groupData: {
        name: '',
        id: '',
      }
    },
    ask: '',
    typePost: '',
  },
};

//* reducer
export default (state = initalState, action: ActionComand) => {
  switch (action.type) {
    case 'setPosts':
      return {
        ...state,
        postsList: action.payload,
      };
      case 'setVideoList':
      return {
        ...state,
        postsList: action.payload,
      };
    case 'setRecentActivity':
      return {
        ...state,
        recentAcivity: action.payload,
      };
    case 'setUploadVideo':
      return {
        ...state,
        uploadVideo: action.payload,
      };
    case 'setPostToUpdate':
      return {
        ...state,
        postToUpdate: action.payload,
      };
    case 'cleanPostReduce':
      return initalState;
    default:
      return state;
  }
};
