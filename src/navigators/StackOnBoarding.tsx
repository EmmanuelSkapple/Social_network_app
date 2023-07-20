import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//* Screens
import OnboardingPhoto from '../screens/OnBoardingScreens/OnboardingPhoto';
// eslint-disable-next-line import/no-cycle
import OnboardingPhone from '../screens/OnBoardingScreens/OnboardingPhone';
import OnboardingGroup from '../screens/OnBoardingScreens/OnboardingGroup';

export type RootStackOnBoarding = {
  OnboardingPhone: undefined;
  OnboardingPhoto: undefined;
  OnboardingGroup: undefined;
};

const StackComponent = createStackNavigator<RootStackOnBoarding>();

function StackOnBoarding() {
  return (
    <StackComponent.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="OnboardingPhoto"
    >
      
      <StackComponent.Screen
        name="OnboardingPhoto"
        component={OnboardingPhoto}
      />
      <StackComponent.Screen
        name="OnboardingGroup"
        component={OnboardingGroup}
      />
    </StackComponent.Navigator>
  );
}

export default StackOnBoarding;
