import {
  addDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  doc,
  arrayRemove,
  deleteDoc,
  Timestamp,
  arrayUnion,
  orderBy,
} from 'firebase/firestore/';
import { Alert } from 'react-native';
import { NewCommentProps } from '../../types/typesComments';
import { db } from './FirebaseConfig';
import { addNotiifacion } from './notificationsFirebase';


export const addComment = async ({
  idPost,
  group,
  comment,
  poster,
  membersData
}: NewCommentProps) => {
  try {
    const reqComment = await addDoc(collection(db, 'Comments'), {
      idPost,
      group,
      comment,
      poster,
      created: new Date(),
    });
    await updateDoc(doc(db, 'Posts',`${idPost}`), {
      comments:arrayUnion(reqComment.id)
    });
    addNotiifacion({
      group: {
        id: group.id,
        name: group.name,
      },
      poster,
      typeNotification: 'newComment',
      membersToNotify: membersData.map((member: any) => member.id),
      iconType: 'Comment',
      trackingId: reqComment.id,
    });
    return { status: 200 };
  } catch (error) {
    if (error instanceof Error) { console.log('Error en addComment', error.message); }
    return { status: 500 };
  }
};

export const getComments = async (idPost: string) => {  
  const commentsList: Array<object> = [];
  try {
    const commentRef = collection(db, 'Comments');
    const usersQuery = query(
      commentRef,
      where('idPost', '==', idPost),
      orderBy('created', 'desc'),
    );
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((doc) => {
      const commentData = doc.data();
      commentData.id = doc.id;
      commentsList.push(commentData);
    });
    return { status: 200, commentsList };
  } catch (err: unknown) {
    console.log(err);
    return { status: 500, commentsList };
  }
};
