import ContactScreen from '../screens/ContactScreen'
import HomeScreen from '../screens/PingScreen';
import React, { useContext, useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../constants/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalState, { ContactState } from '../constants/Global'
import { contactPermission } from '../utility/permissions';
import LoadingScreen from '../screens/LoadingScreen'

import { ContactModel } from './ContactModel';
import { AsyncStorage, Platform } from 'react-native';
import Keys from '../constants/Keys';
import { UserModel } from './UserModel';
import { formatPhoneNumber } from '../utility/format';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { NotificationState } from '../constants/Global'
import messaging from '@react-native-firebase/messaging';
import * as firebase from 'firebase'
import * as FB from '../utility/FBFunctions';

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function AppNavigation() {
  const [loading, setLoading] = useState(true);
  const { contacts, setContacts } = useContext(ContactState);
  const { contactsToFind, setContactsToFind } = useContext(ContactState);
  const { user, setUser } = useContext(GlobalState);
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef();
  const responseListener = useRef();
  const db = firebase.firestore().collection('users');


  const getContacts = async () => {
    
    const contactNumberList = await contactPermission();
    const formattedNumbers: string[] = []
    for(let number of contactNumberList){
      var formattedNumber = formatPhoneNumber(number)
      if(formattedNumber !== undefined){
        formattedNumbers.push(formattedNumber);
      }
      
    }
   
    FB.setFBContacts(formattedNumbers).then(async (result) => {
      if(!user.haveContacts){
        await FB.uploadContacts(user.phoneNumber,result)
      }
      setContacts(result);
      setLoading(false)
    })
  }

  const getUser = async () => {
    if (firebase.auth().currentUser !== null) {
      const userId = formatPhoneNumber(firebase.auth().currentUser?.phoneNumber as string);
      const docSnapshot = firebase.firestore().collection('users').doc(userId as string).get();
      docSnapshot.then(doc => {
        if (doc.exists) {
          setUser(doc.data() as UserModel);
        }
      })
    }

  }


  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    db.doc(user.phoneNumber).update({ pushToken: token });
  };

  

  if (loading || contacts === undefined) {
    getUser();
    getContacts().then(() => {
      
      registerForPushNotificationsAsync()
    });

    return <LoadingScreen />
  }

  return (
    <Tab.Navigator
      initialRouteName="Pings"
      tabBarOptions={{
        activeBackgroundColor: Colors.mainColor,
        inactiveBackgroundColor: Colors.offWhite,
        activeTintColor: Colors.offWhite,
        inactiveTintColor: Colors.mainColor,
      }}
    >
      <Tab.Screen
        name="Pings"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Pings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="comment-eye" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactScreen}
        options={{
          tabBarLabel: 'Contacts',

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="contacts" color={color} size={size} />
          ),
        }}
      />

    </Tab.Navigator >
  )
}