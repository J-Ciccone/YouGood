import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage } from 'react-native';
import Btn from '../components/Btn';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

import { ViewProps } from 'react-native';
import styled from 'styled-components/native';
import * as Styles from '../constants/Styles'
import Colors from '../constants/Colors'



export default function SplashScreen() {
  const navigation = useNavigation();

  const toLogin = () => {
    navigation.navigate('Login')
  }
  const toRegister = () => {
    navigation.navigate('Register')
  }
  return (
    <Styles.Container backgroundColor={Colors.mainColor} >
      <Styles.Header style={style.shadow} flex={4} lRadius={30} rRadius={30} style={{zIndex: 1}} >
        <Styles.BigText fontSize={50}>You Good?</Styles.BigText>
      </Styles.Header>
      <Styles.Footer flex={2} radius={false} backgroundColor={Colors.mainColor}>
        <Styles.Text color={Colors.offWhite} fontSize={15} >Have an account?</Styles.Text>
        <Styles.Button backgroundColor={Colors.lightMono} onPress={() => toLogin()} style={{marginBottom: 10}}>
          <Styles.Text color={Colors.offWhite} >Log in</Styles.Text>
        </Styles.Button>
        <Styles.Text color={Colors.offWhite} fontSize={15} >Don't have an account?</Styles.Text>
        <Styles.Button backgroundColor={Colors.lightMono} onPress={() => toRegister()}>
          <Styles.Text color={Colors.offWhite}>Register</Styles.Text>
        </Styles.Button>
      </Styles.Footer>
    </Styles.Container>


  );
}

const style = StyleSheet.create({
  shadow: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: .2,
    shadowRadius: 2,
    elevation: 2,
  },
  
});

