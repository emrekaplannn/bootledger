// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-url-polyfill/auto';
import supabase from './supabase'; // Import supabase client
import EntranceScreen from './BootLedger';
import LoginScreen from './LoginScreen';
import MainMenu from './mainmenu';
import Camera from './Camera';
import Delivery1 from './Delivery1';
import Delivery2 from './Delivery2';
import Camera2 from './Camera2';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BootLedger">
        <Stack.Screen name="BootLedger" component={EntranceScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="Delivering QR Scanner" component={Camera} />
        <Stack.Screen name="Receiving QR Scanner" component={Camera2} />
        <Stack.Screen name="Deliver Item" component={Delivery1} />
        <Stack.Screen name="Receive Item" component={Delivery2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
