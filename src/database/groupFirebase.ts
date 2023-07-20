import {
  addDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  orderBy,
  where,
  doc,
  Timestamp,
  getDoc,
  deleteDoc,
  documentId,
} from 'firebase/firestore/';
import { getMembers } from './memberFirebase';
import { db } from './FirebaseConfig';
import { deletePostsOfGroup } from './postFirebase';
import { GroupData, MemberData } from '../../types/typesGroup';

export const createGroup = async (
  name: string,
  tag: string,
  userID: string,
  groupsList: Array<string>,
  password?: string
) => {
  const dateGroup = new Date();
  try {
    const { id } = await addDoc(collection(db, 'Groups'), {
      name,
      tag,
      password: password || null,
      admins: [userID],
      members: [userID],
      post: [],
      created: Timestamp.fromDate(dateGroup),
      lastUpdate: Timestamp.fromDate(dateGroup),
      acceptNewMembers: true,
    });

    await updateDoc(doc(db, 'Users', `${userID}`), {
      groups: [...groupsList, id],
    });

    return { status: 200, message: 'Your group was created' };
  } catch (err: unknown) {
    console.log(err);
    return { status: 505, message: 'Error creating group' };
  }
};

export const getGroup = async (idGroup: string) => {
  try {
    console.log('getGroup');
    const groupData = await getDoc(doc(db, 'Groups', `${idGroup}`));
    if (groupData) {
      if (groupData.exists()) {
        return { status: 200, groupData: groupData.data() };
      }
      return { status: 404, groupData: null };
    }
    return { status: 404, groupData: null };
  } catch (err: unknown) {
    console.log('error en getGroup', err);
    return { status: 500, groupData: null };
  }
};

export const getGroupWithArrayIds = async (idGroups: Array<string>) => {
  const groupList: Array<object> = [];
  try {
    console.log('getGroupWithArrayIds');
    const idGroupsAux = idGroups.length>10?idGroups.slice(0,9):idGroups
    const groupsRef = collection(db, 'Groups');
    const groups = query(groupsRef, where(documentId(), 'in', idGroupsAux));
    const querySnapshot = await getDocs(groups);
    querySnapshot.forEach((docGroup) => {
      const groupData = docGroup.data();
      groupData.id = docGroup.id;
      groupList.push(groupData);
    });
    return {
      status: 200,
      groupData: groupList as GroupData[],
    };
  } catch (err: unknown) {
    console.log('error en getGroupWithArrayIds', err);
    return { status: 500, groupData: null };
  }
};

export const getGroups = async (idUser: string) => {
  const groupList: Array<object> = [];
  try {
    const groupsRef = collection(db, 'Groups');
    const groups = query(
      groupsRef,
      where('members', 'array-contains', idUser),
      orderBy('lastUpdate')
    );
    console.log('getGroups');

    const querySnapshot = await getDocs(groups);
    querySnapshot.forEach((docGroup) => {
      const groupData = docGroup.data();
      groupData.id = docGroup.id;
      groupList.push(groupData);
    });
    return {
      status: 200,
      groupData: groupList as GroupData[],
    
    };
  } catch (err: unknown) {
    console.log('error in getGroups', err);
    return { status: 500, groupData: groupList as GroupData[] };
  }
};

export const deleteGroup = async (idGroup: string) => {
  try {
    await deleteDoc(doc(db, 'Groups', idGroup));
    return { status: 200 };
  } catch (err: unknown) {
    console.log('error in deleteGroups', err);
    return { status: 500 };
  }
};

export const getGroupsIds = async (idUser: string) => {
  const groupIdList: Array<string> = [];
  try {
    const groupsRef = collection(db, 'Groups');
    const groups = query(
      groupsRef,
      where('members', 'array-contains', idUser),
      orderBy('lastUpdate')
    );
    console.log('getGroupsIds');

    const querySnapshot = await getDocs(groups);
    querySnapshot.forEach((docGroup) => {
      groupIdList.push(docGroup.id);
    });

    return { status: 200, groupIdList };
  } catch (err: unknown) {
    console.log('error in getGroups', err);
    return { status: 500, groupIdList };
  }
};

export const addPostToGroup = async (
  idPost: string,
  currentGroup: { id: string; name: string; post: any }
) => {
  try {
    await updateDoc(doc(db, 'Groups', `${currentGroup.id}`), {
      post: currentGroup.post ? [...currentGroup.post, idPost] : [idPost],
    });
    return { status: 200 };
  } catch (error) {
    console.log(error);

    return { status: 505 };
  }
};

export const removeUserOfGroup = async (idUser: string, currentGroup: any) => {
  try {
    if (currentGroup.members) {
      const newMembers = currentGroup.members.filter(
        (item: any) => item !== idUser
      );
      if (newMembers.length > 0) {
        await updateDoc(doc(db, 'Groups', `${currentGroup.id}`), {
          members: newMembers,
        });
      } else {
        deleteGroup(currentGroup.id);
        deletePostsOfGroup(currentGroup.post);
      }
      return { status: 200 };
    } else {
      return { status: 404 };
    }
  } catch (error) {
    console.log('error en removeUserOfGroup', error);

    return { stattus: 505 };
  }
};

// eslint-disable-next-line consistent-return
export const removePostOfGroup = async (idPost: string, idGroup: string) => {
  try {
    const reqGroup = await getGroup(idGroup);
    if (reqGroup.status === 200) {
      let post = reqGroup.groupData?.post ? reqGroup.groupData?.post : [];
      const newPostList = post.filter((item: any) => item !== idPost);
      await updateDoc(doc(db, 'Groups', `${idGroup}`), {
        post: newPostList,
      });
      return { status: 200, message: 'Your photo was update' };
    }
  } catch (err: unknown) {
    console.log(err);
    return { status: 505, message: err };
  }
};

export const editGroup = async (
  idGroup: string,
  name: string,
  acceptNewMembers: boolean
) => {
  try {
    await updateDoc(doc(db, 'Groups', `${idGroup}`), {
      name,
      acceptNewMembers,
    });
    return { status: 200 };
  } catch (error) {
    console.log(error);

    return { status: 505 };
  }
};

export const joinGroup = async (
  idGroup: string,
  members: Array<string>,
  groupsList: Array<string>,
  IdUser: string
) => {
  try {
    await updateDoc(doc(db, 'Groups', `${idGroup}`), {
      members: [...members, IdUser],
    });
    await updateDoc(doc(db, 'Users', `${IdUser}`), {
      groups: [...groupsList, idGroup],
    });
    return { status: 200 };
  } catch (error) {
    console.log('Error al unise a grupo ->', error);

    return { status: 505 };
  }
};
