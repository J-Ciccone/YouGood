import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Platform, AsyncStorage, BackHandler, RefreshControl, Alert } from 'react-native';
import { Dimensions } from "react-native";
import Keys from '../../constants/Keys'
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Styles from '../../constants/Styles'
import Colors from '../../constants/Colors'
import * as FB from '../../utility/FBFunctions'

import firebase from '../../constants/firebaseConfig'
import { useNavigation } from '@react-navigation/native';

import { FirebaseRecaptchaVerifierModal, FirebaseAuthApplicationVerifier } from 'expo-firebase-recaptcha';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GlobalState from '../../constants/Global'
import 'firebase/firestore'
import { formatPhoneNumber } from '../../utility/format';


const LOGGED_IN: string = 'LOGGED_IN';
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
var verifyPhone: string = '';
var deviceHeight = Dimensions.get("window").height;
const firestore = firebase.firestore()
export default function LoginScreen() {
  const { setSignedIn } = useContext(GlobalState);
  const recaptchaVerifier = useRef(null);
  const [confirmed, setConfirm] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [pwConfirm, setPassConfirm] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const { phoneNumber, setPhoneNumber } = useContext(GlobalState);
  const [verificationId, setVerificationId] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');


  const [message, showMessage] = React.useState(!firebaseConfig
    ? { text: "No Firebase Configuration has been found!" }
    : undefined);


  const signIn = async (credential: firebase.auth.AuthCredential) => {
    try {
      await firebase.auth().signInWithCredential(credential);
      AsyncStorage.setItem(Keys.LOGGED_IN, 'true');
      if (firebase.auth().currentUser && phoneNumber !== null) {
        const data = {
          displayName: (firstname + ' ' + lastname),
          phoneNumber: formatPhoneNumber(phoneNumber),
          pushToken: ''
        }
        let docName = formatPhoneNumber(phoneNumber);
        AsyncStorage.setItem(Keys.PHONENUMBER, formatPhoneNumber(phoneNumber) as string);
        await firestore.collection('users').doc(docName).set(data)
      }
    } catch (err) {
      console.log(err);
    }
    setSignedIn(true);
  }


  return (
    <SafeAreaView>
      <Styles.Container backgroundColor={Colors.offWhite} >
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
        <Styles.BigText color={Colors.mainColor} margin={70} fontSize="40" justify="center">
          You Good?
        </Styles.BigText>
        <Styles.Div style={styles.container} backgroundColor={Colors.mainColor} radius={40}>
          <Styles.BigText color={Colors.offWhite} margin={0} fontSize="30" justify="center">
            Register
          </Styles.BigText>
          {!confirmed
            ?
            <Styles.Div
              style={styles.shadowed} backgroundColor={Colors.offWhite} margin={15} radius={5}>
              <Styles.Text >Enter your name</Styles.Text>
              <Styles.Input
                color={Colors.offWhite}
                selectionColor={Colors.offWhite}
                placeholder="First name"
                onChangeText={(firstname: React.SetStateAction<string>) => setFirstname(firstname)}
              />
              <Styles.Input
                color={Colors.offWhite}
                selectionColor={Colors.offWhite}
                placeholder="Last name"
                onChangeText={(lastname: React.SetStateAction<string>) => setLastname(lastname)}
              />
              <Styles.Text >Enter phone number</Styles.Text>
              <Styles.Input
                color={Colors.offWhite}
                selectionColor={Colors.offWhite}
                placeholder="000 000 0000"
                autoCompleteType="tel"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                onChangeText={(phoneNumber: string) => setPhoneNumber(phoneNumber)}
              />
              <Styles.Button
                style={styles.centered}
                backgroundColor={Colors.mainColor}
                color={Colors.offWhite}
                onPress={async () => {
                  // The FirebaseRecaptchaVerifierModal ref implements the
                  // FirebaseAuthApplicationVerifier interface and can be
                  // passed directly to `verifyPhoneNumber`.
                  try {//todo make a function for verification
                    if (firstname === '' || lastname == '' || !phoneNumber) {
                      showMessage({
                        text: "Must enter a username and phonenumber",
                      });
                    } else {
                      const phoneProvider = new firebase.auth.PhoneAuthProvider();
                      verifyPhone = await phoneProvider.verifyPhoneNumber(
                        '+1' + phoneNumber,
                        recaptchaVerifier.current as unknown as FirebaseAuthApplicationVerifier
                      );
                      setVerificationId(verifyPhone);
                      setConfirm(true);
                      showMessage({
                        text: "Verification code has been sent to your phone.",
                      });
                    }

                  } catch (err) {
                    showMessage({ text: `Error: ${err.message}` });
                  }
                }}>
                <Styles.Text color={Colors.offWhite} fontSize={15} >Send Verification Code</Styles.Text>
              </Styles.Button>
            </Styles.Div>
            :
            <Styles.Div style={styles.shadowed} backgroundColor={Colors.offWhite} margin={15} radius={5}>
              <Styles.Text >Enter Verification code</Styles.Text>
              <Styles.Input
                selectionColor={Colors.darkMono}
                editable={!!verificationId}
                placeholder="123456"
                onChangeText={setVerificationCode}
              />
              <Styles.Input
                selectionColor={Colors.darkMono}
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={setPassword}
              />
              <Styles.Input
                selectionColor={Colors.darkMono}
                secureTextEntry={true}
                placeholder="Confirm Password"
                onChangeText={setPassConfirm}
              />
              <Styles.Button
                style={styles.centered}
                disabled={!verificationId}
                backgroundColor={Colors.mainColor}
                onPress={async () => {
                  try {
                    if (password === pwConfirm) {
                      const credential = await firebase.auth.PhoneAuthProvider.credential(
                        verificationId,
                        verificationCode
                      );

                      signIn(credential);
                    }


                  } catch (err) {
                    showMessage({ text: `Error: ${err.message}` });
                  }
                }}>
                <Styles.Text color={Colors.offWhite} fontSize={15}>Confirm Verification Code</Styles.Text>
              </Styles.Button>

              <TouchableOpacity
                onPress={async () => {
                  try {
                    const phoneProvider = new firebase.auth.PhoneAuthProvider();
                    verifyPhone = await phoneProvider.verifyPhoneNumber(
                      phoneNumber,
                      recaptchaVerifier.current as unknown as FirebaseAuthApplicationVerifier
                    );
                    setVerificationId(verifyPhone);
                    showMessage({
                      text: "Verification code has been sent to your phone.",
                    });
                  } catch (err) {
                    showMessage({ text: `Error: ${err.message}` });
                  }
                }}>
                <Styles.Text color={Colors.mainColor} fontSize={10}>Resend Code</Styles.Text>
              </TouchableOpacity>
            </Styles.Div>
          }
          {message ? (
            <TouchableOpacity
              style={styles.centered}
              onPress={() => showMessage(undefined)}>
              <Text >
                {message.text}
              </Text>
            </TouchableOpacity>
          ) : undefined}
        </Styles.Div>

      </Styles.Container>
    </SafeAreaView>
  );


}



const styles = StyleSheet.create({
  container: {

    height: deviceHeight * 100 / 100,
  },
  shadowed: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 9,
  },
  message: {
    color: Colors.mainColor,
    fontSize: 20,
  },
  centered: {
    alignSelf: 'center',

  }

});
