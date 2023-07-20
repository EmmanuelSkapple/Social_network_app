import { ActionComand} from '../../types/typesRedux';

const initalState = {
  questionsMatterList: [],
  questionOfDay: {},
  postsWithAnswers: [],
};

export default (state = initalState, action: ActionComand) => {
  switch (action.type) {
    case 'setQuestionsMatter':
      return {
        ...state,
        questionsMatterList: action.payload,
      };
    case 'setQuestionOfDay':
      return {
        ...state,
        questionOfDay: action.payload,
      };
      case 'setPostsWithAnswers':
      return {
        ...state,
        postsWithAnswers: action.payload,
      };
    case 'cleanQuestionsReduce':
      return initalState;
    default:
      return state;
  }
};
