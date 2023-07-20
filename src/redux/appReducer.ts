import { combineReducers } from 'redux';
import ThemeReduce from './Theme';
import UserReduce from './UserReducer';
import GroupReducer from './GroupReducer';
import MembersReducer from './MembersReducer';
import PostReducer from './PostReducer';
import QuestionsReducer from './QuestionsReducer';
import LenguagesReducer from './LenguagesReducer';

const AppReducer = combineReducers({
  theme: ThemeReduce,
  user: UserReduce,
  groups: GroupReducer,
  members: MembersReducer,
  posts: PostReducer,
  questions: QuestionsReducer,
  language: LenguagesReducer,
});

export default AppReducer;

export type RootState = ReturnType<typeof AppReducer>;
