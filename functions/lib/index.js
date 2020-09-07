const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');


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
firebase.initializeApp(firebaseConfig);

// Set up Firestore.

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const db = firebase.firestore().collection('users');

exports.findContacts = functions.https.onCall((contacts, phoneNumber) => {
    for (let contact of contacts) {
        const number = contact.phoneNumbers[0].number;
        const contactSnapshot = db.doc(number).get();
        contactSnapshot.then((doc) => {
            if (doc.exists) {
                const data = {
                    username: doc.data().username ? doc.data().username : 'Not Found',
                    displayName: doc.data().displayName ? doc.data().displayName : 'Not Found',
                    phoneNumber: doc.data().phoneNumber ? doc.data().phoneNumber : 'Not Found',
                }
                db.doc(userId).update({
                    contacts: firebase.firestore.FieldValue.arrayUnion(data),
                });
                return;
            } else {
                const data = {
                    displayName: contact.firstName,
                    phoneNumber: number
                }
                db.doc(phoneNumber).update({
                    contacts: firebase.firestore.FieldValue.arrayUnion(data),
                });
                return;
            }
        }).catch(err => console.log(err))
    }

});
