import { Dispatch } from 'redux';
import { GroupData, MemberData, GroupDataResponse } from '../../../types/typesGroup';
import { getGroups } from '../../database/groupFirebase';

export const REQUEST_GROUPS = 'requestGroups';
export const SET_GROUPS_SUCCESS = 'setGroups';
export const SET_MEMBERS_SUCCESS = 'setMembers';

export interface RequestGroups {
  type: typeof REQUEST_GROUPS;
  userId: string;
}
export interface SetGroups {
  type: typeof SET_GROUPS_SUCCESS;
  payload: GroupData[];
}
export interface SetMembers {
  type: typeof SET_MEMBERS_SUCCESS;
  payload: MemberData[];
}

export type GroupDispatchTypes = RequestGroups | SetGroups | SetMembers;

export const getGroupData =
  (userId: string) => async (dispatch: Dispatch<GroupDispatchTypes>) => {
    const result: GroupDataResponse = await getGroups(userId);
    switch (result.status) {
      case 200:
        dispatch({ type: SET_GROUPS_SUCCESS, payload: result.groupData });
        break;
      default:
        break;
    }
  };
