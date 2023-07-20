import i18n from 'i18n-js';
import { validateNickName } from '../database/userFirebase';

export const validationEmail = (text: string) => {
  let error;
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (text === '') {
    error = i18n.t('errCompleteThisField');
  } else if (reg.test(text) === false) {
    error = i18n.t('errInvalidEmail');
  } else {
    error = '';
  }
  return error;
};

export const validationNickname = async (
  text: string,
  validateDB: boolean = false
) => {
  let error = "";
  const reg = /^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/;
  if (text.length >= 3) {
    console.log('paso de 3')
    if (reg.test(text) === false) {
      console.log('no paso el regx')
      error = i18n.t('errInvalidNickname');
    } else {

      if (validateDB) {
        let {isValid, status} = await validateNickName(text);     
        console.log('is valid',isValid);       
        console.log('status',status);    
        if (status == 200) {isValid
            ? (error = '')
            : (error = i18n.t('errInvalidNickname'));
        } else {
          error = i18n.t('errInvalidNickname');
        }
      } else {
        error = '';
      }
    }
  } else {
    console.log('noo pasa de 3')
    error = i18n.t('errInvalidNickname');
  }
  console.log('return',error)    
  return error;
};

export const validationPassword = (text: string) => {
  let error;
  if (text === '') {
    error = i18n.t('errCompleteThisField');
  } else if (text.length < 8) {
    error = i18n.t('errInvalidPassword');
  } else {
    error = '';
  }
  return error;
};

export const validationBirthdayDD = (DD: string) => {
  const day = parseInt(DD, 10);
  let error;
  if (day === 0) {
    error = i18n.t('errCompleteThisField');
  } else if (day < 1 || day > 31) {
    error = i18n.t('errInvalidBirthday');
  } else {
    error = '';
  }
  return error;
};

export const validationBirthdayMM = (MM: string) => {
  const month = parseInt(MM, 10);
  let error;
  if (month === 0) {
    error = i18n.t('errCompleteThisField');
  } else if (month < 1 || month > 12) {
    error = i18n.t('errInvalidBirthday');
  } else {
    error = '';
  }
  return error;
};

export const validationBirthdayYYYY = (YYYY: string) => {
  const year = parseInt(YYYY, 10);
  let error;
  let currentYear = new Date().getFullYear();
  if (year === 0) {
    error = i18n.t('errCompleteThisField');
  } else if (year < 1900 || year > currentYear) {
    error = i18n.t('errInvalidBirthday');
  } else {
    error = '';
  }
  return error;
};
