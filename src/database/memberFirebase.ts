import {
  getDocs,
  collection,
  query,
  where,
  documentId,
} from 'firebase/firestore/';

import { db } from './FirebaseConfig';

export const getMembers = async (groupList: Array<any>,allMembers :Array<any> = []) => {
    const membersID: Array<string> = [];
    // eslint-disable-next-line max-len
    groupList.map((group: any) =>
      group.members.map((id: string) =>
        !membersID.includes(id) ? membersID.push(id) : {}
      )
    );
  const memberList: Array<object> = [];
  const membersIDAux = [...membersID];
  allMembers.forEach((item : any) => {
    membersIDAux.includes(item.id) && membersIDAux.slice(membersIDAux.indexOf(item.id),1)
  });

  try {
    if(membersIDAux.length>0){
      while (membersIDAux.length) {
        const membersTen = membersIDAux.splice(0, 10);
        const userRef = collection(db, 'Users');
        const usersQuery = query(userRef, where(documentId(), 'in', membersTen));
        console.log('getMembers');
        const querySnapshot = await getDocs(usersQuery);
        querySnapshot.forEach((doc) => {
          const memberData = doc.data();
          memberData.id = doc.id;
          memberList.push(memberData);
        });
      }
      return {status: allMembers.length == 0?202:200, memberData: memberList}
    }else{
      return { status: 201, memberData: [] };
    }
  } catch (err: unknown) {
    console.log('error en getMembers', err);
    return { status: 500, memberData: memberList };
  }
};
