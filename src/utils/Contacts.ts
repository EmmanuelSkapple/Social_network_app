import * as Contacts from 'expo-contacts';
import { getUsersFromPhoneNumber } from '../database/userFirebase';

export const getContactsRandom = async (quantity: number) => {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status === 'granted') {
    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.FirstName,
        Contacts.Fields.LastName,
        Contacts.Fields.PhoneNumbers,
      ],
    });
    const contacts = data
      .filter(
        (item) => item.phoneNumbers
          && item.phoneNumbers?.length > 0
          && item.phoneNumbers?.[0].number?.includes('+'),
      )
      .sort(() => Math.random() - Math.random())
      .slice(0, quantity);
    const contactsInMatter = await getContactsWithMatter(contacts);

    return {
      status: 200,
      contactsInMatter,
      contacts,
    };
  }
  return { status: 505, contacts: [] };
};

const getContactsWithMatter = async (contacts: any) => {
  const numbersArray = [] as any;
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i]?.phoneNumbers?.length > 0) {
      numbersArray.push(contacts[i].phoneNumbers[0].number.replace(/\s/g, ''));
    }
  }
  const loopCicles = Math.ceil(contacts.length / 10);
  let totalContacts = [] as any;
  let punter = 0;
  for (let index = 1; index <= loopCicles; index++) {
    const users = await getUsersFromPhoneNumber(
      numbersArray.slice(punter, index * 10),
    );
    totalContacts = [
      ...totalContacts,
      ...(users.status === 200 ? users.userList : []),
    ];
    punter = index * 10;
  }
  return totalContacts;
};
