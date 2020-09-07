import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput } from 'react-native';
import Btn from '../../components/Btn'

import fireApp from '../../constants/firebaseConfig'
import { useNavigation } from '@react-navigation/native';



export default function RegisterScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwd2, setRePwd] = useState('');
    const [err, setErr] = useState('');
    

    const handleRegister = () => {
      const auth = fireApp.auth();
      auth.createUserWithEmailAndPassword(email,pwd)
      .then(() =>{
        setEmail('');
        setPwd('');
        if( err ){
            setErr('');
        }
        navigation.navigate('Login');
      }).catch(
        err => setErr(err.message)
      )
    }

    const handleLogin = () => {
      navigation.navigate('Login');
    }

    return (
      <View style={styles.container}>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          onChangeText={(txt)=>setEmail(txt)}
        />
        <TextInput
          value={pwd}
          style={styles.input}
          placeholder="New Password"
          onChangeText={(txt)=>setPwd(txt)}
          secureTextEntry={true}

        />
        <TextInput
          value={pwd2}
          style={styles.input}
          placeholder=" Password"
          onChangeText={(txt)=>setRePwd(txt)}
          secureTextEntry={true}
        />
        <Btn label="Sign up!" disabled={false} onPress={()=>handleRegister()}/>
        <Btn label="Already have an account?" disabled={false} onPress={()=>handleLogin()}/>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
  
    
  },
  input: {
    height: 50,
    marginLeft: 10,

  }
});
