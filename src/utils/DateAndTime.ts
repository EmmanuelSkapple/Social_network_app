export const getDateFormat = (date: any) => {
  const newDate = new Date(date.seconds * 1000);
  const day = newDate.getDate() <= 9 ? `0${newDate.getDate()}` : newDate.getDate();
  const month = newDate.getMonth() + 1 <= 9
    ? `0${newDate.getMonth() + 1}`
    : newDate.getMonth() + 1;
  // return {
  //   day: day.toString(),
  //   month: month.toString(),
  //   year: newDate.getFullYear().toString(),
  // };
  return `${day}/${month}/${newDate.getFullYear()}`;
};

export const FireDateToJsDate = (date: any) => {
  const newDate = new Date(date.seconds * 1000);
  return newDate;
};

export const getBirthDayFormat = (birthDay:any) => {
  let name = '';
  try {
    if (birthDay) {
      const birthDate = new Date(birthDay.seconds * 1000);
      const day = birthDate.getDate() <= 9
        ? `0${birthDate.getDate()}`
        : birthDate.getDate();
      const month = birthDate.getMonth() + 1 <= 9
        ? `0${birthDate.getMonth() + 1}`
        : birthDate.getMonth() + 1;
      name = `${day}/${month}/${birthDate.getFullYear()}`;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  return "";
  }
  return name;
};

export const convertTime = (minutes: any) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split('.')[0];
    const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);
    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (sec === 60) {
      return `${minute + 1}:00`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};


export function validateDateOfQuestion(lastDate : any) {
  let lastDateObject = new Date(lastDate);
  let lastDateFormat = `${lastDateObject.getDate()}-${lastDateObject.getMonth() + 1}-${lastDateObject.getFullYear()}`

  let currentDateObject = new Date();
  let currentDateFormat = `${currentDateObject.getDate()}-${currentDateObject.getMonth() + 1}-${currentDateObject.getFullYear()}`

  return(lastDateFormat == currentDateFormat)
}
