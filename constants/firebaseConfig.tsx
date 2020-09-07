import * as firebase from 'firebase'
import 'firebase/auth';
import "firebase/functions";


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

export default firebase;


