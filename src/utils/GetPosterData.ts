import Store from '../redux/Store';

import {GetPosterDataProps }  from '../../types/typesUtils';


export const getPosterData = (poster: GetPosterDataProps) => {
  const members = Store.getState().members.membersList;
  const userData = members.filter((member: any) => {
    poster.id == member.id;
  });
  if (userData.length > 0) {
    const user = userData[0];
    return { name: user.firstName, photo: user.photo, id: user.id };
  }
  return poster;
};
