import firebase from '../constants/firebaseConfig'
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import { ContactModel } from '../components/ContactModel';
import { useState } from 'react';
import { UserModel } from '../components/UserModel';
import { formatPhoneNumber } from './format';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const firebaseConfig = {
    apiKey: "AIzaSyA5XKG3chTYshTGW7y-IwzYFzGVSavc2Vw",
    authDomain: "yougood-c717e.firebaseapp.com",
    databaseURL: "https://yougood-c717e.firebaseio.com",
    projectId: "yougood-c717e",
    storageBucket: "yougood-c717e.appspot.com",
    messagingSenderId: "374416832156",
    appId: "1:374416832156:web:3ab97a9b7d0538e9189f59",
    measurementId: "G-7YB6FC3ME5",
    trackingId: '',
};

const db = firebase.firestore().collection('users');
const dbPings = firebase.firestore().collection('pings');

export const setFBContacts = async (numbers: string[]) => {
    const confirmedContacts: UserModel[] = []
    const contactArray = await Promise.all(
        numbers.map(number => {
            const contact = {
                phoneNumber: number,

            }
            return db.doc(number as string).get().then(doc => {
                if (!doc.exists) {
                    return contact
                } else {
                    return doc.data();
                }
            })
        })
    )

    for (let contact of contactArray) {
        if (contact !== undefined) {
            confirmedContacts.push(contact as UserModel)
        }
    }
    return confirmedContacts;
}


export const sendPing = async (ping: any, token: string) => {
    sendPushNotification(token)
    dbPings.add(ping);
};


export const sendResponse = async (response: string, pingId: string) => {
    dbPings.doc(pingId).update({ response: response });
};


export const confirmPassword = async (userId: string, password: string) => {
    const user = db.doc(userId).get();
    const confirmation = await user.then(doc => {
        if (doc.exists) {
            if (doc!.data()!.password === password) {
                return true
            } else {
                false
            }
        } else {
            false
        }
    })
    return confirmation;
};

export const sendPushNotification = async (expoPushToken: string) => {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Pinged',
        body: 'Someone sent you a Ping!',
    };
    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

export const deletePing = (pingId: string) => {
   return dbPings.doc(pingId).delete()
}

export const uploadContacts = (userId: string,contacts: ContactModel[]) => {
    const uploaded = Promise.all(
        contacts.map((contact)=>{
            db.doc(userId).collection('contacts').doc(contact.phoneNumber).set(contact)
        })
    )
    return uploaded
}