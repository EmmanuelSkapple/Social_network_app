// Import the functions you need from the SDKs you need

import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  arrayRemove,
} from 'firebase/firestore/';

import { db } from './FirebaseConfig';

import { AddNotiifacionProps } from '../../types/typesNotificationsFirebase';

export const addNotiifacion = async ({
  group,
  poster,
  typeNotification,
  membersToNotify,
  iconType,
  trackingId = '',
}: AddNotiifacionProps) => {
  try {
    await addDoc(collection(db, 'Notifications'), {
      group,
      poster,
      typeNotification,
      membersToNotify,
      iconType,
      trackingId,
      created: new Date(),
    });
    return { status: 200 };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error en addQuestion', error.message);
    }
    return { status: 500 };
  }
};

export const getNotifications = async (idUser: string) => {
  const notifyList: Array<object> = [];
  try {
    const postRef = collection(db, 'Notifications');
    if (idUser) {
      const usersQuery = query(
        postRef,
        where('membersToNotify', 'array-contains', idUser),
      );
      const querySnapshot = await getDocs(usersQuery);
      querySnapshot.forEach((doc) => {
        const notifyData = doc.data();
        notifyData.id = doc.id;
        notifyList.push(notifyData);
        if (notifyData.membersToNotify.length <= 1) {
          deleteNotifications(notifyData.id);
        } else {
          removeMemberToNotification(idUser, notifyData.id);
        }
      });
      return { status: 200, notifyList: notifyList.reverse() };
    }
    return { status: 500, notifyList };
  } catch (err: unknown) {
    console.log(err);
    return { status: 500, notifyList };
  }
};

export const removeMemberToNotification = async (
  idUser?: string,
  idNotification?: string,
) => {
  try {
    if (idUser && idNotification) {
      const questionsRef = doc(db, 'Notifications', `${idNotification}`);
      await updateDoc(questionsRef, {
        membersToNotify: arrayRemove(`${idUser}`),
      });
    }
    return { status: 200 };
  } catch (err: unknown) {
    console.log('error en removeMemberToNoti => ', err);
    return { status: 500 };
  }
};

export const deleteNotifications = async (idNotification: string) => {
  try {
    
    await deleteDoc(doc(db, 'Notifications', idNotification));
    return { status: 200 };
  } catch (err: unknown) {
    console.log('Error en deleteNotify', err);
    return { status: 505, message: err };
  }
};
