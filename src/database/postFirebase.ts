import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  Timestamp,
  orderBy,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore/';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getThumbnailAsync } from 'expo-video-thumbnails';
import { Alert, Platform } from 'react-native';
import { db, storage } from './FirebaseConfig';
import { addPostToGroup, getGroups, removePostOfGroup } from './groupFirebase';
import { uploadSource } from './storageFirebase';
import Store from '../redux/Store';
import { sendNotification } from '../utils/notifications';
import { removeMemberToQuestion } from './stampFirebase';
import { addNotiifacion } from './notificationsFirebase';
import { uploadFileStorage } from '../services/StorageFiles';
import { compressVideo } from '../services/compressVideo';

const batch = writeBatch(db);

export const createPost = async (
  postData: {
    poster: {
      id: string;
      name: string;
      photo: string;
    };
    asker?: {
      id: string;
      name: string;
      photo: string;
      idQuestion: string;
    };
    status: string;
    ask: string;
    typePost: string;
  },
  videoUrl: string,
  videoThumbails: string,
  dispatch: any,
  currentGroup: {
    name: string;
    id: string;
    post: any;
    membersGroup: Array<string>;
  },
  datevideo: string,
  description: string
) => {
  const membersData = Store.getState().members.membersList.filter((member: any) =>
    currentGroup.membersGroup.includes(member.id)
  );
  const datePost = new Date();
  try {
    let thumbailsUri = await uploadSource(
      videoThumbails,
      `post/${postData.poster.id}/${datevideo}/thumbnails.jpg`
    );

    dispatch({ type: 'setUploadVideo', payload: { status: 1, progress: 0.9 } });
    console.log('desde el front ', {
      poster: postData.poster,
      asker: postData.asker ? postData.asker : null,
      ask: postData.ask,
      description: description,
      status: postData.status,
      typePost: postData.typePost,
      uriSource: videoUrl,
      uriThumbnails: thumbailsUri || '',
      group: {
        name: currentGroup.name,
        id: currentGroup.id,
      },
      likes: [],
      created: Timestamp.fromDate(datePost),
    });

    const idPost = await addDoc(collection(db, 'Posts'), {
      poster: postData.poster,
      asker: postData.asker ? postData.asker : null,
      ask: postData.ask,
      description: description,
      status: postData.status,
      typePost: postData.typePost,
      uriSource: videoUrl,
      uriThumbnails: thumbailsUri || '',
      group: {
        name: currentGroup.name,
        id: currentGroup.id,
      },
      likes: [],
      created: Timestamp.fromDate(datePost),
    });

    let reqGroup = await addPostToGroup(idPost.id, currentGroup);

    if (reqGroup.status === 200) {
      // aqui insertamos nueva notificaion
      await removeMemberToQuestion(postData.poster.id, postData.asker?.idQuestion);
      dispatch({ type: 'setUploadVideo', payload: { status: 1, progress: 1 } });
      dispatch({ type: 'setUploadVideo', payload: { status: 0, progress: 0 } });
      sendNotification('newUpdate', false, membersData, postData.poster.name, currentGroup.name);
      addNotiifacion({
        group: {
          id: currentGroup.id,
          name: currentGroup.name,
        },
        poster: postData.poster,
        typeNotification: `newPost-${postData.typePost}`,
        membersToNotify: membersData.map((member: any) => member.id),
        iconType: `${postData.typePost}`,
        trackingId: idPost.id,
      });
      const result: any = await getGroups(postData.poster.id);
      if (result.status === 200) {
        dispatch({ type: 'setGroups', payload: result.groupData });
        dispatch({
          type: 'setCurrentGroup',
          payload: result.groupData.filter((group: any) => group.id === currentGroup.id)[0],
        });
      }
      return { status: 200, message: 'Your post was created' };
    }
    return { status: 505, message: 'Error post' };
  } catch (err: unknown) {
    console.log('error en createPost', err);
    dispatch({ type: 'setUploadVideo', payload: { status: 0, progress: 0 } });
    Alert.alert('Error', 'somethin went wrong');
    return { status: 505, message: 'Error post' };
  }
};

export const getPost = async (GroupId: string) => {
  const postList: Array<object> = [];
  try {
    const postRef = collection(db, 'Posts');
    const usersQuery = query(postRef, where('group.id', '==', GroupId), orderBy('created', 'desc'));
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      postData.id = doc.id;
      postList.push(postData);
    });
    return { status: 200, postList };
  } catch (err: unknown) {
    console.log(err);
    return { status: 500, postList };
  }
};

export const getPostsNotLiberate = async (GroupId: string) => {
  const postList: Array<object> = [];
  try {
    const postRef = collection(db, 'Posts');
    const usersQuery = query(
      postRef,
      where('group.id', '==', GroupId),
      where('status', '==', 'inQuestion'),
      orderBy('created', 'desc')
    );
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      postData.id = doc.id;
      postList.push(postData);
    });
    return { status: 200, postList };
  } catch (err: unknown) {
    console.log(err);
    return { status: 500, postList };
  }
};

export const getPostFromQuestion = async (GroupId: string, idQuestion: string) => {
  const postList: Array<object> = [];
  const usersWithAnswers: Array<string> = [];
  try {
    const postRef = collection(db, 'Posts');
    const usersQuery = query(
      postRef,
      where('group.id', '==', GroupId),
      where('asker.idQuestion', '==', idQuestion),
      orderBy('created', 'desc')
    );
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      postData.id = doc.id;
      postList.push(postData);
      usersWithAnswers.push(postData.poster.id);
    });
    return { status: 200, postList, usersWithAnswers };
  } catch (err: unknown) {
    console.log(err);
    return { status: 500, postList, usersWithAnswers };
  }
};

export const getPostUser = async (idUser: string) => {
  const postList: Array<object> = [];
  try {
    const postRef = collection(db, 'Posts');
    const usersQuery = query(postRef, where('poster.id', '==', idUser));
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      postData.id = doc.id;
      postList.push(postData);
    });

    return { status: 200, postList };
  } catch (err: unknown) {
    // console.log(err);
    return { status: 500, postList };
  }
};

export const deletePost = async (
  idUser: string,
  idPost: string,
  idGroup: string,
  dispatch: any
) => {
  try {
    const reqRemoveOfGroup = await removePostOfGroup(idPost, idGroup);
    if (reqRemoveOfGroup?.status === 200) {
      await deleteDoc(doc(db, 'Posts', idPost));
      const result: any = await getGroups(idUser);
      if (result.status === 200) {
        dispatch({ type: 'setGroups', payload: result.groupData });
        dispatch({
          type: 'setCurrentGroup',
          payload: result.groupData.filter((group: any) => group.id === idGroup)[0],
        });
      }
      return { status: 200, message: 'Your post no longer exists :(' };
    }
    return { status: 505, message: 'algo paso mal' };
  } catch (err: unknown) {
    console.log(err);
    return { status: 505, message: err };
  }
};

export const deletePostsOfGroup = async (arrayIdPosts: Array<string>) => {
  try {
    arrayIdPosts.forEach((item) => {
      batch.delete(doc(db, 'Posts', item));
    });
    await batch.commit();
    return { status: 200 };
  } catch (error) {
    console.log('error en deletePostsOfGroup', error);
    return { status: 505 };
  }
};

export const uploadPost = async (
  uriSource: string,
  postData: {
    poster: {
      id: string;
      name: string;
      photo: string;
    };
    asker?: {
      id: string;
      name: string;
      photo: string;
      idQuestion: string;
    };
    status: string;
    ask: string;
    typePost: string;
  },
  dispatch: any,
  currentGroup: {
    name: string;
    id: string;
    post: any;
    membersGroup: Array<string>;
  },
  description: string,
  duration: number
) => {
  try {
    console.log('pas 0');

    const datevideo = new Date().getTime().toString();
    console.log('pas 0.1', uriSource);

    let videoThumbnails =
      postData.typePost == 'Video'
        ? await getThumbnailAsync(uriSource, { time: 2000, quality: 0.3 })
        : { uri: '' };

    console.log('pas 0.15');

    let urlStoragePost = '';
    console.log('pas 0.2');

    let urlToSave =
      'post/' + postData.poster.id + '/' + datevideo + '/postSource.' + getExtSource(uriSource);
    console.log('pas 0.4');

    if (postData.typePost == 'Video') {
      console.log('pas 1');

      urlStoragePost = await compressVideo(
        uriSource,
        duration,
        urlToSave,
        0.11,
        0.7,
        dispatch,
        getExtSource(uriSource),
        postData.typePost
      );
    } else {
      console.log('paso que no debe');

      dispatch({ type: 'setUploadVideo', payload: { status: 1, progress: 0.3 } });
      const fetchedVideo = await fetch(uriSource);
      dispatch({ type: 'setUploadVideo', payload: { status: 1, progress: 0.42 } });
      const videoBlob = await fetchedVideo.blob();
      dispatch({ type: 'setUploadVideo', payload: { status: 1, progress: 0.67 } });
      const videoRef = ref(storage, urlToSave);
      const uploadTask = await uploadBytes(videoRef, videoBlob);
      dispatch({ type: 'setUploadVideo', payload: { status: 1, progress: 0.81 } });
      urlStoragePost = await getDownloadURL(uploadTask.ref);
    }
    console.log('urlStoragePost', urlStoragePost);

    if (urlStoragePost) {
      createPost(
        postData,
        urlStoragePost,
        videoThumbnails.uri,
        dispatch,
        currentGroup,
        datevideo,
        description
      );
    } else {
    }
  } catch (error) {
    console.log('error en uploadVideo', error);
    Alert.alert('Error', 'somethin went wrong');
  }
};

const getExtSource = (uriSource: string) => {
  let extSource = '';
  if (Platform.OS === 'ios' && (uriSource.endsWith('.heic') || uriSource.endsWith('.HEIC'))) {
    extSource = 'jpg';
  } else {
    extSource = uriSource.split('.').pop() as string;
  }
  return extSource;
};

export const getLastPostAllGroups = async (
  idUser: string,
  startAtHours: number,
  groupArray: Array<string>
) => {
  const postList: Array<object> = [];
  try {
    if (groupArray.length > 0) {
      const postRef = collection(db, 'Posts');
      if (idUser) {
        const TimestampPost = Timestamp.fromDate(
          new Date(new Date().getTime() - startAtHours * 3600 * 1000)
        );
        const usersQuery = query(
          postRef,
          where('created', '>=', TimestampPost),
          where('group.id', 'in', groupArray)
        );
        const querySnapshot = await getDocs(usersQuery);
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          postData.id = doc.id;
          postList.push(postData);
        });

        return { status: 200, postList: postList.reverse() };
      }
      return { status: 500, postList };
    }
  } catch (err: unknown) {
    console.log(err);
    return { status: 500, postList };
  }
};
