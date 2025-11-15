// Import gesture handler first for web compatibility
import 'react-native-gesture-handler';

import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';

// Screens
import CommunityScreen from './screens/CommunityScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import DoctorsScreen from './screens/DoctorsScreen';
import DoctorDetailScreen from './screens/DoctorDetailScreen';
import BookingScreen from './screens/BookingScreen';
import TrackersScreen from './screens/TrackersScreen';
import BabyTrackerScreen from './screens/BabyTrackerScreen';
import MotherTrackerScreen from './screens/MotherTrackerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CommunityStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen}
        options={{ title: 'Post' }}
      />
    </Stack.Navigator>
  );
}

function DoctorsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Doctors" 
        component={DoctorsScreen}
        options={{ title: 'Find a Doctor' }}
      />
      <Stack.Screen 
        name="DoctorDetail" 
        component={DoctorDetailScreen}
        options={{ title: 'Doctor Profile' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{ title: 'Book Consultation' }}
      />
    </Stack.Navigator>
  );
}

function TrackersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Trackers" 
        component={TrackersScreen}
        options={{ title: 'Health Trackers' }}
      />
      <Stack.Screen 
        name="BabyTracker" 
        component={BabyTrackerScreen}
        options={{ title: 'Baby Tracker' }}
      />
      <Stack.Screen 
        name="MotherTracker" 
        component={MotherTrackerScreen}
        options={{ title: 'My Recovery' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Community') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Doctors') {
              iconName = focused ? 'medical' : 'medical-outline';
            } else if (route.name === 'Trackers') {
              iconName = focused ? 'fitness' : 'fitness-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textLight,
          tabBarStyle: {
            backgroundColor: theme.colors.backgroundLight,
            borderTopColor: theme.colors.border,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Community" 
          component={CommunityStack}
          options={{ title: 'Community' }}
        />
        <Tab.Screen 
          name="Doctors" 
          component={DoctorsStack}
          options={{ title: 'Doctors' }}
        />
        <Tab.Screen 
          name="Trackers" 
          component={TrackersStack}
          options={{ title: 'Trackers' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

