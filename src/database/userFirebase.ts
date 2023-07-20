// Import the functions you need from the SDKs you need

import {
  getDoc,
  setDoc,
  doc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  deleteDoc,
  arrayRemove,
} from 'firebase/firestore/';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {firebase } from '@react-native-firebase/auth';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import i18n from 'i18n-js';
import { db, auth, storage } from './FirebaseConfig';
import axios from 'axios';

import {
  CreateUserProps,
  UpdateUserProps,
  UpdatePhotoUserProps,
  UpdatePhoneUserProps,
  UpdateNotificationTokenUserProps,
} from '../../types/typesUserFirebase';
const serverUrl = 'https://lyfelab.org';




// eslint-disable-next-line consistent-return
export const createUser = async (userData: CreateUserProps) => {
  const { 
    userName, firstname,lastname,phone, email,birthDay,
  } = userData;
  try {
      let userCredential=firebase.auth().currentUser;
    if (userCredential?.uid) {
      const signupDate = userCredential.metadata.creationTime;
      const datePost = signupDate? new Date(signupDate) : new Date ();
      await setDoc(doc(db, 'Users', userCredential.uid), {
        birthDay: new Date(
          parseInt(birthDay.year, 10),
          parseInt(birthDay.month, 10) - 1,
          parseInt(birthDay.day, 10),
        ),
        userName,
        firstname,
        lastname,
        phone,
        email,
        questionCount: 0,
        notification: true,
        firstTime: true,
        created: Timestamp.fromDate(datePost),
        onBoarding: {
          AfterHome: false,
          GroupFeed: false,
          GroupList: false,
          Home: false,
          Questions: false,
        },
      });
      return { status: 200, message: i18n.t('fToastAccountCreated') };
    }
  } catch (err: unknown) {
    console.log('error al crear usuario ->', err);
    const { message } = err as Error;
    if (message.includes('auth/email-already-in-use')) {
      return { status: 505, message: i18n.t('fToastAlreadyRegistered') };
    }
    return { status: 505, message };
  }
};

export const updateUser = async (userData: UpdateUserProps) => {
  const {
     email, birthDay, firstname, lastname, photo, uid,
  } = userData;
  try {
    await updateDoc(doc(db, 'Users', `${uid}`), {
      birthDay: new Date(
        `${birthDay?.month}/${birthDay?.day}/${birthDay?.year}`,
      ),
      firstname,
      lastname,
      email,
      photo,
    });
    return { status: 200, message: i18n.t('fToastAccountUpdated') };
  } catch (err: unknown) {
    console.log(err);
    return { status: 505, message: err };
  }
};

export const deleteUserFromDB = async (idUser : string) => {
  try {
    await deleteDoc(doc(db, 'Users', idUser)); 
    return { status: 200};
  } catch (error) {
    return { status: 505};
  }
}

export const updatePhotoUser = async (userData: UpdatePhotoUserProps) => {
  try {
    const { photo, onBoardinList, uid } = userData;
    const imagePath = `Users/${uid}`;
    const resizedPhoto = await manipulateAsync(
      photo,
      [{ resize: { width: 300 } }],
      { compress: 0.7, format: SaveFormat.JPEG },
    );
    const imageUri = await uploadImage(resizedPhoto.uri, imagePath);
    if (imageUri) {
      if (onBoardinList) {
        await updateDoc(doc(db, 'Users', `${uid}`), {
          photo: imageUri,
        });
      } else {
        await updateDoc(doc(db, 'Users', `${uid}`), {
          photo: imageUri,
        });
      }
      return { status: 200, message: i18n.t('fToastUpdatePhoto') };
    }
    return { status: 505, message: i18n.t('fToastSomethingWentWrong') };
  } catch (err: any) {
    console.log(err);
    return { status: 505, message: err };
  }
};

// eslint-disable-next-line consistent-return
export const updateOnBoarding = async (onBoardinList: Object, uid: string) => {
  try {
    await updateDoc(doc(db, 'Users', `${uid}`), {
      onBoarding: { ...onBoardinList },
    });
  } catch (err: any) {
    console.log(err);
    return { status: 505, message: err };
  }
};

export const updatePhoneUser = async (userData: UpdatePhoneUserProps) => {
  const { phone, countryCode, uid } = userData;
  try {
    await updateDoc(doc(db, 'Users', `${uid}`), {
      phone,
      country: countryCode,
    });
    return { status: 200, message: i18n.t('fToastUpdatePhone') };
  } catch (err: unknown) {
    console.log(err);
    return { status: 505, message: err };
  }
};

export const updateNotificationTokenUser = async (
  userData: UpdateNotificationTokenUserProps,
// eslint-disable-next-line consistent-return
) => {
  const { notificationToken, uid } = userData;
  try {
    if (notificationToken && uid) {
      await updateDoc(doc(db, 'Users', `${uid}`), {
        notificationToken,
      });
      return { status: 200 };
    }
  } catch (err: unknown) {
    console.log(err);
    return { status: 505, message: err };
  }
};

export const getUser = async (idUser: string) => {
  try {
    const userData = await getDoc(doc(db, 'Users', `${idUser}`));
    if (userData) {
      if (await userData.exists()) {
        return { status: 200, userData: userData.data() };
      }
      return { status: 404, userData: null };
    }
    return { status: 404, userData: null };
  } catch (err: unknown) {
    return { status: 500, userData: null };
  }
};


export const getUserLogin = async (idUser: string) => {
  try {
    
    return new Promise(async (resolve,reject)=>{
      const userData = await getDoc(doc(db, 'Users', `${idUser}`));
      if(userData.exists()){
        resolve ({ status: 200, userData: userData.data() })
      }
      else{
        resolve({ status: 404, userData: null })
      }

    }
    )

  } catch (err: unknown) {
    return { status: 500, userData: null };
  }
};


export const removeGroupOfUser = async (idUser : string ,idGroup : string) => {
  
  
  try {
    arrayRemove
       await updateDoc(doc(db, 'Users', `${idUser}`), {
        groups:arrayRemove(idGroup),
      });
    
    return { status: 200 };
  } catch (err: unknown) {
    console.log('error en removeGroupOfUser', err);
    return { status: 500, userData: null };
  }
};

// eslint-disable-next-line consistent-return
export const singInUser = async (email: string, password: string) => {
  try {
    const userCrendential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    if (userCrendential.user) {
      return { status: 200, message: i18n.t('fToastWelcome') };
    }
  } catch (err: unknown) {
    let { message } = err as Error;
    if (message.includes('user-not-found')) {
      message = i18n.t('fToastUserNotFound');
    } else if (message.includes('wrong-password')) {
      message = i18n.t('fToastWrongPassword');
    }
    return { status: 500, message };
  }
};

export const validateNickname = async (nickName: string) => {
  try {

    //Validar nickname
    
   return {status: 200, nickNameExist: true}
  } catch (err: unknown) {
    return { status: 500, err };
  }
};
// eslint-disable-next-line consistent-return
export const uploadImage = async (uriImage: string, uriStorage: string) => {
  try {
    const fetchImage = await fetch(uriImage);
    const blobImage = await fetchImage.blob();
    const videoRef = ref(storage, uriStorage);
    const uploadTask = await uploadBytes(videoRef, blobImage);
    const urlFirebase = await getDownloadURL(uploadTask.ref);
    return urlFirebase;
  } catch (error) {
    console.log('erro To upload ', error);
  }
};

export const isSingned = async () => {
  const state: boolean = true;

  return state;
};

export const getUsersFromPhoneNumber = async (phoneArray: Array<string>) => {
  const userList: Array<object> = [];
  try {
    const usersRef = collection(db, 'Users');
    const users = query(usersRef, where('phone', 'in', phoneArray));

    const querySnapshot = await getDocs(users);
    querySnapshot.forEach((docUsers) => {
      const usersData = docUsers.data();
      usersData.id = docUsers.id;
      userList.push(usersData);
    });
    return { status: 200, userList };
  } catch (err: unknown) {
    console.log(err);
    return { status: 500, userList };
  }
};

export const getTokenUsers = async (idGroup: string) => {
  const tokensArray: Array<object> = [];
  try {
    const postRef = collection(db, 'Users');
    const usersQuery = query(
      postRef,
      where('groups', 'array-contains', idGroup),
      orderBy('created', 'desc'),
    );
    const querySnapshot = await getDocs(usersQuery);
    querySnapshot.forEach((docUsers) => {
      const usersData = docUsers.data();
      if (usersData.notificationToken) {
        tokensArray.push(usersData.notificationToken);
      }
    });
    return { status: 200, tokensArray };
  } catch (err: unknown) {
    console.log(err);
    return { status: 500, tokensArray };
  }
};

export const validateNickName = async (nickname: string) => {
  try {
    console.log(nickname)
    const postRef = collection(db, 'Users');
    const usersQuery = query(
      postRef,
      where('userName', '==', nickname)
    );
    const querySnapshot = await getDocs(usersQuery);
    let isReservated = await validNickNameReservated(nickname);
    return { status: 200, isValid: querySnapshot.size == 0 &&  !isReservated};
  } catch (err: unknown) {
    console.log('error en validateNickName',err);
    
    return { status: 500, isValid: false };
  }
};

export const validateNumberPhone = async (phone: string) => {
  try {
    const postRef = collection(db, 'Users');
    const usersQuery = query(
      postRef,
      where('phone', '==', phone)
    );
    const querySnapshot = await getDocs(usersQuery);
    return { status: 200, isValid: querySnapshot.size == 0 };
  } catch (err: unknown) {
    return { status: 500, isValid: false };
  }
};

export const validNickNameReservated = async (nickname : string) => {
  const req = await axios.post(`${serverUrl}/valid-reservated-nickname`, {nickname:nickname}) as any  
  return(req.data.isReservated);
}


