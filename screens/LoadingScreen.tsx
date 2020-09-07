import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ActivityIndicator } from 'react-native';
import Btn from '../components/Btn';
import firebase from '../constants/firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import * as Styles from '../constants/Styles'
import Color from '../constants/Colors'



export default function LoadingScreen() {

    return (

        <Styles.Footer flex={9}>
            <Styles.BigText fontSize={50}>You Good?</Styles.BigText>
            <Styles.Linebreak width={50} lineColor={Color.lightMono} />
            <ActivityIndicator size="large" color={Color.lightMono} />
        </Styles.Footer>

    );
}


const offset = 24;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameInput: { // 3. <- Add a style for the input
        height: offset * 2,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#111111',
        borderWidth: 1,
    },
});
