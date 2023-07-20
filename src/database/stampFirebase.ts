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
} from 'firebase/firestore/';
import { Alert } from 'react-native';
import { GetQuestionProps, QuestionByGroup, UpdateQuestionProps } from '../../types/typesQuestions';
import { FireDateToJsDate } from '../utils/DateAndTime';
import { db } from './FirebaseConfig';
import { addNotiifacion } from './notificationsFirebase';

const QUESTIONS = 'Questions';

export const addQuestion = async ({
  group,
  membersSelected,
  question,
  poster,
}: UpdateQuestionProps) => {
  try {
    const reqQuestion = await addDoc(collection(db, QUESTIONS), {
      group,
      membersSelected,
      question,
      poster,
      dateUpdate: new Date(),
    });
    addNotiifacion({
      group: {
        id: group.id,
        name: group.name,
      },
      poster,
      typeNotification: 'newQuestion',
      membersToNotify: membersSelected,
      iconType: 'Question',
      trackingId: reqQuestion.id,
    });
    return { status: 200 };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error en addQuestion', error.message);
    }
    return { status: 500 };
  }
};

export const getQuestionsByGroup = async ({ groupID, userID }: GetQuestionProps) => {
  try {
    const list: QuestionByGroup[] = [];
    const questionsRef = collection(db, QUESTIONS);
    const questionsQuery = query(questionsRef, where('group.id', '==', groupID));
    const questionsData = await getDocs(questionsQuery);
    questionsData.forEach((docQuestion) => {
      const data = docQuestion.data();
      if (data.membersSelected.length >= 1) {
        if (data.membersSelected.includes(userID)) {
          list.push({
            membersSelected: data.membersSelected,
            group: data.group,
            question: data.question,
            poster: data.poster,
            dateUpdate: data.dateUpdate,
            id: docQuestion.id,
          });
        }
      } else {
        removeQuestion(docQuestion.id);
      }
    });
    return list;
  } catch (error) {
    if (error instanceof Error) Alert.alert(error.name, error.message);
    return [];
  }
};

export const getQuestionsByUser = async ({ userID }:{userID:string}) => {
  try {
    const list: QuestionByGroup[] = [];
    const questionsRef = collection(db, QUESTIONS);
    const questionsQuery = query(questionsRef, where('membersSelected', 'array-contains', userID));
    const questionsData = await getDocs(questionsQuery);
    questionsData.forEach((docQuestion) => {
      const data = docQuestion.data();
      if (data.membersSelected.length >= 1) {
        if (data.membersSelected.includes(userID)) {
          list.push({
            membersSelected: data.membersSelected,
            group: data.group,
            question: data.question,
            poster: data.poster,
            dateUpdate: data.dateUpdate,
            id: docQuestion.id,
          });
        }
      } else {
        removeQuestion(docQuestion.id);
      }
    });
    list.sort(function (a, b) {
      return FireDateToJsDate(b.dateUpdate).valueOf() - FireDateToJsDate(a.dateUpdate).valueOf();
    });
    return list;
  } catch (error) {
    if (error instanceof Error) Alert.alert(error.name, error.message);
    return [];
  }
};

export const removeQuestion = async (idQuestion: string) => {
  try {
    await deleteDoc(doc(db, 'Questions', idQuestion));
  } catch (error) {
    console.log('Error en removeQuestion -> ', error);
  }
};

export const getQuestionsByMatter = async () => {
  const questionList: Array<object> = [];
  try {
    const questionsRef = collection(db, 'QuestionsByMatter');
    console.log('getMatterQuestions');
    const querySnapshot = await getDocs(questionsRef);
    querySnapshot.forEach((docQuestion) => {
      questionList.push(docQuestion.data());
    });
    return { status: 200, questionList };
  } catch (err: unknown) {
    // console.log(err);
    return { status: 500, questionList };
  }
};

export const removeMemberToQuestion = async (idUser?: string, idQuestion?: string) => {
  try {
    if (idUser && idQuestion) {
      const questionsRef = doc(db, 'Questions', `${idQuestion}`);
      await updateDoc(questionsRef, {
        membersSelected: arrayRemove(`${idUser}`),
      });
    }

    return { status: 200 };
  } catch (err: unknown) {
    console.log('error en removeMemberToQuestion => ', err);
    return { status: 500 };
  }
};
