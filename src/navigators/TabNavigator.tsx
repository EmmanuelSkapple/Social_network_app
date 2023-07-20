import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // user,users
import Ionicons from 'react-native-vector-icons/Ionicons'; // settings-sharp
import Home from '../screens/Home';
import GroupList from '../screens/GroupList';
import ProfileUser from '../screens/ProfileUser';
import Settings from '../screens/Settings';

import Colors from '../utils/Colors';
import NewPostButton from '../components/buttons/NewPostButton';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors().TabNavigatorBackground,
            borderTopColor: 'transparent',
            paddingBottom: 10,
            marginBottom: 25,
            paddingTop: 10,
            height: 70,
            width: '85%',
            alignSelf: 'center',
            borderRadius: 12,
            position: 'absolute',
            left: '7.5%',
          },
          tabBarInactiveTintColor: Colors().TabNavigatorInactiveTintColor,
          tabBarActiveTintColor: Colors().TabNavigatorActiveTintColor,
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name='Home'
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='Groups'
          component={GroupList}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name='group-work' size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='Middle'
          component={GroupList}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name='person-circle-sharp'
                size={1}
                color='transparent'
              />
            ),
          }}
        />
        <Tab.Screen
          name='Profile'
          component={ProfileUser}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='person-circle-sharp' size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='Settings'
          component={Settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='settings-sharp' size={30} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <NewPostButton align='center' marginBottom={85} />
    </>
  );
}
