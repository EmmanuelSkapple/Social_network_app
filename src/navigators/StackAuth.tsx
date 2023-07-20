import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//* Screens
import InitialScreen from '../screens/InitialScreen';
import LoginAndSign from '../screens/AuthScreens';
import TermsAndCondicion from '../screens/TermsAndCoditions';
import ResetPassword from '../screens/AuthScreens/ResetPassword';

export type RootStackAuthParamList = {
  InitialScreen: undefined;
  LoginAndSign: { action: string };
  ResetPassword: undefined;
  TermsAndCondicion: undefined;
};

const StackComponent = createStackNavigator<RootStackAuthParamList>();

function Stack() {

  React.useEffect(() => {
    console.log('entro al stack ')
  }, []);

  return (
    <StackComponent.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="InitialScreen"
    >
      <StackComponent.Screen name="InitialScreen" component={InitialScreen} />
      <StackComponent.Screen name="LoginAndSign" component={LoginAndSign} />
      <StackComponent.Screen name="ResetPassword" component={ResetPassword} />
      <StackComponent.Screen
        name="TermsAndCondicion"
        component={TermsAndCondicion}
      />
    </StackComponent.Navigator>
  );
}

export default Stack;
