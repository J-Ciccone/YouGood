import { ContactState } from "../constants/Global";
import { useContext } from "react";
import * as Contacts from 'expo-contacts'
import { AsyncStorage } from "react-native";
import Keys from '../constants/Keys'
import { ContactModel } from "../components/ContactModel";
import { formatPhoneNumber } from "./format";
import firebase from "firebase";
import {UserModel} from '../components/UserModel'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

/*phoneNumbers": Array [
    Object {
      "countryCode": "us",
      "digits": "+16102200257",
      "id": "D2466015-2FE2-4DE1-AB55-1EBFC3969556",
      "number": "+1 (610) 220-0257",
    }, */

//sends alert to user
export const contactPermission = async () => {
  const getFirebase = await firebase.firestore().collection('users').get()
  const firebaseDocsIds = getFirebase.docs.map(doc => doc.id)
  const { status } = await Contacts.requestPermissionsAsync();
  if (status === 'granted') {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
    if (data.length > 0) {
      const result: any = [];
      for(let contact of data){
        result.push(contact!.phoneNumbers[0].number)
      }
      return result
    }
  }
}

export const registerForPushNotificationsAsync = async () => {
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
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    this.setState({ expoPushToken: token });
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('default', {
      name: 'default',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250],
    });
  }
  };
