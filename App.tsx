import * as firebase from 'firebase';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, AsyncStorage, TextInput, Button, AppState, SafeAreaView } from 'react-native';
import Keys from './constants/Keys'
import GlobalState, { ContactState, NotificationState } from './constants/Global'
import { UserModel } from './components/UserModel'

import ContactScreen from './screens/ContactScreen'
import HomeScreen from './screens/PingScreen';
import LoginScreen from './screens/Signup/LoginScreen'
import RegisterScreen from './screens/Signup/RegisterScreen';
import SplashScreen from './screens/SplashScreen';
import LoadingScreen from './screens/LoadingScreen'

import messaging from '@react-native-firebase/messaging';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppNavigation from './components/AppNavigation';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();



export default function App() {
  const defaultUser = {
    displayName: '',
    phoneNumber: '',
    password: '',
  }
  const [signedIn, setSignedIn] = useState(false);
  const [checkedSignIn, setCheck] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [permissions, setPermissions] = useState(false);
  const [user, setUser] = useState(defaultUser);




  if (!checkedSignIn) {
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('THERE IS A USER')
        setSignedIn(true);
        setCheck(true);
        // User is signed in.
      } else {
        // No user is signed in.
        setSignedIn(false);
        setCheck(true);
      }
    });
    return <LoadingScreen />
  }


  return (

    <GlobalState.Provider value={{ signedIn, setSignedIn, phoneNumber, setPhoneNumber, user, setUser }}>

      <NavigationContainer >

        {!signedIn
          ?
          <Stack.Navigator>
            <Stack.Screen
              name="Splash"
              options={{ headerShown: false, title: 'Welcome' }}
              component={SplashScreen}
            />
            <Stack.Screen
              name="Login"
              options={{ headerShown: false, title: 'Login' }}
              component={LoginScreen} />
            <Stack.Screen
              name="Register"
              options={{ headerShown: false, title: 'Sign up' }}
              component={RegisterScreen} />
          </Stack.Navigator>
          :
          
            <ContactState.Provider value={{ contacts, setContacts }}>
              <AppNavigation />
            </ContactState.Provider>
          
        }

      </NavigationContainer>

    </GlobalState.Provider >

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
