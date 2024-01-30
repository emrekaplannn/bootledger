// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-url-polyfill/auto';
import supabase from './supabase'; // Import supabase client
import EntranceScreen from './BootLedger';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import FeedbackScreen from './FeedbackScreen';
import Camera from './Camera';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BootLedger">
        <Stack.Screen name="BootLedger" component={EntranceScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Camera" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
