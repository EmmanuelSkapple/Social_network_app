import * as Linking from 'expo-linking';

const config = {
  screens: {
    Home: {
      screens: {
        InviteScreen: {
          path: 'invite/:id',
          parse: {
            id: (id: string) => `${id}`,
          },
        },
      },
    },
  },
};

const linking = {
  prefixes: ['https://mtter.io/', 'https://*.mtter.io/', Linking.createURL('mtter.io://')],
  confing: config,
};

export default linking;
