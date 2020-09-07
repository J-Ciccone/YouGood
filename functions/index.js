const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
admin.initializeApp(firebaseConfig);

// Set up Firestore.

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const db = admin.firestore().collection('users');

exports.findContacts = functions.https.onCall((contact, phoneNumber) => {

    const number = contact.phoneNumbers[0].number;
    const contactSnapshot = db.doc(number).get();
    contactSnapshot.then((doc) => {
        if (doc.exists) {
            const data = {
                username: doc.data().username ? doc.data().username : 'Not Found',
                displayName: doc.data().displayName ? doc.data().displayName : 'Not Found',
                phoneNumber: doc.data().phoneNumber ? doc.data().phoneNumber : 'Not Found',
            }
            return db.doc(userId).update({
                contacts: firebase.firestore.FieldValue.arrayUnion(data),
            });

        } else {
            const data = {
                displayName: contact.firstName,
                phoneNumber: number
            }
            return db.doc(phoneNumber).update({
                contacts: firebase.firestore.FieldValue.arrayUnion(data),
            });

        }
    }).catch(err => console.log(err))

    return;
});

exports.createUser = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
        const { contacts } = useContext(ContactState);
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = snap.data();

        // access a particular field as you would any JS property
        const phoneNumber = newValue.phoneNumber;


        // perform desired operations ...
    });

exports.addPings = functions.firestore
    .document('pings/{pingId}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const ping = snap.data();
        const pingId = snap.id;
        // access a particular field as you would any JS property
        db.doc(ping.userId).collection('pings').doc(pingId).set(ping);
        db.doc(ping.to).collection('pings').doc(pingId).set(ping);
    });

exports.handlePingResponse = functions.firestore
    .document('pings/{pingId}')
    .onChange((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const ping = snap.data();
        const pingId = snap.id;
        // access a particular field as you would any JS property
        db.doc(ping.userId).collection('pings').doc(pingId).update({ response })
        db.doc(ping.to).collection('pings').doc(pingId).set(ping);
    });

exports.addContacts = functions.https.onCall((data, context) => {
    const contacts = data.contacts;
    for (let contact of contacts) {
        let number = contact.phoneNumbers[0].number;
        let phoneNumber = formatPhoneNumber(number);
        db.doc(phoneNumber).get().then(doc => {
            if (doc.exists) {
                db.doc(data.userId).update({
                    contacts: admin.firestore.FieldValue.arrayUnion(phoneNumber)
                })
                return true;
            } else {
                return false;
            }
        }).catch(err);
    }
})


